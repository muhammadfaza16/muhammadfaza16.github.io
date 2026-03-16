import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const songs = await prisma.song.findMany();
    const matches = songs.filter(s => JSON.stringify(s).includes('+'));
    console.log(`Songs with '+': ${matches.length}`);
    matches.forEach(m => console.log(JSON.stringify(m, null, 2)));
}

main().catch(console.error).finally(() => prisma.$disconnect());
