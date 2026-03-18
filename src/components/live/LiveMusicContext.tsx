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
    switchSession: (sessionId?: string) => void;
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
    switchSession: () => {},
});

export const useLiveMusic = () => useContext(LiveMusicContext);

// ─── Tuning ─────────────────────────────────────────────────────────────────
const SYNC_DRIFT_THRESHOLD = 5.0;
const PRELOAD_AHEAD_SECS = 8;

// ─────────────────────────────────────────────────────────────────────────────
// Architecture:
//
// 1. Single root provider in layout.tsx — audio survives navigation
// 2. switchSession(id) changes which station we're tuned to
// 3. On mount → fetchAndSync() → load audio, defer seek to canplay
// 4. During play → onTimeUpdate monitors remaining time
// 5. ≤8s left → preloadNextSong() cache-warms next audio in hidden element
// 6. Song ends → full fetchAndSync() with correct server seek position
//    (preloaded audio URL is in browser HTTP cache → fast load)
// 7. SYNC button → fetchAndSync() → hard seek to server position
// ─────────────────────────────────────────────────────────────────────────────

export function LiveMusicProvider({ children }: { children: React.ReactNode }) {
    // ─── Session management ─────────────────────────────────────────────────
    const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
    const sessionIdRef = useRef<string | undefined>(undefined);

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
    const nextSongDataRef = useRef<LiveSong | null>(null);
    const nextSongIndexRef = useRef<number>(-1);

    // Server sync reference
    const serverSyncRef = useRef<{
        serverSeek: number;
        fetchedAt: number;
        songUrl: string;
    }>({ serverSeek: 0, fetchedAt: Date.now(), songUrl: "" });

    const lastSyncedRef = useRef(false);

    // ─── Build query string for current session ─────────────────────────────
    const getSessionQuery = useCallback(() => {
        const sid = sessionIdRef.current;
        return sid ? `?sessionId=${sid}` : "";
    }, []);

    // ─── Core: Fetch & Sync ─────────────────────────────────────────────────
    const fetchAndSync = useCallback(async (opts?: { metadataOnly?: boolean }) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const sq = getSessionQuery();
        const fetchStart = Date.now();

        try {
            const res = await fetch(`/api/live-music/now${sq}`, { cache: "no-store" });
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

            const song: LiveSong = data.song;
            const serverSeek = data.seekPosition + oneWayLatency;

            setCurrentSong(song);
            setSeekPosition(serverSeek);

            serverSyncRef.current = {
                serverSeek,
                fetchedAt: Date.now(),
                songUrl: song.audioUrl,
            };

            // If metadata-only refresh, don't touch audio
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
    }, [getSessionQuery]);

    // ─── Preload next song (cache warm only) ────────────────────────────────
    const preloadNextSong = useCallback(async () => {
        if (!preloadAudioRef.current) return;
        
        const sq = getSessionQuery();

        try {
            const res = await fetch(`/api/live-music/now${sq}`, { cache: "no-store" });
            const data = await res.json();
            
            if (!data.isLive || data.error || !data.song) return;

            const currentIdx = data.songIndex as number;
            const sid = sessionIdRef.current;
            const nextRes = await fetch(`/api/live-music/next?currentIndex=${currentIdx}${sid ? `&sessionId=${sid}` : ""}`, { cache: "no-store" });
            
            if (nextRes.ok) {
                const nextData = await nextRes.json();
                if (nextData.song && nextData.song.audioUrl) {
                    const nextSong = nextData.song as LiveSong;
                    
                    // Don't re-preload the same song
                    if (preloadedSongUrlRef.current === nextSong.audioUrl) return;
                    
                    preloadedSongUrlRef.current = nextSong.audioUrl;
                    nextSongDataRef.current = nextSong;
                    nextSongIndexRef.current = nextData.songIndex;
                    
                    // Warm the browser HTTP cache
                    preloadAudioRef.current.src = nextSong.audioUrl;
                    preloadAudioRef.current.load();
                }
            }
        } catch {
            // Preload failure is non-critical
        }
    }, [getSessionQuery]);

    // ─── Lifecycle: fetch on mount ──────────────────────────────────────────
    useEffect(() => {
        fetchAndSync();
        return () => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        };
    }, [fetchAndSync]);

    // ─── Switch session (called by live player page) ────────────────────────
    const switchSession = useCallback((newSessionId?: string) => {
        sessionIdRef.current = newSessionId;
        setActiveSessionId(newSessionId);

        // Clear preload state
        preloadedSongUrlRef.current = "";
        nextSongDataRef.current = null;
        nextSongIndexRef.current = -1;

        // Re-fetch for the new session
        isFetchingRef.current = false; // Force allow
        fetchAndSync();
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

    // ─── Song Ended Handler ─────────────────────────────────────────────────
    // Key fix: do a FULL fetchAndSync (not metadataOnly) so we get the
    // correct server seek position for the new song. The preload element
    // already warmed the browser cache, so loading is fast.
    const handleSongEnded = useCallback(() => {
        if (!audioRef.current) return;

        // Enter transitioning state — keeps sync spinner visible
        isTransitioningRef.current = true;
        setIsTransitioning(true);

        // Clear preload tracking
        preloadedSongUrlRef.current = "";
        nextSongDataRef.current = null;
        nextSongIndexRef.current = -1;

        // Full fetchAndSync — gets correct song + seek position from server
        // Browser HTTP cache has the next song file → audio loads fast
        isFetchingRef.current = false; // Force allow
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
            switchSession,
        }}>
            {/* Primary audio element — persists across navigation */}
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
                    if (isTransitioningRef.current) {
                        isTransitioningRef.current = false;
                        setIsTransitioning(false);
                    }
                }}
                onPause={() => {
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
            {/* Preload audio element — hidden, used for HTTP cache warming */}
            <audio
                ref={preloadAudioRef}
                preload="auto"
                style={{ display: "none" }}
            />
            {children}
        </LiveMusicContext.Provider>
    );
}
