import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const audioDir = path.join(process.cwd(), 'public', 'audio');

async function main() {
    // Look for Ada Apa Denganmu in DB
    const songs = await prisma.song.findMany({
        where: { title: { contains: 'Ada Apa Denganmu' } }
    });

    for (const song of songs) {
        if (!song.title.startsWith('Noah —')) {
            const newTitle = 'Noah — Ada Apa Denganmu';
            const newSlug = 'noah-ada-apa-denganmu.mp3';
            const newAudioUrl = `/audio/${newSlug}`;

            console.log(`Fixing: "${song.title}" -> "${newTitle}"`);

            const oldPath = path.join(audioDir, song.audioUrl.replace('/audio/', ''));
            const newPath = path.join(audioDir, newSlug);

            if (fs.existsSync(oldPath) && oldPath !== newPath) {
                fs.renameSync(oldPath, newPath);
                console.log(`  -> Renamed file to ${newSlug}`);
            }

            await prisma.song.update({
                where: { id: song.id },
                data: {
                    title: newTitle,
                    category: 'Indo',
                    audioUrl: newAudioUrl
                }
            });
            console.log(`  -> Updated DB to Indo and new title.`);
        } else {
            // Even if it's already Noah, ensure it's Indo
            if (song.category !== 'Indo') {
                await prisma.song.update({
                    where: { id: song.id },
                    data: { category: 'Indo' }
                });
                console.log(`  -> Category updated to Indo.`);
            }
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
