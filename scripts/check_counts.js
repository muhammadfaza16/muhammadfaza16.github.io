const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const playlists = await prisma.playlist.findMany({
    include: {
      _count: {
        select: { songs: true }
      }
    }
  });
  
  const totalSongs = await prisma.song.count();
  
  console.log('--- PLAYLIST COUNTS ---');
  playlists.forEach(p => {
    console.log(`${p.slug}: ${p._count.songs} songs`);
  });
  console.log(`total: ${totalSongs} songs`);
}

main().finally(() => prisma.$disconnect());
