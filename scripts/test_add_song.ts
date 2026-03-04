import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Testing adding a song to a playlist...");
    try {
        const playlistId = "3fa48762-4194-49d8-bdac-954667f3c14b";

        // Create a dummy song first to ensure it exists
        const song = await prisma.song.create({
            data: {
                title: "Test Song " + Date.now(),
                audioUrl: "/audio/test.mp3",
                source: "local"
            }
        });
        console.log("Created dummy song:", song.id);

        // Now add it to the playlist
        const link = await prisma.playlistSong.upsert({
            where: {
                playlistId_songId: {
                    playlistId: playlistId,
                    songId: song.id
                }
            },
            update: {},
            create: {
                playlistId: playlistId,
                songId: song.id
            }
        });
        console.log("SUCCESS LINK:", link);

    } catch (e: any) {
        console.error("ERROR:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
