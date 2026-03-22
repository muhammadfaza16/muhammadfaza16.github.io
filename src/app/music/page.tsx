"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { ListMusic, ChevronLeft, ArrowRight, Sparkles, LibraryBig, Music, Play, Pause, Disc, Radio } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAudio, useTime } from "@/components/AudioContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const MENU_ITEMS = [
    { id: "songs", label: "All Songs", subtitle: "Full Library", icon: LibraryBig, href: "/music/playlist/all" },
    { id: "playlists", label: "Playlists", subtitle: "Curated Sets", icon: ListMusic, href: "/music/playlist" },
];

export default function AudioHubPage() {
    const { currentSong, isPlaying, togglePlay, setIsPlayerExpanded } = useAudio();
    const { currentTime, duration } = useTime();
    const { theme } = useTheme();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);

    const [dbSongs, setDbSongs] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    
    // Fetch playlists from Database via API
    useEffect(() => {
        fetch("/api/music/playlists")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.playlists) {
                    setPlaylists(data.playlists);
                }
            })
            .catch(() => { });
    }, []);

    const CACHE_KEY = "music_hub_scroll_v1";


    // Restore scroll position
    useEffect(() => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.scrollY) {
                    setTimeout(() => {
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollTop = parsed.scrollY;
                            scrollYRef.current = parsed.scrollY;
                        }
                    }, 100);
                }
            }
        } catch (e) {
            console.error("Failed to restore scroll position", e);
        }
    }, []);

    // Save scroll position on unmount
    useEffect(() => {
        return () => {
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ scrollY: scrollYRef.current }));
            } catch (e) { }
        };
    }, []);

    const cardStyle = {
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "24px",
        boxShadow: theme === "dark" ? "0 15px 45px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)"
    };

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <main style={{
            height: "100svh",
            backgroundColor: theme === "dark" ? "#0A0A0A" : "#F8F5F2",
            backgroundImage: theme === "dark" 
                ? "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0, transparent 50%)"
                : "radial-gradient(at 50% 0%, rgba(255, 255, 255, 0.6) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.3) 0, transparent 50%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: theme === "dark" ? "#FFFFFF" : "#1A1A1A",
            transition: "all 0.5s ease"
        }}>
            <div
                id="music-scroll-container"
                ref={scrollContainerRef}
                onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 16px 140px 16px",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    scrollbarGutter: "stable"
                }}
            >
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}>

                    {/* Entrance Text (Hero Typography) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <Link href="/" style={{ textDecoration: "none" }}>
                                <motion.div 
                                    whileHover={{ x: -4 }}
                                    style={{ 
                                        display: "inline-flex", alignItems: "center", gap: "8px", 
                                        color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                                        fontFamily: headerFont, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.div>
                            </Link>
                            <h1 style={{ 
                                fontFamily: headerFont, fontWeight: 900, fontSize: "2.5rem", lineHeight: 1, margin: 0,
                                letterSpacing: "-0.05em", color: theme === "dark" ? "#FFF" : "#000"
                            }}>
                                Your<br />Soundscape.
                            </h1>
                        </div>
                        <div style={{ 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", borderRadius: "100px",
                            background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                            border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
                        }}>
                            <ThemeToggle transparent />
                        </div>
                    </div>

                {/* Home Dashboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    
                    {/* Music Activity Widget (Multifunctional) */}
                    <div style={{ perspective: "1000px" }}>
                    <AnimatePresence mode="wait" initial={false}>
                        {currentSong && (
                            <motion.div
                                key="active-vibe-refined"
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                whileHover={{ scale: 1.02, y: -4, rotateX: 2, rotateY: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                style={{
                                    ...cardStyle,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0px",
                                    padding: "0px",
                                    backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.45)",
                                    backdropFilter: "blur(24px) saturate(180%)",
                                    border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.5)",
                                    boxShadow: theme === "dark"
                                        ? "0 25px 50px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) inset"
                                        : isPlaying 
                                            ? "0 25px 50px rgba(0,0,0,0.06), 0 0 1px rgba(255,255,255,0.8) inset" 
                                            : "0 8px 24px rgba(0,0,0,0.03)",
                                    overflow: "hidden",
                                    position: "relative"
                                }}
                            >
                                {/* Top Gloss Highlight */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "1px",
                                    background: "linear-gradient(to right, transparent, rgba(255,255,255,0.7) 50%, transparent)",
                                    zIndex: 5
                                }} />

                                {/* Subtitle Bar (Slimmer) */}
                                <div style={{ 
                                    padding: "10px 18px", 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center",
                                    background: isPlaying ? "rgba(0,0,0,0.01)" : "transparent",
                                    borderBottom: "1px solid rgba(0,0,0,0.02)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <motion.div 
                                            animate={isPlaying ? { 
                                                scale: [1, 1.3, 1],
                                                opacity: [1, 0.6, 1]
                                            } : {
                                                opacity: [0.4, 1, 0.4],
                                                scale: [1, 1.5, 1]
                                            }}
                                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                            style={{ 
                                                width: "6px", 
                                                height: "6px", 
                                                borderRadius: "50%", 
                                                backgroundColor: "#6366F1", 
                                            }} 
                                        />
                                        <span style={{ 
                                            fontFamily: headerFont, 
                                            fontWeight: 800, 
                                            fontSize: "0.55rem", 
                                            letterSpacing: "0.12em", 
                                            color: isPlaying 
                                                ? (theme === "dark" ? "#FFF" : "#000") 
                                                : (theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
                                            textTransform: "uppercase"
                                        }}>
                                            Continue Listening
                                        </span>
                                    </div>
                                    
                                    {isPlaying && (
                                        <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px" }}>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ 
                                                        height: [3, 8, 4, 10, 3, 7, 3][(i + Math.floor(Date.now()/500)) % 7],
                                                    }}
                                                    transition={{ 
                                                        repeat: Infinity, 
                                                        duration: 0.5 + (i * 0.1),
                                                        ease: "linear",
                                                        repeatType: "reverse"
                                                    }}
                                                    style={{ 
                                                        width: "2px", 
                                                        background: "linear-gradient(to top, #6366F1, #8B5CF6)",
                                                        borderRadius: "4px"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Main Interaction Area (Tighter) */}
                                <div 
                                    onClick={() => setIsPlayerExpanded(true)}
                                    style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "16px", 
                                        padding: "16px",
                                        cursor: "pointer",
                                        position: "relative"
                                    }}
                                >
                                    <div style={{ position: "relative" }}>
                                        {/* Iridescent Aura (Subtle) */}
                                        <motion.div 
                                            animate={isPlaying ? {
                                                rotate: 360,
                                                opacity: [0.1, 0.2, 0.1]
                                            } : { opacity: 0 }}
                                            transition={{ rotate: { repeat: Infinity, duration: 15, ease: "linear" }, opacity: { repeat: Infinity, duration: 5 } }}
                                            style={{
                                                position: "absolute",
                                                inset: -10,
                                                borderRadius: "20px",
                                                background: "conic-gradient(from 0deg, #6366F1, #8B5CF6, #EC4899, #6366F1)",
                                                filter: "blur(16px)",
                                                zIndex: 0
                                            }}
                                        />
                                        
                                        {/* Vibe Core (Smaller) */}
                                        <div style={{ 
                                            width: "52px", 
                                            height: "52px", 
                                            borderRadius: "14px",
                                            background: isPlaying ? "#1E1B4B" : "rgba(0,0,0,0.04)",
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center",
                                            boxShadow: isPlaying ? "0 10px 20px rgba(0,0,0,0.15)" : "none",
                                            position: "relative",
                                            zIndex: 1,
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            overflow: "hidden"
                                        }}>
                                            {isPlaying && (
                                                <motion.div 
                                                   animate={{
                                                       background: [
                                                           "radial-gradient(at 0% 0%, #6366F1 0, transparent 70%), radial-gradient(at 100% 100%, #8B5CF6 0, transparent 70%)",
                                                           "radial-gradient(at 100% 0%, #6366F1 0, transparent 70%), radial-gradient(at 0% 100%, #8B5CF6 0, transparent 70%)"
                                                       ]
                                                   }}
                                                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                   style={{ position: "absolute", inset: 0, opacity: 0.4 }}
                                                />
                                            )}
                                            <Disc 
                                                className={isPlaying ? "animate-spin-slow" : ""} 
                                                size={24} 
                                                color={isPlaying ? "#fff" : "#6366F1"} 
                                                style={{ zIndex: 2, opacity: isPlaying ? 0.9 : 1 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                                        <AnimatePresence mode="wait" initial={false}>
                                            {currentSong && (() => {
                                                const { cleanTitle, artist, labels } = parseSongTitle(currentSong.title);
                                                return (
                                                    <motion.div 
                                                        key={currentSong.title}
                                                        initial={{ y: 5, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -5, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                                <div style={{ 
                                                                    fontFamily: headerFont, 
                                                                    fontWeight: 600, 
                                                                    fontSize: "0.95rem", 
                                                                    color: theme === "dark" ? "#FFF" : "#000",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    letterSpacing: "-0.015em",
                                                                    lineHeight: 1.1
                                                                }}>
                                                                    {cleanTitle}
                                                                </div>
                                                                {labels.map(label => (
                                                                    <span key={label} style={{
                                                                        fontSize: "0.45rem",
                                                                        fontFamily: headerFont,
                                                                        fontWeight: 700,
                                                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                                                        color: theme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                                                        padding: "3px 8px",
                                                                        borderRadius: "100px",
                                                                        letterSpacing: "0.04em",
                                                                        textTransform: "uppercase",
                                                                        border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.06)",
                                                                        flexShrink: 0
                                                                    }}>{label}</span>
                                                                ))}
                                                            </div>
                                                            <div style={{ 
                                                                fontFamily: headerFont, 
                                                                fontWeight: 500, 
                                                                fontSize: "0.75rem", 
                                                                color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
                                                                letterSpacing: "0.01em"
                                                            }}>
                                                                {artist}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })()}
                                        </AnimatePresence>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlay();
                                        }}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: isPlaying ? (theme === "dark" ? "#6366F1" : "#000") : (theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"),
                                            border: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            zIndex: 2,
                                            color: isPlaying ? "#fff" : (theme === "dark" ? "#fff" : "#000")
                                        }}
                                    >
                                        {isPlaying ? (
                                            <Pause size={18} fill="currentColor" stroke="none" />
                                        ) : (
                                            <Play size={18} fill="currentColor" stroke="none" style={{ marginLeft: "2px" }} />
                                        )}
                                    </motion.button>
                                </div>

                                {/* Slim Fluid Progress */}
                                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(0,0,0,0.02)", position: "relative" }}>
                                    <motion.div 
                                        initial={false}
                                        animate={{ width: `${(currentTime / duration) * 100}%` }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                        style={{ 
                                            height: "100%", 
                                            background: isPlaying 
                                                ? "linear-gradient(to right, #6366F1, #8B5CF6)" 
                                                : "rgba(0,0,0,0.1)",
                                            position: "relative"
                                        }} 
                                    >
                                        {isPlaying && (
                                            <motion.div 
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                style={{
                                                    position: "absolute",
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: "10px",
                                                    background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4))",
                                                    zIndex: 10
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </div>

                    {/* Library Section */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "4px" }}>
                            <LibraryBig size={16} color={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
                            <span style={{ 
                                fontFamily: headerFont, 
                                fontWeight: 800, 
                                fontSize: "0.7rem", 
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" 
                            }}>Browse Library</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", perspective: "1000px" }}>
                            {/* Hero Card: Live Music */}
                            <Link href="/music/live-hub" style={{ textDecoration: "none", gridColumn: "span 2" }}>
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.01, rotateX: 2 }}
                                    whileTap={{ scale: 0.99 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    style={{
                                        ...cardStyle,
                                        background: theme === "dark" 
                                            ? "rgba(255, 255, 255, 0.03)" 
                                            : "rgba(255, 255, 255, 0.7)",
                                        border: theme === "dark" ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(30, 27, 75, 0.08)",
                                        padding: "24px",
                                        position: "relative",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                        boxShadow: theme === "dark" ? "0 20px 40px rgba(0,0,0,0.3)" : "0 10px 24px rgba(30, 27, 75, 0.04)"
                                    }}
                                >

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ 
                                                    width: "48px", height: "48px", borderRadius: "16px",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    background: "linear-gradient(135deg, #450A0A, #7F1D1D)",
                                                    color: "#fff", boxShadow: "0 10px 20px rgba(69, 10, 10, 0.2)",
                                                    position: "relative", overflow: "hidden"
                                                }}>
                                                    <div style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        background: "radial-gradient(circle at 10% 10%, rgba(239, 68, 68, 0.45), transparent 80%)",
                                                    }} />
                                                    <Radio size={24} style={{ position: "relative", zIndex: 1 }} />
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <h2 style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "1.1rem", color: theme === "dark" ? "#FFF" : "#000", margin: 0, letterSpacing: "-0.015em" }}>Live Music</h2>
                                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
                                                    </div>
                                                    <p style={{ margin: 0, fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Music Stations & Hub</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)", 
                                            padding: "0 10px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                                            borderRadius: "100px", border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
                                        }}>
                                            <span style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 800, color: theme === "dark" ? "#FFF" : "#000", letterSpacing: "0.05em", lineHeight: 1 }}>LIVE NOW</span>
                                        </div>
                                    </div>

                                    <div style={{ position: "relative", zIndex: 1 }}>
                                        <p style={{ 
                                            margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 600, 
                                            lineHeight: 1.5, color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                                            maxWidth: "280px"
                                        }}>
                                            Join the live broadcast. Listen together with everyone else in real-time.
                                        </p>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1, marginTop: "4px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", textTransform: "uppercase" }}>Music Status: Active</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span style={{ fontFamily: headerFont, fontSize: "0.8rem", fontWeight: 900, color: theme === "dark" ? "#FFF" : "#000" }}>GO TO HUB</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Standard Library Cards */}
                            {MENU_ITEMS.map((item, idx) => (
                                <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ 
                                            y: -4, 
                                            scale: 1.02, 
                                            rotateX: 2,
                                            rotateY: idx === 0 ? 2 : -2,
                                            backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.9)" 
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        style={{
                                            ...cardStyle,
                                            backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            padding: "12px 16px"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ 
                                                width: "40px", 
                                                height: "40px", 
                                                borderRadius: "12px",
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "center", 
                                                background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", 
                                                color: "#fff",
                                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                                position: "relative",
                                                overflow: "hidden"
                                            }}>
                                                <div style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background: "radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.4), transparent 70%)",
                                                }} />
                                                <item.icon size={18} style={{ position: "relative", zIndex: 1 }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1px", flex: 1 }}>
                                                <span style={{ 
                                                    fontFamily: headerFont, 
                                                    fontWeight: 700, 
                                                    fontSize: "0.9rem", 
                                                    color: theme === "dark" ? "#FFF" : "#000", 
                                                    letterSpacing: "-0.015em" 
                                                }}>{item.label}</span>
                                                    <span style={{ 
                                                        fontFamily: headerFont, 
                                                        fontWeight: 500, 
                                                        fontSize: "0.6rem", 
                                                        color: theme === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)", 
                                                        letterSpacing: "0.01em"
                                                    }}>{item.id === "songs" ? "All Tracks" : "Sets"}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", justifyContent: "space-between", paddingLeft: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Disc size={16} color={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
                                <span style={{ 
                                    fontFamily: headerFont, 
                                    fontWeight: 800, 
                                    fontSize: "0.7rem", 
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
                                }}>Featured Playlists</span>
                            </div>
                            <Link href="/music/playlist" style={{ 
                                fontFamily: headerFont, 
                                fontSize: "0.65rem", 
                                fontWeight: 800, 
                                color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#AAA", 
                                textDecoration: "none",
                                letterSpacing: "0.05em"
                            }}>SEE ALL</Link>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {playlists.slice(0, 4).map((playlist) => (
                                <Link key={playlist.slug || playlist.id} href={`/music/playlist/${playlist.slug || playlist.id}`} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1/1",
                                            backgroundColor: playlist.coverColor || "#1E1B4B",
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            cursor: "pointer",
                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                                            border: "1px solid rgba(255,255,255,0.2)"
                                        }}
                                    >
                                        {playlist.coverImage && (
                                            <img
                                                src={playlist.coverImage}
                                                style={{ 
                                                    width: "100%", height: "100%", objectFit: "cover", 
                                                    position: "absolute", inset: 0, zIndex: 0, 
                                                    opacity: 0.85 
                                                }}
                                                className="mix-blend-multiply" 
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                        {/* Premium Masking Overlays */}
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 100%)",
                                            zIndex: 1
                                        }} />
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
                                            zIndex: 1
                                        }} />
                                        
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: "16px",
                                            zIndex: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "2px"
                                        }}>
                                            <div style={{ 
                                                color: "#fff", 
                                                fontWeight: 900, 
                                                fontSize: "0.8rem", 
                                                fontFamily: headerFont, 
                                                textTransform: "uppercase", 
                                                letterSpacing: "-0.02em", 
                                                lineHeight: 1
                                            }}>
                                                {playlist.title}
                                            </div>
                                            <div style={{ 
                                                color: "rgba(255,255,255,0.7)", 
                                                fontSize: "0.55rem", 
                                                fontFamily: monoFont, 
                                                fontWeight: 800,
                                                letterSpacing: "0.02em"
                                            }}>
                                                {playlist._count?.songs !== undefined ? `${playlist._count.songs} TRACKS` : playlist.vibes?.[0]}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </main>
    );
}

// Global Custom Animations
const globalStyles = `
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
        animation: spin-slow 15s linear infinite;
    }
    @keyframes colorful-shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
    }
`;

if (typeof document !== 'undefined') {
    const styleTag = document.createElement('style');
    styleTag.textContent = globalStyles;
    document.head.appendChild(styleTag);
}
