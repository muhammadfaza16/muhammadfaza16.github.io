import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const allSongs = await prisma.song.findMany();
    
    console.log("=== PHASE 5: Final Polish (Symbols, Parens, Inversions) ===");
    
    const seenTitles = new Set();
    const duplicates = [];

    for (const song of allSongs) {
        let title = song.title;

        // 1. Specific Inversions & Duplicates
        if (title.includes("Tentang Rasa — Astrid")) {
            title = title.replace("Tentang Rasa — Astrid", "Astrid — Tentang Rasa");
        }
        if (title.includes("Apocalypse — Cigarettes After Sex")) {
            title = title.replace("Apocalypse — Cigarettes After Sex", "Cigarettes After Sex — Apocalypse");
        }
        if (title.includes("Cry — Cigarettes After Sex")) {
            title = title.replace("Cry — Cigarettes After Sex", "Cigarettes After Sex — Cry");
        }
        
        // 2. Fix symbols: Replace ALL + with & but keep it clean
        title = title.replace(/\+/g, ' & ');
        
        // 3. Remove messy artifacts like & ; or stray dashes
        title = title
            .replace(/& ;/g, '&')
            .replace(/&+/g, '&')
            .replace(/- -+/g, '-')
            .replace(/\s+/g, ' ');

        // 4. Remove empty parentheses ()
        title = title.replace(/\(\s*\)/g, '').trim();

        // 5. Clean double separators or spaces
        title = title
            .replace(/\s*—\s*—\s*/g, ' — ')
            .replace(/\s+/g, ' ')
            .trim();

        // Detect duplicates
        if (seenTitles.has(title)) {
            duplicates.push(song.id);
            console.log(`Duplicate found: ${title} (ID: ${song.id})`);
            continue; 
        }
        seenTitles.add(title);

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

    if (duplicates.length > 0) {
        console.log(`Deleting ${duplicates.length} duplicate records...`);
        await prisma.song.deleteMany({
            where: { id: { in: duplicates } }
        });
    }
    
    console.log("Final library polish complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
