"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { useAudio } from "./AudioContext";
import rawPlaylist from "@/data/radioPlaylist.json";

// Type derived from our new JSON structure
type RadioTrack = {
    title: string;
    audioUrl: string;
    duration: number;
};

const PLAYLIST = rawPlaylist as RadioTrack[];

// Pre-calculate the total timeline duration and absolute offsets for blazing-fast sync
const TIMELINE = PLAYLIST.reduce((acc, song) => {
    const start = acc.totalDuration;
    const end = start + song.duration;
    acc.tracks.push({ ...song, startOffset: start, endOffset: end });
    acc.totalDuration = end;
    return acc;
}, { tracks: [] as (RadioTrack & { startOffset: number, endOffset: number })[], totalDuration: 0 });

interface RadioContextType {
    isTunedIn: boolean;
    isSyncing: boolean;
    isBuffering: boolean;
    radioState: {
        song: RadioTrack;
        index: number;
        progress: number;
        formattedTime: string;
    } | null;
    handleTuneIn: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function useRadio() {
    const context = useContext(RadioContext);
    if (!context) {
        throw new Error("useRadio must be used within a RadioProvider");
    }
    return context;
}

// Helper to shuffle the playlist
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function RadioProvider({ children }: { children: React.ReactNode }) {
    const [isTunedIn, setIsTunedIn] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [radioQueue, setRadioQueue] = useState<typeof PLAYLIST>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { isPlaying: globalPlaying, togglePlay } = useAudio();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize random queue on mount
    useEffect(() => {
        setRadioQueue(shuffleArray(PLAYLIST));
    }, []);

    const currentSong = radioQueue[currentIndex] || null;

    // Background Resume Logic
    // Ensures audio resumes when returning to the tab or if browser pauses it during navigation
    useEffect(() => {
        if (!isTunedIn) return;

        const attemptResume = () => {
            if (audioRef.current && isTunedIn && audioRef.current.paused) {
                audioRef.current.play().catch(() => {
                    // Fail silently, likely needs interaction
                });
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                setTimeout(attemptResume, 100);
            }
        };

        const handleFocus = () => setTimeout(attemptResume, 100);

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isTunedIn]);

    // Play/Pause Control
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;
        const audio = audioRef.current;

        if (!isTunedIn) {
            audio.pause();
            return;
        }

        const isSameSong = audio.src.endsWith(currentSong.audioUrl);

        if (!isSameSong) {
            console.log("Radio Engine: Switching to new song", currentSong.audioUrl);
            setIsSyncing(true);
            audio.src = currentSong.audioUrl;

            const attemptPlay = () => {
                setIsSyncing(false);
                audio.play().catch(e => console.error("Radio play failed", e));
            };

            audio.addEventListener('canplay', attemptPlay, { once: true });
            if (audio.readyState >= 3) attemptPlay();

        } else if (audio.paused && isTunedIn) {
            audio.play().catch(e => console.error("Radio resume failed", e));
        }
    }, [isTunedIn, currentSong]); // Removed radioSongUrl

    const handleTuneIn = () => {
        if (!radioState || !audioRef.current) return;

        if (isTunedIn) {
            audioRef.current.pause();
            setIsTunedIn(false);
            return;
        }

        if (globalPlaying) {
            togglePlay();
        }

        setIsTunedIn(true);
    };

    return (
        <RadioContext.Provider value={{
            isTunedIn,
            isSyncing,
            isBuffering,
            radioState,
            handleTuneIn
        }}>
            {children}
            <audio
                ref={audioRef}
                preload="metadata"
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onError={() => {
                    setIsBuffering(false);
                }}
            />
        </RadioContext.Provider>
    );
}
