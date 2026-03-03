"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { PLAYLIST } from "@/data/masterPlaylist";

export { PLAYLIST } from "@/data/masterPlaylist";

export interface LyricItem {
    time: number;
    text: string;
}

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    nextSong: (forcePlay?: boolean) => void;
    prevSong: (forcePlay?: boolean) => void;
    jumpToSong: (index: number) => void;
    currentSong: { title: string; audioUrl: string };
    audioRef: React.RefObject<HTMLAudioElement | null>;
    hasInteracted: boolean;
    isBuffering: boolean;
    warmup: () => void;
    showLyrics: boolean;
    setShowLyrics: (v: boolean) => void;
    showMarquee: boolean;
    setShowMarquee: (v: boolean) => void;
    showNarrative: boolean;
    setShowNarrative: (v: boolean) => void;
    currentLyricText: string | null;
    activeLyrics: LyricItem[];
    playQueue: (songs: { title: string; audioUrl: string }[], startIndex?: number, playlistId?: string | null) => void;
    queue: { title: string; audioUrl: string }[];
    currentIndex: number;
    activePlaylistId: string | null;
    isMiniPlayerDismissed: boolean;
    setMiniPlayerDismissed: (v: boolean) => void;
    // Time tracking
    currentTime: number;
    duration: number;
    seekTo: (time: number) => void;
    // Global Hub Mode
    activePlaybackMode: 'none' | 'music' | 'radio';
    setActivePlaybackMode: (mode: 'none' | 'music' | 'radio') => void;
    stopMusic: () => void; // Properly stops music and clears retries
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [queue, setQueue] = useState(PLAYLIST);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [isMiniPlayerDismissed, setMiniPlayerDismissed] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Global Hub Mode State
    const [activePlaybackMode, setActivePlaybackMode] = useState<'none' | 'music' | 'radio'>('none');

    // Track intentional pauses to prevent browser-triggered pauses from stopping music
    const intentionalPauseRef = useRef(false);

    // UI Persisted State
    const [showLyrics, setShowLyrics] = useState(true);
    const [showMarquee, setShowMarquee] = useState(true);
    const [showNarrative, setShowNarrative] = useState(true);

    // Lyric State
    const [currentLyricText, setCurrentLyricText] = useState<string | null>(null);
    const [activeLyrics, setActiveLyrics] = useState<LyricItem[]>([]);

    // Time tracking (lightweight, updates throttled)
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Theme integration
    const { theme, setTheme } = useTheme();
    const wasSwitchedRef = useRef(false);

    // Lyrics cache to avoid re-fetching on song revisit (Phase 5)
    const lyricsCacheRef = useRef<Map<string, LyricItem[]>>(new Map());

    // Melancholy Mode Effect — B8 Fix: Respect activePlaybackMode
    useEffect(() => {
        const isAnyAudioActive = isPlaying || activePlaybackMode === 'radio';
        if (isAnyAudioActive && setTheme) {
            if (theme === "light") {
                setTheme("dark");
                wasSwitchedRef.current = true;
            }
        } else if (setTheme) {
            // When ALL audio is idle, revert only if we switched it
            if (wasSwitchedRef.current && activePlaybackMode === 'none') {
                setTheme("light");
                wasSwitchedRef.current = false;
            }
        }
    }, [isPlaying, setTheme, theme, activePlaybackMode]);

    // Auto-resume audio when page visibility/focus changes
    // This handles browser pausing audio during navigation or tab switches
    useEffect(() => {
        const attemptResumeIfNeeded = () => {
            if (audioRef.current && isPlaying && audioRef.current.paused && !intentionalPauseRef.current) {
                audioRef.current.play().catch(() => {
                    // Silently fail - user may need to interact again
                });
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Small delay to let browser stabilize after tab switch
                setTimeout(attemptResumeIfNeeded, 100);
            }
        };

        const handleFocus = () => {
            setTimeout(attemptResumeIfNeeded, 100);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isPlaying]);

    // Periodic sync: if isPlaying is true but audio is paused (desync from navigation), resume it
    // B1 Fix: Only sync when in music mode, and limit attempts
    useEffect(() => {
        if (!isPlaying || activePlaybackMode !== 'music') return;

        let attempts = 0;
        const maxAttempts = 4; // 4 attempts * 500ms = 2 seconds coverage

        const syncInterval = setInterval(() => {
            attempts++;

            if (audioRef.current && audioRef.current.paused && !intentionalPauseRef.current && activePlaybackMode === 'music') {
                audioRef.current.play().catch(() => { });
            }

            if (attempts >= maxAttempts) {
                clearInterval(syncInterval);
            }
        }, 500);

        return () => clearInterval(syncInterval);
    }, [isPlaying, activePlaybackMode]);


    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        setHasInteracted(true);

        if (isPlaying) {
            intentionalPauseRef.current = true; // Tell the onPause listener to respect this
            audioRef.current.pause();
        } else {
            intentionalPauseRef.current = false;

            // If starting from standby, assume 'music' mode by default for local library
            setActivePlaybackMode(prev => prev === 'none' ? 'music' : prev);

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Playback started successfully
                    })
                    .catch(e => {
                        console.error("Playback failed:", e);
                        setIsPlaying(false);
                    });
            }
        }
    }, [isPlaying]);

    // B2 Fix: Proper stopMusic that kills all retries
    const stopMusic = useCallback(() => {
        intentionalPauseRef.current = true;
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    }, []);

    const playQueue = useCallback((newQueue: typeof PLAYLIST, startIndex = 0, playlistId: string | null = null) => {
        intentionalPauseRef.current = false;
        setQueue(newQueue);
        setCurrentIndex(startIndex);
        setActivePlaylistId(playlistId);
        setIsBuffering(false);
        setHasInteracted(true);
        setActivePlaybackMode('music'); // Steal focus for music mode
        setIsPlaying(true);
    }, []);

    const nextSong = useCallback((forcePlay = false) => {
        // OPTIMISTIC: Reset buffering immediately so UI shows title
        setIsBuffering(false);
        if (forcePlay) {
            setIsPlaying(true);
        }
        setCurrentIndex((prev) => (prev + 1) % queue.length);
        // Buffering will naturally trigger on source change
    }, [queue.length]);

    const prevSong = useCallback((forcePlay = false) => {
        setIsBuffering(false);
        if (forcePlay) {
            setIsPlaying(true);
        }
        setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    }, [queue.length]);

    const jumpToSong = useCallback((index: number) => {
        intentionalPauseRef.current = false;
        setIsBuffering(false);
        setHasInteracted(true);
        setIsPlaying(true);
        setCurrentIndex(index);
    }, []);

    // Auto-play when index changes if it was already playing or triggered by next
    // Also triggers when queue changes (e.g., switching playlists)
    const queueId = queue[0]?.audioUrl || ""; // Unique identifier for current queue
    useEffect(() => {
        // If we are playing (or forcePlay was set to true which updated isPlaying),
        // we need to ensure the new track plays.
        if (audioRef.current && isPlaying) {
            // Mobile Auto-Play Fix: Small timeout to ensure DOM is ready and state is clean
            const timer = setTimeout(() => {
                const playPromise = audioRef.current?.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error("Auto-playback failed:", e);
                        // If it failed because of "user interaction", we might need to revert isPlaying
                    });
                }
            }, 50); // 50ms ticks allowing browser event loop to catch up
            return () => clearTimeout(timer);
        }


    }, [currentIndex, isPlaying, queueId]); // Added queueId to detect playlist switches

    const currentSong = queue[currentIndex] || queue[0];

    // Detect Lyrics on Song Change (with cache — Phase 5)
    useEffect(() => {
        let isMounted = true;
        setActiveLyrics([]);
        setCurrentLyricText(null);

        // Check cache first
        const cached = lyricsCacheRef.current.get(currentSong.title);
        if (cached) {
            setActiveLyrics(cached);
            return;
        }

        const fetchLyrics = async () => {
            try {
                const filename = `/lyrics/${encodeURIComponent(currentSong.title)}.json`;
                const res = await fetch(filename);
                if (res.ok) {
                    const data: LyricItem[] = await res.json();
                    if (isMounted) {
                        setActiveLyrics(data);
                        // Store in cache (cap at 20 entries)
                        const cache = lyricsCacheRef.current;
                        cache.set(currentSong.title, data);
                        if (cache.size > 20) {
                            const firstKey = cache.keys().next().value;
                            if (firstKey) cache.delete(firstKey);
                        }
                    }
                } else {
                    if (isMounted) setActiveLyrics([]);
                }
            } catch (error) {
                console.error("Failed to fetch lyrics:", error);
            }
        };
        fetchLyrics();
        return () => { isMounted = false; };
    }, [currentSong.title]);

    // Throttle ref for performance (mobile-first)
    const lastTimeUpdateRef = useRef(0);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const t = audioRef.current.currentTime;

        // Throttled time update for progress bar (every 500ms for performance)
        const now = Date.now();
        if (now - lastTimeUpdateRef.current > 500) {
            setCurrentTime(t);
            lastTimeUpdateRef.current = now;
        }

        // Lyric sync (existing logic)
        if (activeLyrics.length === 0) return;
        let activeLine: LyricItem | null = null;
        let nextLineTime = Infinity;
        for (let i = 0; i < activeLyrics.length; i++) {
            if (activeLyrics[i].time <= t) {
                activeLine = activeLyrics[i];
                if (i + 1 < activeLyrics.length) nextLineTime = activeLyrics[i + 1].time;
            } else { break; }
        }
        if (activeLine && t < nextLineTime) {
            if (currentLyricText !== activeLine.text) setCurrentLyricText(activeLine.text);
        } else {
            if (currentLyricText !== null) setCurrentLyricText(null);
        }
    };

    // Seek to time
    const seekTo = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    // Media Session API (Lock Screen Controls)
    useEffect(() => {
        if (!currentSong || !("mediaSession" in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentSong.title.split("—")[1]?.trim() || currentSong.title,
            artist: currentSong.title.split("—")[0]?.trim() || "Faza's Playlist",
            album: "Taman Langit",
            artwork: [
                { src: "/icon.png", sizes: "192x192", type: "image/png" }
            ]
        });

        navigator.mediaSession.setActionHandler("play", () => togglePlay());
        navigator.mediaSession.setActionHandler("pause", () => togglePlay());
        navigator.mediaSession.setActionHandler("previoustrack", () => prevSong());
        navigator.mediaSession.setActionHandler("nexttrack", () => nextSong());

        return () => {
            if ("mediaSession" in navigator) {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
            }
        };
    }, [currentSong, togglePlay, nextSong, prevSong]);

    // Mobile/Smart Preloading Logic
    const warmup = useCallback(() => {
        // Just creating the audio object or setting src warms up the connection
        if (audioRef.current && audioRef.current.preload === 'none') {
            audioRef.current.preload = 'metadata'; // Upgrade to metadata on hover/touch
        }
    }, []);

    // Refs to track active preload/prefetch tags for cleanup (Phase 3)
    const preloadLinkRef = useRef<HTMLLinkElement | null>(null);
    const prefetchLinkRef = useRef<HTMLLinkElement | null>(null);

    // Smart Strategy: "The Next Song" Prefetcher
    // Eagerly prefetch the next song after 3s of stable playback
    useEffect(() => {
        if (!isPlaying || isBuffering) return;

        const idleFetcher = setTimeout(() => {
            const nextIdx = (currentIndex + 1) % queue.length;
            const nextUrl = queue[nextIdx]?.audioUrl;
            if (!nextUrl) return;

            // Remove previous preload tag
            if (preloadLinkRef.current) {
                preloadLinkRef.current.remove();
                preloadLinkRef.current = null;
            }

            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'audio';
            link.href = nextUrl;
            link.onerror = () => {
                link.remove();
                if (preloadLinkRef.current === link) preloadLinkRef.current = null;
            };
            document.head.appendChild(link);
            preloadLinkRef.current = link;
        }, 3000);

        return () => clearTimeout(idleFetcher);
    }, [currentIndex, isPlaying, isBuffering, queue]);

    // Immediate prefetch: inject a prefetch link for the next song as soon as current song changes
    useEffect(() => {
        const nextIdx = (currentIndex + 1) % queue.length;
        const nextUrl = queue[nextIdx]?.audioUrl;
        if (!nextUrl) return;

        // Remove previous prefetch tag
        if (prefetchLinkRef.current) {
            prefetchLinkRef.current.remove();
            prefetchLinkRef.current = null;
        }

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = nextUrl;
        link.onerror = () => {
            link.remove();
            if (prefetchLinkRef.current === link) prefetchLinkRef.current = null;
        };
        document.head.appendChild(link);
        prefetchLinkRef.current = link;

        return () => {
            if (prefetchLinkRef.current) {
                prefetchLinkRef.current.remove();
                prefetchLinkRef.current = null;
            }
        };
    }, [currentIndex, queue]);

    return (
        <AudioContext.Provider value={{
            isPlaying, isBuffering, togglePlay, nextSong, prevSong, jumpToSong, currentSong, audioRef, hasInteracted, warmup,
            showLyrics, setShowLyrics, showMarquee, setShowMarquee, showNarrative, setShowNarrative,
            currentLyricText,
            activeLyrics,
            playQueue,
            queue,
            currentIndex,
            activePlaylistId,
            isMiniPlayerDismissed,
            setMiniPlayerDismissed,
            currentTime,
            duration,
            seekTo,
            activePlaybackMode,
            setActivePlaybackMode,
            stopMusic
        }}>
            <audio
                ref={audioRef}
                src={queue[currentIndex]?.audioUrl}
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration || 0);
                    }
                }}
                onPlay={() => {
                    intentionalPauseRef.current = false;
                    setIsPlaying(true);
                }}
                onPause={() => {
                    // B1 Fix: Only attempt resume if we are in music mode and not intentionally paused
                    if (intentionalPauseRef.current) {
                        setIsPlaying(false);
                    } else if (activePlaybackMode === 'music') {
                        // Unintentional pause (browser-triggered) — single gentle retry only
                        setTimeout(() => {
                            if (audioRef.current && audioRef.current.paused && !intentionalPauseRef.current && activePlaybackMode === 'music') {
                                audioRef.current.play().catch(() => {
                                    // If still fails, accept it — don't storm
                                });
                            }
                        }, 200);
                    }
                    // If mode is 'radio' or 'none', do nothing — let it stay paused
                }}
                onWaiting={() => setIsBuffering(true)} // Buffer started
                onPlaying={() => setIsBuffering(false)} // Buffer finished, playing
                onCanPlay={() => setIsBuffering(false)} // Adequate data to start
                onLoadedData={() => setIsBuffering(false)} // First frame loaded
                onEnded={() => nextSong(true)}
                onError={(e) => {
                    const audio = audioRef.current;
                    const error = audio ? audio.error : null;
                    console.error("Audio error details:", {
                        code: error?.code,
                        message: error?.message,
                        src: audio?.src
                    });
                    setIsPlaying(false);
                    setIsBuffering(false);
                }}
            />
            {children}
        </AudioContext.Provider>
    );
}
