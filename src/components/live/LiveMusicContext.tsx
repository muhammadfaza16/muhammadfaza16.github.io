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

// ─── Tuning ─────────────────────────────────────────────────────────────────
// Drift (in seconds) above which the LIVE indicator turns gray.
const SYNC_DRIFT_THRESHOLD = 5.0;

// ─────────────────────────────────────────────────────────────────────────────
// Architecture: Free-Flow + Manual Sync
//
// 1. On mount       → fetchAndSync() → load audio, defer seek to canplay
// 2. First play     → re-fetchAndSync() for a fresh position → seek + play
// 3. During play    → NO polling, NO playbackRate changes, audio at 1.0x
// 4. Song ends      → 1s delay → fetchAndSync() → load next song
// 5. SYNC button    → fetchAndSync() → hard seek to server position
// 6. Play / Pause   → simple play() / pause(), no sync
// ─────────────────────────────────────────────────────────────────────────────

export function LiveMusicProvider({ children }: { children: React.ReactNode }) {
    // ─── React state (drives UI) ────────────────────────────────────────────
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

    // ─── Refs (stable across renders, no stale closures) ────────────────────
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentSongUrlRef = useRef<string>("");
    const hasUserInteractedRef = useRef(false);
    const hasEverPlayedRef = useRef(false);
    const isFetchingRef = useRef(false);

    // Pending seek — the position to jump to once the browser fires canplay.
    // This avoids seeking before the audio source is ready.
    const pendingSeekRef = useRef<number | null>(null);

    // Server sync reference — snapshot from the last fetch.
    // Used in onTimeUpdate to compute expected server position in real-time
    // without any network calls: expected = serverSeek + (now - fetchedAt).
    const serverSyncRef = useRef<{
        serverSeek: number;
        fetchedAt: number;
        songUrl: string;
    }>({ serverSeek: 0, fetchedAt: Date.now(), songUrl: "" });

    // Tracks whether isSynced actually changed, to avoid unnecessary re-renders.
    const lastSyncedRef = useRef(false);

    // Safety timer for the onEnded → same-song edge case.
    const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ─── Core: Fetch & Sync ─────────────────────────────────────────────────
    // Fetches the current server state and synchronizes the <audio> element.
    // Called on: mount, first play, song ended, and manual SYNC press.
    const fetchAndSync = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const fetchStart = Date.now();

        try {
            const res = await fetch("/api/live-music/now", { cache: "no-store" });
            const data = await res.json();

            // Estimate one-way network latency (capped at 500ms)
            const rtt = Date.now() - fetchStart;
            const oneWayLatency = Math.min(rtt / 2, 500) / 1000;

            // ── Not live ────────────────────────────────────────────────────
            if (!data.isLive) {
                setIsLive(false);
                setCurrentSong(null);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
                }
                setIsLoading(false);
                isFetchingRef.current = false;
                return;
            }

            // ── Server error ────────────────────────────────────────────────
            if (data.error) {
                setIsLive(true);
                setError(data.error);
                setIsLoading(false);
                isFetchingRef.current = false;
                return;
            }

            // ── Update metadata state ───────────────────────────────────────
            setIsLive(true);
            setError(null);
            setSongIndex(data.songIndex);
            setTotalSongs(data.totalSongs);
            setPlaylistTitle(data.playlistTitle);
            setPlaylistCover(data.playlistCover || null);
            setPlaylistColor(data.playlistColor || null);
            setTracklist(data.tracklist || []);

            const song: LiveSong = data.song;
            const serverSeek = data.seekPosition + oneWayLatency;

            setCurrentSong(song);
            setSeekPosition(serverSeek);

            // Update the sync reference point
            serverSyncRef.current = {
                serverSeek,
                fetchedAt: Date.now(),
                songUrl: song.audioUrl,
            };

            if (!audioRef.current) {
                isFetchingRef.current = false;
                return;
            }

            const audio = audioRef.current;

            // ── Different song → load new source ────────────────────────────
            if (currentSongUrlRef.current !== song.audioUrl) {
                currentSongUrlRef.current = song.audioUrl;

                // Store the target seek position.
                // It will be applied in the onCanPlay handler once the
                // browser has buffered enough data to actually seek.
                pendingSeekRef.current = serverSeek > 1.0 ? serverSeek : 0;

                audio.playbackRate = 1.0;
                audio.src = song.audioUrl;
                // audio.load() is implicit when src changes.

                setIsWaitingForSync(false);

                // Don't call play() here — the onCanPlay handler will do it
                // after applying the seek, if the user has interacted.

            // ── Same song → hard seek only ──────────────────────────────────
            } else {
                audio.currentTime = serverSeek;
                audio.playbackRate = 1.0;

                if (hasUserInteractedRef.current && audio.paused) {
                    audio.play().catch(() => {});
                }

                setIsWaitingForSync(false);
            }

            setIsLoading(false);
            setIsSynced(true);
            lastSyncedRef.current = true;

        } catch (err: any) {
            setError(err.message || "Failed to connect to live stream");
            setIsLoading(false);
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    // ─── Lifecycle: fetch on mount only ─────────────────────────────────────
    useEffect(() => {
        fetchAndSync();
        return () => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        };
    }, [fetchAndSync]);

    // ─── User action: Play / Pause ──────────────────────────────────────────
    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;
        hasUserInteractedRef.current = true;

        if (isPlaying) {
            // Pausing: simple, no sync needed.
            audioRef.current.pause();
        } else {
            if (!hasEverPlayedRef.current) {
                // Very first play since page load.
                // Re-sync to get a fresh server position because the user
                // might have waited before pressing play.
                hasEverPlayedRef.current = true;
                fetchAndSync();
            } else {
                // Subsequent play from paused: just resume, no sync.
                audioRef.current.play().catch(() => {});
            }
        }
    }, [isPlaying, fetchAndSync]);

    // ─── User action: Manual SYNC ───────────────────────────────────────────
    const refresh = useCallback(() => {
        hasUserInteractedRef.current = true;
        hasEverPlayedRef.current = true;
        setIsWaitingForSync(true);
        fetchAndSync();
    }, [fetchAndSync]);

    // ─── Render ─────────────────────────────────────────────────────────────
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
                onCanPlay={() => {
                    setIsBuffering(false);

                    // Apply deferred seek once browser is ready.
                    if (pendingSeekRef.current !== null && audioRef.current) {
                        audioRef.current.currentTime = pendingSeekRef.current;
                        pendingSeekRef.current = null;

                        // Auto-play if the user has already interacted.
                        if (hasUserInteractedRef.current) {
                            audioRef.current.play().catch(() => {});
                        }
                    }
                }}
                onPlaying={() => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                    setIsWaitingForSync(false);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                    // Song finished naturally.
                    // Wait 1s for the server clock to advance past the
                    // transition point, then fetch the next song.
                    setIsPlaying(false);
                    setIsWaitingForSync(true);

                    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
                    retryTimerRef.current = setTimeout(() => {
                        fetchAndSync();
                    }, 1000);
                }}
                onTimeUpdate={() => {
                    if (!audioRef.current) return;
                    const t = audioRef.current.currentTime;
                    setCurrentTime(t);

                    // Compute drift from expected server position.
                    // Expected = serverSeek + wallclock elapsed since fetch.
                    const sync = serverSyncRef.current;
                    if (sync.songUrl && sync.songUrl === currentSongUrlRef.current) {
                        const elapsed = (Date.now() - sync.fetchedAt) / 1000;
                        const expectedPos = sync.serverSeek + elapsed;
                        const drift = Math.abs(expectedPos - t);
                        const synced = drift < SYNC_DRIFT_THRESHOLD;

                        // Only update state when the value actually changes.
                        if (synced !== lastSyncedRef.current) {
                            lastSyncedRef.current = synced;
                            setIsSynced(synced);
                        }
                    }
                }}
                style={{ display: "none" }}
            />
            {children}
        </LiveMusicContext.Provider>
    );
}
