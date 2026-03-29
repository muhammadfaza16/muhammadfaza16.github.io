import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'music-metadata';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

/**
 * Slugifies a filename to be URL-safe.
 * Example: "Ungu — Sejauh Mungkin.mp3" -> "ungu-sejauh-mungkin.mp3"
 */
function slugifyFilename(filename: string): string {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);

    const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
        .replace(/-+/g, '-')      // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '');   // Trim hyphens from ends

    return `${safeName}${ext}`;
}

async function main() {
    if (!fs.existsSync(AUDIO_DIR)) {
        console.error("Audio directory not found:", AUDIO_DIR);
        return;
    }

    const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    console.log(`Auditing ${files.length} songs in public/audio...`);

    let renameCount = 0;
    let dbUpdateCount = 0;

    for (const file of files) {
        const oldPath = path.join(AUDIO_DIR, file);
        const newFileName = slugifyFilename(file);
        const newPath = path.join(AUDIO_DIR, newFileName);

        const oldAudioUrl = `/audio/${encodeURIComponent(file)}`;
        const newAudioUrl = `/audio/${newFileName}`; // Slugs are already URL-safe

        // 1. Rename physical file if needed
        if (file !== newFileName) {
            try {
                // If the target already exists, we might need to handle collision or just overwrite
                // For this migration, if a collision occurs (e.g. "Song.mp3" and "song.mp3"),
                // we'll just log it and proceed. Windows is case-insensitive, so "Song" -> "song" is a rename.
                if (fs.existsSync(newPath) && file.toLowerCase() !== newFileName.toLowerCase()) {
                    console.warn(`[SKIP] Collision: ${newFileName} already exists, cannot rename ${file}`);
                    continue;
                }

                fs.renameSync(oldPath, newPath);
                console.log(`[RENAME] "${file}" -> "${newFileName}"`);
                renameCount++;
            } catch (err) {
                console.error(`[ERROR] Failed to rename ${file}:`, err);
                continue;
            }
        }

        // 2. Update database record
        // We find by EXACT audioUrl (as it was stored before: encoded version of original filename)
        // or by the original filename if the URL matches.
        const songRecord = await prisma.song.findFirst({
            where: {
                OR: [
                    { audioUrl: oldAudioUrl },
                    { audioUrl: `/audio/${file}` }, // Some might be unencoded
                    { audioUrl: newAudioUrl }       // Already migrated?
                ]
            }
        });

        if (songRecord) {
            // Extract duration if missing
            let duration: number | null = songRecord.duration;
            if (!duration || duration === 0) {
                try {
                    const metadata = await mm.parseFile(newPath);
                    duration = Math.round(metadata.format.duration || 0);
                    console.log(`[DURATION] Extracted ${duration}s for "${songRecord.title}"`);
                } catch (err) {
                    console.warn(`[WARN] Could not extract duration for ${newFileName}:`, (err as Error).message);
                }
            }

            if (songRecord.audioUrl !== newAudioUrl || songRecord.duration !== duration) {
                await prisma.song.update({
                    where: { id: songRecord.id },
                    data: { 
                        audioUrl: newAudioUrl,
                        duration: duration
                    }
                });
                console.log(`[DB] Updated record for "${songRecord.title}"`);
                dbUpdateCount++;
            }
        } else {
            console.warn(`[WARN] No database record found for "${file}"`);
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Files renamed: ${renameCount}`);
    console.log(`DB records updated: ${dbUpdateCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
