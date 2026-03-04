import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("--- All Playlists ---");
    const playlists = await prisma.playlist.findMany();
    console.log(playlists.map(p => ({ id: p.id, title: p.title })));

    console.log("\n--- All Playlist-Song Links ---");
    const links = await prisma.playlistSong.findMany({
        include: { playlist: true, song: true }
    });
    console.log(`Found ${links.length} links.`);
    links.forEach(link => {
        console.log(`Playlist: "${link.playlist.title}" -> Song: "${link.song.title}"`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
