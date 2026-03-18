import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'music-metadata';

const prisma = new PrismaClient();
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), 'public');

async function main() {
    console.log("Starting Duration Audit for all songs in the database...\n");

    const songs = await prisma.song.findMany();
    let updatedCount = 0;
    let missingFileCount = 0;
    let skippedCount = 0;

    for (const song of songs) {
        // audioUrl usually looks like /audio/filename.mp3
        if (!song.audioUrl) {
            console.log(`[SKIP] ID: ${song.id} | ${song.title} (No audioUrl)`);
            skippedCount++;
            continue;
        }

        // Construct absolute path to the actual mp3 file
        const relativePath = song.audioUrl.startsWith('/') ? song.audioUrl.substring(1) : song.audioUrl;
        const filePath = path.join(PUBLIC_AUDIO_DIR, relativePath);

        if (!fs.existsSync(filePath)) {
            console.log(`[MISSING] ${song.title} | File not found at: ${filePath}`);
            missingFileCount++;
            continue;
        }

        try {
            const metadata = await mm.parseFile(filePath, { duration: true });
            if (metadata.format.duration) {
                const actualDuration = Math.round(metadata.format.duration); // in seconds
                
                // Only update if duration is missing or wildly inaccurate (e.g. >2s difference)
                if (song.duration === null || Math.abs(song.duration - actualDuration) > 2) {
                    await prisma.song.update({
                        where: { id: song.id },
                        data: { duration: actualDuration }
                    });
                    console.log(`[UPDATE] ${song.title} | Duration: ${song.duration || 'null'} -> ${actualDuration}s`);
                    updatedCount++;
                } else {
                    // console.log(`[OK] ${song.title} | ${actualDuration}s (Accurate)`);
                    skippedCount++;
                }
            } else {
                console.log(`[ERROR] ${song.title} | Could not extract duration metadata!`);
            }
        } catch (error: any) {
            console.log(`[ERROR] ${song.title} | Parsing failed: ${error.message}`);
        }
    }

    console.log(`\nAudit Complete!`);
    console.log(`Total DB entries: ${songs.length}`);
    console.log(`Updated         : ${updatedCount}`);
    console.log(`Skipped (OK)    : ${skippedCount}`);
    console.log(`Missing Files   : ${missingFileCount}`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
