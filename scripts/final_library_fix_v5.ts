import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const allSongs = await prisma.song.findMany();
    
    console.log("=== PHASE 5: Final Polish (Symbols, Parens, Inversions) ===");
    
    for (const song of allSongs) {
        let title = song.title;

        // 1. Specific Inversions
        if (title.includes("Tentang Rasa — Astrid")) {
            title = title.replace("Tentang Rasa — Astrid", "Astrid — Tentang Rasa");
        }
        
        // 2. Fix symbols: Replace + with & but keep it clean
        // "Slowed + Reverb" -> "Slowed & Reverb"
        title = title.replace(/\+ /g, '& ');
        title = title.replace(/ \+/g, ' &');
        title = title.replace(/\+/g, '&');
        title = title.replace(/& &+/g, '&');

        // 3. Remove empty parentheses ()
        title = title.replace(/\(\s*\)/g, '').trim();

        // 4. Clean double separators or spaces
        title = title
            .replace(/\s*—\s*—\s*/g, ' — ')
            .replace(/\s+/g, ' ')
            .trim();

        // 5. Final check for "Artist - Title" vs "Title - Artist" 
        // We already did a lot, but let's double check common ones if needed.
        // For now, only the one the user explicitly mentioned.

        if (title !== song.title) {
            console.log(`Fixing: "${song.title}" -> "${title}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = title.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            const nextAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                if (fs.existsSync(oldPath) && oldPath !== newPath) {
                    try {
                        fs.renameSync(oldPath, newPath);
                        console.log(`  -> File renamed: ${safeName}`);
                    } catch (e) {
                         console.error(`  -> Failed to rename: ${e}`);
                    }
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: { title: title, audioUrl: nextAudioUrl }
            });
            console.log("  -> DB entry updated.");
        }
    }
    
    console.log("Final library polish complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
