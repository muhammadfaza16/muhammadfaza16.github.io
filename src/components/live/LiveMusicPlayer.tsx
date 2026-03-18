"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Radio, Disc, Music } from "lucide-react";
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
        error, togglePlay, refresh
    } = useLiveMusic();
    const { theme } = useTheme();

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

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
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* LIVE Badge + Playlist Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

            {/* Cover Art / Visualizer */}
            <div style={{
                width: "100%", aspectRatio: "1/1", maxWidth: "320px", margin: "0 auto",
                borderRadius: "28px", overflow: "hidden", position: "relative",
                background: playlistColor || (isDark ? "linear-gradient(135deg, #1E1B4B, #312E81)" : "linear-gradient(135deg, #E0E7FF, #C7D2FE)"),
                boxShadow: isDark ? "0 40px 100px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.08)"
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
                    <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "3px", zIndex: 3 }}>
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
            </div>

            {/* Song Info */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.3rem", margin: 0, letterSpacing: "-0.03em", color: isDark ? "#FFF" : "#000" }}>
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
                <p style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.9rem", margin: 0, color: isDark ? "rgba(255,255,255,0.5)" : "#888" }}>
                    {artist}
                </p>
            </div>

            {/* Progress Bar (non-interactive, radio-style) */}
            <div style={{ width: "100%", padding: "0 8px" }}>
                <div style={{
                    width: "100%", height: "4px", borderRadius: "100px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}>
                    <motion.div
                        style={{ height: "100%", backgroundColor: "#EF4444", borderRadius: "100px", width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontFamily: monoFont, fontSize: "0.7rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                    <span>{fmtTime(currentTime)}</span>
                    <span>{fmtTime(currentSong.duration)}</span>
                </div>
            </div>

            {/* Play/Pause Control */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                {isWaitingForSync ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        style={{
                            width: "72px", height: "72px", borderRadius: "100px",
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
                            width: "72px", height: "72px", borderRadius: "100px",
                            background: isDark ? "#FFF" : "#000",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "none", cursor: "pointer",
                            boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.15)"
                        }}
                    >
                        {isPlaying
                            ? <Pause size={32} color={isDark ? "#000" : "#fff"} fill="currentColor" />
                            : <Play size={32} color={isDark ? "#000" : "#fff"} fill="currentColor" style={{ marginLeft: "4px" }} />
                        }
                    </motion.button>
                )}
            </div>

            {/* Track counter */}
            <div style={{ textAlign: "center", fontFamily: monoFont, fontWeight: 700, fontSize: "0.65rem", color: isWaitingForSync ? "#EF4444" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)") }}>
                {isWaitingForSync ? (
                    <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        SYNCING BROADCAST...
                    </motion.span>
                ) : (
                    `TRACK ${songIndex + 1} OF ${totalSongs}`
                )}
            </div>

            {/* Queue Preview */}
            {tracklist.length > 0 && (
                <div style={{
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.04)",
                    borderRadius: "20px", overflow: "hidden"
                }}>
                    <div style={{
                        padding: "12px 16px",
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.04)",
                        display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                        <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "#FFF" : "#000" }}>
                            UP NEXT
                        </span>
                        <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                            {totalSongs} TRACKS
                        </span>
                    </div>
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                        {tracklist.map((track, i) => {
                            const { cleanTitle: tTitle, artist: tArtist } = parseSongTitle(track.title);
                            return (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: "12px",
                                    padding: "10px 16px",
                                    backgroundColor: track.isCurrent ? (isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)") : "transparent",
                                    borderBottom: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.02)"
                                }}>
                                    <div style={{
                                        width: "20px", textAlign: "center", fontFamily: monoFont,
                                        fontWeight: 700, fontSize: "0.6rem",
                                        color: track.isCurrent ? "#EF4444" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")
                                    }}>
                                        {track.isCurrent ? (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Music size={14} color="#EF4444" />
                                            </motion.div>
                                        ) : (
                                            (i + 1).toString().padStart(2, "0")
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: headerFont, fontWeight: 800, fontSize: "0.8rem",
                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                            color: track.isCurrent ? (isDark ? "#FFF" : "#000") : (isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)")
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
                                    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                                        {fmtTime(track.duration)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
