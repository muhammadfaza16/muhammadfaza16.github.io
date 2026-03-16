import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const songs = await prisma.song.findMany();
    const matches = songs.filter(s => s.title.includes('+'));
    console.log(`Songs with '+': ${matches.length}`);
    matches.forEach(m => console.log(`- ${m.title}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
