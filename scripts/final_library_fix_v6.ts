import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const allSongs = await prisma.song.findMany();
    const report: string[] = [];
    
    console.log("=== PHASE 6: Specific Inversions & Formatting (Round 2) ===");
    
    const seenTitles = new Set();
    const duplicates = [];

    for (const song of allSongs) {
        let title = song.title;

        // 1. SPECIFIC CORRECTIONS REQUESTED BY USER
        
        // Hujan Kemarin (Taxi)
        if (title.includes("Taxi — Hujan Kemarin & (Reverb)")) {
            title = title.replace("Taxi — Hujan Kemarin & (Reverb)", "Taxi — Hujan Kemarin");
        }
        
        // Sally Sendiri (Noah)
        if (title.includes("Sally Sendiri — Noah")) {
            title = title.replace("Sally Sendiri — Noah", "Noah — Sally Sendiri");
        }
        
        // Pujaan Hati (Kangen Band)
        if (title.includes("Pujaan Hati — Kangen Band")) {
            title = title.replace("Pujaan Hati — Kangen Band", "Kangen Band — Pujaan Hati");
        }
        
        // Pesan Terakhir (Lyodra)
        if (title.includes("Pesan Terakhir — Lyodra")) {
            title = title.replace("Pesan Terakhir — Lyodra", "Lyodra — Pesan Terakhir");
        }
        if (title.includes("Lyodra — Pesan Terakhir &")) {
            title = title.replace("Lyodra — Pesan Terakhir &", "Lyodra — Pesan Terakhir");
        }
        
        // Pelan Pelan Saja (Kotak)
        if (title.includes("Pelan Pelan Saja — Kotak")) {
            title = title.replace("Pelan Pelan Saja — Kotak", "Kotak — Pelan Pelan Saja");
        }
        
        // Merindukanmu (D'masiv)
        if (title.includes("Merindukanmu — D'masiv")) {
            title = title.replace("Merindukanmu — D'masiv", "D'masiv — Merindukanmu");
        }
        
        // Melepasmu (Drive)
        if (title.includes("Melepasmu — Drive")) {
            title = title.replace("Melepasmu — Drive", "Drive — Melepasmu");
        }
        
        // Jadi Aku Sebentar Saja (Judika)
        if (title.includes("Jadi Aku Sebentar Saja — Judika")) {
            title = title.replace("Jadi Aku Sebentar Saja — Judika", "Judika — Jadi Aku Sebentar Saja");
        }
        
        // Hujan (Utopia)
        if (title.includes("Hujan — Utopia")) {
            title = title.replace("Hujan — Utopia", "Utopia — Hujan");
        }
        
        // Dan (Sheila on 7)
        if (title.includes("Dan — Sheila on 7")) {
            title = title.replace("Dan — Sheila on 7", "Sheila on 7 — Dan");
        }
        
        // Cinta Terlarang (The Virgins)
        if (title.includes("Cinta Terlarang — The Virgins")) {
            title = title.replace("Cinta Terlarang — The Virgins", "The Virgins — Cinta Terlarang");
        }
        
        // Bersama Bintang (Drive)
        if (title.includes("Bersama Bintang — Drive")) {
            title = title.replace("Bersama Bintang — Drive", "Drive — Bersama Bintang");
        }
        
        // Bunga (Bondan)
        if (title.includes("Bunga — Bondan Prakoso & Fade2black")) {
            title = title.replace("Bunga — Bondan Prakoso & Fade2black", "Bondan Prakoso & Fade2black — Bunga");
        }

        // 2. GENERAL CLEANUP (Artifacts, Double Spaces, etc)
        title = title
            .replace(/\s+/g, ' ')
            .replace(/& ;/g, '&')
            .replace(/& &+/g, '&')
            .replace(/& \(/g, '(') // Fix "Song & (Reverb)" -> "Song (Reverb)"
            .replace(/\(\s*reverb\s*\)/gi, '(Reverb)') // Normalize casing for common labels
            .replace(/\(reverb\)\s*\(reverb\)/gi, '(Reverb)')
            .replace(/— —+/g, '—')
            .trim();


        // 3. DUPLICATE DETECTION
        if (seenTitles.has(title)) {
            duplicates.push(song.id);
            report.push(`- DELETED DUPLICATE: ${song.title} (Target: ${title})`);
            continue; 
        }
        seenTitles.add(title);

        if (title !== song.title) {
            report.push(`- UPDATED: "${song.title}" -> "${title}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = title.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            const nextAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                if (fs.existsSync(oldPath) && oldPath !== newPath) {
                    try {
                        fs.renameSync(oldPath, newPath);
                        report.push(`  -> Renamed file: ${safeName}`);
                    } catch (e) {
                         report.push(`  -> FAILED to rename file: ${e}`);
                    }
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: { title: title, audioUrl: nextAudioUrl }
            });
        }
    }

    if (duplicates.length > 0) {
        await prisma.song.deleteMany({
            where: { id: { in: duplicates } }
        });
    }
    
    const finalReport = report.join('\n');
    fs.writeFileSync('rewrite_report.md', "# Library Rewrite Report (Round 2)\n\n" + (finalReport || "No changes detected."));
    console.log("Library polish complete! Report saved to rewrite_report.md");
}

main().catch(console.error).finally(() => prisma.$disconnect());
