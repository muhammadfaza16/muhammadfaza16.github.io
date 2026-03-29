import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'music-metadata';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error("Audio directory not found:", AUDIO_DIR);
    return;
  }

  const songs = await prisma.song.findMany({
    where: {
      OR: [
        { duration: null },
        { duration: 0 }
      ]
    }
  });

  console.log(`Found ${songs.length} songs with missing or zero duration.`);

  let fixCount = 0;
  let failCount = 0;

  for (const song of songs) {
    // audioUrl normally looks like "/audio/filename.mp3"
    const relativePath = song.audioUrl.startsWith('/audio/') 
      ? song.audioUrl.substring(7) 
      : song.audioUrl;
    
    const filePath = path.join(AUDIO_DIR, decodeURIComponent(relativePath));

    if (!fs.existsSync(filePath)) {
      console.warn(`[SKIP] File not found: ${filePath} for song "${song.title}"`);
      failCount++;
      continue;
    }

    try {
      const metadata = await mm.parseFile(filePath);
      const duration = Math.round(metadata.format.duration || 0);

      if (duration > 0) {
        await prisma.song.update({
          where: { id: song.id },
          data: { duration }
        });
        console.log(`[FIXED] "${song.title}" -> ${duration}s`);
        fixCount++;
      } else {
        console.warn(`[WARN] Could not extracted valid duration for "${song.title}"`);
        failCount++;
      }
    } catch (err: any) {
      console.error(`[ERROR] Failed to parse ${song.title}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Songs fixed: ${fixCount}`);
  console.log(`Failures: ${failCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
