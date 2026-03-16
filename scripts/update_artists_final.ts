import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

const ARTIST_MAP: Record<string, string> = {
    "Unknown — Dirimu yang Dulu Mana Dirimu yang Dahulu (Sped Up)": "Anggis Devaki — Dirimu yang Dulu (Sped Up)",
    "Unknown — Adakah Kau Setia": "Stings — Adakah Kau Setia",
    "Unknown — Bukan Aku Tak Cinta": "Iklim — Bukan Aku Tak Cinta",
    "Unknown — Bukan Ku Tak Sudi": "Iklim — Bukan Ku Tak Sudi",
    "Unknown — Mencari Alasan": "Exist — Mencari Alasan",
    "Unknown — Mimpi yang Hilang": "Iklim — Mimpi yang Hilang",
    "Unknown — Satu Nama Tetap di Hati": "Key — Satu Nama Tetap di Hati",
    "Unknown — Sembilu": "Ella — Sembilu",
    "Unknown — Surat Undangan": "Poppy Mercury — Surat Undangan",
    "Unknown — Tenda Biru": "Desy Ratnasari — Tenda Biru",
    "Unknown — Aduhai! Seribu Kali Sayang": "Iklim — Aduhai! Seribu Kali Sayang", // Assumed from context
    "Unknown — Airmata di Hari Persandinganmu": "Lestari — Airmata di Hari Persandinganmu",
    "Unknown — Pilihan Hatiku X Cinta Terbaik X Memilih Setia (Sped Up)": "Mashup — Pilihan Hatiku X Cinta Terbaik X Memilih Setia (Sped Up)",
    "Unknown — Merindukan Mu X Masih Cinta": "D'masiv — Merindukan Mu X Masih Cinta",
    "Unknown — Tanpa Pesan Terakhir X Jaga Selalu Hatimu X yang Telah Merelakanmu + (Reverb, Sped Up)": "Mashup — Tanpa Pesan Terakhir X Jaga Selalu Hatimu X yang Telah Merelakanmu + (Reverb, Sped Up)"
};

async function main() {
    console.log("=== PHASE 4: Updating Artists Based on User Input ===");

    for (const [oldTitle, newTitle] of Object.entries(ARTIST_MAP)) {
        const song = await prisma.song.findFirst({
            where: { title: oldTitle }
        });

        if (song) {
            console.log(`Updating: "${oldTitle}" -> "${newTitle}"`);
            
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
            console.warn(`Song not found: "${oldTitle}"`);
        }
    }

    console.log("\n=== CONSOLIDATING REMAINING UNKNOWNS ===");
    // Double check if any other Unknowns exist
    const remaining = await prisma.song.findMany({
        where: { title: { startsWith: 'Unknown —' } }
    });
    if (remaining.length > 0) {
        console.log(`Note: ${remaining.length} songs still have Unknown artist.`);
    } else {
        console.log("All Unknown artists have been updated!");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
