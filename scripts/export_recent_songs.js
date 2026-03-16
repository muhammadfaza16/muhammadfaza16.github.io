const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    // get songs added in the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const songs = await prisma.song.findMany({
        where: { createdAt: { gte: twoDaysAgo } },
        orderBy: { createdAt: 'desc' }
    });

    fs.writeFileSync('recent_songs.json', JSON.stringify(songs, null, 2));
    console.log("Saved to recent_songs.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
