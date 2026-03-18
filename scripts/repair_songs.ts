import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function getPerfectTitle(currentTitle: string): string {
    let t = currentTitle
        .replace(/\(Official Music Video\)/gi, '')
        .replace(/\(Official Audio\)/gi, '')
        .replace(/\(Official Video\)/gi, '')
        .replace(/\(Visualizer\)/gi, '')
        .replace(/\(Official Visualizer\)/gi, '')
        .replace(/\(Official Lyric Video\)/gi, '')
        .replace(/\(Lyric Video\)/gi, '')
        .replace(/\(Lyrics Video\)/gi, '')
        .replace(/\(Lyrics\)/gi, '')
        .replace(/\(Official Audio\)/gi, '')
        .replace(/\(\s*\)/g, '')
        .replace(/#music/gi, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Specific Fixes
    if (t.includes('FIRMAN')) t = t.replace('FIRMAN', 'Firman');
    if (t.includes('GHEA INDRAWARI')) t = t.replace('GHEA INDRAWARI', 'Ghea Indrawari');
    if (t.includes('JIWA YANG BERSEDIH')) t = t.replace('JIWA YANG BERSEDIH', 'Jiwa Yang Bersedih');
    if (t.includes('LOBOW Salah')) t = 'Lobow — Salah';
    if (t.includes('Firman — Kehilangan')) t = 'Firman — Kehilangan';
    if (t === 'Budi Doremi Mesin Waktu') t = 'Budi Doremi — Mesin Waktu';

    if (t === 'Bersama Bintang') t = 'Drive — Bersama Bintang';
    if (t === 'Menunggu Pagi') t = 'Peterpan — Menunggu Pagi';
    if (t === 'Bahagia Lagi' || t === 'Piche Kota — Bahagia Lagi') t = 'Piche Kota — Bahagia Lagi';
    if (t === 'Jangan Paksa Rindu (Beda)' || t === 'Ifan 17 — Jangan Paksa Rindu (Beda)') t = 'Ifan 17 — Jangan Paksa Rindu (Beda)';
    
    if (t.includes('Feby Putri feat. Fiersa Besari')) {
        t = 'Feby Putri — Runtuh (feat. Fiersa Besari)';
    }

    if (t.includes('Lihat Kebunku (Taman Bunga) — Aku Jeje')) {
        t = 'Aku Jeje — Lihat Kebunku (Taman Bunga)';
    }
    if (t.includes('Lihat Kebunku — Aku Jeje')) {
        t = 'Aku Jeje — Lihat Kebunku';
    }

    
    // Trailing noise
    t = t.replace(/\s+—\s+$/, '').replace(/\s*\($/, '').trim();

    // Ensure em-dash
    if (t.includes(' - ')) t = t.replace(' - ', ' — ');
    
    // Capitalize lowercase titles
    if (t.includes('kota ini tak sama tanpamu')) t = t.replace('kota ini tak sama tanpamu', 'Kota Ini Tak Sama Tanpamu');

    return t;
}

async function repair() {
    const songs = await prisma.song.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 37
    });

    const audioDir = path.join(process.cwd(), 'public', 'audio');

    for (const song of songs) {
        const currentTitle = song.title;
        const perfectTitle = getPerfectTitle(currentTitle);
        
        if (currentTitle === perfectTitle) continue;

        console.log(`Repairing: "${currentTitle}" -> "${perfectTitle}"`);

        const newSlug = perfectTitle
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') + '.mp3';
        
        const oldAudioUrl = song.audioUrl;
        const newAudioUrl = `/audio/${newSlug}`;

        const oldPath = path.join(audioDir, oldAudioUrl.replace('/audio/', ''));
        const newPath = path.join(audioDir, newSlug);

        // Rename file if it exists and changed
        if (fs.existsSync(oldPath) && oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
            console.log(`  -> Renamed file to ${newSlug}`);
        }

        // Update DB
        await prisma.song.update({
            where: { id: song.id },
            data: {
                title: perfectTitle,
                audioUrl: newAudioUrl
            }
        });
        console.log(`  -> Updated database.`);
    }

    console.log('\nRepair complete! Now re-syncing playlists...');
}

repair().catch(console.error).finally(() => prisma.$disconnect());
