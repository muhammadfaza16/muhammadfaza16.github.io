import { useState, useEffect } from 'react';

export type LyricLine = {
    time: number;
    text: string;
};

export function useLyrics(songTitle: string) {
    const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!songTitle) return;

        setLoading(true);
        setError(false);
        setLyrics(null);

        // Construct URL: public/lyrics/Title.json
        const cleanTitle = songTitle.trim();
        const url = `/lyrics/${encodeURIComponent(cleanTitle)}.json`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Lyrics not found");
                return res.json();
            })
            .then((data: LyricLine[]) => {
                setLyrics(data);
                setLoading(false);
            })
            .catch(() => {
                // Silent fail: just means no lyrics for this song yet
                setLyrics(null);
                setError(true);
                setLoading(false);
            });
    }, [songTitle]);

    return { lyrics, loading, error };
}
