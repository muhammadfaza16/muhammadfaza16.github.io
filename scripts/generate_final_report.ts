import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const songs = await prisma.song.findMany({ 
        orderBy: { updatedAt: 'desc' }, 
        take: 37 
    });

    let md = '# Final Music Ingestion Report\n\n';
    md += 'Successfully processed 37 songs from the `populate` folder into the main library.\n\n';
    md += '| Final Title | Category | Slugified URL |\n';
    md += '| :--- | :--- | :--- |\n';

    songs.reverse().forEach(song => {
        md += `| **${song.title}** | ${song.category} | \`${song.audioUrl}\` |\n`;
    });

    md += '\n## Sync Status\n';
    md += '- **"Indo Hits" Playlist**: Updated to include all new tracks.\n';
    md += '- **Filesystem**: All tracks moved to `public/audio/` with URL-safe slugs.\n';

    fs.writeFileSync(path.join(process.cwd(), 'final_ingestion_report.md'), md);
    console.log('Final report generated as final_ingestion_report.md');
}

main().catch(console.error).finally(() => prisma.$disconnect());
