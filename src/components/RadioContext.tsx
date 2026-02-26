"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { useAudio, PLAYLIST } from "./AudioContext";

export const TIME_PER_SONG = 210; // 3.5 minutes per rotation

interface RadioContextType {
    isTunedIn: boolean;
    isSyncing: boolean;
    isBuffering: boolean;
    freqData: Uint8Array | null;
    radioState: {
        song: typeof PLAYLIST[0];
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
    const [currentTime, setCurrentTime] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [freqData, setFreqData] = useState<Uint8Array | null>(null);
    const [isTunedIn, setIsTunedIn] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    const { isPlaying: globalPlaying, togglePlay } = useAudio();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const contextRef = useRef<AudioContext | null>(null);

    // Initial sync to "World Time"
    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentTime(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Background Resume Logic
    // Ensures audio resumes when returning to the tab or if browser pauses it during navigation
    useEffect(() => {
        if (!isTunedIn) return;

        const attemptResume = () => {
            if (audioRef.current && isTunedIn && audioRef.current.paused) {
                // For radio, we always want to sync to "World Time" on resume
                if (radioStateRef.current) {
                    audioRef.current.currentTime = radioStateRef.current.progress;
                }
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

    const radioState = useMemo(() => {
        if (!mounted) return null;
        const totalDuration = PLAYLIST.length * TIME_PER_SONG;
        const globalProgress = currentTime % totalDuration;
        const songIndex = Math.floor(globalProgress / TIME_PER_SONG);
        const songProgress = globalProgress % TIME_PER_SONG;

        return {
            song: PLAYLIST[songIndex],
            index: songIndex,
            progress: songProgress,
            formattedTime: `${Math.floor(songProgress / 60)}:${(songProgress % 60).toString().padStart(2, '0')}`
        };
    }, [currentTime, mounted]);

    // Track current state in a ref for use in effects without triggering them
    const radioStateRef = useRef(radioState);
    useEffect(() => {
        radioStateRef.current = radioState;
    }, [radioState]);

    const initAudio = () => {
        if (!audioRef.current || contextRef.current) return;

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            const analyser = ctx.createAnalyser();
            const source = ctx.createMediaElementSource(audioRef.current);

            source.connect(analyser);
            analyser.connect(ctx.destination);

            analyser.fftSize = 256;
            contextRef.current = ctx;
            analyserRef.current = analyser;
        } catch (e) {
            console.error("Radio AudioContext failed:", e);
        }
    };

    // Visualizer Loop
    useEffect(() => {
        if (!isTunedIn) {
            setFreqData(null);
            return;
        }

        let animationFrameId: number;
        const updateVisualizer = () => {
            if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                setFreqData(new Uint8Array(dataArray));
            }
            animationFrameId = requestAnimationFrame(updateVisualizer);
        };

        animationFrameId = requestAnimationFrame(updateVisualizer);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isTunedIn]);

    // Unified Playback & Sync Logic
    const radioSongUrl = radioState?.song?.audioUrl;

    // Play/Pause & Song Change Effect
    useEffect(() => {
        if (!audioRef.current || !radioSongUrl) return;
        const audio = audioRef.current;

        if (!isTunedIn) {
            audio.pause();
            return;
        }

        const syncAndPlay = () => {
            if (radioStateRef.current) {
                const targetTime = radioStateRef.current.progress;
                console.log("Radio Engine: Syncing to", targetTime);
                audio.currentTime = targetTime;
                setIsSyncing(false);
                audio.play().catch(e => console.error("Radio play failed", e));
            }
        };

        const isSameSong = audio.src.endsWith(radioSongUrl);

        if (!isSameSong) {
            console.log("Radio Engine: Switching to new song", radioSongUrl);
            setIsSyncing(true);
            audio.src = radioSongUrl;
            audio.addEventListener('canplay', syncAndPlay, { once: true });
            // Fallback if already buffered
            if (audio.readyState >= 3) syncAndPlay();
        } else if (audio.paused && isTunedIn) {
            // If it's the same song but we just tuned in (paused), sync and play immediately
            syncAndPlay();
        }
    }, [isTunedIn, radioSongUrl]);

    // Drift Correction (Every 10 seconds)
    useEffect(() => {
        if (!isTunedIn || !audioRef.current || isSyncing) return;

        const interval = setInterval(() => {
            if (audioRef.current && radioStateRef.current) {
                const audio = audioRef.current;
                const targetTime = radioStateRef.current.progress;
                const drift = Math.abs(audio.currentTime - targetTime);

                // If drift > 2 seconds, do a hard sync
                if (drift > 2) {
                    console.log("Radio Engine: Correcting drift", { drift, current: audio.currentTime, target: targetTime });
                    audio.currentTime = targetTime;
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isTunedIn, isSyncing]);

    const handleTuneIn = () => {
        if (!radioState || !audioRef.current) return;

        if (isTunedIn) {
            audioRef.current.pause();
            setIsTunedIn(false);
            return;
        }

        initAudio();
        if (contextRef.current?.state === 'suspended') {
            contextRef.current.resume();
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
            freqData,
            radioState,
            handleTuneIn
        }}>
            {children}
            <audio
                ref={audioRef}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onPause={() => {
                    // If it pauses and we are still "tuned in", it's likely a browser-forced pause
                    // or a background suspension. The Visibility logic will handle the resume.
                }}
                onError={() => {
                    setIsBuffering(false);
                    // On error, try to re-sync if still tuned in
                    if (isTunedIn) {
                        setTimeout(() => {
                            if (audioRef.current && radioStateRef.current) {
                                audioRef.current.src = radioStateRef.current.song.audioUrl;
                            }
                        }, 1000);
                    }
                }}
            />
        </RadioContext.Provider>
    );
}
