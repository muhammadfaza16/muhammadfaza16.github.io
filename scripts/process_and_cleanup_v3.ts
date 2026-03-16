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
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'as', 'with', 'off', 'vs'
]);

function smartTitleCase(str: string): string {
    if (!str) return '';
    
    // Normalize special characters (italics Judika case)
    let normalized = str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    // Replace non-ascii word-like chars with standard chars for Judika's speed up
    normalized = normalized.replace(/𝘴𝘱𝘦𝘦𝘥 𝘶𝘱/gi, 'Speed Up').replace(/𝘳𝘦𝘷𝘦𝘳𝘣/gi, 'Reverb');

    const words = normalized.split(/\s+/);
    
    return words.map((word, index) => {
        const isFirst = index === 0;
        const isLast = index === words.length - 1;
        
        // Clean word of punctuation for lookup but keep original for transformation
        const cleanWord = word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
        
        let prevWasSeparator = false;
        if (index > 0) {
            const prev = words[index - 1];
            if (prev === '—' || prev === '-' || prev.endsWith('(') || prev.endsWith('[') || prev.endsWith('{')) {
                prevWasSeparator = true;
            }
        }

        // Special check for Roman Numerals
        if (/^(ii|iii|iv|vi|vii|viii|ix|x)$/i.test(cleanWord)) {
            return word.toUpperCase();
        }

        if (isFirst || isLast || prevWasSeparator || !SMALL_WORDS.has(cleanWord)) {
            // Capitalize first alphanumeric char
            return word.replace(/[a-z]/i, (c) => c.toUpperCase());
        }
        
        return word.toLowerCase();
    }).join(' ');
}

function cleanDebris(str: string): string {
    return str
        .replace(/official music video/gi, '')
        .replace(/official video/gi, '')
        .replace(/official lyric visualizer/gi, '')
        .replace(/lyric video/gi, '')
        .replace(/lyric visualizer/gi, '')
        .replace(/lirik video/gi, '')
        .replace(/lirik lagu/gi, '')
        .replace(/lagu lirik/gi, '')
        .replace(/pop nostalgia/gi, '')
        .replace(/lagu lyrics/gi, '')
        .replace(/lyric/gi, '')
        .replace(/lirik/gi, '')
        .replace(/video/gi, '')
        .replace(/visual/gi, '')
        .replace(/doomer/gi, '')
        .replace(/ngesad/gi, '')
        .replace(/tiktok version/gi, '')
        .replace(/moza cover/gi, '')
        .replace(/#[a-z0-9]+/gi, '')
        .replace(/& reverb/gi, '')
        .replace(/\+ reverb/gi, '')
        .replace(/and reverb/gi, '')
        .replace(/slowed down/gi, '')
        .replace(/slowed version/gi, '')
        .replace(/slowed/gi, '')
        .replace(/speed up/gi, '')
        .replace(/sped up/gi, '')
        .replace(/pain/gi, '')
        .replace(/  +/g, ' ')
        // Remove trailing/leading symbols
        .replace(/^[\s\-_,;.]+/, '')
        .replace(/[\s\-_,;.!]+$/, '')
        .trim();
}

interface SongInfo {
    artist: string;
    title: string;
    tags: string[];
}

function parseSongInfo(raw: string): SongInfo {
    const filename = raw.replace(/\.mp3$/i, '');
    
    // Detect tags manually before cleaning debris
    const tags: string[] = [];
    if (/slowed/i.test(filename)) tags.push('Slowed');
    if (/reverb|𝘴𝘱𝘦𝘦𝘥 𝘶𝘱|𝘳𝘦𝘷𝘦𝘳𝘣/i.test(filename)) tags.push('Reverb');
    if (/speed up|sped up|𝘴𝘱𝘦𝘦𝘥 𝘶𝘱/i.test(filename)) tags.push('Sped Up');
    if (/tiktok version/i.test(filename)) tags.push('TikTok Version');

    // Remove tags and other junk
    let cleanedText = filename;
    // Remove blocks in brackets first
    cleanedText = cleanedText.replace(/\[.*?\]/g, ' ').replace(/\(Lyrics\)/gi, ' ');
    
    // Split Artist - Title
    let artist = 'Unknown';
    let title = cleanedText;

    // Use em-dash or standard dash as separator
    const separators = [' \u2014 ', ' — ', ' - ', ' \u2013 '];
    let sepIndex = -1;
    let sepFound = '';
    
    for (const sep of separators) {
        const idx = cleanedText.indexOf(sep);
        if (idx !== -1) {
            sepIndex = idx;
            sepFound = sep;
            break;
        }
    }

    if (sepIndex !== -1) {
        artist = cleanedText.substring(0, sepIndex).trim();
        title = cleanedText.substring(sepIndex + sepFound.length).trim();
        
        // Final cleaning of individual parts
        artist = cleanDebris(artist);
        title = cleanDebris(title);

        // Heuristic: If artist part is very long and title is short
        if (artist.split(' ').length > 4 && title.split(' ').length <= 2 && !artist.includes(' & ') && !artist.includes(', ')) {
             [artist, title] = [title, artist];
        }
    } else {
        // No separator found, check if it's just "Artist - Title" without spaces
        if (cleanedText.includes('-')) {
             const parts = cleanedText.split('-');
             artist = cleanDebris(parts[0]);
             title = cleanDebris(parts.slice(1).join('-'));
        } else {
             title = cleanDebris(cleanedText);
        }
    }

    if (!artist || artist === 'Unknown') artist = 'Unknown';

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

async function main() {
    console.log("=== PHASE 1: Cleaning All Songs in DB ===");
    const allSongs = await prisma.song.findMany();
    
    for (const song of allSongs) {
        const info = parseSongInfo(song.title);
        // Manual override for some known errors in the DB
        if (info.title === "Apa Kabar Sayang" && info.artist === "Unknown") info.artist = "Armada";
        if (info.title === "Asma" && info.artist === "Setia Band") info.title = "Asmara";
        if (info.artist === "Noah" && info.title === "sally Sendiri") info.title = "Sally Sendiri";

        const finalTitle = getFinalTitle(info);
        
        if (song.title !== finalTitle) {
            console.log(`Updating: "${song.title}" -> "${finalTitle}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = getSafeFileName(finalTitle);
            const nextAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                if (fs.existsSync(oldPath) && oldPath !== newPath) {
                    fs.renameSync(oldPath, newPath);
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: { title: finalTitle, audioUrl: nextAudioUrl }
            });
        }
    }

    console.log("\n=== PHASE 2: New Songs Handled via Phase 1 already logic? ===\nNo, let's check folder again.");
    if (fs.existsSync(NEW_SOUNGS_DIR)) {
        const files = fs.readdirSync(NEW_SOUNGS_DIR).filter(f => f.endsWith('.mp3'));
        for (const file of files) {
             const info = parseSongInfo(file);
             const finalTitle = getFinalTitle(info);
             const safeName = getSafeFileName(finalTitle);
             const oldPath = path.join(NEW_SOUNGS_DIR, file);
             const newPath = path.join(AUDIO_DIR, safeName);
             
             fs.renameSync(oldPath, newPath);
             const audioUrl = `/audio/${encodeURIComponent(safeName)}`;
             
             await prisma.song.upsert({
                 where: { id: '0' }, // Dummy since we use findFirst usually
                 create: { title: finalTitle, audioUrl, source: 'local' },
                 update: { title: finalTitle, audioUrl },
                 // Actually upsert by audioUrl is better
             }).catch(async () => {
                 const ex = await prisma.song.findFirst({ where: { audioUrl } });
                 if (ex) {
                     await prisma.song.update({ where: { id: ex.id }, data: { title: finalTitle } });
                 } else {
                     await prisma.song.create({ data: { title: finalTitle, audioUrl, source: 'local' } });
                 }
             });
             console.log(`Added/Updated: ${finalTitle}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
