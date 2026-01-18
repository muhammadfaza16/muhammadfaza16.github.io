const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Specific mappings for files that don't follow standard format or need manual fix
const MANUAL_MAPPING = {
    'Ku Katakan Dengan Indah.mp3': 'Peterpan - Ku Katakan Dengan Indah.mp3',
    'Separuh Aku - Noah.mp3': 'Noah - Separuh Aku.mp3',
    'NOAH - Ini Cinta (Official Audio).mp3': 'Noah - Ini Cinta.mp3',
    // Ensure Lily is handled if it exists in a raw form, though user said they replaced it.
    // We'll process all files generic style if not here.
};

function cleanFileName(filename) {
    if (MANUAL_MAPPING[filename]) return MANUAL_MAPPING[filename];

    let name = filename.replace(/\.mp3$/i, '');

    // Remove common suffixes
    name = name.replace(/\(Lyrics\)/i, '')
        .replace(/\(Official Audio\)/i, '')
        .replace(/\(1\)/, '')
        .replace(/, Pt\. II/i, ' Pt II') // Simplify part 2
        .trim();

    // Split Artist - Title
    // Try to find the separator " - "
    const parts = name.split(' - ');

    // Default fallback if no separator
    let artist = 'Unknown';
    let title = name;

    if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim(); // Rejoin rest as title
    }

    // Truncate title words > 5
    const titleWords = title.split(/\s+/);
    if (titleWords.length > 5) {
        title = titleWords.slice(0, 3).join(' ') + '...';
    }

    // Clean up artist name for consistencies if needed (e.g., removing feat.)
    artist = artist.split(/,|&|feat\./)[0].trim();

    return `${artist} - ${title}.mp3`;
}

function main() {
    if (!fs.existsSync(AUDIO_DIR)) {
        console.error("Audio directory not found:", AUDIO_DIR);
        return;
    }

    const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    const playlist = [];

    files.forEach(file => {
        const oldPath = path.join(AUDIO_DIR, file);
        const newName = cleanFileName(file);
        const newPath = path.join(AUDIO_DIR, newName);

        // Rename logic
        if (file !== newName) {
            // Check if target exists to avoid overwrite collision (unless it's the same file case-insensitive? Windows handles that, but let's be safe)
            if (fs.existsSync(newPath) && file.toLowerCase() !== newName.toLowerCase()) {
                console.log(`Skipping rename of ${file} because ${newName} exists.`);
            } else {
                console.log(`Renaming: "${file}" -> "${newName}"`);
                fs.renameSync(oldPath, newPath);
            }
        } else {
            console.log(`Keeping: "${file}"`);
        }

        // Add to playlist data (for AudioContext)
        // Parse the NEW name for display
        const namePart = newName.replace(/\.mp3$/i, '');
        const [artist, ...titleParts] = namePart.split(' - ');
        const title = titleParts.join(' - ');

        playlist.push({
            title: `${artist} — ${title}`,
            audioUrl: `/audio/${encodeURIComponent(newName)}` // Encode for URL safety
        });
    });

    console.log("\nGenerated Playlist Data:");
    console.log(JSON.stringify(playlist, null, 2));
}

main();
