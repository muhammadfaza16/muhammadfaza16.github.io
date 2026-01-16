"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    nextSong: (forcePlay?: boolean) => void;
    prevSong: () => void;
    currentSong: { title: string; audioUrl: string };
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
const PLAYLIST = [
    {
        title: "Alan Walker — Faded",
        audioUrl: "/audio/Alan Walker - Faded (Lyrics).mp3",
    },
    {
        title: "Alan Walker — Lily",
        audioUrl: "/audio/Alan Walker, K-391 & Emelie Hollow - Lily (Lyrics).mp3",
    },
    {
        title: "Loreen — Tattoo",
        audioUrl: "/audio/Loreen - Tattoo.mp3",
    },
    {
        title: "Bruno Mars — Locked Out",
        audioUrl: "/audio/Bruno Mars - Locked Out Of Heaven.mp3",
    },
    {
        title: "Halsey — Without Me",
        audioUrl: "/audio/Halsey - Without Me (Lyrics).mp3",
    },
    {
        title: "The Script — The Man Who",
        audioUrl: "/audio/The Script - The Man Who Can't Be Moved (Lyrics).mp3",
    },
    {
        title: "James Arthur — Impossible",
        audioUrl: "/audio/James Arthur - Impossible (Lyrics) (1).mp3",
    },
    {
        title: "John Newman — Love Me",
        audioUrl: "/audio/John Newman - Love Me Again (Lyrics).mp3",
    },
    {
        title: "Hoobastank — The Reason",
        audioUrl: "/audio/Hoobastank - The Reason (Lyrics).mp3",
    },
    {
        title: "Conan Gray — Memories",
        audioUrl: "/audio/Conan Gray - Memories (Lyrics).mp3",
    },
    {
        title: "Alan Walker — Alone",
        audioUrl: "/audio/Alan Walker & Ava Max - Alone, Pt. II (Lyrics).mp3",
    }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Theme integration
    const { theme, setTheme } = useTheme();
    const wasSwitchedRef = useRef(false);

    // Melancholy Mode Effect
    useEffect(() => {
        if (isPlaying && setTheme) {
            if (theme === "light") {
                setTheme("dark");
                wasSwitchedRef.current = true;
            }
        } else if (setTheme) {
            // When paused/stopped, revert only if we switched it
            if (wasSwitchedRef.current) {
                setTheme("light");
                wasSwitchedRef.current = false;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, setTheme]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [isPlaying]);

    const nextSong = useCallback((forcePlay = false) => {
        setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);

        if (forcePlay) {
            setIsPlaying(true);
        }
    }, []);

    const prevSong = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    }, []);

    // Auto-play when index changes if it was already playing or triggered by next
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentIndex, isPlaying]);

    const currentSong = PLAYLIST[currentIndex];

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, nextSong, prevSong, currentSong }}>
            <audio
                ref={audioRef}
                src={currentSong.audioUrl}
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => nextSong(true)}
                onError={(e) => {
                    console.error("Audio error:", e);
                    // Try next song on error? Or just stop.
                    setIsPlaying(false);
                }}
            />
            {children}
        </AudioContext.Provider>
    );
}
