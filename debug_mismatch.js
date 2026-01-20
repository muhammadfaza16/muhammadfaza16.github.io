const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'public', 'audio');
const contextFile = path.join(__dirname, 'src', 'components', 'AudioContext.tsx');

const files = fs.readdirSync(audioDir);
const contextContent = fs.readFileSync(contextFile, 'utf-8');

const playlistMatches = [...contextContent.matchAll(/audioUrl:\s*"([^"]+)"/g)];
const playlistUrls = playlistMatches.map(match => decodeURIComponent(match[1]).split('/').pop());

const problematicFiles = [
    "David Guetta, Bebe Rexha - I'm good (Blue)  I'm good, yeah, I'm feelin' alright.mp3",
    "Kygo & Selena Gomez - It Ain't Me (Audio).mp3",
    "Shawn Mendes  There's Nothing Holding Me Back (Lyrics).mp3",
    "SLANDER - Love is Gone (Lyrics) ft. Dylan Matthew (Acoustic) I'm sorry don't leave me.mp3",
    "The Chainsmokers - Don't Let Me Down (Lyrics) ft. Daya.mp3",
    "The Weeknd & Ariana Grande - Save Your Tears (Remix) (Official Video).mp3"
];

console.log("--- Strict Debugging ---");

problematicFiles.forEach(targetFile => {
    const isOnDisk = files.includes(targetFile);
    const isInPlaylist = playlistUrls.includes(targetFile);

    console.log(`\nTarget: "${targetFile}"`);
    console.log(`  On Disk:      ${isOnDisk ? 'YES' : 'NO'}`);
    console.log(`  In Playlist:  ${isInPlaylist ? 'YES' : 'NO'}`);

    if (!isInPlaylist) {
        // Try to find unmatched candidates in playlist that look similar
        const candidates = playlistUrls.filter(u => u.includes(targetFile.substring(0, 10)) || u.includes("Weeknd"));
        if (candidates.length > 0) {
            console.log("  Candidates in Playlist:");
            candidates.forEach(c => {
                console.log(`    "${c}"`);
                compareStrings(targetFile, c);
            });
        }
    }
});

function compareStrings(a, b) {
    console.log(`    Comparing...`);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
            console.log(`    MISMATCH at index ${i}:`);
            console.log(`      Target: '${a[i]}' code=${a.charCodeAt(i)}`);
            console.log(`      Cand:   '${b[i]}' code=${b.charCodeAt(i)}`);
            return;
        }
    }
}
