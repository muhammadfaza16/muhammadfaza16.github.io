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

// Soft sync threshold: below this, use playbackRate adjustment
const SOFT_SYNC_THRESHOLD = 2.5;
// Hard sync threshold: above this, force seek
const HARD_SYNC_THRESHOLD = 3.0;
// Polling interval in ms
const POLL_INTERVAL = 12000;

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
    const timeUpdateRef = useRef<number>(0);
    const currentSongUrlRef = useRef<string>("");
    const hasUserInteractedRef = useRef(false);
    const isSyncingRef = useRef(false);

    // Fetch current live state from server
    const fetchNow = useCallback(async (isInitial = false) => {
        if (isSyncingRef.current && !isInitial) return;
        isSyncingRef.current = true;

        try {
            const res = await fetch("/api/live-music/now", { cache: "no-store" });
            const data = await res.json();

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

            // --- Audio Sync Logic ---
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.preload = "auto";
                // Ensure pitch is preserved when we adjust playbackRate
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
                });
                audioRef.current.addEventListener("timeupdate", () => {
                    if (audioRef.current) {
                        setCurrentTime(audioRef.current.currentTime);
                    }
                });
            }

            const audio = audioRef.current;
            const serverSeek = data.seekPosition;

            // Account for network latency: estimate ~200ms fetch time
            const adjustedSeek = serverSeek + 0.2;

            if (currentSongUrlRef.current !== song.audioUrl) {
                // Song changed — hard load new source
                currentSongUrlRef.current = song.audioUrl;
                audio.src = song.audioUrl;
                audio.currentTime = adjustedSeek;
                setIsWaitingForSync(false); // Clear waiting state since we have a new song

                if (hasUserInteractedRef.current) {
                    try {
                        await audio.play();
                    } catch {
                        // Autoplay blocked — user needs to click play
                    }
                }
            } else {
                // Same song — apply Graceful Sync
                const drift = adjustedSeek - audio.currentTime;
                const absDrift = Math.abs(drift);

                if (absDrift > HARD_SYNC_THRESHOLD) {
                    // Hard sync: tab was sleeping or major desync
                    audio.currentTime = adjustedSeek;
                } else if (absDrift > 0.5) {
                    // Soft sync: slightly adjust playback rate to catch up/slow down
                    // 5% speed change is imperceptible to human ear
                    audio.playbackRate = drift > 0 ? 1.05 : 0.95;

                    // Calculate how long we need to run at adjusted rate to close the gap
                    // At 1.05x, we gain 0.05s per second. To close `absDrift` seconds gap:
                    // time = absDrift / 0.05
                    const correctionTime = (absDrift / 0.05) * 1000;

                    setTimeout(() => {
                        if (audioRef.current) {
                            audioRef.current.playbackRate = 1.0;
                        }
                    }, Math.min(correctionTime, POLL_INTERVAL - 1000));
                }
                // If drift < 0.5s, do nothing — already synced enough
            }

            setIsLoading(false);
        } catch (err: any) {
            setError(err.message || "Failed to connect to live stream");
            setIsLoading(false);
        } finally {
            isSyncingRef.current = false;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNow(true);

        // Start polling
        pollTimerRef.current = setInterval(() => fetchNow(false), POLL_INTERVAL);

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
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
