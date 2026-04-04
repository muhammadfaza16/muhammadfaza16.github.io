import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const playlists = await prisma.playlist.findMany({
      select: {
          title: true,
          slug: true,
          coverImage: true,
          _count: { select: { songs: true } }
      },
      orderBy: { title: 'asc' }
    });

    console.log('--- Detailed Playlist Check ---');
    playlists.forEach((p, i) => {
      console.log(`${i + 1}. [${p.title}]`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Cover: ${p.coverImage ? `✅ ${p.coverImage}` : '❌ NULL/NULL'}`);
      console.log(`   Tracks: ${p._count.songs}`);
      console.log('-------------------------');
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
