import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const SOURCE_DIR = path.join(__dirname, '../public/audio/new song to populate');
const DEST_DIR = path.join(__dirname, '../public/audio');

function cleanFileName(filename: string) {
    let name = filename.replace(/\.mp3$/i, '');
    
    // Detect special versions
    const isSlowedReverb = /(slowed|reverb)/i.test(name);
    const isSpedUp = /(speed up|sped up)/i.test(name);

    // Remove common suffixes and garbage
    name = name.replace(/\(Lyrics\)/gi, '')
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
               .replace(/slowed\s*(&|\+|and)?\s*reverb/gi, '')
               .replace(/slowed version/gi, '')
               .replace(/slowed/gi, '')
               .replace(/sped upunderwater/gi, '')
               .replace(/speed up - tiktok version/gi, '')
               .replace(/\(\s*\)/g, '')
               .replace(/  +/g, ' ')
               .trim();

    // Check if artist and title are separated by "-"
    let artist = '';
    let title = name;
    
    if (name.includes('-')) {
        const parts = name.split('-');
        // A common pattern in this folder: "Title - Artist" or "Artist - Title"
        // Let's assume standard "Artist - Title" if we can't be sure, but let's check manually:
        // "Aku Lelakimu - Virzha" -> Title - Artist
        // "Anima - Bintang" -> Artist - Title
        // To be safe, wait, often it's "Artist - Title". Let's stick to standard `Artist - Title`.
        // If the first part is known artist, it's Artist - Title.
        // Actually, just keep it exactly as it was split: First part is Artist, rest is Title.
        // Wait, "Aku Lelakimu - Virzha" -> "Aku Lelakimu" is Title.
        // Let's just use the `split(' - ')` and if not matched, string `-`.
        const splitStr = name.includes(' - ') ? ' - ' : '-';
        const parts2 = name.split(splitStr);
        if (parts2.length >= 2) {
            // Let's just map it to: Part 1 — Part 2
            artist = parts2[0].trim();
            title = parts2.slice(1).join(splitStr).trim();
            
            // Heuristic for Title - Artist: if Part 2 is just one word and Part 1 is multiple words.
            // Let's just keep Artist - Title format and we'll fix manually if wrong, or just store it as is.
        }
    }

    // Capitalize smartly if it's all lowercase
    if (artist === artist.toLowerCase()) {
        artist = artist.replace(/\b\w/g, c => c.toUpperCase());
    }
    if (title === title.toLowerCase()) {
        title = title.replace(/\b\w/g, c => c.toUpperCase());
    }

    let finalTitleStr = artist ? `${artist} — ${title}` : title;
    
    if (isSlowedReverb) {
        finalTitleStr += ' (Slowed & Reverb)';
    } else if (isSpedUp) {
        finalTitleStr += ' (Sped Up)';
    }

    // Fix some known weird ones
    if (finalTitleStr.includes("Aku Lelakimu — Virzha")) {
        finalTitleStr = "Virzha — Aku Lelakimu";
    }
    if (finalTitleStr.includes("Hujan Kemarin — Taxi Band")) {
        finalTitleStr = "Taxi Band — Hujan Kemarin";
    }

    // Sanitize file name for URL
    const safeFileName = finalTitleStr.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';

    return { finalTitleStr, safeFileName };
}

async function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error("Source directory not found:", SOURCE_DIR);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.mp3'));
    console.log(`Found ${files.length} mp3 files to process.`);

    for (const file of files) {
        const oldPath = path.join(SOURCE_DIR, file);
        const { finalTitleStr, safeFileName } = cleanFileName(file);
        const newPath = path.join(DEST_DIR, safeFileName);

        console.log(`Processing: "${file}"`);
        console.log(`  -> Title: ${finalTitleStr}`);
        console.log(`  -> File : ${safeFileName}`);

        // Move/rename file
        if (!fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath);
        } else {
            console.log(`  -> File already exists at destination, replacing/skipping.`);
            fs.renameSync(oldPath, newPath); // overwrite
        }

        const audioUrl = `/audio/${encodeURIComponent(safeFileName)}`;

        // Upsert into DB
        const songRecord = await prisma.song.findFirst({
            where: { audioUrl }
        });

        if (!songRecord) {
            await prisma.song.create({
                data: {
                    title: finalTitleStr,
                    audioUrl: audioUrl,
                    source: "local"
                }
            });
            console.log(`  -> Added to database.`);
        } else {
            // Update title if it changed
            await prisma.song.update({
                where: { id: songRecord.id },
                data: { title: finalTitleStr }
            });
            console.log(`  -> Updated database record.`);
        }
    }

    console.log("Done processing all songs.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
