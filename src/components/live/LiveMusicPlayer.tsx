"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Radio, Disc, Music, ListMusic, ChevronDown, ChevronLeft, Heart, Headphones, Power, Users } from "lucide-react";
import { useLiveMusic, useLiveTime } from "./LiveMusicContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";

function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

const BufferingOverlay = React.memo(() => {
    const { isBuffering } = useLiveTime();
    if (!isBuffering) return null;
    return (
        <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)", zIndex: 4
        }}>
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ willChange: "transform" }}
            >
                <Disc size={32} color="#fff" />
            </motion.div>
        </div>
    );
});
BufferingOverlay.displayName = "BufferingOverlay";

const LiveVisualizer = React.memo(({ isPlaying }: { isPlaying: boolean }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    if (!isPlaying) return null;
    return (
        <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: "3px", zIndex: 3, height: "40px" }}>
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ scaleY: [0.2, 0.5 + Math.random() * 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: "easeInOut" }}
                    style={{
                        width: "4px", height: "40px",
                        transformOrigin: "bottom",
                        borderRadius: "100px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)",
                        willChange: "transform"
                    }}
                />
            ))}
        </div>
    );
});
LiveVisualizer.displayName = "LiveVisualizer";

const LivePlayerProgress = React.memo(({ isPlaying }: { isPlaying: boolean }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { currentTime, duration } = useLiveTime();
    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div style={{
            width: "100%", height: "4px", borderRadius: "100px",
            backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)",
            overflow: "hidden"
        }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
                style={{ 
                    height: "100%", backgroundColor: "#EF4444", borderRadius: "100px",
                    boxShadow: isPlaying ? "0 0 12px rgba(239, 68, 68, 0.8)" : "none",
                    willChange: "width"
                }}
            />
        </div>
    );
});
LivePlayerProgress.displayName = "LivePlayerProgress";

const LivePlayerClock = React.memo(() => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { currentTime, duration } = useLiveTime();
    const monoFont = "var(--font-mono), monospace";
    return (
        <div style={{ 
            display: "flex", justifyContent: "space-between", marginTop: "6px", 
            fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, 
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)" 
        }}>
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration)}</span>
        </div>
    );
});
LivePlayerClock.displayName = "LivePlayerClock";

const MarqueeText = React.memo(({ 
    text, 
    fontSize = "1.75rem", 
    fontWeight = 900, 
    color = "#000",
    letterSpacing = "-0.04em",
    fontFamily = "inherit",
    lineHeight = 1.1,
    boxHeight = "40px",
    justifyContent = "center"
}: { 
    text: string, 
    fontSize?: string, 
    fontWeight?: number, 
    color?: string,
    letterSpacing?: string,
    fontFamily?: string,
    lineHeight?: number | string,
    boxHeight?: string,
    justifyContent?: "center" | "flex-start" | "flex-end"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (textRef.current && containerRef.current) {
            const tw = textRef.current.scrollWidth;
            const cw = containerRef.current.offsetWidth;
            setTextWidth(tw);
            setContainerWidth(cw);
            setShouldAnimate(tw > cw);
        }
    }, [text]);

    const duration = textWidth * 0.05; // Adjust speed based on length

    return (
        <div 
            ref={containerRef}
            style={{ 
                width: "100%", 
                height: boxHeight,
                overflow: "hidden", 
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: justifyContent,
                // Edge mask for premium look
                WebkitMaskImage: shouldAnimate 
                    ? "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
                    : "none",
                maskImage: shouldAnimate 
                    ? "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
                    : "none",
            }}
        >
            <motion.div
                ref={textRef}
                initial={{ x: 0 }}
                animate={shouldAnimate ? { x: [0, -(textWidth + 40)] } : { x: 0 }}
                transition={{ 
                    duration: duration, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatDelay: 1 
                }}
                style={{
                    fontFamily,
                    fontWeight,
                    fontSize,
                    color,
                    letterSpacing,
                    lineHeight,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    paddingRight: shouldAnimate ? "40px" : "0" // Gap before repeat
                }}
            >
                {text}
                {shouldAnimate && <span style={{ marginLeft: "40px" }}>{text}</span>}
            </motion.div>
        </div>
    );
});
MarqueeText.displayName = "MarqueeText";

const LiveTrackRow = React.memo(({ 
    track, index, isDark, headerFont, monoFont, activeTrackRef 
}: { 
    track: any, index: number, isDark: boolean, headerFont: string, monoFont: string, activeTrackRef: any 
}) => {
    const { cleanTitle: tTitle, artist: tArtist } = parseSongTitle(track.title);
    return (
        <div 
            ref={track.isCurrent ? activeTrackRef : null}
            style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "16px 20px",
            backgroundColor: track.isCurrent ? (isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)") : "transparent",
            borderBottom: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.02)"
        }}>
            <div style={{
                width: "24px", textAlign: "center", fontFamily: monoFont,
                fontWeight: 700, fontSize: "0.65rem",
                color: track.isCurrent ? "#EF4444" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")
            }}>
                {track.isCurrent ? (
                    <Music size={14} color="#EF4444" />
                ) : (
                    (index + 1).toString().padStart(2, "0")
                )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                        fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        color: track.isCurrent ? (isDark ? "#FFF" : "#000") : (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)")
                    }}>
                        {tTitle}
                    </div>
                    {(() => {
                        const { labels } = parseSongTitle(track.title);
                        return labels.length > 0 && (
                            <div style={{ display: "flex", gap: "4px" }}>
                                {labels.map(l => (
                                    <span key={l} style={{
                                        fontSize: "0.4rem", fontFamily: headerFont, fontWeight: 800,
                                        backgroundColor: track.isCurrent ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(239,68,68,0.1)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"),
                                        color: track.isCurrent ? (isDark ? "#FFF" : "#EF4444") : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"),
                                        padding: "1px 5px", borderRadius: "100px",
                                        letterSpacing: "0.06em", textTransform: "uppercase",
                                        border: "1px solid " + (track.isCurrent ? (isDark ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.2)") : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"))
                                    }}>{l}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>
                <div style={{
                    fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem",
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                    textTransform: "uppercase"
                }}>
                    {tArtist}
                </div>
            </div>
            <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.65rem", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                {fmtTime(track.duration)}
            </div>
        </div>
    );
});
LiveTrackRow.displayName = "LiveTrackRow";

const LiveControls = React.memo(({ 
    isWaitingForSync, isTransitioning, togglePlay, isPlaying, isSynced, refresh, isDark, headerFont, onShowQueue 
}: any) => {
    const { isBuffering } = useLiveTime();
    return (
        <div style={{ display: "flex", justifySelf: "center", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 20px" }}>
            {/* Left: Queue Toggle */}
            <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onShowQueue}
                    style={{
                        width: "48px", height: "48px", borderRadius: "100px",
                        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(99, 102, 241, 0.12)",
                        backdropFilter: "blur(20px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(99, 102, 241, 0.2)",
                        cursor: "pointer",
                        color: isDark ? "#FFF" : "#6366F1",
                    }}
                >
                    <ListMusic size={20} />
                </motion.button>
            </div>

            {/* Center: Play/Pause -> Join/Leave */}
            {(isWaitingForSync || isBuffering) ? (
                <div
                    style={{
                        height: "64px", padding: "0 32px", borderRadius: "100px",
                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <Radio size={18} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"} />
                    </motion.div>
                    <span style={{ 
                        fontFamily: "var(--font-display), system-ui, sans-serif", 
                        fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.1em", 
                        textTransform: "uppercase",
                        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    }}>
                        {isWaitingForSync ? "Syncing" : "Tuning In"}
                    </span>
                </div>
            ) : (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    style={{
                        height: "64px", borderRadius: "100px",
                        background: (isPlaying || isTransitioning) 
                            ? (isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)") 
                            : (isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.95)"),
                        backdropFilter: "blur(30px)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                        border: (isPlaying || isTransitioning) ? (isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)") : "none",
                        cursor: "pointer",
                        boxShadow: (isPlaying || isTransitioning) ? "none" : (isDark ? "0 20px 40px rgba(255,255,255,0.15)" : "0 10px 30px rgba(0,0,0,0.2)"),
                        color: (isPlaying || isTransitioning) ? "#EF4444" : (isDark ? "#000" : "#FFF"),
                        padding: "0 40px"
                    }}
                >
                    {(isPlaying || isTransitioning) ? (
                        <>
                            <Power size={20} color="currentColor" strokeWidth={2.5} />
                            <span style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Leave
                            </span>
                        </>
                    ) : (
                        <>
                            <Headphones size={20} color="currentColor" strokeWidth={2.5} />
                            <span style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Join
                            </span>
                        </>
                    )}
                </motion.button>
            )}

            {/* Right: LIVE Indicator / Sync Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={refresh}
                style={{
                    padding: "0 12px", height: "48px", borderRadius: "100px",
                    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(239, 68, 68, 0.12)",
                    backdropFilter: "blur(20px)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(239, 68, 68, 0.2)",
                    display: "flex", alignItems: "center", gap: "8px",
                    cursor: "pointer",
                    color: isDark ? "#FFF" : "#EF4444",
                }}
            >
                <span style={{ 
                    fontFamily: headerFont, fontWeight: 900, fontSize: "0.65rem", 
                    letterSpacing: "0.1em", textTransform: "uppercase" 
                }}>
                    {isSynced ? "LIVE" : "SYNC"}
                </span>
                <motion.div
                    animate={isSynced ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.6, 1],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: isSynced ? "#EF4444" : "#666",
                        boxShadow: isSynced ? "0 0 8px rgba(239, 68, 68, 0.5)" : "none"
                    }}
                />
            </motion.button>
        </div>
    );
});
LiveControls.displayName = "LiveControls";

export function LiveMusicPlayer() {
    const {
        isLive, isPlaying, isLoading, isWaitingForSync, isTransitioning,
        currentSong, songIndex, totalSongs,
        playlistTitle, playlistCover, playlistColor, tracklist,
        error, togglePlay, refresh, isSynced, listenersCount
    } = useLiveMusic();
    const { theme } = useTheme();
    const [showQueue, setShowQueue] = React.useState(false);
    const [reactions, setReactions] = React.useState<{ id: number, x: number, duration: number }[]>([]);

    const handleReact = () => {
        const id = Date.now() + Math.random();
        setReactions(prev => [...prev.slice(-15), { id, x: Math.random() * 40 - 20, duration: 2 + Math.random() * 2 }]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 4000);
    };

    const nextSong = tracklist.length > 0 ? tracklist[(songIndex + 1) % tracklist.length] : null;
    const { cleanTitle: nextTitle, artist: nextArtist } = nextSong ? parseSongTitle(nextSong.title) : { cleanTitle: "", artist: "" };

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";
    const activeTrackRef = React.useRef<HTMLDivElement>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Custom Smooth Scroll with Bezier (Ease Out Cubic)
    const smoothScrollToActive = React.useCallback(() => {
        const container = scrollContainerRef.current;
        const target = activeTrackRef.current;
        if (!container || !target) return;

        const start = container.scrollTop;
        const targetTop = target.offsetTop - container.offsetTop - (container.clientHeight / 2) + (target.clientHeight / 2);
        const distance = targetTop - start;
        const duration = 800; // ms
        let startTime: number | null = null;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            container.scrollTop = start + distance * easeOutCubic(progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }, []);

    // Auto-scroll to active track when showing queue
    React.useEffect(() => {
        if (showQueue) {
            // Use a small delay to ensure the modal is in the DOM and layout is calculated
            const timer = setTimeout(smoothScrollToActive, 50);
            return () => clearTimeout(timer);
        }
    }, [showQueue, smoothScrollToActive]);

    const isDark = theme === "dark";

    // Loading state
    if (isLoading) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "24px", padding: "60px 20px"
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)"
                    }}
                >
                    <Radio size={36} color="#fff" />
                </motion.div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        TUNING IN
                    </div>
                    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.65rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginTop: "6px" }}>
                        CONNECTING TO LIVE STREAM
                    </div>
                </div>
            </div>
        );
    }

    // Off Air state
    if (!isLive) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "24px", padding: "60px 20px"
            }}>
                <div style={{
                    width: "100px", height: "100px", borderRadius: "28px",
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <Radio size={48} color={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.4rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: isDark ? "#FFF" : "#000" }}>
                        OFF AIR
                    </div>
                    <div style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.85rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginTop: "6px", lineHeight: 1.4 }}>
                        Nothing is currently streaming.<br />
                        Check back later for live music.
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={refresh}
                    style={{
                        fontFamily: headerFont, fontWeight: 800, fontSize: "0.75rem",
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        padding: "10px 24px", borderRadius: "100px", cursor: "pointer",
                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                        color: isDark ? "#FFF" : "#000"
                    }}
                >
                    REFRESH
                </motion.button>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1rem", color: "#EF4444" }}>
                    STREAM ERROR
                </div>
                <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.7rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginTop: "8px" }}>
                    {error}
                </div>
            </div>
        );
    }

    if (!currentSong) return null;

    const { cleanTitle, artist, labels } = parseSongTitle(currentSong.title);

    return (
        <>
            {/* Ambient Background — static gradient, no GPU-heavy blur */}
            <div style={{
                position: "absolute",
                inset: "-50px",
                zIndex: 0,
                pointerEvents: "none",
                background: isDark 
                    ? "radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(30, 27, 75, 0.3) 50%, transparent 80%)"
                    : `radial-gradient(circle at 0% 0%, rgba(129, 140, 248, 0.12) 0%, transparent 50%),
                       radial-gradient(circle at 100% 100%, rgba(244, 114, 182, 0.12) 0%, transparent 50%),
                       radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.1) 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 30%, rgba(199, 210, 254, 0.35) 0%, rgba(255, 255, 255, 0) 70%),
                       #F8FAFC`
            }} />

            <div style={{ 
                position: "relative", 
                zIndex: showQueue ? 999999 : 1, 
                flex: 1, 
                display: "flex", 
                flexDirection: "column", 
                width: "100%", 
                maxWidth: "500px", 
                margin: "0 auto",
                paddingBottom: "calc(env(safe-area-inset-bottom) + 180px)" // Increased padding to clear URL bar and MiniPlayer
            }}>
            {/* Playlist Info & Listeners */}
            <div style={{ 
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "12px", 
                padding: "16px 20px 22px", 
            }}>
                <span style={{ 
                    fontFamily: headerFont, 
                    fontWeight: 900, 
                    fontSize: "1rem", 
                    letterSpacing: "-0.01em", 
                    color: isDark ? "#FFF" : "#000", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px"
                }}>
                    <Radio size={18} color="#EF4444" />
                    {playlistTitle} 
                </span>

                <div style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "6px", 
                    padding: "4px 12px", 
                    borderRadius: "100px", 
                    background: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.12)", 
                    border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)" 
                }}>
                    <Users size={12} color="#EF4444" /> 
                    <span style={{ 
                        fontFamily: monoFont, 
                        fontWeight: 900, 
                        fontSize: "0.65rem", 
                        color: "#EF4444", 
                        lineHeight: 1,
                        letterSpacing: "0.05em"
                    }}>
                        {listenersCount}
                    </span>
                </div>
            </div>

            {/* Inner Flex Container mirroring GlobalBottomPlayer */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0 32px 40px" }}>

            {/* Cover Art Container Wrapper (For Particles & Button) */}
            <div style={{ position: "relative", width: "100%", maxWidth: "240px", aspectRatio: "1/1" }}>
                {/* Static shadow wrapper — NOT animated, so browser never repaints shadow */}
                <motion.div
                    animate={{ scale: isPlaying ? 1 : 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                        width: "100%", height: "100%",
                        borderRadius: "28px", overflow: "hidden", position: "relative",
                        background: isDark 
                            ? "linear-gradient(135deg, #1E1B4B, #312E81)" 
                            : "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none",
                        boxShadow: isDark 
                            ? "0 40px 100px rgba(0,0,0,0.6)" 
                            : (isPlaying ? "0 20px 50px rgba(99, 102, 241, 0.3)" : "0 10px 30px rgba(0,0,0,0.1)"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        willChange: "transform"
                    }}
                >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)", zIndex: 1 }} />
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
                        <motion.div
                            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                            transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.5 }}
                            style={{ 
                                position: "relative",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: "180px", height: "180px",
                                willChange: "transform"
                            }}
                        >
                            <Disc 
                                size={180} 
                                color={isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.3)"} 
                            />
                            {/* Rotation Visual Aids: Vinyl Highlights */}
                            <div style={{ 
                                position: "absolute", inset: 0, 
                                background: isDark
                                    ? "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 10%, transparent 20%, transparent 50%, rgba(255,255,255,0.1) 60%, transparent 70%)"
                                    : "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 10%, transparent 20%, transparent 50%, rgba(255,255,255,0.4) 60%, transparent 70%)",
                                borderRadius: "50%",
                                zIndex: 1
                            }} />
                        </motion.div>
                    </div>

                    <BufferingOverlay />
                    <LiveVisualizer isPlaying={isPlaying} />
                </motion.div>

                {/* Floating Particles Area anchored to Cover Art */}
                <div style={{ position: "absolute", bottom: "30px", right: "-10px", width: "40px", height: "250px", pointerEvents: "none", zIndex: 10 }}>
                    <AnimatePresence>
                        {reactions.map(r => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 0, x: r.x, scale: 0.5 }}
                                animate={{ opacity: [0, 1, 0], y: -150 - Math.random() * 80, x: r.x + (Math.random() * 40 - 20), scale: [0.5, 1.2, 1] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: r.duration, ease: "easeOut" }}
                                style={{ position: "absolute", bottom: 0, right: 0 }}
                            >
                                <Heart size={24} fill="#EF4444" color="#EF4444" style={{ filter: "drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4))" }} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* React Button overlaid on Cover Art corner */}
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={handleReact}
                    style={{
                        position: "absolute", bottom: "-12px", right: "-12px", zIndex: 11,
                        width: "40px", height: "40px", borderRadius: "100px",
                        background: isDark ? "rgba(20, 20, 20, 0.6)" : "#FFF",
                        backdropFilter: "blur(20px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
                        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 8px 20px rgba(255, 71, 126, 0.25)",
                        cursor: "pointer", color: "#EF4444",
                    }}
                >
                    <Heart size={18} fill="#EF4444" />
                </motion.button>
            </div>

            {/* Gap Cover to Title (23px) */}
            <div style={{ height: "23px" }} />

            {/* Song Info */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", padding: "0 20px" }}>
                <MarqueeText 
                    text={cleanTitle}
                    fontSize="1.75rem"
                    fontWeight={900}
                    color={isDark ? "#FFF" : "#000"}
                    fontFamily={headerFont}
                    boxHeight="40px"
                />
                {labels.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                        {labels.map(label => (
                            <span key={label} style={{
                                fontSize: "0.38rem", fontFamily: headerFont, fontWeight: 800,
                                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                padding: "1.5px 6px", borderRadius: "100px",
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)"
                            }}>{label}</span>
                        ))}
                    </div>
                )}
                <p style={{ 
                    fontFamily: headerFont, 
                    fontWeight: 600, 
                    fontSize: "0.9rem", 
                    margin: 0, 
                    letterSpacing: "0.02em", 
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                    opacity: 0.8
                }}>
                    {artist}
                </p>
            </div>

            {/* Gap Title to Progress (Tight 20px) */}
            <div style={{ height: "20px" }} />

            {/* Progress Bar & Clock (Memoized & High-Frequency Isolated) */}
            <div style={{ width: "100%", padding: "0 20px" }}>
                <LivePlayerProgress isPlaying={isPlaying} />
                <LivePlayerClock />
                <AnimatePresence>
                    {nextSong && (
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ 
                                textAlign: "center", fontFamily: headerFont, fontSize: "0.75rem", fontWeight: 600, 
                                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "5px" 
                            }}
                        >
                            <span style={{ 
                                fontWeight: 900, 
                                textTransform: "uppercase", 
                                fontSize: "0.6rem", 
                                letterSpacing: "0.15em", 
                                color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", 
                                marginRight: "8px" 
                            }}>Up Next</span>
                            <div style={{ display: "inline-block", verticalAlign: "middle", width: "160px" }}>
                                <MarqueeText 
                                    text={`${nextTitle} • ${nextArtist}`}
                                    fontSize="0.75rem"
                                    fontWeight={600}
                                    color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                                    fontFamily={headerFont}
                                    boxHeight="20px"
                                    letterSpacing="0"
                                    justifyContent="flex-start"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Gap Progress to Controls (Tight 20px) */}
            <div style={{ height: "20px" }} />

            <div style={{ position: "relative", width: "100%", paddingTop: "12px", paddingBottom: "10px" }}>
                <LiveControls 
                    isWaitingForSync={isWaitingForSync}
                    isTransitioning={isTransitioning}
                    togglePlay={togglePlay}
                    isPlaying={isPlaying}
                    isSynced={isSynced}
                    refresh={refresh}
                    isDark={isDark}
                    headerFont={headerFont}
                    onShowQueue={() => setShowQueue(true)}
                />
            </div>
            
            </div> {/* End of Inner Flex layout container */}

            {/* Modal Queue (Bottom Sheet) */}
            <AnimatePresence>
                {showQueue && tracklist.length > 0 && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQueue(false)}
                            style={{
                                position: "fixed", inset: 0, zIndex: 999999,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                backdropFilter: "blur(8px)"
                            }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 280 }}
                            style={{
                                position: "fixed", inset: 0, zIndex: 999999,
                                background: isDark ? "#121212" : "#FFF",
                                borderRadius: 0,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 -20px 60px rgba(0,0,0,0.3)"
                            }}
                        >
                            {/* Header Area */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                padding: "calc(env(safe-area-inset-top) + 20px) 20px 16px",
                                borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                            }}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowQueue(false)}
                                    style={{
                                        width: "40px", height: "40px", borderRadius: "100px",
                                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "none", cursor: "pointer", marginRight: "16px"
                                    }}
                                >
                                    <ChevronLeft size={24} color={isDark ? "#FFF" : "#000"} />
                                </motion.button>
                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "#FFF" : "#000" }}>
                                        UP NEXT
                                    </div>
                                    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>
                                        {totalSongs} TRACKS • LIVE MUSIC
                                    </div>
                                </div>
                            </div>

                            <div 
                                ref={scrollContainerRef}
                                style={{ 
                                padding: "8px 0 40px", 
                                overflowY: "auto", 
                                flex: 1,
                                height: "auto"
                            }}>
                                {tracklist.map((track, i) => (
                                    <LiveTrackRow 
                                        key={i} 
                                        index={i}
                                        track={track}
                                        isDark={isDark}
                                        headerFont={headerFont}
                                        monoFont={monoFont}
                                        activeTrackRef={activeTrackRef}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
        </>
    );
}
