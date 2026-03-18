import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncPlaylists() {
    const playlists: any[] = await prisma.playlist.findMany();
    const indoPlaylist = playlists.find(p => p.slug === 'indo-hits');
    const luarPlaylist = playlists.find(p => p.slug === 'international-favorites');

    if (!indoPlaylist || !luarPlaylist) {
        console.error("Playlists not found!");
        console.log("Available slugs:", playlists.map(p => p.slug));
        return;
    }

    console.log(`Found Indo Playlist: ${indoPlaylist.id} (${indoPlaylist.slug})`);
    console.log(`Found Luar Playlist: ${luarPlaylist.id} (${luarPlaylist.slug})`);

    // 1. Clear existing relations
    await prisma.playlistSong.deleteMany({
        where: {
            playlistId: { in: [indoPlaylist.id, luarPlaylist.id] }
        }
    });
    console.log("Cleared existing playlist-song relations.");

    // 2. Fetch all categorized songs (using any to bypass outdated prisma types)
    const songs: any[] = await prisma.song.findMany();
    const indoSongs = songs.filter(s => s.category === 'Indo');
    const luarSongs = songs.filter(s => s.category === 'Luar');

    console.log(`Syncing ${indoSongs.length} songs to Indo playlist...`);
    console.log(`Syncing ${luarSongs.length} songs to Luar playlist...`);

    // 3. Create new relations
    if (indoSongs.length > 0 || luarSongs.length > 0) {
        await prisma.playlistSong.createMany({
            data: [
                ...indoSongs.map((s, index) => ({
                    playlistId: indoPlaylist.id,
                    songId: s.id,
                    order: index
                })),
                ...luarSongs.map((s, index) => ({
                    playlistId: luarPlaylist.id,
                    songId: s.id,
                    order: index
                }))
            ]
        });
    }

    console.log("Playlist sync completed successfully!");
}

syncPlaylists()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
