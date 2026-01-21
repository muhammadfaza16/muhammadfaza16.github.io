const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'lyrics');

function parseLrc(lrcText) {
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
            const text = line.replace(timeRegex, '').trim();

            if (text) {
                lyrics.push({ time, text });
            }
        }
    }
    return lyrics;
}

const BATCH_4 = {
    "twenty one pilots — Ride": `[00:08.50]I just wanna stay in the sun where I find
[00:11.50]I know it's hard sometimes
[00:14.00]Pieces of peace in the sun's peace of mind
[00:17.00]I know it's hard sometimes
[00:19.50]Yeah, I think about the end just way too much
[00:23.00]But it's fun to fantasize
[00:25.50]On my enemies I wouldn't wish who I was
[00:28.50]But it's fun to fantasize
[00:47.00]I'm falling, so I'm taking my time on my ride
[00:53.00]I'm falling, so I'm taking my time on my ride
[00:59.00]Taking my time on my ride
[01:05.50]I'd die for you, that's easy to say
[01:08.00]We have a list of people that we would take
[01:10.50]A bullet for them, a bullet for you
[01:12.00]A bullet for everybody in this room
[01:13.50]But I don't seem to see many bullets coming through
[01:16.00]See many bullets coming through
[01:17.50]Metaphorically, I'm the man
[01:19.00]But literally, I don't know what I'd do
[01:21.00]I'd live for you, and that's hard to do
[01:23.50]Even harder to say when you know it's not true
[01:26.50]Even harder to write when you know that tonight
[01:29.00]There were people back home who tried talking to you
[01:31.50]But then you ignored them still
[01:33.00]All these questions they're for real, like
[01:35.00]Who would you live for?
[01:36.50]Who would you die for?
[01:37.50]And would you ever kill?`,
    "Loreen — Tattoo": `[00:00.00]I don't wanna go
[00:02.50]But baby, we both know
[00:05.00]This is not our time
[00:07.50]It's time to say goodbye
[00:10.00]Until we meet again
[00:12.50]'Cause this is not the end
[00:15.00]It will come a day
[00:17.50]When we will find our way
[00:20.00]Violins playing and the angels crying
[00:25.00]When the stars align, then I'll be there
[00:30.00]No, I don't care about them all
[00:33.00]'Cause all I want is to be loved
[00:36.00]or all I care about is you
[00:38.00]You're stuck on me like a tattoo
[00:41.00]No, I don't care about the pain
[00:43.50]I'll walk through fire and through rain
[00:46.00]Just to get closer to you
[00:48.50]You're stuck on me like a tattoo
[00:51.50]I'm letting my hair down
[00:53.50]I'm taking it cool
[00:56.00]You got my heart in your hand
[00:58.50]Don't lose it, my friend
[01:01.00]It's all that I got
[01:03.50]Violins playing and the angels crying
[01:08.50]When the stars align, then I'll be there`
};

for (const [title, lrc] of Object.entries(BATCH_4)) {
    const json = parseLrc(lrc);
    if (json.length > 0) {
        fs.writeFileSync(path.join(outputDir, `${title}.json`), JSON.stringify(json, null, 4));
        console.log(`Updated ${title}`);
    } else {
        console.warn(`Failed to parse LRC for ${title}`);
    }
}
