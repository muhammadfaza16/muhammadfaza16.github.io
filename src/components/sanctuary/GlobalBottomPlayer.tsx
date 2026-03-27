"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAudio, useTime } from "@/components/AudioContext";
import { useLiveMusic } from "@/components/live/LiveMusicContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, ChevronUp, Repeat1, ListMusic, Disc, FileText, Search, Music, X } from "lucide-react";
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
    const [queueSearchQuery, setQueueSearchQuery] = useState("");

    // Reset queue search when modal closes
    useEffect(() => {
        if (!showQueueModal) setQueueSearchQuery("");
    }, [showQueueModal]);

    const filteredQueue = useMemo(() => {
        if (!queueSearchQuery) return queue.map((s, i) => ({ ...s, originalIdx: i }));
        const q = queueSearchQuery.toLowerCase();
        return (queue as any[])
            .map((s, i) => ({ ...s, originalIdx: i }))
            .filter(song => 
                song.title.toLowerCase().includes(q) || 
                (song.artist && song.artist.toLowerCase().includes(q))
            );
    }, [queue, queueSearchQuery]);

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
                            inset: 0,
                            backgroundColor: theme === "dark" ? "#0A0A0A" : "#F8F5F2",
                            backgroundImage: theme === "dark" 
                                ? "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05), transparent 50%)"
                                : "radial-gradient(circle at 50% 20%, rgba(255, 217, 61, 0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 128, 171, 0.1), transparent 50%)",
                            zIndex: 999999,
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
                                        <motion.div
                                            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                                            transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.5 }}
                                            style={{ 
                                                position: "relative",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                width: "160px", height: "160px",
                                                willChange: "transform"
                                            }}
                                        >
                                            <Disc 
                                                size={160} 
                                                color={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"} 
                                            />
                                            {/* Rotation Visual Aids: Vinyl Highlights */}
                                            <div style={{ 
                                                position: "absolute", inset: 0, 
                                                background: theme === "dark"
                                                    ? "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.05) 10%, transparent 20%, transparent 50%, rgba(255,255,255,0.05) 60%, transparent 70%)"
                                                    : "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 10%, transparent 20%, transparent 50%, rgba(255,255,255,0.4) 60%, transparent 70%)",
                                                borderRadius: "50%",
                                                zIndex: 1
                                            }} />
                                        </motion.div>
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
                                                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                                color: theme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                                padding: "1.5px 6px",
                                                borderRadius: "100px",
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                border: "1px solid " + (theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"),
                                                flexShrink: 0
                                            }}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.9rem", margin: 0, color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#888", opacity: 0.8 }}>{songArtist}</p>
                            </div>

                            <div style={{ width: "100%", position: "relative" }}>
                                <div 
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        seekTo(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration);
                                    }}
                                    style={{ 
                                        width: "100%", 
                                        height: "6px", 
                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)", 
                                        borderRadius: "100px", 
                                        cursor: "pointer", 
                                        position: "relative",
                                        overflow: "visible"
                                    }}
                                >
                                    {/* Progress Fill with Glow */}
                                    <motion.div 
                                        initial={false}
                                        animate={{ 
                                            width: `${(currentTime / duration) * 100}%`,
                                            backgroundColor: isPlaying 
                                                ? (theme === "dark" ? "#818CF8" : "#6366F1")
                                                : (theme === "dark" ? "#FFF" : "#000")
                                        }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                        style={{ 
                                            height: "100%", 
                                            borderRadius: "100px",
                                            position: "relative",
                                            boxShadow: isPlaying && theme === "dark" ? "0 0 15px rgba(129, 140, 248, 0.4)" : "none"
                                        }}
                                    />
                                    
                                    {/* Playhead (Knob) */}
                                    <motion.div 
                                        initial={false}
                                        animate={{ 
                                            left: `${(currentTime / duration) * 100}%`,
                                            x: "-50%",
                                            y: "-50%",
                                            scale: isPlaying ? [1, 1.15, 1] : 1
                                        }}
                                        transition={{ 
                                            left: { type: "spring", bounce: 0, duration: 0.3 },
                                            scale: isPlaying ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.2 }
                                        }}
                                        style={{ 
                                            position: "absolute", 
                                            top: "50%", 
                                            width: "16px", 
                                            height: "16px", 
                                            backgroundColor: theme === "dark" ? "#FFF" : "#000", 
                                            borderRadius: "100px", 
                                            border: theme === "dark" ? "3px solid #1A1A1A" : "3px solid #fff", 
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)", 
                                            zIndex: 5
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontFamily: monoFont, fontSize: "0.75rem", fontWeight: 700, color: theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)" }}>
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
                                <motion.button 
                                    whileHover={{ scale: 1.2, rotate: -10 }}
                                    whileTap={{ scale: 0.9 }} 
                                    onClick={toggleShuffle} 
                                    style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        color: shuffleMode 
                                            ? (theme === "dark" ? "#818CF8" : "#6366F1") 
                                            : (theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"),
                                        filter: shuffleMode ? (theme === "dark" ? "drop-shadow(0 0 12px rgba(129,140,248,0.6))" : "drop-shadow(0 0 8px rgba(99,102,241,0.3))") : "none",
                                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    }}
                                >
                                    <Shuffle size={24} strokeWidth={shuffleMode ? 3 : 2} />
                                </motion.button>
                                <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
                                    <motion.button 
                                        whileHover={{ scale: 1.1, x: -4 }}
                                        whileTap={{ scale: 0.9 }} 
                                        onClick={() => prevSong()} 
                                        style={{ background: "transparent", border: "none", color: "currentColor", cursor: "pointer" }}
                                    >
                                        <SkipBack size={32} fill="currentColor" />
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05, boxShadow: theme === "dark" ? "0 25px 70px rgba(0,0,0,0.7)" : "0 15px 40px rgba(0,0,0,0.2)" }}
                                        whileTap={{ scale: 0.92 }} 
                                        onClick={togglePlay}
                                        style={{ 
                                            width: "84px", 
                                            height: "84px", 
                                            borderRadius: "100px", 
                                            background: theme === "dark" ? "#FFF" : "#000", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            border: "none", 
                                            cursor: "pointer",
                                            boxShadow: theme === "dark" ? "0 20px 60px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.15)",
                                            transition: "box-shadow 0.3s ease"
                                        }}
                                    >
                                        {isPlaying 
                                            ? <Pause size={38} color={theme === "dark" ? "#000" : "#fff"} fill="currentColor" /> 
                                            : <Play size={38} color={theme === "dark" ? "#000" : "#fff"} fill="currentColor" style={{ marginLeft: "6px" }} />
                                        }
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.1, x: 4 }}
                                        whileTap={{ scale: 0.9 }} 
                                        onClick={() => nextSong()} 
                                        style={{ background: "transparent", border: "none", color: "currentColor", cursor: "pointer" }}
                                    >
                                        <SkipForward size={32} fill="currentColor" />
                                    </motion.button>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }} 
                                    onClick={toggleRepeat} 
                                    style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        color: repeatMode !== 'off' 
                                            ? (theme === "dark" ? "#A78BFA" : "#8B5CF6") 
                                            : (theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"),
                                        filter: repeatMode !== 'off' ? (theme === "dark" ? "drop-shadow(0 0 12px rgba(167,139,250,0.6))" : "drop-shadow(0 0 8px rgba(139,92,246,0.3))") : "none",
                                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    }}
                                >
                                    {repeatMode === 'one' ? <Repeat1 size={24} strokeWidth={3} /> : <Repeat size={24} strokeWidth={repeatMode === 'all' ? 3 : 2} />}
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
                                        position: "absolute", inset: 0,
                                        backgroundColor: theme === "dark" ? "rgba(10, 10, 10, 0.98)" : "rgba(248, 245, 242, 0.98)", 
                                        backdropFilter: "blur(20px)",
                                        zIndex: 100005, padding: "24px 24px 0", display: "flex", flexDirection: "column"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", marginTop: "env(safe-area-inset-top)" }}>
                                        <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.03em", color: theme === "dark" ? "#FFF" : "#1A1A1A" }}>Playing Next</span>
                                        <button onClick={() => setShowQueueModal(false)} style={{ background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", padding: "8px", borderRadius: "100px", color: "currentColor" }}><ChevronDown size={24} /></button>
                                    </div>

                                    {/* Queue Search Bar */}
                                    <div style={{ 
                                        marginBottom: "0px",
                                        padding: "10px 14px",
                                        background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                                    }}>
                                        <Search size={16} color="#888" />
                                        <input 
                                            type="text"
                                            placeholder="Search in queue..."
                                            value={queueSearchQuery}
                                            onChange={(e) => setQueueSearchQuery(e.target.value)}
                                            style={{
                                                flex: 1,
                                                background: "none",
                                                border: "none",
                                                outline: "none",
                                                color: "currentColor",
                                                fontFamily: headerFont,
                                                fontSize: "0.9rem",
                                                fontWeight: 600
                                            }}
                                        />
                                        {queueSearchQuery && (
                                            <button onClick={() => setQueueSearchQuery("")} style={{ background: "none", border: "none", color: "#888" }}><X size={16} /></button>
                                        )}
                                    </div>

                                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "100px" }}>
                                        {filteredQueue.map((song, idx) => {
                                            const isCurrent = currentSong && song.audioUrl === currentSong.audioUrl;
                                            const { cleanTitle, artist, labels: qLabels } = parseSongTitle(song.title);
                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => { jumpToSong(song.originalIdx); setShowQueueModal(false); }}
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
                                                                    padding: "1px 6px",
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
