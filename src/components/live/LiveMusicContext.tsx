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
    isTransitioning: boolean;
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
    listenersCount: number;
    togglePlay: () => void;
    refresh: () => void;
}

const LiveMusicContext = createContext<LiveMusicState>({
    isLive: false,
    isPlaying: false,
    isLoading: true,
    isBuffering: false,
    isWaitingForSync: false,
    isTransitioning: false,
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
    listenersCount: 0,
    togglePlay: () => {},
    refresh: () => {},
});

export const useLiveMusic = () => useContext(LiveMusicContext);

// ─── Tuning ─────────────────────────────────────────────────────────────────
const SYNC_DRIFT_THRESHOLD = 5.0;
const PRELOAD_AHEAD_SECS = 8; // Start preloading next song when ≤8s remain

// ─────────────────────────────────────────────────────────────────────────────
// Architecture: Predictive Preload + Instant Swap
//
// 1. On mount       → fetchAndSync() → load audio, defer seek to canplay
// 2. First play     → re-fetchAndSync() for a fresh position → seek + play
// 3. During play    → onTimeUpdate monitors remaining time
// 4. ≤8s left       → preloadNextSong() loads next audio in hidden element
// 5. Song ends      → instant swap to preloaded audio → zero-gap transition
// 6. Post-swap      → background fetchAndSync() refreshes metadata
// 7. SYNC button    → fetchAndSync() → hard seek to server position
// ─────────────────────────────────────────────────────────────────────────────

export function LiveMusicProvider({ children }: { children: React.ReactNode }) {
    // ─── React state (drives UI) ────────────────────────────────────────────
    const [isLive, setIsLive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isWaitingForSync, setIsWaitingForSync] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
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
    const [listenersCount, setListenersCount] = useState(0);

    // ─── Refs ────────────────────────────────────────────────────────────────
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
    const currentSongUrlRef = useRef<string>("");
    const hasUserInteractedRef = useRef(false);
    const hasEverPlayedRef = useRef(false);
    const isFetchingRef = useRef(false);
    const pendingSeekRef = useRef<number | null>(null);
    const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isTransitioningRef = useRef(false);

    // Preload tracking
    const preloadedSongUrlRef = useRef<string>("");
    const preloadReadyRef = useRef(false);
    const nextSongDataRef = useRef<LiveSong | null>(null);
    const nextSongIndexRef = useRef<number>(-1);

    // Server sync reference
    const serverSyncRef = useRef<{
        serverSeek: number;
        fetchedAt: number;
        songUrl: string;
    }>({ serverSeek: 0, fetchedAt: Date.now(), songUrl: "" });

    const lastSyncedRef = useRef(false);

    // ─── Preload: resolve next song from tracklist cache ────────────────────
    const tracklistRef = useRef<TracklistItem[]>([]);
    const allSongsRef = useRef<{ audioUrl: string; title: string; duration: number; category?: string }[]>([]);

    // ─── Core: Fetch & Sync ─────────────────────────────────────────────────
    const fetchAndSync = useCallback(async (opts?: { metadataOnly?: boolean }) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

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
                isFetchingRef.current = false;
                return;
            }

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
            setListenersCount(data.listenersCount || 0);

            // Cache tracklist for preload resolution
            tracklistRef.current = data.tracklist || [];

            // Cache full song list if available from the response
            if (data.allSongs) {
                allSongsRef.current = data.allSongs;
            }

            const song: LiveSong = data.song;
            const serverSeek = data.seekPosition + oneWayLatency;

            setCurrentSong(song);
            setSeekPosition(serverSeek);

            serverSyncRef.current = {
                serverSeek,
                fetchedAt: Date.now(),
                songUrl: song.audioUrl,
            };

            // If metadata-only refresh (post-swap), don't touch audio
            if (opts?.metadataOnly) {
                setIsLoading(false);
                setIsSynced(true);
                lastSyncedRef.current = true;
                isFetchingRef.current = false;
                return;
            }

            if (!audioRef.current) {
                isFetchingRef.current = false;
                return;
            }

            const audio = audioRef.current;

            // ── Different song → load new source ────────────────────────────
            if (currentSongUrlRef.current !== song.audioUrl) {
                currentSongUrlRef.current = song.audioUrl;
                pendingSeekRef.current = serverSeek > 1.0 ? serverSeek : 0;
                audio.playbackRate = 1.0;
                audio.src = song.audioUrl;
                setIsWaitingForSync(false);

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

    // ─── Preload next song ──────────────────────────────────────────────────
    const preloadNextSong = useCallback(async () => {
        if (!preloadAudioRef.current) return;
        
        // Fetch the current server state to get the next song's audio URL
        try {
            const res = await fetch("/api/live-music/now", { cache: "no-store" });
            const data = await res.json();
            
            if (!data.isLive || data.error || !data.song) return;

            const songs = data.tracklist as TracklistItem[];
            const currentIdx = data.songIndex as number;
            const nextIdx = (currentIdx + 1) % songs.length;

            // We need the next song's audioUrl — fetch it by getting the state
            // that would exist 'duration - seekPosition' seconds from now.
            // Instead, we fetch the /api/live-music/next endpoint or compute locally.
            // For now, store the index — we'll use fetchAndSync on transition
            // but with a preloaded audio element.
            
            // Actually, the simplest approach: fetch what will be playing
            // a few seconds from now by requesting /api/live-music/now with
            // a time offset. But since the API doesn't support that,
            // let's preload by fetching the next song data.
            const nextRes = await fetch(`/api/live-music/next?currentIndex=${currentIdx}`, { cache: "no-store" });
            
            if (nextRes.ok) {
                const nextData = await nextRes.json();
                if (nextData.song && nextData.song.audioUrl) {
                    const nextSong = nextData.song as LiveSong;
                    
                    // Don't re-preload the same song
                    if (preloadedSongUrlRef.current === nextSong.audioUrl) return;
                    
                    preloadedSongUrlRef.current = nextSong.audioUrl;
                    nextSongDataRef.current = nextSong;
                    nextSongIndexRef.current = nextData.songIndex ?? nextIdx;
                    preloadReadyRef.current = false;
                    
                    preloadAudioRef.current.src = nextSong.audioUrl;
                    preloadAudioRef.current.load();
                }
            }
        } catch {
            // Preload failure is non-critical — we'll fall back to fetchAndSync
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
            audioRef.current.pause();
        } else {
            if (!hasEverPlayedRef.current) {
                hasEverPlayedRef.current = true;
                // Show sync spinner immediately so user sees loading feedback
                setIsWaitingForSync(true);
                fetchAndSync();
            } else {
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

    // ─── Instant Swap Handler ───────────────────────────────────────────────
    const handleSongEnded = useCallback(() => {
        if (!audioRef.current) return;

        // Enter transitioning state — keeps the sync spinner visible
        // and prevents the micro-pause button flash
        isTransitioningRef.current = true;
        setIsTransitioning(true);

        // If we have a preloaded song ready, do instant swap
        if (preloadReadyRef.current && preloadAudioRef.current && nextSongDataRef.current) {
            const preloaded = preloadAudioRef.current;
            const nextSong = nextSongDataRef.current;

            // Swap: pause primary, start preloaded at position 0
            audioRef.current.pause();
            audioRef.current.src = "";

            // Move preloaded to primary
            currentSongUrlRef.current = nextSong.audioUrl;
            preloaded.currentTime = 0;
            preloaded.playbackRate = 1.0;

            // Swap the refs
            const oldPrimary = audioRef.current;
            audioRef.current = preloaded;
            preloadAudioRef.current = oldPrimary;

            // Update state
            setCurrentSong(nextSong);
            setSongIndex(nextSongIndexRef.current);
            setCurrentTime(0);
            setSeekPosition(0);

            // Clear preload tracking
            preloadedSongUrlRef.current = "";
            preloadReadyRef.current = false;
            nextSongDataRef.current = null;
            nextSongIndexRef.current = -1;

            // Play immediately
            preloaded.play().then(() => {
                isTransitioningRef.current = false;
                setIsTransitioning(false);
                setIsWaitingForSync(false);
                setIsPlaying(true);
            }).catch(() => {
                isTransitioningRef.current = false;
                setIsTransitioning(false);
            });

            // Update sync reference
            serverSyncRef.current = {
                serverSeek: 0,
                fetchedAt: Date.now(),
                songUrl: nextSong.audioUrl,
            };

            // Background metadata refresh
            setTimeout(() => fetchAndSync({ metadataOnly: true }), 500);

        } else {
            // Fallback: no preloaded song, use the old fetchAndSync approach
            // but keep transitioning state active
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
            retryTimerRef.current = setTimeout(() => {
                fetchAndSync().then(() => {
                    // Clear transition after fetch completes and audio starts
                    // The onPlaying handler will clear it
                });
            }, 500);
        }
    }, [fetchAndSync]);

    // ─── Render ─────────────────────────────────────────────────────────────
    return (
        <LiveMusicContext.Provider value={{
            isLive,
            isPlaying,
            isLoading,
            isBuffering,
            isWaitingForSync,
            isTransitioning,
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
            listenersCount,
            togglePlay,
            refresh,
        }}>
            {/* Primary audio element */}
            <audio
                ref={audioRef}
                preload="auto"
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => {
                    setIsBuffering(false);

                    if (pendingSeekRef.current !== null && audioRef.current) {
                        audioRef.current.currentTime = pendingSeekRef.current;
                        pendingSeekRef.current = null;

                        if (hasUserInteractedRef.current) {
                            audioRef.current.play().catch(() => {});
                        }
                    }
                }}
                onPlaying={() => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                    setIsWaitingForSync(false);
                    // Clear transitioning — the new song is now audibly playing
                    if (isTransitioningRef.current) {
                        isTransitioningRef.current = false;
                        setIsTransitioning(false);
                    }
                }}
                onPause={() => {
                    // Only update isPlaying to false if we're NOT mid-transition
                    // This prevents the micro-pause icon flash
                    if (!isTransitioningRef.current) {
                        setIsPlaying(false);
                    }
                }}
                onEnded={handleSongEnded}
                onTimeUpdate={() => {
                    if (!audioRef.current) return;
                    const t = audioRef.current.currentTime;
                    setCurrentTime(t);

                    // ── Preload trigger: when ≤ PRELOAD_AHEAD_SECS remain ───
                    const song = audioRef.current;
                    if (song.duration && song.duration > 0) {
                        const remaining = song.duration - t;
                        if (remaining <= PRELOAD_AHEAD_SECS && remaining > 0 && !preloadedSongUrlRef.current) {
                            preloadNextSong();
                        }
                    }

                    // ── Drift calculation ────────────────────────────────────
                    const sync = serverSyncRef.current;
                    if (sync.songUrl && sync.songUrl === currentSongUrlRef.current) {
                        const elapsed = (Date.now() - sync.fetchedAt) / 1000;
                        const expectedPos = sync.serverSeek + elapsed;
                        const drift = Math.abs(expectedPos - t);
                        const synced = drift < SYNC_DRIFT_THRESHOLD;

                        if (synced !== lastSyncedRef.current) {
                            lastSyncedRef.current = synced;
                            setIsSynced(synced);
                        }
                    }
                }}
                style={{ display: "none" }}
            />
            {/* Preload audio element — hidden, used for buffering next song */}
            <audio
                ref={preloadAudioRef}
                preload="auto"
                onCanPlayThrough={() => {
                    preloadReadyRef.current = true;
                }}
                style={{ display: "none" }}
            />
            {children}
        </LiveMusicContext.Provider>
    );
}

