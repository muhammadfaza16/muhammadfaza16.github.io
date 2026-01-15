"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
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

const SONG = {
    title: "The Man Who Can't Be Moved — The Script",
    audioUrl: "/audio/the-man-who-cant-be-moved.mp3",
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
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

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, currentSong: SONG }}>
            <audio
                ref={audioRef}
                src={SONG.audioUrl}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                    console.error("Audio error:", e);
                    setIsPlaying(false);
                }}
            />
            {children}
        </AudioContext.Provider>
    );
}
