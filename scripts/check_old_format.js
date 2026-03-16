const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // get 10 oldest songs to see standard convention
    const songs = await prisma.song.findMany({
        orderBy: { createdAt: 'asc' },
        take: 10
    });

    console.log(JSON.stringify(songs.map(s => s.title), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
