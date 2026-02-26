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
    useEffect(() => {
        if (!isTunedIn || !audioRef.current || !radioSongUrl) return;

        const audio = audioRef.current;
        const isSameSong = audio.src.endsWith(radioSongUrl);

        if (!isSameSong) {
            console.log("Radio Engine: Switching to new song", radioSongUrl);
            setIsSyncing(true);
            audio.src = radioSongUrl;

            const performSync = () => {
                if (radioStateRef.current) {
                    audio.currentTime = radioStateRef.current.progress;
                }
                setIsSyncing(false);
                audio.play().catch(e => console.error("Radio Engine play failed", e));
                audio.removeEventListener('canplay', performSync);
            };

            audio.addEventListener('canplay', performSync);
            if (audio.readyState >= 3) performSync();
        }
    }, [isTunedIn, radioSongUrl]);

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
            />
        </RadioContext.Provider>
    );
}
