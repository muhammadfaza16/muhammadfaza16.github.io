import fs from 'fs';
import path from 'path';

const playlistPath = path.resolve('src/data/radioPlaylist.json');
const rawPlaylist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));

console.log(`Loaded ${rawPlaylist.length} tracks.`);

const TIMELINE = rawPlaylist.reduce((acc, song) => {
    const start = acc.totalDuration;
    const end = start + song.duration;
    acc.tracks.push({ ...song, startOffset: start, endOffset: end });
    acc.totalDuration = end;
    return acc;
}, { tracks: [], totalDuration: 0 });

console.log(`TIMELINE Total Duration: ${TIMELINE.totalDuration}`);

if (TIMELINE.totalDuration > 0) {
    const currentTimeWorld = Math.floor(Date.now() / 1000);
    const globalProgress = currentTimeWorld % TIMELINE.totalDuration;

    console.log(`Current World Time (s): ${currentTimeWorld}`);
    console.log(`Global Progress (modulo): ${globalProgress}`);

    const activeTrackIndex = TIMELINE.tracks.findIndex(
        (t) => globalProgress >= t.startOffset && globalProgress < t.endOffset
    );

    if (activeTrackIndex !== -1) {
        const activeTrack = TIMELINE.tracks[activeTrackIndex];
        const songProgress = globalProgress - activeTrack.startOffset;
        console.log(`Currently Playing: [${activeTrackIndex}] ${activeTrack.title}`);
        console.log(`Progress: ${songProgress.toFixed(2)}s / ${activeTrack.duration.toFixed(2)}s`);
        console.log(`Formatted Time: ${Math.floor(songProgress / 60)}:${Math.floor(songProgress % 60).toString().padStart(2, '0')}`);
    } else {
        console.log("ERROR: Could not find active track.");
    }
} else {
    console.log("ERROR: Timeline duration is 0.");
}
