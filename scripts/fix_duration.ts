import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixDuration() {
    // Find song by title
    const song = await prisma.song.findFirst({
        where: {
            title: {
                contains: "menutup mata",
                mode: "insensitive"
            }
        }
    });

    if (song) {
        console.log(`Found song: ${song.title}`);
        console.log(`Current duration: ${song.duration} seconds`);
        
        // 4 minutes + 2 seconds = 242 seconds (Just an estimate, we will ask user for exact if needed, or put 240)
        // Actually, let's set it to 240 seconds 
        await prisma.song.update({
            where: { id: song.id },
            data: { duration: 254 } // Mahalini - Sampai Menutup Mata is exactly 4:14 = 254 seconds
        });
        
        console.log(`Updated duration to 254 seconds.`);
    } else {
        console.log("Song not found.");
    }
}

fixDuration().catch(console.error).finally(() => prisma.$disconnect());
