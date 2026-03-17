const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Starting URL normalization...");
    const songs = await prisma.song.findMany();
    
    let updatedCount = 0;
    
    for (const song of songs) {
        // If the URL is already encoded with %, we decode it first to get the raw filename
        // Then we store it as a URI-encoded string properly, or we can decide to store it raw
        // But the current implementation seems to expect encoded URLs in the DB.
        // The issue is likely some URLs are double-encoded or use '+' for spaces.
        
        let rawPath = song.audioUrl.replace('/audio/', '');
        
        // Decode to get back to the natural filename
        // We do it twice in case there was double encoding
        let decoded = decodeURIComponent(rawPath);
        while (decoded !== rawPath) {
            rawPath = decoded;
            decoded = decodeURIComponent(rawPath);
        }
        
        // Now we have the raw filename. Re-encode it exactly once.
        const normalizedUrl = `/audio/${encodeURIComponent(rawPath)}`;
        
        if (normalizedUrl !== song.audioUrl) {
            console.log(`Normalizing: "${song.title}"`);
            console.log(`  Old: ${song.audioUrl}`);
            console.log(`  New: ${normalizedUrl}`);
            
            await prisma.song.update({
                where: { id: song.id },
                data: { audioUrl: normalizedUrl }
            });
            updatedCount++;
        }
    }
    
    console.log(`\nNormalization complete.`);
    console.log(`Total songs checked: ${songs.length}`);
    console.log(`Total songs updated: ${updatedCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
