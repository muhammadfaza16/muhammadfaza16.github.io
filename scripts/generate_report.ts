import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function report() {
    const allSongs = await prisma.song.findMany({
        orderBy: { title: 'asc' }
    });

    const categories: Record<string, string[]> = {};
    for (const song of allSongs) {
        const cat = song.category || 'Uncategorized';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(song.title);
    }

    let output = "# Current Database Song Categories\n\n";
    output += `Total Songs: ${allSongs.length}\n\n`;

    for (const [cat, titles] of Object.entries(categories)) {
        output += `## ${cat} (${titles.length})\n`;
        titles.forEach(t => output += `- ${t}\n`);
        output += "\n";
    }

    fs.writeFileSync('current_category_report.md', output);
    console.log("Report written to current_category_report.md");
}

report().catch(console.error).finally(() => prisma.$disconnect());
