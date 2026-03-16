import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const playlists = await prisma.playlist.findMany();
    console.log(`Found ${playlists.length} playlists in DB.`);
    for (const p of playlists) {
        console.log(`- ${p.title} (${p.slug})`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
