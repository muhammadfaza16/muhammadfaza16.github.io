import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Creating New Hot Playlists ---');

    // 1. NoahVerse
    const noahVerse = await (prisma as any).playlist.upsert({
      where: { slug: 'noahverse' },
      update: {
        title: 'NoahVerse',
        coverImage: '/images/playlist/noahverse.webp',
        coverColor: '#1E1B4B'
      },
      create: {
        title: 'NoahVerse',
        slug: 'noahverse',
        description: 'The definitive NOAH collection.',
        coverImage: '/images/playlist/noahverse.webp',
        coverColor: '#1E1B4B'
      }
    });
    console.log(`✓ Created/Updated: ${noahVerse.title} (${noahVerse.slug})`);

    // 2. Back to Basic (B2B)
    const b2b = await (prisma as any).playlist.upsert({
      where: { slug: 'back-to-basic' },
      update: {
        title: 'Back to Basic (B2B)',
        coverImage: '/images/playlist/back_to_basic.jpg',
        coverColor: '#312E81'
      },
      create: {
        title: 'Back to Basic (B2B)',
        slug: 'back-to-basic',
        description: 'Classical vibes and acoustic memories.',
        coverImage: '/images/playlist/back_to_basic.jpg',
        coverColor: '#312E81'
      }
    });
    console.log(`✓ Created/Updated: ${b2b.title} (${b2b.slug})`);

  } catch (error) {
    console.error('Error creating playlists:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
