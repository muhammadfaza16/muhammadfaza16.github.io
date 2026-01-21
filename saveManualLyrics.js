const fs = require('fs');
const path = require('path');

const title = process.argv[2];
const inputFile = process.argv[3];
const outputDir = path.join(__dirname, 'public', 'lyrics');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

if (!title || !inputFile) {
    console.error("Usage: node saveManualLyrics.js \"Song Title\" \"input.txt\"");
    process.exit(1);
}

try {
    const lrcText = fs.readFileSync(inputFile, 'utf8');
    const lines = lrcText.split('\n');
    const lyrics = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const ms = parseFloat(`0.${match[3]}`);
            const time = minutes * 60 + seconds + ms;
            const text = line.replace(timeRegex, '').trim().replace(/"/g, "'");

            if (text) {
                lyrics.push({ time, text });
            }
        }
    }

    if (lyrics.length === 0) {
        console.error("Error: No valid LRC lines found in input.");
        process.exit(1);
    }

    const outputFile = path.join(outputDir, `${title}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(lyrics, null, 4));
    console.log(`Successfully saved ${lyrics.length} lyric lines to: ${title}.json`);

} catch (err) {
    console.error("Error processing file:", err.message);
    process.exit(1);
}
