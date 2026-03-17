const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'public', 'audio');

async function main() {
  const songs = await prisma.song.findMany();
  console.log(`Checking ${songs.length} songs...`);
  
  let brokenCount = 0;
  for (const song of songs) {
    if (song.audioUrl.startsWith('/audio/')) {
        const relativePath = decodeURIComponent(song.audioUrl.replace('/audio/', ''));
        const fullPath = path.join(audioDir, relativePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`BROKEN: "${song.title}"`);
            console.log(`  Expected Path: "${fullPath}"`);
            console.log(`  Db Url:        "${song.audioUrl}"`);
            brokenCount++;
        }
    }
  }
  
  console.log(`\nTotal checked: ${songs.length}`);
  console.log(`Total broken:  ${brokenCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
