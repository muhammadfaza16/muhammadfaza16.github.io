import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INDO_ARTISTS = [
  'Sheila on 7', 'Noah', 'Ungu', 'Samsons', 'D\'masiv', 'St12', 'Hijau Daun', 'Ungu', 'Vagetoz', 
  'Vierra', 'Virgoun', 'Virzha', 'Wali', 'Slam', 'Exists', 'Exist', 'Spoon', 'Screen', 'Ukays', 
  'Ella', 'Stings', 'Taxi', 'Taxi Band', 'Utopia', 'For Revenge', 'Fredy', 'Geisha', 'Geisha', 
  'Element', 'Eren', 'Janji', 'Desy Ratnasari', 'David Bayu', 'Daun Jatuh', 'Samsons', 'Last Child',
  'Lyodra', 'Andra', 'Dewa', 'Tulus', 'Risalah'
];

async function main() {
  console.log('Starting regional categorization...');

  // 1. Ensure Playlists exist in DB
  const playlists = [
    { slug: 'indo-hits', title: 'Indo Hits', description: 'Koleksi lagu-lagu terbaik dari tanah air dan sekitarnya.' },
    { slug: 'international-favorites', title: 'International Favorites', description: 'Top global tracks that define the current era.' }
  ];

  for (const p of playlists) {
    await prisma.playlist.upsert({
      where: { slug: p.slug },
      update: { title: p.title, description: p.description },
      create: { slug: p.slug, title: p.title, description: p.description, vibes: [] }
    });
  }

  const indoPlaylist = await prisma.playlist.findUnique({ where: { slug: 'indo-hits' } });
  const intlPlaylist = await prisma.playlist.findUnique({ where: { slug: 'international-favorites' } });

  if (!indoPlaylist || !intlPlaylist) throw new Error('Playlists not found');

  // 2. Fetch all songs
  const songs = await prisma.song.findMany();
  console.log(`Found ${songs.length} songs total.`);

  let indoCount = 0;
  let intlCount = 0;

  for (const song of songs) {
    const isIndo = INDO_ARTISTS.some(artist => song.title.toLowerCase().includes(artist.toLowerCase()));
    const targetPlaylistId = isIndo ? indoPlaylist.id : intlPlaylist.id;

    // Check if already in playlist
    const exists = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: targetPlaylistId,
          songId: song.id
        }
      }
    });

    if (!exists) {
      await prisma.playlistSong.create({
        data: {
          playlistId: targetPlaylistId,
          songId: song.id
        }
      });
      if (isIndo) indoCount++; else intlCount++;
    }
  }

  console.log(`Categorization complete!`);
  console.log(`Added to Indo Hits: ${indoCount}`);
  console.log(`Added to International Favorites: ${intlCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
