import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const allSongs = await prisma.song.findMany();
    
    for (const song of allSongs) {
        let title = song.title;
        
        // Fix empty parentheses
        title = title.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();
        
        // Fix double spaces or spaces before closing parenthesis
        title = title.replace(/\s\)/g, ')').replace(/\(\s/g, '(');
        
        // Fix special cases like " ( (Slowed & Reverb))"
        title = title.replace(/\(\s*\(/g, '(').replace(/\)\s*\)/g, ')');
        
        // Remove trailing commas before parentheses
        title = title.replace(/,\s*\(/g, ' (');

        if (title !== song.title) {
            console.log(`Fixing: "${song.title}" -> "${title}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = title.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            const nextAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                if (fs.existsSync(oldPath) && oldPath !== newPath) {
                    fs.renameSync(oldPath, newPath);
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: { title: title, audioUrl: nextAudioUrl }
            });
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
