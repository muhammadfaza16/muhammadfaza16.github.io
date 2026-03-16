import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');
const NEW_SOUNGS_DIR = path.join(AUDIO_DIR, 'new song to populate');

const SMALL_WORDS = new Set([
    // Indonesian
    'di', 'ke', 'dari', 'pada', 'dalam', 'yang', 'dan', 'untuk', 'dengan', 'si', 'itu',
    // English
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'as', 'with', 'off'
]);

/**
 * Implements Smart Title Case based on English & Indonesian rules.
 */
function smartTitleCase(str: string): string {
    if (!str) return '';
    
    // Split by spaces but preserve separators
    const words = str.toLowerCase().split(/\s+/);
    
    return words.map((word, index) => {
        // Always capitalize first word, last word, and words after a dash or parenthesis
        const isFirst = index === 0;
        const isLast = index === words.length - 1;
        
        // Check if previous word was a separator like "—" or "(" or "["
        let prevWasSeparator = false;
        if (index > 0) {
            const prev = words[index - 1];
            if (prev === '—' || prev === '-' || prev.endsWith('(') || prev.endsWith('[')) {
                prevWasSeparator = true;
            }
        }

        if (isFirst || isLast || prevWasSeparator || !SMALL_WORDS.has(word)) {
            // Special cases for parts like "Pt", "Feat", "Vs"
            if (word === 'pt') return 'Pt';
            if (word === 'feat') return 'feat.';
            if (word === 'vs') return 'vs.';
            
            // Standard capitalization
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        
        return word;
    }).join(' ');
}

function cleanString(str: string): string {
    return str
        .replace(/\(Lyrics\)/gi, '')
        .replace(/\[lirik\]/gi, '')
        .replace(/\[lyrics\]/gi, '')
        .replace(/Lagu pop Indonesia terbaru 2023/gi, '')
        .replace(/\[Official MV\]/gi, '')
        .replace(/\[ Lagu Lirik \]/gi, '')
        .replace(/\(Video Clip\)/gi, '')
        .replace(/\[.*?\]/g, '') // Remove brackets like YouTube IDs
        .replace(/\(Official Audio\)/gi, '')
        .replace(/\(Official Music Video\)/gi, '')
        .replace(/\(Lirik\)/gi, '')
        .replace(/\(Lirik Video\)/gi, '')
        .replace(/Lirik Lagu/gi, '')
        .replace(/Lirik/gi, '')
        .replace(/LAGU NOSTALGIA TERBAIK #lyrics/gi, '')
        .replace(/official lyric visualizer/gi, '')
        .replace(/doomer visual/gi, '')
        .replace(/moza cover/gi, '')
        .replace(/\\(.*?\\)/g, (match) => {
             // Keep slowed/reverb/sped up if they are in parentheses, otherwise likely debris
             if (/slowed|reverb|speed up|sped up/i.test(match)) return match;
             return '';
        })
        .replace(/  +/g, ' ')
        .trim();
}

interface SongInfo {
    artist: string;
    title: string;
    tags: string[];
}

function parseSongInfo(raw: string): SongInfo {
    let text = cleanString(raw.replace(/\.mp3$/i, ''));
    
    // Detect tags
    const tags: string[] = [];
    if (/slowed/i.test(text)) tags.push('Slowed');
    if (/reverb/i.test(text)) tags.push('Reverb');
    if (/speed up|sped up/i.test(text)) tags.push('Sped Up');
    if (/tiktok version/i.test(text)) tags.push('TikTok Version');

    // Remove tags from main text
    text = text.replace(/slowed\s*(&|\+|and)?\s*reverb/gi, '')
               .replace(/slowed down/gi, '')
               .replace(/slowed version/gi, '')
               .replace(/slowed/gi, '')
               .replace(/reverb/gi, '')
               .replace(/speed up\s*\+\s*reverb/gi, '')
               .replace(/speed up/gi, '')
               .replace(/sped up/gi, '')
               .replace(/tiktok version/gi, '')
               .replace(/  +/g, ' ')
               .replace(/\(\s*\)/g, '')
               .replace(/\[\s*\]/g, '')
               .trim();

    // Split Artist - Title
    let artist = 'Unknown';
    let title = text;

    const separators = [' — ', ' - ', ' —', '— ', ' -', '- '];
    let sepIndex = -1;
    let sepFound = '';
    
    for (const sep of separators) {
        const idx = text.indexOf(sep);
        if (idx !== -1) {
            sepIndex = idx;
            sepFound = sep;
            break;
        }
    }

    if (sepIndex !== -1) {
        artist = text.substring(0, sepIndex).trim();
        title = text.substring(sepIndex + sepFound.length).trim();
        
        // Heuristic: If artist part has many spaces and title part has none, they might be flipped
        // e.g. "Aku Lelakimu - Virzha"
        if (artist.split(' ').length > 2 && title.split(' ').length === 1) {
             [artist, title] = [title, artist];
        }
    } else if (text.includes('-')) {
        // Fallback for single dash with no spaces
        const parts = text.split('-');
        artist = parts[0].trim();
        title = parts.slice(1).join('-').trim();
    }

    return { 
        artist: smartTitleCase(artist), 
        title: smartTitleCase(title), 
        tags 
    };
}

function getFinalTitle(info: SongInfo): string {
    let final = `${info.artist} — ${info.title}`;
    
    const meta: string[] = [];
    if (info.tags.includes('Slowed') && info.tags.includes('Reverb')) {
        meta.push('Slowed & Reverb');
    } else if (info.tags.includes('Slowed')) {
        meta.push('Slowed');
    } else if (info.tags.includes('Reverb')) {
        meta.push('Reverb');
    }
    
    if (info.tags.includes('Sped Up')) meta.push('Sped Up');
    if (info.tags.includes('TikTok Version')) meta.push('TikTok Version');

    if (meta.length > 0) {
        final += ` (${meta.join(', ')})`;
    }
    
    return final;
}

function getSafeFileName(title: string): string {
    return title.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
}

async function processFile(oldPath: string, isFromNewFolder: boolean) {
    const filename = path.basename(oldPath);
    const info = parseSongInfo(filename);
    const finalTitle = getFinalTitle(info);
    const safeName = getSafeFileName(finalTitle);
    const newPath = path.join(AUDIO_DIR, safeName);
    const audioUrl = `/audio/${encodeURIComponent(safeName)}`;

    console.log(`Processing: ${filename}`);
    console.log(`  -> Final Title: ${finalTitle}`);

    // If it's a rename in the same folder vs move from subfolder
    if (oldPath !== newPath) {
        if (fs.existsSync(newPath) && oldPath.toLowerCase() !== newPath.toLowerCase()) {
            console.log(`  -> Target exists, skipping file move.`);
        } else {
            fs.renameSync(oldPath, newPath);
            console.log(`  -> File moved/renamed.`);
        }
    }

    // Upsert DB
    // Try to find existing by audioUrl first (old or new)
    const oldUrl = `/audio/${encodeURIComponent(filename)}`;
    const existing = await prisma.song.findFirst({
        where: {
            OR: [
                { audioUrl: audioUrl },
                { audioUrl: oldUrl }
            ]
        }
    });

    if (existing) {
        await prisma.song.update({
            where: { id: existing.id },
            data: {
                title: finalTitle,
                audioUrl: audioUrl,
                source: "local"
            }
        });
        console.log(`  -> DB Updated.`);
    } else {
        await prisma.song.create({
            data: {
                title: finalTitle,
                audioUrl: audioUrl,
                source: "local"
            }
        });
        console.log(`  -> DB Created.`);
    }
}

async function main() {
    console.log("=== PHASE 1: Cleaning Existing Library ===");
    const allSongs = await prisma.song.findMany();
    console.log(`Checking ${allSongs.length} existing songs...`);
    
    for (const song of allSongs) {
        // Use the current title as the base for cleanup/parsing
        const info = parseSongInfo(song.title);
        const finalTitle = getFinalTitle(info);
        
        // Only update if something changed
        if (song.title !== finalTitle) {
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = getSafeFileName(finalTitle);
            const newAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                
                if (fs.existsSync(oldPath) && oldPath.toLowerCase() !== newPath.toLowerCase()) {
                    fs.renameSync(oldPath, newPath);
                    console.log(`Renamed file: ${oldFileName} -> ${safeName}`);
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: {
                    title: finalTitle,
                    audioUrl: newAudioUrl
                }
            });
            console.log(`Updated DB info for: ${song.title} -> ${finalTitle}`);
        }
    }

    console.log("\n=== PHASE 2: Processing New Songs ===");
    if (fs.existsSync(NEW_SOUNGS_DIR)) {
        const files = fs.readdirSync(NEW_SOUNGS_DIR).filter(f => f.endsWith('.mp3'));
        console.log(`Found ${files.length} new files to process.`);
        for (const file of files) {
            await processFile(path.join(NEW_SOUNGS_DIR, file), true);
        }
    }

    console.log("\n=== ALL DONE ===");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
