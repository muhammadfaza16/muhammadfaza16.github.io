
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function audit() {
  console.log("--- Starting Song Audit ---");
  const songs = await prisma.song.findMany();
  console.log(`Found ${songs.length} songs in database.`);

  const audioDir = path.join(process.cwd(), 'public', 'audio');
  const files = fs.readdirSync(audioDir);
  console.log(`Found ${files.length} files in public/audio.`);

  const results = {
    missingFiles: [] as any[],
    mismatchedUrls: [] as any[],
    specialCharIssues: [] as any[],
    success: [] as any[]
  };

  for (const song of songs) {
    const url = song.audioUrl;
    const filename = decodeURIComponent(url.replace('/audio/', ''));
    
    const exists = files.includes(filename);
    
    if (!exists) {
      // Try space vs + check
      const altFilename = filename.replace(/\+/g, ' ');
      if (files.includes(altFilename)) {
        results.mismatchedUrls.push({ title: song.title, dbUrl: url, actualFile: altFilename, type: 'plus_vs_space' });
      } else {
        results.missingFiles.push({ title: song.title, dbUrl: url });
      }
    } else {
      if (filename.includes('+') || filename.includes('&') || filename.includes('—')) {
         results.specialCharIssues.push({ title: song.title, dbUrl: url });
      }
      results.success.push({ title: song.title });
    }
  }

  console.log("\n--- Audit Results ---");
  console.log(`Success: ${results.success.length}`);
  console.log(`Missing Files: ${results.missingFiles.length}`);
  console.log(`Mismatched (Space/Plus): ${results.mismatchedUrls.length}`);
  
  if (results.missingFiles.length > 0) {
    console.log("\nTOP 5 MISSING:");
    results.missingFiles.slice(0, 5).forEach(m => console.log(`- ${m.title} (${m.dbUrl})`));
  }
  
  if (results.mismatchedUrls.length > 0) {
    console.log("\nMISTMATCHED EXAMPLES:");
    results.mismatchedUrls.slice(0, 5).forEach(m => console.log(`- ${m.title}: DB=${m.dbUrl}, File=${m.actualFile}`));
  }

  await prisma.$disconnect();
}

audit();
