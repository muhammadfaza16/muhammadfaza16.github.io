import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDuration() {
    // 254 is the true physical length of the file
    const song = await prisma.song.findFirst({
        where: {
            title: { contains: "Acha" }
        }
    });

    if (song) {
        await prisma.song.update({
            where: { id: song.id },
            data: { duration: 254 }
        });
        console.log("Fixed Acha duration to 254s");
    }
}

fixDuration().catch(console.error).finally(() => prisma.$disconnect());
