const fs = require('fs');
const path = require('path');

const title = process.argv[2];
const offsetStr = process.argv[3];
const lyricsDir = path.join(__dirname, 'public', 'lyrics');

if (!title || !offsetStr) {
    console.error("Usage: node adjustLyrics.js \"Song Title\" <offset_in_seconds>");
    console.error("Example: node adjustLyrics.js \"Loreen — Tattoo\" 0.5  (Adds 0.5s delay)");
    console.error("Example: node adjustLyrics.js \"Loreen — Tattoo\" -1.0 (Speeds up by 1s)");
    process.exit(1);
}

const offset = parseFloat(offsetStr);

if (isNaN(offset)) {
    console.error("Error: Offset must be a number.");
    process.exit(1);
}

const filePath = path.join(lyricsDir, `${title}.json`);

if (!fs.existsSync(filePath)) {
    console.error(`Error: Lyric file not found for "${title}"`);
    process.exit(1);
}

try {
    const jsonContent = fs.readFileSync(filePath, 'utf8');
    let lyrics = JSON.parse(jsonContent);

    if (!Array.isArray(lyrics)) {
        console.error("Error: Invalid JSON format (expected array).");
        process.exit(1);
    }

    const updatedLyrics = lyrics.map(line => ({
        time: parseFloat((line.time + offset).toFixed(3)), // Keep precision clean
        text: line.text
    })).filter(line => line.time >= 0); // Remove lines that would become negative? Or keep 0? layout safe.

    fs.writeFileSync(filePath, JSON.stringify(updatedLyrics, null, 4));
    console.log(`Successfully adjusted timing for "${title}" by ${offset > 0 ? '+' : ''}${offset}s.`);

} catch (err) {
    console.error("Error processing file:", err.message);
    process.exit(1);
}
