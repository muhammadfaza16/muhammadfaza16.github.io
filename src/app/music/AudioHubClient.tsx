"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ListMusic, ChevronLeft, LibraryBig, Disc, Radio, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio, useTime } from "@/components/AudioContext";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLiveMusic } from "@/components/live/LiveMusicContext";

const MENU_ITEMS = [
    { id: "songs", label: "All Songs", subtitle: "Full Library", icon: LibraryBig, href: "/music/playlist/all" },
    { id: "playlists", label: "Playlists", subtitle: "Curated Sets", icon: ListMusic, href: "/music/playlist" },
];

export default function AudioHubClient({ 
    initialPlaylists = [],
    activeSessionPlaylistIds = []
}: { 
    initialPlaylists?: any[],
    activeSessionPlaylistIds?: string[]
}) {
    const { currentSong, isPlaying, togglePlay, setIsPlayerExpanded } = useAudio();
    const { currentTime, duration } = useTime();
    const { isLive } = useLiveMusic();
    const { theme } = useTheme();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);

    const playlists = initialPlaylists || [];
    const livePlaylistIds = activeSessionPlaylistIds || [];

    const CACHE_KEY = "music_hub_scroll_v1";

    const [greeting, setGreeting] = useState({ line1: "Your", line2: "Soundscape.", emoji: "" });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) setGreeting({ line1: "Good Morning", line2: "Faza", emoji: "🌅" });
        else if (hour >= 11 && hour < 15) setGreeting({ line1: "Good Afternoon", line2: "Faza", emoji: "☀️" });
        else if (hour >= 15 && hour < 19) setGreeting({ line1: "Good Evening", line2: "Faza", emoji: "🌇" });
        else setGreeting({ line1: "Good Night", line2: "Faza", emoji: "🌙" });
    }, []);

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

    // Global Custom Animations
    useEffect(() => {
        const globalStyles = `
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
                animation: spin-slow 15s linear infinite;
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.textContent = globalStyles;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

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
                    padding: "0 20px 140px 20px",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    scrollbarGutter: "stable"
                }}
            >
                <motion.div 
                    style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}
                >
                    {/* Header */}
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
                            <motion.h1 
                                style={{ 
                                    fontFamily: headerFont, fontWeight: 900, fontSize: "2.5rem", lineHeight: 1.1, margin: 0,
                                    letterSpacing: "-0.05em", color: theme === "dark" ? "#FFF" : "#000",
                                    display: "flex", flexDirection: "column"
                                }}
                            >
                                <span>{greeting.line1},</span>
                                <span style={{ display: "inline-flex", alignItems: "center" }}>
                                    {greeting.line2}
                                    {greeting.emoji && (
                                        <span style={{ fontSize: "1.5rem", marginLeft: "16px", lineHeight: 1 }}>{greeting.emoji}</span>
                                    )}
                                </span>
                            </motion.h1>
                        </div>
                        <motion.div 
                            style={{ 
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: "44px", height: "44px", borderRadius: "100px",
                                background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
                            }}
                        >
                            <ThemeToggle transparent />
                        </motion.div>
                    </div>

                    <motion.div initial={false} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                        <AnimatePresence mode="wait">
                            {currentSong && (
                                <motion.div
                                    key="active-vibe"
                                    initial={false}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        ...cardStyle,
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0px",
                                        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.45)",
                                        backdropFilter: "blur(24px) saturate(180%)",
                                        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.5)",
                                        overflow: "hidden",
                                        position: "relative"
                                    }}
                                >
                                    {/* Subtitle Bar */}
                                    <div style={{ 
                                        padding: "10px 18px", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        borderBottom: "1px solid rgba(0,0,0,0.02)"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#6366F1" }} />
                                            <span style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.55rem", letterSpacing: "0.12em", color: theme === "dark" ? "#FFF" : "#000", textTransform: "uppercase" }}>
                                                {isPlaying ? "Now Playing" : "Continue Listening"}
                                            </span>
                                        </div>
                                    </div>

                                    <div onClick={() => setIsPlayerExpanded(true)} style={{ padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: isPlaying ? "#1E1B4B" : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                                            <Disc className={isPlaying ? "animate-spin-slow" : ""} size={24} color={isPlaying ? "#fff" : "#6366F1"} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {(() => {
                                                const { cleanTitle, artist, labels } = parseSongTitle(currentSong.title);
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                            <div style={{ fontFamily: headerFont, fontWeight: 600, fontSize: "0.95rem", color: theme === "dark" ? "#FFF" : "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.015em" }}>{cleanTitle}</div>
                                                            {labels.map(l => (
                                                                <span key={l} style={{
                                                                    fontSize: "0.45rem", fontFamily: headerFont, fontWeight: 700,
                                                                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                                                    color: theme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                                                    padding: "3px 8px", borderRadius: "100px",
                                                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                                                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.06)"
                                                                }}>{l}</span>
                                                            ))}
                                                        </div>
                                                        <div style={{ fontFamily: headerFont, fontWeight: 500, fontSize: "0.75rem", color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>{artist}</div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: isPlaying ? (theme === "dark" ? "#6366F1" : "#000") : "rgba(0,0,0,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                                            {isPlaying ? <Pause size={18} fill="currentColor" stroke="none" /> : <Play size={18} fill="currentColor" stroke="none" style={{ marginLeft: "2px" }} />}
                                        </button>
                                    </div>
                                    <div style={{ width: "100%", height: "4px", backgroundColor: theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)" }}>
                                        <motion.div animate={{ width: `${(currentTime / duration) * 100}%` }} style={{ height: "100%", background: "linear-gradient(to right, #6366F1, #8B5CF6)" }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Library */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "4px" }}>
                                <LibraryBig size={16} color={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
                                <span style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>Browse Library</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <Link href="/music/live-hub" style={{ textDecoration: "none", gridColumn: "span 2" }}>
                                    <motion.div 
                                        whileHover={{ y: -6, scale: 1.01 }} 
                                        whileTap={{ scale: 0.99 }} 
                                        style={{ 
                                            ...cardStyle, 
                                            padding: "24px", 
                                            display: "flex", 
                                            gap: "20px", 
                                            flexDirection: "column",
                                            background: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
                                            border: theme === "dark" ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(0, 0, 0, 0.08)"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "linear-gradient(135deg, #450A0A, #7F1D1D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                                                    <Radio size={24} />
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <h2 style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "1.1rem", margin: 0, letterSpacing: "-0.015em" }}>Live Music</h2>
                                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: isLive ? "#EF4444" : "#666" }} />
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, opacity: 0.45, fontFamily: monoFont, letterSpacing: "0.1em", textTransform: "uppercase" }}>{isLive ? "Music Stations & Hub" : "Broadcast Offline"}</p>
                                                </div>
                                            </div>
                                            <div style={{ 
                                                backgroundColor: isLive ? (theme === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)") : (theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)"), 
                                                padding: "0 10px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                                                borderRadius: "100px", border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
                                            }}>
                                                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: isLive ? "#EF4444" : (theme === "dark" ? "#FFF" : "#000"), letterSpacing: "0.05em", fontFamily: monoFont }}>{isLive ? "LIVE NOW" : "OFF AIR"}</span>
                                            </div>
                                        </div>

                                        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7, lineHeight: 1.5, maxWidth: "280px" }}>
                                            {isLive ? "Join the live broadcast. Listen together with everyone else in real-time." : "No current live sessions found. Browse the archive or wait for the next show."}
                                        </p>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: isLive ? "#EF4444" : "#888", fontFamily: monoFont, textTransform: "uppercase" }}>Music Status: {isLive ? "Active" : "Inactive"}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ fontSize: "0.8rem", fontWeight: 900, color: theme === "dark" ? "#FFF" : "#000", fontFamily: headerFont }}>GO TO HUB</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>

                                {MENU_ITEMS.map((item) => (
                                    <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...cardStyle, padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                                                <item.icon size={18} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                                                <span style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "0.9rem" }}>{item.label}</span>
                                                <span style={{ fontSize: "0.6rem", opacity: 0.45 }}>{item.subtitle}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Featured Playlists */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingLeft: "4px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Disc size={16} color={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
                                    <span style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Featured Playlists</span>
                                </div>
                                <Link href="/music/playlist" style={{ fontSize: "0.65rem", fontWeight: 800, opacity: 0.3, textDecoration: "none", color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#AAA" }}>SEE ALL</Link>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {playlists
                                    .filter(p => !!p.coverImage)
                                    .slice(0, 4)
                                    .map((playlist) => (
                                    <Link key={playlist.slug || playlist.id} href={`/music/playlist/${playlist.slug || playlist.id}`} style={{ textDecoration: "none" }}>
                                        <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ position: "relative", aspectRatio: "1/1", backgroundColor: playlist.coverColor || "#1E1B4B", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" }}>
                                            {playlist.coverImage && (
                                                <img 
                                                    src={playlist.coverImage} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: 0.95 }} 
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            )}

                                            {/* Subtle text protection gradient */}
                                            <div style={{
                                                position: "absolute", inset: 0, zIndex: 1,
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
                                                pointerEvents: "none"
                                            }} />
                                            
                                            {livePlaylistIds.includes(playlist.id) && (
                                                <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10, display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(220, 38, 38, 0.9)", padding: "4px 8px", borderRadius: "6px", backdropFilter: "blur(4px)" }}>
                                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFF" }} />
                                                    <span style={{ color: "#FFF", fontSize: "0.55rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>LIVE</span>
                                                </div>
                                            )}

                                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", zIndex: 2 }}>
                                                <div style={{ color: "#fff", fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase" }}>{playlist.title}</div>
                                                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.55rem", fontWeight: 800 }}>{playlist._count?.songs} TRACKS</div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
