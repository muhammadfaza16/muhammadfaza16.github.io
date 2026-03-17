
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function audit() {
  console.log("--- Starting Song Audit (JS) ---");
  try {
      const songs = await prisma.song.findMany();
      console.log(`Found ${songs.length} songs in database.`);

      const audioDir = path.join(process.cwd(), 'public', 'audio');
      if (!fs.existsSync(audioDir)) {
          console.error("Audio directory not found:", audioDir);
          return;
      }
      const files = fs.readdirSync(audioDir);
      console.log(`Found ${files.length} files in public/audio.`);

      const results = {
        missingFiles: [],
        mismatchedUrls: [],
        urlWithPlus: [],
        success: []
      };

      for (const song of songs) {
        const url = song.audioUrl;
        // Basic decode and remove prefix
        let decodedUrl = decodeURIComponent(url);
        let filenameFromUrl = decodedUrl.replace('/audio/', '');
        
        let exists = files.includes(filenameFromUrl);
        
        if (!exists) {
            // Check if it's a + vs space issue
            // Databases often store URLs where spaces are + (standard URL encoding)
            // But browsers might send it as %20 or + depending on implementation
            const withSpaces = filenameFromUrl.replace(/\+/g, ' ');
            if (files.includes(withSpaces)) {
                results.mismatchedUrls.push({ title: song.title, dbUrl: url, actualFile: withSpaces, type: 'plus_vs_space' });
            } else {
                results.missingFiles.push({ title: song.title, dbUrl: url, attempted: filenameFromUrl });
            }
        } else {
            if (url.includes('+')) {
                results.urlWithPlus.push({ title: song.title, dbUrl: url });
            }
            results.success.push({ title: song.title });
        }
      }

      console.log("\n--- Audit Summary ---");
      console.log(`Total DB Songs: ${songs.length}`);
      console.log(`Accessible (Exact match): ${results.success.length}`);
      console.log(`Accessible (via + -> space fix): ${results.mismatchedUrls.length}`);
      console.log(`Inaccessible (Missing): ${results.missingFiles.length}`);
      console.log(`URLs containing '+': ${results.urlWithPlus.length}`);
      
      if (results.missingFiles.length > 0) {
        console.log("\n--- TOP 10 MISSING FILES ---");
        results.missingFiles.slice(0, 10).forEach(m => {
            console.log(`[!] TITLE: ${m.title}`);
            console.log(`    DB_URL: ${m.dbUrl}`);
            console.log(`    EXPECTED_FILE: ${m.attempted}`);
        });
      }

      if (results.mismatchedUrls.length > 0) {
        console.log("\n--- TOP 5 PLUS-SPACE MISMATCHES ---");
        results.mismatchedUrls.slice(0, 5).forEach(m => {
            console.log(`[*] ${m.title}: DB has '+' but file has ' '`);
        });
      }

  } catch (err) {
      console.error("Audit failed:", err);
  } finally {
      await prisma.$disconnect();
  }
}

audit();
