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
  console.log(JSON.stringify(playlists, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
