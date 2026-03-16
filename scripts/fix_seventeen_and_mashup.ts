import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Mapping for identified specific fixes and the remaining ones that might have failed due to slight string differences
const FINAL_FIXES: Record<string, string> = {
    // seventeen inversion fix
    "Hal Terindah — Seventeen": "Seventeen — Hal Terindah",
    "Hal Terindah — Seventeen (Sped Up)": "Seventeen — Hal Terindah (Sped Up)",
    "Hal Terindah — Seventeen (Slowed & Reverb)": "Seventeen — Hal Terindah (Slowed & Reverb)",
    
    // catch any mismatches from previous run
    "Unknown — Tanpa Pesan Terakhir X Jaga Selalu Hatimu X yang Telah Merelakanmu + (Reverb, Sped Up)": "Mashup — Tanpa Pesan Terakhir X Jaga Selalu Hatimu X yang Telah Merelakanmu + (Reverb, Sped Up)",
    "Unknown — Pilihan Hatiku X Cinta Terbaik X Memilih Setia (Sped Up)": "Mashup — Pilihan Hatiku X Cinta Terbaik X Memilih Setia (Sped Up)",
};

async function main() {
    console.log("=== PHASE 5: Focused Inversion Fix & Final Cleanup ===");

    for (const [oldTitle, newTitle] of Object.entries(FINAL_FIXES)) {
        // Try searching by title or containing the key part to be more robust
        const song = await prisma.song.findFirst({
            where: { title: { contains: oldTitle.substring(0, 20) } }
        });

        if (song) {
            console.log(`Fixing: "${song.title}" -> "${newTitle}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = newTitle.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
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
                data: { title: newTitle, audioUrl: nextAudioUrl }
            });
            console.log("  -> DB entry updated.");
        } else {
            console.warn(`Song not found for: "${oldTitle}"`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
