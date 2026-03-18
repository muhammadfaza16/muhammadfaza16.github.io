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

        // Measure real one-way network latency
        const fetchStart = Date.now();

        try {
            const res = await fetch("/api/live-music/now", { cache: "no-store" });
            const data = await res.json();

            // Estimate one-way latency (RTT / 2), capped to prevent absurd values
            const rtt = Date.now() - fetchStart;
            const oneWayLatency = Math.min(rtt / 2, 500) / 1000; // seconds, max 0.5s

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

            // ─── Audio Element Setup (once) ────────────────────────────────
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.preload = "auto";
                // Preserve pitch when we nudge playbackRate
                (audioRef.current as any).preservesPitch = true;
                (audioRef.current as any).mozPreservesPitch = true;
                (audioRef.current as any).webkitPreservesPitch = true;

                audioRef.current.addEventListener("waiting", () => setIsBuffering(true));
                audioRef.current.addEventListener("canplay", () => setIsBuffering(false));
                audioRef.current.addEventListener("playing", () => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                });
                audioRef.current.addEventListener("pause", () => setIsPlaying(false));
                audioRef.current.addEventListener("ended", () => {
                    setIsPlaying(false);
                    setIsWaitingForSync(true);
                    // Immediately fetch to get the next song
                    fetchNow(true);
                });
                audioRef.current.addEventListener("timeupdate", () => {
                    if (audioRef.current) {
                        setCurrentTime(audioRef.current.currentTime);
                    }
                });
            }

            const audio = audioRef.current;
            const serverSeek = data.seekPosition + oneWayLatency;

            // ─── Song Change: Hard Load ────────────────────────────────────
            if (currentSongUrlRef.current !== song.audioUrl) {
                currentSongUrlRef.current = song.audioUrl;

                // Clear any running correction timer from the previous song
                if (correctionTimerRef.current) {
                    clearTimeout(correctionTimerRef.current);
                    correctionTimerRef.current = null;
                }
                // Clear transition timer
                if (transitionTimerRef.current) {
                    clearTimeout(transitionTimerRef.current);
                    transitionTimerRef.current = null;
                }

                // Reset rate to normal before loading new song
                audio.playbackRate = 1.0;
                audio.src = song.audioUrl;

                // If seek > 1s into the song, set it; otherwise start from 0
                // This prevents the "not starting from 0" bug for fresh transitions
                if (serverSeek > 1.0) {
                    audio.currentTime = serverSeek;
                } else {
                    audio.currentTime = 0;
                }

                setIsWaitingForSync(false);

                if (hasUserInteractedRef.current) {
                    try {
                        await audio.play();
                    } catch {
                        // Autoplay blocked — user needs to click play
                    }
                }

                // Schedule a predictive transition fetch near the end of this song
                scheduleTransitionFetch(song.duration, serverSeek);

            } else {
                // ─── Same Song: Graceful Sync ──────────────────────────────
                const drift = serverSeek - audio.currentTime;
                const absDrift = Math.abs(drift);

                if (absDrift > HARD_SYNC_THRESHOLD) {
                    // Major desync (tab was sleeping) — force seek, unavoidable
                    audio.currentTime = serverSeek;
                } else if (absDrift > DRIFT_TOLERANCE) {
                    // Gentle correction: nudge playbackRate by max 2%
                    // Clear any previous correction timer to prevent stacking
                    if (correctionTimerRef.current) {
                        clearTimeout(correctionTimerRef.current);
                        correctionTimerRef.current = null;
                    }

                    const rate = drift > 0 ? (1 + SOFT_RATE) : (1 - SOFT_RATE);
                    audio.playbackRate = rate;

                    // Calculate how many seconds at this rate to close the gap
                    // At 1.02x we gain 0.02s/sec → time = drift / 0.02
                    const correctionDuration = (absDrift / SOFT_RATE) * 1000;
                    // Cap to prevent running at adjusted rate forever
                    const maxCorrectionMs = Math.min(correctionDuration, POLL_INTERVAL - 2000);

                    correctionTimerRef.current = setTimeout(() => {
                        if (audioRef.current) {
                            audioRef.current.playbackRate = 1.0;
                        }
                        correctionTimerRef.current = null;
                    }, maxCorrectionMs);
                } else {
                    // Drift is within tolerance — ensure rate is normal
                    if (audio.playbackRate !== 1.0) {
                        audio.playbackRate = 1.0;
                    }
                    if (correctionTimerRef.current) {
                        clearTimeout(correctionTimerRef.current);
                        correctionTimerRef.current = null;
                    }
                }

                // Re-schedule transition fetch for this song
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
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
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
            togglePlay,
            refresh,
        }}>
            {children}
        </LiveMusicContext.Provider>
    );
}
