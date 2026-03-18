"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface LiveSong {
    title: string;
    audioUrl: string;
    duration: number;
    category?: string;
}

interface TracklistItem {
    title: string;
    duration: number;
    isCurrent: boolean;
}

interface LiveMusicState {
    isLive: boolean;
    isPlaying: boolean;
    isLoading: boolean;
    isBuffering: boolean;
    isWaitingForSync: boolean;
    currentSong: LiveSong | null;
    seekPosition: number;
    currentTime: number;
    songIndex: number;
    totalSongs: number;
    playlistTitle: string;
    playlistCover: string | null;
    playlistColor: string | null;
    tracklist: TracklistItem[];
    error: string | null;
    isSynced: boolean;
    togglePlay: () => void;
    refresh: () => void;
}

const LiveMusicContext = createContext<LiveMusicState>({
    isLive: false,
    isPlaying: false,
    isLoading: true,
    isBuffering: false,
    isWaitingForSync: false,
    currentSong: null,
    seekPosition: 0,
    currentTime: 0,
    songIndex: 0,
    totalSongs: 0,
    playlistTitle: "",
    playlistCover: null,
    playlistColor: null,
    tracklist: [],
    error: null,
    isSynced: false,
    togglePlay: () => {},
    refresh: () => {},
});

export const useLiveMusic = () => useContext(LiveMusicContext);

// ─── Sync Tuning Constants ─────────────────────────────────────────────────
// Drift below this is considered "in sync" — no action needed.
const DRIFT_TOLERANCE = 1.0;
// Drift between DRIFT_TOLERANCE and HARD_SYNC_THRESHOLD uses gentle playbackRate.
// Max playbackRate offset is 2%, which is imperceptible on music.
const SOFT_RATE = 0.02; // 1.02x or 0.98x
// Drift above this triggers an immediate seek (tab was sleeping, etc.)
const HARD_SYNC_THRESHOLD = 5.0;
// Normal polling interval
const POLL_INTERVAL = 15000;
// When audio is within this many seconds of the song's end, do an early fetch
// to ensure a seamless transition to the next song.
const TRANSITION_LOOKAHEAD = 4;

export function LiveMusicProvider({ children }: { children: React.ReactNode }) {
    const [isLive, setIsLive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isWaitingForSync, setIsWaitingForSync] = useState(false);
    const [currentSong, setCurrentSong] = useState<LiveSong | null>(null);
    const [seekPosition, setSeekPosition] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [songIndex, setSongIndex] = useState(0);
    const [totalSongs, setTotalSongs] = useState(0);
    const [playlistTitle, setPlaylistTitle] = useState("");
    const [playlistCover, setPlaylistCover] = useState<string | null>(null);
    const [playlistColor, setPlaylistColor] = useState<string | null>(null);
    const [tracklist, setTracklist] = useState<TracklistItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSynced, setIsSynced] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const correctionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const currentSongUrlRef = useRef<string>("");
    const hasUserInteractedRef = useRef(false);
    const isSyncingRef = useRef(false);
    const songDurationRef = useRef<number>(0);

    // ─── Core Fetch ────────────────────────────────────────────────────────
    const fetchNow = useCallback(async (isInitial = false) => {
        if (isSyncingRef.current && !isInitial) return;
        isSyncingRef.current = true;

        const fetchStart = Date.now();

        try {
            const res = await fetch("/api/live-music/now", { cache: "no-store" });
            const data = await res.json();

            const rtt = Date.now() - fetchStart;
            const oneWayLatency = Math.min(rtt / 2, 500) / 1000;

            if (!data.isLive) {
                setIsLive(false);
                setCurrentSong(null);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
                }
                setIsLoading(false);
                isSyncingRef.current = false;
                return;
            }

            if (data.error) {
                setIsLive(true);
                setError(data.error);
                setIsLoading(false);
                isSyncingRef.current = false;
                return;
            }

            setIsLive(true);
            setError(null);
            setSongIndex(data.songIndex);
            setTotalSongs(data.totalSongs);
            setPlaylistTitle(data.playlistTitle);
            setPlaylistCover(data.playlistCover || null);
            setPlaylistColor(data.playlistColor || null);
            setTracklist(data.tracklist || []);
            setSeekPosition(data.seekPosition);

            const song: LiveSong = data.song;
            setCurrentSong(song);
            songDurationRef.current = song.duration || 0;

            const serverSeek = data.seekPosition + oneWayLatency;

            // ─── Song Change: Hard Load ────────────────────────────────────
            if (currentSongUrlRef.current !== song.audioUrl) {
                currentSongUrlRef.current = song.audioUrl;

                if (correctionTimerRef.current) {
                    clearTimeout(correctionTimerRef.current);
                    correctionTimerRef.current = null;
                }
                if (transitionTimerRef.current) {
                    clearTimeout(transitionTimerRef.current);
                    transitionTimerRef.current = null;
                }

                if (audioRef.current) {
                    const audio = audioRef.current;
                    audio.playbackRate = 1.0;
                    audio.src = song.audioUrl;

                    if (serverSeek > 1.0) {
                        audio.currentTime = serverSeek;
                    } else {
                        audio.currentTime = 0;
                    }

                    setIsWaitingForSync(false);

                    if (hasUserInteractedRef.current) {
                        audio.play().catch(() => {});
                    }
                }

                scheduleTransitionFetch(song.duration, serverSeek);

            } else if (audioRef.current) {
                // ─── Same Song: Graceful Sync ──────────────────────────────
                const audio = audioRef.current;
                const drift = serverSeek - audio.currentTime;
                const absDrift = Math.abs(drift);

                if (absDrift > HARD_SYNC_THRESHOLD) {
                    audio.currentTime = serverSeek;
                } else if (absDrift > DRIFT_TOLERANCE) {
                    if (correctionTimerRef.current) {
                        clearTimeout(correctionTimerRef.current);
                        correctionTimerRef.current = null;
                    }

                    const rate = drift > 0 ? (1 + SOFT_RATE) : (1 - SOFT_RATE);
                    audio.playbackRate = rate;

                    const correctionDuration = (absDrift / SOFT_RATE) * 1000;
                    const maxCorrectionMs = Math.min(correctionDuration, POLL_INTERVAL - 2000);

                    correctionTimerRef.current = setTimeout(() => {
                        if (audioRef.current) {
                            audioRef.current.playbackRate = 1.0;
                        }
                        correctionTimerRef.current = null;
                    }, maxCorrectionMs);
                } else {
                    if (audio.playbackRate !== 1.0) {
                        audio.playbackRate = 1.0;
                    }
                    if (correctionTimerRef.current) {
                        clearTimeout(correctionTimerRef.current);
                        correctionTimerRef.current = null;
                    }
                }

                scheduleTransitionFetch(song.duration, audio.currentTime);
            }

            setIsLoading(false);
        } catch (err: any) {
            setError(err.message || "Failed to connect to live stream");
            setIsLoading(false);
        } finally {
            isSyncingRef.current = false;
        }
    }, []);

    // ─── Predictive Transition ─────────────────────────────────────────────
    // Schedules an early fetch before the current song ends, ensuring the client
    // has the next song's data ready for a seamless gapless transition.
    const scheduleTransitionFetch = useCallback((songDuration: number, currentPos: number) => {
        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = null;
        }

        const remaining = songDuration - currentPos;
        const fetchAhead = remaining - TRANSITION_LOOKAHEAD;

        if (fetchAhead > 0) {
            transitionTimerRef.current = setTimeout(() => {
                fetchNow(true);
            }, fetchAhead * 1000);
        }
    }, [fetchNow]);

    // ─── Lifecycle ─────────────────────────────────────────────────────────
    useEffect(() => {
        fetchNow(true);

        // Start polling
        pollTimerRef.current = setInterval(() => fetchNow(false), POLL_INTERVAL);

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            if (correctionTimerRef.current) clearTimeout(correctionTimerRef.current);
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        };
    }, [fetchNow]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !currentSong) return;

        hasUserInteractedRef.current = true;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
    }, [isPlaying, currentSong]);

    const refresh = useCallback(() => {
        hasUserInteractedRef.current = true;
        fetchNow(true);
    }, [fetchNow]);

    return (
        <LiveMusicContext.Provider value={{
            isLive,
            isPlaying,
            isLoading,
            isBuffering,
            isWaitingForSync,
            currentSong,
            seekPosition,
            currentTime,
            songIndex,
            totalSongs,
            playlistTitle,
            playlistCover,
            playlistColor,
            tracklist,
            error,
            isSynced,
            togglePlay,
            refresh,
        }}>
            <audio
                ref={audioRef}
                preload="auto"
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onPlaying={() => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                    setIsPlaying(false);
                    setIsWaitingForSync(true);
                    fetchNow(true);
                }}
                onTimeUpdate={() => {
                    if (audioRef.current) {
                        const t = audioRef.current.currentTime;
                        setCurrentTime(t);
                        
                        // Recalculate sync status
                        if (seekPosition > 0 && isPlaying && !isBuffering && !isWaitingForSync) {
                            const drift = Math.abs(t - seekPosition);
                            setIsSynced(drift < DRIFT_TOLERANCE);
                        } else {
                            setIsSynced(false);
                        }
                    }
                }}
                style={{ display: "none" }}
            />
            {children}
        </LiveMusicContext.Provider>
    );
}
