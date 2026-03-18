import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecific() {
    // 1. Fix "Sempurna" title inversion
    const sempurnaSongs = await prisma.song.findMany({
        where: {
            title: {
                contains: 'Sempurna — Andra',
                mode: 'insensitive'
            }
        }
    });

    for (const song of sempurnaSongs) {
        if (song.title.startsWith('Sempurna — Andra')) {
            const newTitle = song.title.replace('Sempurna — Andra', 'Andra And The Backbone — Sempurna');
            console.log(`Fixing: ${song.title} -> ${newTitle}`);
            await prisma.song.update({
                where: { id: song.id },
                data: { title: newTitle }
            });
        }
    }

    // 2. Any other specific fixes?
    // Let's check for any other "Title — Artist" patterns if we find them.
    // For now, this is the main one requested.
    
    console.log("Specific fixes completed.");
}

fixSpecific().catch(console.error).finally(() => prisma.$disconnect());
