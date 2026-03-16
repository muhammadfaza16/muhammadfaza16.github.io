import { PrismaClient } from '@prisma/client';
import * as mm from 'music-metadata';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting duration sync...");
    
    const songs = await prisma.song.findMany();
    console.log(`Found ${songs.length} songs in database.`);

    for (const song of songs) {
        try {
            // Convert audioUrl (e.g., /audio/song.mp3) to local file path
            const relativePath = decodeURIComponent(song.audioUrl).replace(/^\/audio\//, '');
            const filePath = path.join(process.cwd(), 'public', 'audio', relativePath);

            if (fs.existsSync(filePath)) {
                const metadata = await mm.parseFile(filePath);
                const duration = Math.round(metadata.format.duration || 0);

                if (duration > 0) {
                    await prisma.song.update({
                        where: { id: song.id },
                        data: { duration }
                    });
                    console.log(`✅ ${song.title}: ${duration}s`);
                } else {
                    console.warn(`⚠️ ${song.title}: Duration is 0`);
                }
            } else {
                console.error(`❌ ${song.title}: File not found at ${filePath}`);
            }
        } catch (error: any) {
            console.error(`❌ ${song.title}: Error processing - ${error.message}`);
        }
    }

    console.log("Duration sync complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
