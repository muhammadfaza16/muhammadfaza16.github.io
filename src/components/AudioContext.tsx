"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
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
        title: "Alan Walker, K-391 & Emelie Hollow — Lily",
        audioUrl: "/audio/Alan Walker, K-391 & Emelie Hollow - Lily (Lyrics).mp3",
    },
    {
        title: "Alan Walker & Ava Max — Alone, Pt. II",
        audioUrl: "/audio/Alan Walker & Ava Max - Alone, Pt. II (Lyrics).mp3",
    },
    {
        title: "Bruno Mars — Locked Out Of Heaven",
        audioUrl: "/audio/Bruno Mars - Locked Out Of Heaven.mp3",
    },
    {
        title: "John Newman — Love Me Again",
        audioUrl: "/audio/John Newman - Love Me Again (Lyrics).mp3",
    },
    {
        title: "The Script — The Man Who Can't Be Moved",
        audioUrl: "/audio/The Script - The Man Who Can't Be Moved (Lyrics).mp3",
    },
    {
        title: "Conan Gray — Memories",
        audioUrl: "/audio/Conan Gray - Memories (Lyrics).mp3",
    },
    {
        title: "Halsey — Without Me",
        audioUrl: "/audio/Halsey - Without Me (Lyrics).mp3",
    },
    {
        title: "Hoobastank — The Reason",
        audioUrl: "/audio/Hoobastank - The Reason (Lyrics).mp3",
    },
    {
        title: "James Arthur — Impossible",
        audioUrl: "/audio/James Arthur - Impossible (Lyrics) (1).mp3",
    },
    {
        title: "Loreen — Tattoo",
        audioUrl: "/audio/Loreen - Tattoo.mp3",
    }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Theme integration
    const { theme, setTheme } = useTheme();
    const wasSwitchedRef = useRef(false);

    // Guard for source switch pause event
    const isSwitchingRef = useRef(false);

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
            setIsPlaying(false);
            audioRef.current.pause();
        } else {
            setIsPlaying(true);
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    };

    const nextSong = (forcePlay = false) => {
        // If forcing play, OR if already playing, act as switching
        if (forcePlay || isPlaying) {
            if (forcePlay) setIsPlaying(true);
            isSwitchingRef.current = true; // Flag transition
        }
        setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    const prevSong = () => {
        // If we were playing, we want to keep playing (implied forcePlay behavior for prev usually?)
        // The user didn't ask for forcePlay on prev, but logic implies continuity.
        // Let's keep it safe. If playing, set flag.
        if (isPlaying) {
            isSwitchingRef.current = true;
        }
        setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    };

    // Auto-play when index changes if it was already playing or triggered by next
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            // Basic safety check: only play if paused to avoid "interrupted" errors
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
        }
    }, [currentIndex, isPlaying]);

    const currentSong = PLAYLIST[currentIndex];

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, nextSong, prevSong, currentSong }}>
            <audio
                ref={audioRef}
                src={currentSong.audioUrl}
                preload="auto"
                onPlay={() => {
                    setIsPlaying(true);
                    isSwitchingRef.current = false; // Reset flag on successful play
                }}
                onPause={() => {
                    // Ignore pause event if it's due to switching songs
                    if (isSwitchingRef.current) {
                        isSwitchingRef.current = false;
                        return;
                    }

                    // Ignore pause event if buffering (readyState < 3 means likely waiting for data)
                    // 0: HAVE_NOTHING, 1: HAVE_METADATA, 2: HAVE_CURRENT_DATA
                    if (audioRef.current && audioRef.current.readyState < 3) {
                        return;
                    }

                    setIsPlaying(false);
                }}
                onWaiting={() => {
                    console.log("Audio buffering...");
                }}
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
