// Dynamic Lyrics Engine Types
// The actual lyric data is now loaded from JSON files in public/lyrics/

export type LyricItem = {
    time: number; // Changed from start/end to time-based for lrc compatibility
    text: string;
    // Legacy support if needed, but JSONs use 'time'
    start?: number;
    end?: number;
    expressive?: boolean
};
