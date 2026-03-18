import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    // Fetch songs added today that are likely the new ones
    const songs = await prisma.song.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 15
    });

    const noahSongs = [
        'Sally Sendiri',
        'Satu Hati',
        'Semua Tentang Kita',
        'Taman Langit',
        'Tertinggalkan Waktu',
        'Tetap Berdiri (2DSD)',
        'Topeng',
        'Yang Terdalam',
        'Bintang di Surga',
        'Walau Habis Terang'
    ];

    const audioDir = path.join(process.cwd(), 'public', 'audio');

    for (const song of songs) {
        let needsUpdate = false;
        let newTitle = song.title;

        // Check if title matches any of our new Noah songs AND doesn't already have Noah
        const match = noahSongs.find(ns => song.title.includes(ns));
        if (match && !song.title.startsWith('Noah —') && !song.title.startsWith('NOAH —')) {
            newTitle = `Noah — ${match}`;
            needsUpdate = true;
        }

        // Force category to Indo if it's Noah
        if (newTitle.toLowerCase().includes('noah') && song.category !== 'Indo') {
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`Fixing: "${song.title}" -> "${newTitle}"`);
            
            const newSlug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '') + '.mp3';
            
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
                    audioUrl: `/audio/${newSlug}`
                }
            });
            console.log(`  -> Updated DB.`);
        }
    }

    console.log('Done fixing Noah songs.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
