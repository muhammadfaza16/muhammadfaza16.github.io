import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    // Fetch recent songs
    const songs = await prisma.song.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50 // Enough to cover recent additions
    });

    const audioDir = path.join(process.cwd(), 'public', 'audio');

    // Known Noah/Peterpan songs from the recent list
    const knownNoahSongs = [
        'Aku & Bintang', 'Bebas', 'Cobalah Mengerti', 'Dan Hilang', 'Di Belakangku',
        'Diatas Normal', 'Dibalik Awan', 'Dunia Yang Terlupa', 'Hari Yang Cerah Untuk Jiwa Yang Sepi',
        'Khayalan Tingkat Tinggi', 'Kita Tertawa', 'Kota Mati', 'Ku Katakan Dengan Indah',
        'Lihat Langkahku', 'Melawan Dunia', 'Mimpi Yang Sempurna', 'Mungkin Nanti', 'Sahabat'
    ];

    for (const song of songs) {
        let newTitle = song.title;
        let needsUpdate = false;

        if (knownNoahSongs.includes(song.title)) {
            newTitle = `Noah — ${song.title}`;
            needsUpdate = true;
        } else if (song.title.startsWith('NOAH — ')) {
            newTitle = song.title.replace('NOAH — ', 'Noah — ');
            needsUpdate = true;
        }

        if (song.category !== 'Indo' && newTitle.toLowerCase().includes('noah')) {
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
            } else if (!fs.existsSync(oldPath)) {
                console.log(`  -> Warning: old file not found: ${oldPath}`);
            }

            await prisma.song.update({
                where: { id: song.id },
                data: {
                    title: newTitle,
                    category: 'Indo',
                    audioUrl: `/audio/${newSlug}`
                }
            });
            console.log(`  -> Updated DB to Indo and new title.`);
        }
    }

    console.log('Done fixing additional Noah songs.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
