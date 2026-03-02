"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAudio } from "./AudioContext";
import rawStations from "@/data/radioStations.json";

export type RadioTrack = {
    title: string;
    audioUrl: string;
    duration: number;
};

export type RadioStation = {
    id: string;
    name: string;
    description: string;
    themeColor: string;
    playlist: RadioTrack[];
};

const STATIONS = rawStations as RadioStation[];

// Pre-calculate timelines for ALL stations
const TIMELINES: Record<string, { tracks: (RadioTrack & { startOffset: number, endOffset: number })[], totalDuration: number }> = {};
STATIONS.forEach(station => {
    TIMELINES[station.id] = station.playlist.reduce((acc, song) => {
        const start = acc.totalDuration;
        const end = start + song.duration;
        acc.tracks.push({ ...song, startOffset: start, endOffset: end });
        acc.totalDuration = end;
        return acc;
    }, { tracks: [] as (RadioTrack & { startOffset: number, endOffset: number })[], totalDuration: 0 });
});

export type StationState = {
    song: RadioTrack;
    index: number;
    progress: number;
    formattedTime: string;
};

interface RadioContextType {
    stations: RadioStation[];
    activeStationId: string | null;
    isSyncing: boolean;
    isBuffering: boolean;
    // The live state of ALL stations rolling continuously in world time
    stationsState: Record<string, StationState | null>;
    handleTuneIn: (stationId: string) => void;
    turnOff: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function useRadio() {
    const context = useContext(RadioContext);
    if (!context) throw new Error("useRadio must be used within a RadioProvider");
    return context;
}

export function RadioProvider({ children }: { children: React.ReactNode }) {
    const [currentTimeWorld, setCurrentTimeWorld] = useState(0);
    const [mounted, setMounted] = useState(false);

    const [activeStationId, setActiveStationId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    const { isPlaying: globalPlaying, togglePlay, setActivePlaybackMode } = useAudio();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track precise World Time for all stations concurrently
    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setCurrentTimeWorld(Date.now() / 1000), 1000);
        return () => clearInterval(interval);
    }, []);

    // Evaluate the timeline for ALL stations
    const stationsState = useMemo(() => {
        if (!mounted) return {};
        const state: Record<string, StationState | null> = {};

        STATIONS.forEach(station => {
            const timeline = TIMELINES[station.id];
            if (timeline.totalDuration === 0) {
                state[station.id] = null;
                return;
            }

            const globalProgress = currentTimeWorld % timeline.totalDuration;
            const activeTrackIndex = timeline.tracks.findIndex(
                (t) => globalProgress >= t.startOffset && globalProgress < t.endOffset
            );

            if (activeTrackIndex === -1) {
                state[station.id] = null;
                return;
            }

            const activeTrack = timeline.tracks[activeTrackIndex];
            const songProgress = globalProgress - activeTrack.startOffset;

            state[station.id] = {
                song: activeTrack,
                index: activeTrackIndex,
                progress: songProgress,
                formattedTime: `${Math.floor(songProgress / 60)}:${Math.floor(songProgress % 60).toString().padStart(2, '0')}`
            };
        });

        return state;
    }, [currentTimeWorld, mounted]);

    // Active station target state tracking for seamless audio handoff
    const activeTargetState = activeStationId ? stationsState[activeStationId] : null;
    const activeTargetStateRef = useRef(activeTargetState);
    useEffect(() => {
        activeTargetStateRef.current = activeTargetState;
    }, [activeTargetState]);

    // Seamless URL handoff and Drift Correction for the ACTIVE station
    useEffect(() => {
        if (!audioRef.current || !activeStationId || !activeTargetState) return;

        const audio = audioRef.current;
        const targetUrl = activeTargetState.song.audioUrl;
        const targetTime = activeTargetState.progress;

        const isSameSong = audio.src.endsWith(targetUrl);

        if (!isSameSong) {
            console.log(`Global Radio: Action [Switch Source] -> ${activeTargetState.song.title}`);
            setIsSyncing(true);
            audio.src = targetUrl;
            if (activeTargetStateRef.current) audio.currentTime = activeTargetStateRef.current.progress;

            const timer = setTimeout(() => {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => setIsSyncing(false)).catch(() => setIsSyncing(false));
                } else {
                    setIsSyncing(false);
                }
            }, 50);
            return () => clearTimeout(timer);
        } else {
            // Correct drift
            if (!audio.paused && Math.abs(audio.currentTime - targetTime) > 1.5) {
                audio.currentTime = targetTime;
            }
            // Auto-resume if paused unexpectedly but should be playing
            if (audio.paused && !isSyncing && activeStationId) {
                audio.currentTime = targetTime;
                audio.play().catch(() => { });
            }
        }
    }, [activeStationId, activeTargetState?.song.audioUrl]); // Dependency on the active song URL

    // Background Resume
    useEffect(() => {
        if (!activeStationId) return;
        const attemptResume = () => {
            if (audioRef.current && activeStationId && audioRef.current.paused && activeTargetStateRef.current) {
                audioRef.current.currentTime = activeTargetStateRef.current.progress;
                audioRef.current.play().catch(() => { });
            }
        };
        const handleVisibility = () => { if (document.visibilityState === 'visible') setTimeout(attemptResume, 150); };
        const handleFocus = () => setTimeout(attemptResume, 150);
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);
        return () => { document.removeEventListener('visibilitychange', handleVisibility); window.removeEventListener('focus', handleFocus); };
    }, [activeStationId]);

    const handleTuneIn = useCallback((stationId: string) => {
        if (!audioRef.current) return;
        setActivePlaybackMode('radio');

        // If switching stations or turning on, pause everything first
        setIsSyncing(true);
        audioRef.current.pause();

        // Pause Global Audio if it's playing music
        if (globalPlaying) {
            togglePlay();
        }

        setActiveStationId(stationId);
    }, [globalPlaying, togglePlay, setActivePlaybackMode]);

    const turnOff = useCallback(() => {
        setIsSyncing(false);
        setActiveStationId(null);
        setActivePlaybackMode('none');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }, [setActivePlaybackMode]);

    return (
        <RadioContext.Provider value={{
            stations: STATIONS,
            activeStationId,
            isSyncing,
            isBuffering,
            stationsState,
            handleTuneIn,
            turnOff
        }}>
            {children}
            <audio
                ref={audioRef}
                preload="metadata"
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onError={() => setIsBuffering(false)}
            />
        </RadioContext.Provider>
    );
}
