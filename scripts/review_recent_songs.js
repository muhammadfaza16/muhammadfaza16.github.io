const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // get songs added in the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const songs = await prisma.song.findMany({
        where: { createdAt: { gte: twoDaysAgo } },
        orderBy: { createdAt: 'desc' }
    });

    console.log(JSON.stringify(songs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
