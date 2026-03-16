import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const allSongs = await prisma.song.findMany();
    fs.writeFileSync('complete_songs_dump.json', JSON.stringify(allSongs, null, 2));
    console.log(`Dumped ${allSongs.length} songs to complete_songs_dump.json`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
