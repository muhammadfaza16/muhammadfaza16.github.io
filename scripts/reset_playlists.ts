import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("=== RESETTING PLAYLISTS IN DATABASE ===");

    // 1. Clear all playlist-song associations
    const deletedSongs = await prisma.playlistSong.deleteMany({});
    console.log(`Cleared ${deletedSongs.count} song assignments.`);

    // 2. Update Playlist titles based on fixed IDs
    const updates = [
        { id: "teman-sunyi", title: "Western Classic" },
        { id: "line-up-inti", title: "Alexandria" },
        { id: "menunggu-pagi", title: "Malay Josjis" },
        { id: "tentang-dia", title: "Nanteska" }
    ];

    for (const update of updates) {
        try {
            await prisma.playlist.update({
                where: { slug: update.id }, // ID here mappings to slug in DB
                data: { title: update.title }
            });
            console.log(`Updated title to: ${update.title}`);
        } catch (e) {
            console.warn(`Could not update playlist with slug ${update.id}: ${e}`);
        }
    }

    console.log("Playlist reset complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
