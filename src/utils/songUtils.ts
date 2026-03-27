export interface ParsedTitle {
    artist: string;
    cleanTitle: string;
    labels: string[];
}

const METADATA_KEYWORDS = [
    "Slowed", "Reverb", "Sped Up", "Speed Up"
];

export function parseSongTitle(fullTitle: string): ParsedTitle {
    if (!fullTitle) return { artist: "Unknown Artist", cleanTitle: "Unknown Title", labels: [] };

    const parts = fullTitle.split("—");
    const artist = parts[0]?.trim() || "Unknown Artist";
    let rawTitle = parts[1]?.trim() || fullTitle;
    const labels: string[] = [];

    // 1. Identify "Slowed + Reverb" combinations (Priority)
    const srPatterns = [
        /\(\s*[^()]*?slowed\s*(&|\+|\s|and)\s*reverb[^()]*?\)/gi,
        /\[\s*[^[\]]*?slowed\s*(&|\+|\s|and)\s*reverb[^[\]]*?\]/gi,
        /(\s*-\s*slowed\s*(&|\+|\s|and)\s*reverb.*)$/gi
    ];
    
    srPatterns.forEach(p => {
        if (p.test(rawTitle)) {
            labels.push("SLOWED + REVERB");
            rawTitle = rawTitle.replace(p, "").trim();
        }
    });

    // 2. Identify individual keywords (Slowed, Reverb, Sped Up)
    const keywords = ["Slowed", "Reverb", "Sped Up", "Speed Up"];
    keywords.forEach(kw => {
        if (labels.length > 0) return; // Skip if already caught by combo

        const patterns = [
            new RegExp(`\\(\\s*[^()]*?\\b${kw}\\b[^()]*?\\)`, "gi"),
            new RegExp(`\\[\\s*[^[\\]]*?\\b${kw}\\b[^[\\]]*?\\]`, "gi"),
            new RegExp(`(\\s+-\\s+[^\\s]*?\\b${kw}\\b.*)$`, "gi") // Surgical trailing hyphen
        ];

        patterns.forEach(p => {
            if (p.test(rawTitle)) {
                labels.push(kw.toUpperCase().replace("SPEED UP", "SPED UP"));
                rawTitle = rawTitle.replace(p, "").trim();
            }
        });
    });

    // 3. Strip Junk Metadata (Official Video, Lyrics, etc.)
    const junkKeywords = [
        "Official Music Video", "Official Video", "Official Audio", 
        "Official Lyric Visualizer", "Music Video", "Lyric Video", 
        "Lirik Video", "Lyrics", "Lirik", "Video", "Audio", "Full Album"
    ];

    junkKeywords.forEach(jk => {
        const patterns = [
            new RegExp(`\\(\\s*[^()]*?${jk}[^()]*?\\)`, "gi"),
            new RegExp(`\\[\\s*[^[\\]]*?${jk}[^[\\]]*?\\]`, "gi"),
        ];
        patterns.forEach(p => {
            rawTitle = rawTitle.replace(p, "").trim();
        });
    });

    // Final cleanup
    let cleanTitle = rawTitle
        .replace(/\s+[\-\&\+]\s*$/, "") // Remove trailing separators
        .replace(/\(\s*\)/g, "")        // Remove empty parens
        .replace(/\[\s*\]/g, "")        // Remove empty brackets
        .replace(/\s\s+/g, " ")         // Collapse spaces
        .trim();

    return { artist, cleanTitle, labels: Array.from(new Set(labels)) };
}
