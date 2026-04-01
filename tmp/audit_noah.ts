import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const prisma = new PrismaClient();

async function main() {
  const allSongs = await prisma.song.findMany({
    where: {
      title: {
        contains: 'NOAH',
        mode: 'insensitive'
      }
    }
  });

  console.log(`Found ${allSongs.length} NOAH songs in database.`);

  const issues = [];

  for (const song of allSongs) {
    const audioPath = path.join(process.cwd(), 'public', song.audioUrl);
    const fileExists = fs.existsSync(audioPath);
    
    let actualDuration: number | null = null;
    let metadataError: string | null = null;

    if (fileExists) {
      try {
        const metadata = await mm.parseFile(audioPath);
        actualDuration = metadata.format.duration ? Math.round(metadata.format.duration) : null;
      } catch (err: any) {
        metadataError = err.message;
      }
    }

    if (!fileExists) {
      issues.push(`[Missing File] ID: ${song.id} | Title: ${song.title} | File: ${song.audioUrl}`);
    }

    if (song.duration === null || song.duration === 0) {
      issues.push(`[Invalid DB Duration] ID: ${song.id} | Title: ${song.title} | DB Duration: ${song.duration} | Actual Duration: ${actualDuration}`);
    }

    if (fileExists && actualDuration !== null && song.duration !== null && Math.abs(song.duration - actualDuration) > 3) {
      issues.push(`[Duration Mismatch] ID: ${song.id} | Title: ${song.title} | DB Duration: ${song.duration}s | Actual File Duration: ${actualDuration}s`);
    }

    if (metadataError) {
      issues.push(`[Metadata Error] ID: ${song.id} | Title: ${song.title} | Error: ${metadataError}`);
    }
  }

  console.log('\n--- AUDIT RESULTS ---');
  if (issues.length === 0) {
    console.log('No issues found with NOAH songs.');
  } else {
    issues.forEach(issue => console.log(issue));
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
