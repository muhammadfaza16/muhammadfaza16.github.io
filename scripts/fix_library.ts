import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(process.cwd(), 'public/audio');

// Reuse logic from process_new_songs.ts for consistency
function cleanTitle(title: string) {
    let newTitle = title
        .replace(/\(\s*Official Music Video\s*\)/gi, '')
        .replace(/\(\s*Official Audio\s*\)/gi, '')
        .replace(/\(\s*Official Lyric Video\s*\)/gi, '')
        .replace(/\(\s*Official Video\s*\)/gi, '')
        .replace(/\(\s*video official\s*\)/gi, '')
        .replace(/\(\s*Video Clip\s*\)/gi, '')
        .replace(/\(\s*Lirik Video\s*\)/gi, '')
        .replace(/\(\s*video lyrics\s*\)/gi, '')
        .replace(/\(\s*Lirik\s*\)/gi, '')
        .replace(/\(\s*Lyrics\s*\)/gi, '')
        .replace(/\(\s*Video\s*\s*\)/gi, '') // Handle (Video )
        .replace(/Lyrics\s*\(\s*Speed Up\s*\)/gi, '') // Handle "Lyrics ( Speed Up )"
        .replace(/\[\s*Official MV\s*\]/gi, '')
        .replace(/\[\s*Lyrics\s*\]/gi, '')
        .replace(/with lyrics/gi, '')
        .replace(/\(OST\..*?\)/gi, '')
        .replace(/  +/g, ' ')
        .trim();

    // Standardize separator
    if (newTitle.includes(' — ')) return newTitle;
    if (newTitle.includes(' - ')) return newTitle.replace(' - ', ' — ');
    
    // Fallback for messy one
    if (newTitle.includes('(Seventeen)')) {
         newTitle = "Seventeen — " + newTitle.replace('(Seventeen)', '').trim();
    }

    return newTitle;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + '.mp3';
}

async function fix() {
    console.log("--- Starting Library Fix ---");
    
    const songs = await prisma.song.findMany();
    const filesOnDisk = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    const filesInDb = new Set();

    // 1. Fix Existing Songs (Titles and URLs)
    for (const song of songs) {
        console.log(`Processing: ${song.title}`);
        
        const fixedTitle = cleanTitle(song.title);
        const expectedSlug = slugify(fixedTitle);
        const expectedUrl = `/audio/${expectedSlug}`;
        
        // Find matching file if current one is missing
        let actualUrl = song.audioUrl;
        const currentPath = path.join(process.cwd(), 'public', song.audioUrl);
        
        if (!fs.existsSync(currentPath)) {
            console.log(`  [HEAL] File missing at ${song.audioUrl}. Checking for slug match...`);
            if (fs.existsSync(path.join(AUDIO_DIR, expectedSlug))) {
                 actualUrl = expectedUrl;
                 console.log(`  [HEAL] Found match: ${expectedSlug}`);
            } else {
                 // Try loose match
                 const looseMatch = filesOnDisk.find(f => f.toLowerCase().includes(song.title.split(' — ')[0].toLowerCase().replace(/[^a-z]/g, '')));
                 if (looseMatch) {
                     actualUrl = `/audio/${looseMatch}`;
                     console.log(`  [HEAL] Found loose match: ${looseMatch}`);
                 }
            }
        }

        if (fixedTitle !== song.title || actualUrl !== song.audioUrl) {
            await prisma.song.update({
                where: { id: song.id },
                data: {
                    title: fixedTitle,
                    audioUrl: actualUrl
                }
            });
            console.log(`  [UPDATED] Title: "${fixedTitle}" | URL: ${actualUrl}`);
        }
        
        filesInDb.add(path.basename(actualUrl));
    }

    // 2. Adopt Orphans
    const orphans = filesOnDisk.filter(f => !filesInDb.has(f));
    for (const orphan of orphans) {
        console.log(`[ADOPT] Found orphan file: ${orphan}`);
        // Create title from filename
        let base = orphan.replace(/\.mp3$/, '');
        let titleParts = base.split('-');
        let suggestedTitle = '';
        
        if (titleParts.length >= 2) {
            const artist = titleParts[0].charAt(0).toUpperCase() + titleParts[0].slice(1);
            const rest = titleParts.slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase());
            suggestedTitle = `${artist} — ${rest}`;
        } else {
            suggestedTitle = base.charAt(0).toUpperCase() + base.slice(1);
        }

        await prisma.song.create({
            data: {
                title: suggestedTitle,
                audioUrl: `/audio/${orphan}`,
                source: 'local'
            }
        });
        console.log(`  [ADOPTED] Created record: ${suggestedTitle}`);
    }

    console.log("--- Library Fix Finished ---");
}

fix()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
