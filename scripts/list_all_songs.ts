import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const songs = await prisma.song.findMany({
    orderBy: { title: 'asc' }
  });

  console.log(JSON.stringify(songs.map(s => ({ id: s.id, title: s.title })), null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
