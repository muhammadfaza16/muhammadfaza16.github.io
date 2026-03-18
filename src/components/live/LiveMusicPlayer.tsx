"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Radio, Disc, Music, ListMusic, ChevronDown } from "lucide-react";
import { useLiveMusic } from "./LiveMusicContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";

function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function LiveMusicPlayer() {
    const {
        isLive, isPlaying, isLoading, isBuffering, isWaitingForSync,
        currentSong, currentTime, songIndex, totalSongs,
        playlistTitle, playlistCover, playlistColor, tracklist,
        error, togglePlay, refresh, isSynced
    } = useLiveMusic();
    const { theme } = useTheme();
    const [showQueue, setShowQueue] = React.useState(false);

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
    const progress = currentSong.duration ? (currentTime / currentSong.duration) * 100 : 0;

    return (
        <>
            {/* Ambient Dynamic Background */}
            <AnimatePresence>
                {playlistCover && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDark ? 0.4 : 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        style={{
                            position: "absolute",
                            inset: "-150px",
                            zIndex: 0,
                            pointerEvents: "none",
                            backgroundImage: `url(${playlistCover})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(100px) saturate(150%)",
                            transform: "scale(1.2)"
                        }}
                    >
                        <motion.div
                            animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                            style={{ width: "100%", height: "100%", background: "inherit" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div style={{ position: "absolute", inset: "-150px", zIndex: 0, pointerEvents: "none", backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }} />

            <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {/* LIVE Badge + Playlist Info - Placed at top */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px 16px" }}>
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{
                        width: "10px", height: "10px", borderRadius: "50%",
                        backgroundColor: "#EF4444",
                        boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)"
                    }}
                />
                <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#EF4444" }}>
                    LIVE
                </span>
                <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                    {playlistTitle}
                </span>
            </div>

            {/* Inner Flex Container mirroring GlobalBottomPlayer */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", padding: "0 32px", paddingBottom: "32px" }}>

            {/* Cover Art / Visualizer */}
            <motion.div 
                animate={{ scale: isPlaying ? [1, 1.03, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                style={{
                width: "100%", aspectRatio: "1/1", maxWidth: "240px",
                borderRadius: "28px", overflow: "hidden", position: "relative",
                background: playlistColor || (isDark ? "linear-gradient(135deg, #1E1B4B, #312E81)" : "linear-gradient(135deg, #E0E7FF, #C7D2FE)"),
                boxShadow: isDark ? "0 30px 80px rgba(0,0,0,0.7)" : "0 20px 60px rgba(0,0,0,0.3)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                {playlistCover && (
                    <img src={playlistCover} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} alt="" />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)", zIndex: 1 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    >
                        <Disc size={100} color="rgba(255,255,255,0.15)" />
                    </motion.div>
                </div>

                {/* Audio Visualizer Bars */}
                {isPlaying && (
                    <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: "3px", zIndex: 3, height: "40px" }}>
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [8, 20 + Math.random() * 16, 8] }}
                                transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: "easeInOut" }}
                                style={{
                                    width: "4px", borderRadius: "100px",
                                    backgroundColor: "rgba(255,255,255,0.7)"
                                }}
                            />
                        ))}
                    </div>
                )}

                {isBuffering && (
                    <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.4)", zIndex: 4
                    }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Disc size={32} color="#fff" />
                        </motion.div>
                    </div>
                )}
            </motion.div>

            {/* Song Info */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.5rem", margin: 0, letterSpacing: "-0.04em", color: isDark ? "#FFF" : "#000" }}>
                    {cleanTitle}
                </h2>
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
                <p style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "0.95rem", margin: 0, letterSpacing: "0.02em", color: isDark ? "rgba(255,255,255,0.6)" : "#666" }}>
                    {artist}
                </p>
            </div>

            {/* Progress Bar (non-interactive, radio-style) */}
            <div style={{ width: "100%" }}>
                <div style={{
                    width: "100%", height: "6px", borderRadius: "100px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
                    overflow: "hidden"
                }}>
                    <motion.div
                        style={{ 
                            height: "100%", backgroundColor: "#EF4444", borderRadius: "100px", width: `${Math.min(progress, 100)}%`,
                            boxShadow: isPlaying ? "0 0 12px rgba(239, 68, 68, 0.8)" : "none"
                        }}
                        transition={{ duration: 0.25, ease: "linear" }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                    <span>{fmtTime(currentTime)}</span>
                    <span>{fmtTime(currentSong.duration)}</span>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 10px" }}>
                {/* Left: Queue Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowQueue(true)}
                    style={{
                        width: "48px", height: "48px", borderRadius: "100px",
                        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(20px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        color: isDark ? "#FFF" : "#000",
                    }}
                >
                    <ListMusic size={20} />
                </motion.button>

                {/* Center: Play/Pause */}
                {isWaitingForSync ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        style={{
                            width: "80px", height: "80px", borderRadius: "100px",
                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <Radio size={32} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} />
                    </motion.div>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        style={{
                            width: "80px", height: "80px", borderRadius: "100px",
                            background: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
                            backdropFilter: "blur(30px)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.1)"
                        }}
                    >
                        {isPlaying
                            ? <Pause size={36} color={isDark ? "#FFF" : "#000"} fill="currentColor" />
                            : <Play size={36} color={isDark ? "#FFF" : "#000"} fill="currentColor" style={{ marginLeft: "6px" }} />
                        }
                    </motion.button>
                )}

                {/* Right: LIVE Indicator / Sync Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={refresh}
                    style={{
                        padding: "0 12px", height: "48px", borderRadius: "100px",
                        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(20px)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                        display: "flex", alignItems: "center", gap: "8px",
                        cursor: "pointer",
                        color: isDark ? "#FFF" : "#000",
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
                                position: "fixed", inset: 0, zIndex: 9998,
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
                                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
                                background: isDark ? "#121212" : "#FFF",
                                borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
                                height: "100svh", overflow: "hidden",
                                boxShadow: "0 -20px 60px rgba(0,0,0,0.3)"
                            }}
                        >
                            {/* Down Arrow / Close Indicator */}
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "8px" }}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowQueue(false)}
                                    style={{
                                        width: "48px", height: "48px", borderRadius: "100px",
                                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "none", cursor: "pointer",
                                    }}
                                >
                                    <ChevronDown size={28} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"} />
                                </motion.button>
                            </div>

                            <div style={{
                                padding: "8px 20px 24px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                            }}>
                                <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "#FFF" : "#000" }}>
                                    UP NEXT
                                </span>
                                <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.65rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                                    {totalSongs} TRACKS
                                </span>
                            </div>

                            <div 
                                ref={scrollContainerRef}
                                style={{ 
                                padding: "8px 0 40px", 
                                overflowY: "auto", 
                                maxHeight: "calc(85vh - 80px)" 
                            }}>
                                {tracklist.map((track, i) => {
                                    const { cleanTitle: tTitle, artist: tArtist } = parseSongTitle(track.title);
                                    return (
                                        <div 
                                            key={i} 
                                            ref={track.isCurrent ? activeTrackRef : null}
                                            style={{
                                            display: "flex", alignItems: "center", gap: "12px",
                                            padding: "12px 20px",
                                            backgroundColor: track.isCurrent ? (isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)") : "transparent",
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
                                                    (i + 1).toString().padStart(2, "0")
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem",
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                    color: track.isCurrent ? (isDark ? "#FFF" : "#000") : (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)")
                                                }}>
                                                    {tTitle}
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
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
        </>
    );
}
