import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const oldTitle = "R.I.P (Rhyme In Place) Bondan Prakoso & Fade2Black";
    const newTitle = "Bondan Prakoso & Fade2Black \u2014 R.I.P (Rhyme In Place)";
    const newFileName = "Bondan Prakoso & Fade2Black \u2014 RIP (Rhyme In Place).mp3";
    const newAudioUrl = `/audio/${encodeURIComponent(newFileName)}`;

    const song = await prisma.song.findFirst({ where: { title: oldTitle } });
    if (song) {
        const actualOldFile = decodeURIComponent(song.audioUrl.split('/audio/')[1]);
        const actualOldPath = path.join(AUDIO_DIR, actualOldFile);
        const newPath = path.join(AUDIO_DIR, newFileName);

        if (fs.existsSync(actualOldPath)) {
            fs.renameSync(actualOldPath, newPath);
            console.log(`Renamed to ${newFileName}`);
        }
        
        await prisma.song.update({
            where: { id: song.id },
            data: { title: newTitle, audioUrl: newAudioUrl }
        });
        console.log("Updated DB");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
