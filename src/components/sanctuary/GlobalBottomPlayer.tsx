"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAudio, useTime } from "@/components/AudioContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, ChevronUp, Repeat1, ListMusic, Disc, FileText, Search, Music } from "lucide-react";
import { MusicBottomNav } from "./MusicBottomNav";

export function GlobalBottomPlayer() {
    const {
        isPlaying, togglePlay, nextSong, prevSong, jumpToSong,
        currentSong, seekTo,
        shuffleMode, toggleShuffle, repeatMode, toggleRepeat,
        activePlaybackMode, activeLyrics, queue,
        isPlayerExpanded: isExpanded, setIsPlayerExpanded: setIsExpanded,
        isMiniPlayerDismissed, setMiniPlayerDismissed
    } = useAudio();
    const { theme } = useTheme();

    const { currentTime, duration, isBuffering } = useTime();

    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'cover' | 'lyrics'>('cover');
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => setIsMounted(true), []);

    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== "undefined" && sessionStorage.getItem("autoExpandPlayer") !== "true") {
             setIsExpanded(false);
        }
    }, [pathname, setIsExpanded]);

    useEffect(() => {
        if (pathname === '/music' && typeof window !== "undefined") {
            const timer = setTimeout(() => {
                if (sessionStorage.getItem("autoExpandPlayer") === "true") {
                    setIsExpanded(true);
                    sessionStorage.removeItem("autoExpandPlayer");
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [pathname, setIsExpanded]);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    if (!isMounted) return null;

    if (activePlaybackMode === 'none' || !currentSong) return null;

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const { cleanTitle: songTitle, artist: songArtist, labels } = parseSongTitle(currentSong.title);
    
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        key="expanded-player"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 250 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100dvh",
                            backgroundColor: theme === "dark" ? "#0A0A0A" : "#F8F5F2",
                            backgroundImage: theme === "dark" 
                                ? "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05), transparent 50%)"
                                : "radial-gradient(circle at 50% 20%, rgba(255, 217, 61, 0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 128, 171, 0.1), transparent 50%)",
                            zIndex: 100001,
                            display: "flex",
                            flexDirection: "column",
                            padding: "env(safe-area-inset-top) 0 0 0",
                            overflow: "hidden",
                            color: theme === "dark" ? "#FFF" : "#1A1A1A",
                            transition: "background-color 0.5s ease, color 0.5s ease"
                        }}
                    >
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "12px 0 20px 0" }} onClick={() => setIsExpanded(false)}>
                            <div style={{ width: "40px", height: "5px", backgroundColor: theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)", borderRadius: "10px" }} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "0 24px" }}>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsExpanded(false)}
                                style={{ 
                                    background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", 
                                    border: "none",
                                    padding: "8px", 
                                    cursor: "pointer", 
                                    borderRadius: "100px",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                }}
                            >
                                <ChevronDown size={22} color="currentColor" />
                            </motion.button>
                            <span style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#666" }}>
                                Now Playing
                            </span>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowQueueModal(true)}
                                    style={{ background: "transparent", border: "none", color: "currentColor", cursor: "pointer" }}
                                >
                                    <ListMusic size={22} />
                                </motion.button>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", padding: "0 32px" }}>
                            
                            <motion.div 
                                animate={{ scale: isPlaying ? 1 : 0.9, opacity: isPlaying ? 1 : 0.8 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    maxWidth: "240px",
                                    borderRadius: "28px",
                                    background: theme === "dark" 
                                        ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)" 
                                        : "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)",
                                    backdropFilter: "blur(40px)",
                                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.5)",
                                    boxShadow: theme === "dark" ? "0 40px 100px rgba(0,0,0,0.6)" : "0 20px 50px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    position: "relative"
                                }}
                            >
                                {activeTab === 'cover' ? (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                        <Disc size={120} color="rgba(0,0,0,0.05)" className={isPlaying ? "animate-spin-slow" : ""} />
                                        <div style={{ 
                                            position: "absolute", inset: 0, 
                                            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent)", 
                                            zIndex: 1 
                                        }} />
                                        <div style={{ textAlign: "center", zIndex: 2 }}>
                                             <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}>
                                                <Music size={80} color="#000" opacity={0.1} />
                                             </motion.div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ width: "100%", height: "100%", padding: "24px", overflowY: "auto", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        {activeLyrics.length > 0 ? (
                                            activeLyrics.map((lyric, idx) => {
                                                const isActive = lyric.time <= currentTime && (idx === activeLyrics.length - 1 || activeLyrics[idx + 1].time > currentTime);
                                                return (
                                                    <motion.p 
                                                        key={idx}
                                                        animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1.05 : 1 }}
                                                        style={{ 
                                                            fontFamily: headerFont, fontWeight: 800, fontSize: "1rem", margin: "12px 0", color: theme === "dark" ? "#FFF" : "#000"
                                                        }}>
                                                        {lyric.text || "♪"}
                                                    </motion.p>
                                                );
                                            })
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", opacity: 0.3 }}>
                                                <FileText size={48} strokeWidth={1} />
                                                <p style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Lyrics not available</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            <div style={{ textAlign: "center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.3rem", margin: 0, letterSpacing: "-0.03em", color: theme === "dark" ? "#FFF" : "#000" }}>{songTitle}</h2>
                                {labels.length > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                                        {labels.map(label => (
                                            <span key={label} style={{
                                                fontSize: "0.38rem",
                                                fontFamily: headerFont,
                                                fontWeight: 800,
                                                backgroundColor: "rgba(0,0,0,0.04)",
                                                color: "rgba(0,0,0,0.5)",
                                                padding: "1.5px 6px",
                                                borderRadius: "100px",
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                border: "1px solid rgba(0,0,0,0.06)",
                                                flexShrink: 0
                                            }}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.9rem", margin: 0, color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#888", opacity: 0.8 }}>{songArtist}</p>
                            </div>

                            <div style={{ width: "100%" }}>
                                <div 
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        seekTo(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration);
                                    }}
                                    style={{ width: "100%", height: "6px", backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", borderRadius: "100px", cursor: "pointer", position: "relative" }}
                                >
                                    <motion.div 
                                        style={{ height: "100%", backgroundColor: theme === "dark" ? "#FFF" : "#000", borderRadius: "100px", width: `${(currentTime / duration) * 100}%` }}
                                    />
                                    <motion.div 
                                        style={{ position: "absolute", top: "50%", left: `${(currentTime / duration) * 100}%`, width: "14px", height: "14px", backgroundColor: theme === "dark" ? "#FFF" : "#000", borderRadius: "100px", border: theme === "dark" ? "3px solid #1A1A1A" : "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transform: "translate(-50%, -50%)" }}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontFamily: monoFont, fontSize: "0.75rem", fontWeight: 700, color: "#AAA" }}>
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={toggleShuffle} style={{ background: "transparent", border: "none", color: shuffleMode ? (theme === "dark" ? "#FFF" : "#000") : "#CCC" }}>
                                    <Shuffle size={24} />
                                </motion.button>
                                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => prevSong()} style={{ background: "transparent", border: "none", color: "currentColor" }}>
                                        <SkipBack size={32} fill="currentColor" />
                                    </motion.button>
                                    <motion.button 
                                        whileTap={{ scale: 0.9 }} 
                                        onClick={togglePlay}
                                        style={{ 
                                            width: "80px", 
                                            height: "80px", 
                                            borderRadius: "100px", 
                                            background: theme === "dark" ? "#FFF" : "#000", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            border: "none", 
                                            boxShadow: theme === "dark" ? "0 20px 60px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.15)" 
                                        }}
                                    >
                                        {isPlaying 
                                            ? <Pause size={36} color={theme === "dark" ? "#000" : "#fff"} fill="currentColor" /> 
                                            : <Play size={36} color={theme === "dark" ? "#000" : "#fff"} fill="currentColor" style={{ marginLeft: "5px" }} />
                                        }
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => nextSong()} style={{ background: "transparent", border: "none", color: "currentColor" }}>
                                        <SkipForward size={32} fill="currentColor" />
                                    </motion.button>
                                </div>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={toggleRepeat} style={{ background: "transparent", border: "none", color: repeatMode !== 'off' ? (theme === "dark" ? "#FFF" : "#000") : "#CCC" }}>
                                    {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24} />}
                                </motion.button>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: "40px", padding: "20px 0 40px 0" }}>
                            <button onClick={() => setActiveTab('lyrics')} style={{ background: "transparent", border: "none", color: activeTab === 'lyrics' ? (theme === "dark" ? "#FFF" : "#000") : "#AAA", fontFamily: headerFont, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.1em" }}>LYRICS</button>
                            <button onClick={() => setActiveTab('cover')} style={{ background: "transparent", border: "none", color: activeTab === 'cover' ? (theme === "dark" ? "#FFF" : "#000") : "#AAA", fontFamily: headerFont, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.1em" }}>VISUAL</button>
                        </div>

                        <AnimatePresence>
                            {showQueueModal && (
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                    style={{
                                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: theme === "dark" ? "rgba(10, 10, 10, 0.98)" : "rgba(248, 245, 242, 0.98)", 
                                        backdropFilter: "blur(20px)",
                                        zIndex: 100005, padding: "24px", display: "flex", flexDirection: "column"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "env(safe-area-inset-top)" }}>
                                        <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.03em", color: theme === "dark" ? "#FFF" : "#1A1A1A" }}>Playing Next</span>
                                        <button onClick={() => setShowQueueModal(false)} style={{ background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", padding: "8px", borderRadius: "100px", color: "currentColor" }}><ChevronDown size={24} /></button>
                                    </div>
                                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {queue.map((song, idx) => {
                                            const isCurrent = currentSong && song.audioUrl === currentSong.audioUrl;
                                            const { cleanTitle, artist, labels: qLabels } = parseSongTitle(song.title);
                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => { jumpToSong(idx); setShowQueueModal(false); }}
                                                    style={{ 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        gap: "16px", 
                                                        padding: "12px", 
                                                        borderRadius: "16px", 
                                                        backgroundColor: isCurrent 
                                                            ? (theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)") 
                                                            : "transparent" 
                                                    }}
                                                >
                                                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Music size={18} color={isCurrent ? (theme === "dark" ? "#FFF" : "#000") : "#AAA"} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                            <div style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.95rem", color: isCurrent ? (theme === "dark" ? "#FFF" : "#000") : (theme === "dark" ? "rgba(255,255,255,0.8)" : "#333") }}>{cleanTitle}</div>
                                                            {qLabels.map(label => (
                                                                <span key={label} style={{
                                                                    fontSize: "0.35rem",
                                                                    fontFamily: headerFont,
                                                                    fontWeight: 800,
                                                                    backgroundColor: isCurrent 
                                                                        ? (theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)") 
                                                                        : (theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"),
                                                                    color: isCurrent ? (theme === "dark" ? "#FFF" : "#000") : "#888",
                                                                    padding: "1px 5px",
                                                                    borderRadius: "100px",
                                                                    letterSpacing: "0.06em",
                                                                    textTransform: "uppercase",
                                                                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                                                                    flexShrink: 0
                                                                }}>{label}</span>
                                                            ))}
                                                        </div>
                                                        <div style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.75rem", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#888" }}>{artist}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <MusicBottomNav />
        </>
    );
}

// Global Custom Animations
const globalStyles = `
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
    }
`;

if (typeof document !== 'undefined') {
    const styleTag = document.createElement('style');
    styleTag.textContent = globalStyles;
    document.head.appendChild(styleTag);
}
