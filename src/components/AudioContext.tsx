"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface AudioContextType {
    isPlaying: boolean;
    isShuffle: boolean;
    togglePlay: () => void;
    toggleShuffle: () => void;
    nextSong: () => void;
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
        title: "NOAH — Ini Cinta",
        audioUrl: "/audio/NOAH - Ini Cinta (Official Audio).mp3",
    },
    {
        title: "NOAH — Jalani Mimpi",
        audioUrl: "/audio/NOAH - Jalani Mimpi (Official Audio).mp3",
    },
    {
        title: "The Script — The Man Who Can't Be Moved",
        audioUrl: "/audio/The Script - The Man Who Can't Be Moved (Lyrics).mp3",
    },
    {
        title: "Alan Walker & Ava Max — Alone, Pt. II",
        audioUrl: "/audio/Alan Walker & Ava Max - Alone, Pt. II (Lyrics).mp3",
    }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
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

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const nextSong = () => {
        if (isShuffle && PLAYLIST.length > 1) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * PLAYLIST.length);
            } while (nextIndex === currentIndex);
            setCurrentIndex(nextIndex);
        } else {
            setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
        }
        setIsPlaying(true); // Auto-play next
    };

    // Auto-play when index changes if it was already playing or triggered by next
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentIndex, isPlaying]);

    const currentSong = PLAYLIST[currentIndex];

    return (
        <AudioContext.Provider value={{ isPlaying, isShuffle, togglePlay, toggleShuffle, nextSong, currentSong }}>
            <audio
                ref={audioRef}
                src={currentSong.audioUrl}
                onEnded={nextSong}
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
