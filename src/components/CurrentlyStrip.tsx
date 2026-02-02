"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAudio, PLAYLIST } from "./AudioContext";
import { useNarrativeEngine } from "../hooks/useNarrativeEngine";
import { useZen } from "./ZenContext";
import { SkipBack, SkipForward, ListMusic } from "lucide-react";
import { getSongMessage } from "../data/songMessages";
import { LyricsDisplay } from "./LyricsDisplay";
import { PlaylistDrawer } from "./PlaylistDrawer";
import { motion, AnimatePresence } from "framer-motion";

// New Component Imports
import { TypewriterText, formatTime } from "./music/helpers";
import { ContinuousMarquee } from "./music/Marquee";
import { VibingAvatar } from "./music/VibingAvatar";
import { getMoods, WELCOME_MESSAGES } from "./music/constants";

export function CurrentlyStrip() {
    const pathname = usePathname();
    const {
        isPlaying, isBuffering, togglePlay, currentSong, nextSong, prevSong, hasInteracted, audioRef, warmup,
        showLyrics, showMarquee, activeLyrics, currentIndex, playQueue
    } = useAudio();

    // Debounced Buffering State
    const [showBufferingUI, setShowBufferingUI] = useState(false);

    // Track song changes
    const [justChangedSong, setJustChangedSong] = useState(false);

    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

    useEffect(() => {
        setJustChangedSong(true);
        const timer = setTimeout(() => setJustChangedSong(false), 5000);
        return () => clearTimeout(timer);
    }, [currentSong]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isBuffering) {
            timer = setTimeout(() => {
                setShowBufferingUI(true);
            }, 2500);
        } else {
            setShowBufferingUI(false);
        }
        return () => clearTimeout(timer);
    }, [isBuffering]);

    // Calculate Next Song
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    const nextSongTitle = PLAYLIST[nextIndex].title;

    // Narrative Engine
    const narrative = useNarrativeEngine({
        currentSongTitle: currentSong.title,
        isPlaying,
        audioRef,
        nextSongTitle
    });

    const { isZen } = useZen();

    const [currentTime, setCurrentTime] = useState("");
    const [currentHour, setCurrentHour] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);

    const [moods, setMoods] = useState<string[]>([]);
    const [moodIndex, setMoodIndex] = useState(0);
    const displayMood = moods.length > 0 ? moods[moodIndex % moods.length] : "";

    const [songMessageIndex, setSongMessageIndex] = useState(0);
    const [msgOpacity, setMsgOpacity] = useState(1);

    const displaySongMessage = useMemo(() => {
        if (showBufferingUI) return "Buffering...";
        if (justChangedSong) return currentSong.title;
        if (!hasInteracted && !isPlaying) {
            return "Pick a song. Let's see where it takes us.";
        }
        return getSongMessage(currentSong.title, isPlaying, songMessageIndex);
    }, [currentSong, isPlaying, songMessageIndex, hasInteracted, showBufferingUI, justChangedSong]);

    const [showWelcomeText, setShowWelcomeText] = useState(false);
    const [showAvatarTooltip, setShowAvatarTooltip] = useState(false);

    useEffect(() => {
        if (isHydrated) {
            setShowAvatarTooltip(true);
            const timer = setTimeout(() => {
                setShowAvatarTooltip(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isHydrated]);

    useEffect(() => {
        if (isPlaying && !hasInteracted) {
            sessionStorage.setItem('player_interacted', 'true');
            setShowWelcomeText(true);
            setTimeout(() => {
                setShowWelcomeText(false);
            }, 5000);
        }
    }, [isPlaying, hasInteracted]);

    // Memoized Items
    const playingItem = useMemo(() => ({
        icon: showBufferingUI ? "⏳" : "🎵",
        label: showBufferingUI ? "Status" : "Playing",
        text: showBufferingUI ? "Buffering..." : currentSong.title,
        width: "200px",
        labelWidth: "60px",
        className: "marquee-song-title"
    }), [currentSong.title, showBufferingUI]);

    const timeItem = useMemo(() => ({
        icon: "◎",
        label: "Time",
        text: currentTime,
        width: "65px",
        labelWidth: "40px"
    }), [currentTime]);

    const moodItem = useMemo(() => ({
        icon: "⚡",
        label: "Mood",
        text: displayMood,
        width: "160px",
        labelWidth: "40px"
    }), [displayMood]);

    const checkInItem = useMemo(() => ({
        icon: "💌",
        label: "Checking in",
        text: narrative.text || "Thinking of u...",
        width: "320px",
        labelWidth: "90px"
    }), [narrative.text]);

    const welcomeItems = useMemo(() => [
        { icon: "👋", label: "Hey", text: "You made it. Finally." },
        { icon: "🧠", label: "Info", text: "This isn't just a playlist. It's my collection of thoughts." },
        { icon: "▶️", label: "Action", text: "Pick a song. Let's see where it takes us." },
    ], []);

    const statusItems = useMemo(() => {
        if (!hasInteracted && !isPlaying) {
            return welcomeItems;
        }
        return [
            playingItem,
            timeItem,
            moodItem,
            checkInItem
        ];
    }, [hasInteracted, isPlaying, welcomeItems, playingItem, timeItem, moodItem, checkInItem]);

    // Tracker for checking-in visibility
    const visibleCheckIns = useRef(new Set<string>());

    const handleVisibilityChange = (id: string, isVisible: boolean) => {
        if (isVisible) {
            visibleCheckIns.current.add(id);
        } else {
            visibleCheckIns.current.delete(id);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        let lastHour = -1;

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));

            const h = now.getHours();
            if (h !== lastHour) {
                setMoods(getMoods(h));
                setCurrentHour(h);
                lastHour = h;
            }
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        const contentRotationInterval = setInterval(() => {
            setMoodIndex((prev) => prev + 1);
            setSongMessageIndex((prev) => prev + 1);
        }, 20000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(contentRotationInterval);
        };
    }, []);

    if (!isHydrated) return null;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "0rem"
            }}>

            {/* Lyrics Layer (Sky) */}
            <AnimatePresence>
                {showLyrics && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: "auto", opacity: 1, marginBottom: "1rem" }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden", width: "100%" }}
                    >
                        <LyricsDisplay />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Layer */}
            <div style={{ position: "relative" }}>
                {!isPlaying && (
                    <div
                        style={{
                            position: "absolute",
                            top: "16px",
                            left: "50%",
                            transform: "translate(-50%, -100%)",
                            maxWidth: "140px",
                            width: "max-content",
                            marginBottom: "0px",
                            fontSize: "0.65rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--foreground)",
                            opacity: 0.7,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            lineHeight: 1.2,
                            whiteSpace: "normal",
                            textAlign: "center",
                            zIndex: 10,
                            pointerEvents: "none",
                            animation: "tooltip-enter 0.5s ease-out forwards"
                        }}
                    >
                        <TypewriterText
                            texts={WELCOME_MESSAGES}
                            speed={60}
                            deleteSpeed={50}
                            pauseDuration={3000}
                        />
                        <style>{`
                            @keyframes tooltip-enter {
                                0% { opacity: 0; }
                                100% { opacity: 0.7; }
                            }
                        `}</style>
                    </div>
                )}

                <VibingAvatar
                    isPlaying={isPlaying}
                    hour={currentHour}
                    lyrics={activeLyrics}
                    narrativeText={activeLyrics.length > 0 ? undefined : narrative.text}
                    mood={narrative.mood}
                    pose={narrative.pose}
                />
            </div>

            {/* Top: Marquee Pill */}
            {showMarquee && (
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 1.25rem",
                        borderRadius: "99px",
                        backgroundColor: "rgba(var(--background-rgb), 0.5)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.02em",
                        width: "clamp(300px, 90vw, 600px)",
                        overflow: "hidden"
                    }}
                    className="pause-on-hover"
                >
                    <ContinuousMarquee items={statusItems} onVisibilityChange={handleVisibilityChange} />
                </div>
            )}


            {/* Bottom: Play Control */}
            <div
                style={{
                    minHeight: "3rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingTop: "0rem",
                    paddingBottom: "0.25rem"
                }}
            >
                {/* Song message text with fade transition */}
                <p
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "0.95rem",
                        color: "var(--text-muted)",
                        margin: 0,
                        marginBottom: "0",
                        cursor: "pointer",
                        userSelect: "none",
                        textAlign: "center",
                        minHeight: "2.8em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.5s ease-in-out",
                        opacity: msgOpacity
                    }}
                    onClick={togglePlay}
                >
                    {displaySongMessage}
                </p>

                {/* Player controls row */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* Playlist Toggle */}
                        {hasInteracted && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPlaylistOpen(true);
                                }}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)",
                                    opacity: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s ease",
                                    padding: "4px"
                                }}
                                className="hover:opacity-100"
                                title="Open Library"
                            >
                                <ListMusic size={14} />
                            </div>
                        )}

                        {/* Prev Button */}
                        {hasInteracted && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevSong();
                                }}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)",
                                    opacity: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s ease",
                                    padding: "4px"
                                }}
                                className="hover:opacity-100"
                                title="Previous Song"
                            >
                                <SkipBack size={14} />
                            </div>
                        )}

                        <button
                            onClick={togglePlay}
                            onMouseEnter={warmup}
                            onTouchStart={warmup}
                            style={{
                                all: "unset",
                                fontSize: (!hasInteracted && !isPlaying) ? "1.5rem" : "0.9rem",
                                color: "var(--foreground)",
                                opacity: (!hasInteracted && !isPlaying) ? 0.8 : 0.7,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                                background: "transparent",
                                WebkitTapHighlightColor: "transparent",
                                cursor: "pointer",
                                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                            className="hover:opacity-100"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? "⏸" : "▶"}
                        </button>

                        {/* Next Button */}
                        {hasInteracted && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextSong();
                                }}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)",
                                    opacity: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s ease",
                                    padding: "4px"
                                }}
                                className="hover:opacity-100"
                                title="Next Song"
                            >
                                <SkipForward size={14} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Playlist Drawer */}
            <PlaylistDrawer
                isOpen={isPlaylistOpen}
                onClose={() => setIsPlaylistOpen(false)}
                currentSongTitle={currentSong.title}
                onPlaySong={(index) => playQueue(PLAYLIST, index)}
                isPlaying={isPlaying}
            />

        </div >
    );
}
