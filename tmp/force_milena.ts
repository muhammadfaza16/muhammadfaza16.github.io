import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Force Provisioning Milena ---');
    // Using the exact prisma property name 'playlist' (usually camelCase for models)
    const p = await prisma.playlist.upsert({
      where: { slug: 'milena' },
      update: {
          title: 'Milena',
          coverImage: '/images/playlist/milena.jpg',
          coverColor: '#1E1B4B'
      },
      create: {
          slug: 'milena',
          title: 'Milena',
          description: 'Mysteries and melodies.',
          coverImage: '/images/playlist/milena.jpg',
          coverColor: '#1E1B4B'
      }
    });
    console.log(`✅ Success! Playlist [${p.title}] is now in your database.`);
  } catch (error) {
    console.error('❌ Failed to provision Milena:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
