import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(process.cwd(), 'public/audio');

async function audit() {
    console.log("--- Starting Library Audit ---");
    
    // 1. Get all songs from DB
    const songs = await prisma.song.findMany();
    console.log(`Checking ${songs.length} database records...`);

    const unplayable: any[] = [];
    const messy: any[] = [];
    const filesOnDisk = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    const filesInDb = new Set();

    for (const song of songs) {
        const relativePath = song.audioUrl.startsWith('/') ? song.audioUrl.substring(1) : song.audioUrl;
        const fullPath = path.join(process.cwd(), 'public', relativePath);
        const fileName = path.basename(fullPath);
        
        filesInDb.add(fileName);

        // Check Playability (File Existence)
        if (!fs.existsSync(fullPath)) {
            unplayable.push({
                reason: "FILE_MISSING",
                title: song.title,
                url: song.audioUrl
            });
            continue;
        }

        // Check for encoding issues / messy URLs
        // Standard slug: lowercase, a-z, 0-9, hyphen
        if (/[^a-z0-9\-\.]/.test(fileName)) {
            unplayable.push({
                reason: "UNOPTIMIZED_FILENAME",
                title: song.title,
                url: song.audioUrl
            });
        }

        // Check for messy titles
        if (song.title.includes('  ') || /\[.*?\]/.test(song.title) || /\(.*?\)/.test(song.title)) {
             // Some labels are fine (like Slowed & Reverb in parentheses), but Youtube junk isn't.
             if (/(Official|Lyrics|Lirik|Video|Clip)/i.test(song.title)) {
                 messy.push({
                     reason: "JUNK_KEYWORDS",
                     title: song.title
                 });
             }
        }
        
        if (!song.title.includes(' — ')) {
            messy.push({
                reason: "MISSING_SEPARATOR",
                title: song.title
            });
        }
    }

    // Check for orphans
    const orphans = filesOnDisk.filter(f => !filesInDb.has(f));

    const report = {
        unplayable,
        messy,
        orphans,
        stats: {
            totalDb: songs.length,
            totalDisk: filesOnDisk.length
        }
    };

    fs.writeFileSync(path.join(process.cwd(), 'audit_report.json'), JSON.stringify(report, null, 2));
    console.log("Audit report written to audit_report.json");
}

audit().catch(console.error).finally(() => prisma.$disconnect());
