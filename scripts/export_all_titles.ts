import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const allSongs = await prisma.song.findMany({
        orderBy: { title: 'asc' }
    });
    
    const titles = allSongs.map(s => s.title);
    fs.writeFileSync('all_titles_debug.json', JSON.stringify(titles, null, 2));
    console.log(`Saved ${titles.length} titles to all_titles_debug.json`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
