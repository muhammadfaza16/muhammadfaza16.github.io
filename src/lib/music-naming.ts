/**
 * Robustly parses a raw song title into clean Artist and Title parts.
 */
export function parseSongTitle(raw: string): { artist: string; title: string } {
    if (!raw) return { artist: "", title: "" };

    let t = raw.trim();

    // 1. Remove everything in brackets [] or parentheses ()
    t = t.replace(/\s*[\[(][^\])]*[\])]\s*/g, " ");

    // 2. Remove common trailing junk words
    const trailJunk = [
        /\s+official\s*(music\s*)?video\s*/gi,
        /\s+official\s*audio\s*/gi,
        /\s+lyrics?\s*(video)?\s*/gi,
        /\s+visualizer\s*/gi,
        /\s+slowed\s*((\+|n|and)\s*reverb)?\s*/gi,
        /\s+reverb\s*/gi,
        /\s+bass\s*boost(ed)?\s*/gi,
        /\s+sped\s*up\s*/gi,
        /\s+nightcore\s*/gi,
        /\s+8d\s*audio\s*/gi,
        /\s+use\s*headphones?\s*/gi,
        /\s*\|\s*.*$/gi,
    ];
    for (const p of trailJunk) {
        t = t.replace(p, " ");
    }

    // 3. Clean up stray punctuation
    t = t.replace(/\s*[-–—]\s*$/g, "");
    t = t.replace(/^\s*[-–—]\s*/g, "");
    t = t.replace(/\s{2,}/g, " ").trim();

    // 4. Split into Artist and Title
    let artist = "";
    let title = t;
    const dashMatch = t.match(/^(.+?)\s*[-–—]\s+(.+)$/);
    if (dashMatch) {
        artist = dashMatch[1].trim();
        title = dashMatch[2].trim();
        title = title.split(/\s*[-–—]\s*/)[0].trim();
    }

    // 5. Title Case
    const titleCase = (s: string) =>
        s.split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

    return {
        artist: titleCase(artist),
        title: titleCase(title)
    };
}

/**
 * Legacy wrapper: Robustly formats a raw song title into a clean "Artist — Title" format.
 */
export function formatSongTitle(raw: string): string {
    const { artist, title } = parseSongTitle(raw);
    if (artist) {
        return `${artist} — ${title}`.slice(0, 100).trim();
    }
    return title.slice(0, 100).trim();
}
