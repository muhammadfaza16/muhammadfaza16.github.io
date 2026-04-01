import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const prisma = new PrismaClient();

async function main() {
  const allSongs = await prisma.song.findMany({
    where: {
      title: {
        contains: 'Peterpan',
        mode: 'insensitive'
      }
    }
  });

  console.log(`Found ${allSongs.length} Peterpan songs in database.`);

  const issues = [];

  for (const song of allSongs) {
    const audioPath = path.join(process.cwd(), 'public', song.audioUrl);
    const fileExists = fs.existsSync(audioPath);
    
    let actualDuration = null;
    let metadataError = null;

    if (fileExists) {
      try {
        const metadata = await mm.parseFile(audioPath);
        actualDuration = metadata.format.duration ? Math.round(metadata.format.duration) : null;
      } catch (err) {
        metadataError = err.message;
      }
    }

    if (!fileExists) {
        issues.push(`[Missing File] ID: ${song.id} | Title: "${song.title}"`);
    }

    if (song.duration === null || song.duration === 0) {
        issues.push(`[Invalid DB Duration] Title: "${song.title}" | DB Duration: ${song.duration} | Actual: ${actualDuration}`);
    } else if (fileExists && actualDuration !== null && Math.abs(song.duration - actualDuration) > 3) {
        issues.push(`[Duration Mismatch] Title: "${song.title}" | DB Duration: ${song.duration}s | Actual: ${actualDuration}s`);
    }

    if (metadataError) {
        issues.push(`[Metadata Error] Title: "${song.title}" | Error: ${metadataError}`);
    }
  }

  console.log('\n--- AUDIT RESULTS ---');
  if (issues.length === 0) {
    console.log('No issues found with Peterpan songs.');
  } else {
    issues.forEach(issue => console.log(issue));
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
