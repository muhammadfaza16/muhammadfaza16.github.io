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

export function RadioProvider({ children }: { children: React.ReactNode }) {
    const [currentTimeWorld, setCurrentTimeWorld] = useState(0);
    const [mounted, setMounted] = useState(false);

    const [isTunedIn, setIsTunedIn] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    const { isPlaying: globalPlaying, togglePlay } = useAudio();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track precise World Time
    useEffect(() => {
        setMounted(true);
        // Sync the internal clock every second
        const interval = setInterval(() => {
            setCurrentTimeWorld(Date.now() / 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Evaluate the timeline
    const radioState = useMemo(() => {
        if (!mounted || TIMELINE.totalDuration === 0) return null;

        // Find exactly where we are in the endless loop
        const globalProgress = currentTimeWorld % TIMELINE.totalDuration;

        const activeTrackIndex = TIMELINE.tracks.findIndex(
            (t) => globalProgress >= t.startOffset && globalProgress < t.endOffset
        );

        if (activeTrackIndex === -1) return null; // Failsafe

        const activeTrack = TIMELINE.tracks[activeTrackIndex];
        const songProgress = globalProgress - activeTrack.startOffset;

        return {
            song: activeTrack,
            index: activeTrackIndex,
            progress: songProgress,
            formattedTime: `${Math.floor(songProgress / 60)}:${Math.floor(songProgress % 60).toString().padStart(2, '0')}`
        };
    }, [currentTimeWorld, mounted]);

    const radioStateRef = useRef(radioState);
    useEffect(() => {
        radioStateRef.current = radioState;
    }, [radioState]);

    // Handle seamless URL handoff and Drift Correction
    useEffect(() => {
        if (!audioRef.current || !radioState || !isTunedIn) return;
        const audio = audioRef.current;
        const targetUrl = radioState.song.audioUrl;
        const targetTime = radioState.progress;

        const isSameSong = audio.src.endsWith(targetUrl);

        if (!isSameSong) {
            console.log("Global Radio: Switching to new song", targetUrl);
            setIsSyncing(true);
            setIsBuffering(true);

            audio.src = targetUrl;

            const attemptPlay = () => {
                // Ensure we start exactly where the world timeline dictates at this millisecond
                if (radioStateRef.current) {
                    audio.currentTime = radioStateRef.current.progress;
                }
                setIsSyncing(false);
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error("Global Radio Auto-Play Blocked/Failed:", e);
                        setIsBuffering(false);
                    });
                }
            };

            audio.addEventListener('canplay', attemptPlay, { once: true });
            if (audio.readyState >= 3) {
                audio.removeEventListener('canplay', attemptPlay);
                attemptPlay();
            }

        } else {
            // Drift correction (only correct if drift is > 1.5s to prevent micro-stutters)
            if (!audio.paused && Math.abs(audio.currentTime - targetTime) > 1.5) {
                console.log("Global Radio: Correcting drift. Audio:", audio.currentTime, "World:", targetTime);
                audio.currentTime = targetTime;
            }

            // If the browser paused us arbitrarily (but tuned in), fight back gently
            if (audio.paused && !isSyncing) {
                audio.currentTime = targetTime;
                audio.play().catch(() => { });
            }
        }
    }, [isTunedIn, radioState?.song.audioUrl]);

    // Background Resume Event Listeners
    useEffect(() => {
        if (!isTunedIn) return;

        const attemptResume = () => {
            if (audioRef.current && isTunedIn && audioRef.current.paused && radioStateRef.current) {
                audioRef.current.currentTime = radioStateRef.current.progress;
                audioRef.current.play().catch(() => { });
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                setTimeout(attemptResume, 150);
            }
        };

        const handleFocus = () => setTimeout(attemptResume, 150);

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isTunedIn]);

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
