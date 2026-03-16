import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const songs = await prisma.song.findMany({
        where: {
            title: {
                contains: '+'
            }
        }
    });

    if (songs.length === 0) {
        console.log("No songs found with '+' symbol.");
    } else {
        console.log(`Found ${songs.length} songs with '+':`);
        songs.forEach(s => console.log(`- ${s.title}`));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
