import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(__dirname, '../public/audio');

async function main() {
    const allSongs = await prisma.song.findMany();
    const unknownArtistSongs: { id: string, title: string }[] = [];
    
    console.log("=== PHASE 3: Refining Titles (Removing Labels) ===");
    
    for (const song of allSongs) {
        let title = song.title;
        
        // Explicitly remove "TikTok Version" and other similar labels
        // These might be inside parentheses or just hanging
        const labelsToRemove = [
            /TikTok Version/gi,
            /Official Music Video/gi,
            /Official Video/gi,
            /Lyric Video/gi,
            /Video Clip/gi,
            /Lirik Lagu/gi,
            /Pop Nostalgia/gi,
            /Official Lyric Visualizer/gi,
            /Official Audio/gi,
            /Cover/gi, // User might want to keep this, but "moza cover" was debris earlier
            /Lyric Music Video/gi,
            /Lirik/gi,
            /Video/gi,
            /Visualizer/gi
        ];

        let refinedTitle = title;
        for (const regex of labelsToRemove) {
            refinedTitle = refinedTitle.replace(regex, '');
        }

        // Clean up formatting after removal
        refinedTitle = refinedTitle
            .replace(/\(\s*\)/g, '')
            .replace(/,\s*\)/g, ')')
            .replace(/\(\s*,/g, '(')
            .replace(/\s+/g, ' ')
            .replace(/ —\s*$/g, '') // remove trailing em-dash if title was all labels
            .trim();

        // Also remove trailing comma or separator before parentheses
        refinedTitle = refinedTitle.replace(/,\s*\(/g, ' (').replace(/\s*—\s*\(/g, ' (');

        if (refinedTitle !== song.title) {
            console.log(`Refining: "${song.title}" -> "${refinedTitle}"`);
            
            const oldFileName = decodeURIComponent(song.audioUrl.split('/audio/')[1] || '');
            const safeName = refinedTitle.replace(/[^a-zA-Z0-9 \-\u2014\(\)\&]/g, '').trim() + '.mp3';
            const nextAudioUrl = `/audio/${encodeURIComponent(safeName)}`;
            
            if (oldFileName) {
                const oldPath = path.join(AUDIO_DIR, oldFileName);
                const newPath = path.join(AUDIO_DIR, safeName);
                if (fs.existsSync(oldPath) && oldPath !== newPath) {
                    try {
                        fs.renameSync(oldPath, newPath);
                    } catch (e) {
                         console.error(`Failed to rename ${oldPath}: ${e}`);
                    }
                }
            }
            
            await prisma.song.update({
                where: { id: song.id },
                data: { title: refinedTitle, audioUrl: nextAudioUrl }
            });
            title = refinedTitle;
        }

        if (title.startsWith('Unknown —')) {
            unknownArtistSongs.push({ id: song.id, title: title });
        }
    }

    // Save unknown artists to a file for easy listing
    fs.writeFileSync(path.join(__dirname, '../unknown_artists.json'), JSON.stringify(unknownArtistSongs, null, 2));
    console.log(`\nFound ${unknownArtistSongs.length} songs with Unknown artist.`);
    console.log("Saved to unknown_artists.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
