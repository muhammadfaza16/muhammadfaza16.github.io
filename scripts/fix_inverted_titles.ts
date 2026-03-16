import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

const FIX_MAP: Record<string, string> = {
    "Tak Mungkin Berpaling — Slam": "Slam — Tak Mungkin Berpaling",
    "Tak Lagi Sama — Noah (Slowed & Reverb)": "Noah — Tak Lagi Sama (Slowed & Reverb)",
    "Sampai Hati — Saleem": "Saleem — Sampai Hati",
    "Sejauh Mungkin — Ungu": "Ungu — Sejauh Mungkin",
    "Bila Cinta Didusta — Screen": "Screen — Bila Cinta Didusta",
    "Betapa Aku Mencintaimu — Vagetos (Slowed & Reverb)": "Vagetos — Betapa Aku Mencintaimu (Slowed & Reverb)",
    "Bebaskan Diriku — Armada (Slowed & Reverb)": "Armada — Bebaskan Diriku (Slowed & Reverb)",
    "Kesayanganku — Al Ghazali ft Chelsea Shania Lyrics (Slowed & Reverb)": "Al Ghazali ft Chelsea Shania — Kesayanganku (Slowed & Reverb)",
    "Selamat (Selamat Tinggal) Virgoun Ft Audy (Slowed & Reverb)": "Virgoun ft Audy — Selamat (Selamat Tinggal) (Slowed & Reverb)",
    "RIP (Rhyme In Place) Bondan Prakoso & Fade2Black": "Bondan Prakoso & Fade2Black — R.I.P (Rhyme In Place)"
};

async function main() {
    console.log("Starting correction script...");

    for (const [oldTitle, newTitle] of Object.entries(FIX_MAP)) {
        // Find in DB
        const song = await prisma.song.findFirst({
            where: { title: oldTitle }
        });

        if (song) {
            console.log(`Found in DB: ${oldTitle}`);
            
            const oldSafeFileName = oldTitle.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            const newSafeFileName = newTitle.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            
            const oldPath = path.join(AUDIO_DIR, oldSafeFileName);
            // Some might not exactly match what PRISMA says because of earlier replace logic.
            // Let's use the DB's audioUrl to find the actual old file name.
            const actualOldFile = decodeURIComponent(song.audioUrl.split('/audio/')[1]);
            const actualOldPath = path.join(AUDIO_DIR, actualOldFile);
            const newPath = path.join(AUDIO_DIR, newSafeFileName);

            const newAudioUrl = `/audio/${encodeURIComponent(newSafeFileName)}`;

            if (fs.existsSync(actualOldPath)) {
                if (actualOldPath !== newPath) {
                    fs.renameSync(actualOldPath, newPath);
                    console.log(`Renamed file: ${actualOldFile} -> ${newSafeFileName}`);
                }
            } else {
                console.log(`File missing: ${actualOldPath}`);
            }

            // Update DB
            await prisma.song.update({
                where: { id: song.id },
                data: {
                    title: newTitle,
                    audioUrl: newAudioUrl
                }
            });
            console.log(`Updated DB: ${oldTitle} -> ${newTitle}`);
            
        } else {
            console.log(`Not found in DB: ${oldTitle}`);
            // Let's try relaxed matching
            const looseMatch = await prisma.song.findFirst({
                where: { title: { contains: oldTitle.substring(0, 10) } }
            });
            if (looseMatch) {
               console.log(`   Maybe you meant: ${looseMatch.title}?`);
            }
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
