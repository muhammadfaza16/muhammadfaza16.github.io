import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const playlists = await prisma.playlist.findMany();
    const withPlus = playlists.filter(p => JSON.stringify(p).includes('+'));
    console.log(`Playlists with '+': ${withPlus.length}`);
    withPlus.forEach(p => console.log(`- ${p.title} (${p.description})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
