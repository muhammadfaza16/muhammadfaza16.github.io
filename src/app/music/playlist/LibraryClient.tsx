"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Disc, Shuffle, ChevronLeft, Filter, Music, ArrowRight, Sparkles, Flame, Clock, Heart, Compass } from "lucide-react";
import { useAudio, useTime } from "@/components/AudioContext";
import { parseSongTitle } from "@/utils/songUtils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const MUSIC_TAGS = [
    { label: "All", value: "", icon: Compass },
    { label: "Indo", value: "Indo", icon: Music },
    { label: "Trending", value: "Main Character", icon: Flame },
    { label: "Chill", value: "Melancholic", icon: Clock },
    { label: "Love", value: "Love", icon: Heart },
];

export default function LibraryClient({ 
    songCount, 
    initialPlaylists = [] 
}: { 
    songCount: number, 
    initialPlaylists?: any[] 
}) {
    const { isPlaying, activePlaylistId } = useAudio();
    const { theme } = useTheme();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const searchParams = useSearchParams();
    const initialVibe = searchParams.get('vibe') || "";
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"latest"|"oldest"|"a-z"|"curated">("a-z");
    const [activeVibe, setActiveVibe] = useState(initialVibe);
    const [isLoading, setIsLoading] = useState(false);

    const CACHE_KEY = "playlist_library_scroll_v1";

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

    useEffect(() => {
        const vibe = searchParams.get('vibe');
        if (vibe) {
            setActiveVibe(vibe);
        }
    }, [searchParams]);

    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const filteredCategories = useMemo(() => {
        let result = initialPlaylists.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesVibe = activeVibe === "" || (p.vibes && p.vibes.includes(activeVibe)) || p.title.includes(activeVibe);
            return matchesSearch && matchesVibe;
        });

        if (sortBy === "curated") {
            result.sort((a, b) => {
                const isALokal = a.title.toLowerCase().includes('indo') || (a.description && a.description.toLowerCase().includes('indo'));
                const isBLokal = b.title.toLowerCase().includes('indo') || (b.description && b.description.toLowerCase().includes('indo'));
                if (isALokal && !isBLokal) return -1;
                if (!isALokal && isBLokal) return 1;
                return (a.title || "").localeCompare(b.title || "");
            });
        } else if (sortBy === "latest") {
            result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        } else if (sortBy === "a-z") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        // Primary Sort: Prioritize playlists with covers (Always first)
        result.sort((a, b) => {
            const hasCoverA = !!a.coverImage ? 1 : 0;
            const hasCoverB = !!b.coverImage ? 1 : 0;
            return hasCoverB - hasCoverA; // 1 comes before 0
        });

        return result;
    }, [initialPlaylists, searchQuery, activeVibe, sortBy]);

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
                id="playlist-scroll-container"
                ref={scrollContainerRef}
                onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "42px 26px var(--explore-bottom-padding, 110px) 26px",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    scrollbarGutter: "stable"
                }}
            >
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "26px" }}>

                    {/* Entrance Navigation */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "-10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <Link href="/music" style={{ textDecoration: "none" }}>
                                <motion.div 
                                    whileHover={{ x: -4 }}
                                    style={{ 
                                        display: "inline-flex", alignItems: "center", gap: "10px", 
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
                                The<br />Archive.
                            </h1>
                        </div>
                    </div>

            {/* Search & Filters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{
                        height: "52px", borderRadius: "18px", padding: "0 16px", flex: 1,
                        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)", display: "flex", alignItems: "center", gap: "10px",
                        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
                        boxShadow: theme === "dark" ? "0 10px 30px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.02)"
                    }}>
                        <Search size={20} style={{ opacity: 0.4 }} />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1, background: "transparent", border: "none", outline: "none",
                                color: "inherit", fontSize: "1rem", fontFamily: headerFont, fontWeight: 600, minWidth: 0
                            }}
                        />
                    </div>
                    <div style={{
                        height: "52px", borderRadius: "18px", padding: "0 16px",
                        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)", display: "flex", alignItems: "center",
                        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
                        boxShadow: theme === "dark" ? "0 10px 30px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.02)"
                    }}>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            style={{ background: "none", border: "none", outline: "none", color: "inherit", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", WebkitAppearance: "none", fontFamily: headerFont }}
                        >
                            <option value="a-z" style={{ color: "#000" }}>A-Z</option>
                            <option value="curated" style={{ color: "#000" }}>Curated</option>
                            <option value="latest" style={{ color: "#000" }}>Latest</option>
                            <option value="oldest" style={{ color: "#000" }}>Oldest</option>
                        </select>
                    </div>
                </div>

                {/* Vibe Selector */}
                <div style={{ 
                    display: "flex", 
                    gap: "10px", 
                    overflowX: "auto", 
                    padding: "6px 26px 10px 26px",
                    margin: "0 -26px",
                    width: "calc(100% + 52px)",
                    scrollbarWidth: "none", 
                    msOverflowStyle: "none" 
                }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {MUSIC_TAGS.map((vibe) => (
                        <motion.button
                            key={vibe.label}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { triggerHaptic(); setActiveVibe(vibe.value); }}
                            style={{
                                display: "flex", alignItems: "center", gap: "10px", padding: "6px 16px",
                                borderRadius: "100px", border: "none", cursor: "pointer",
                                backgroundColor: activeVibe === vibe.value 
                                    ? "#6366F1" 
                                    : (theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)"),
                                color: activeVibe === vibe.value ? "#fff" : "inherit",
                                fontFamily: headerFont, fontWeight: 800, fontSize: "0.75rem",
                                whiteSpace: "nowrap", boxShadow: activeVibe === vibe.value ? "0 8px 20px rgba(99, 102, 241, 0.3)" : "none",
                                transition: "all 0.3s ease"
                            }}
                        >
                            <vibe.icon size={14} />
                            {vibe.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Bento Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Global Catalog Large Card */}
                <Link href="/music/playlist/all" onClick={triggerHaptic} style={{ textDecoration: "none", gridColumn: "span 2" }}>
                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            height: "120px", borderRadius: "26px", padding: "26px",
                            background: theme === "dark" 
                                ? "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" 
                                : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                            position: "relative", overflow: "hidden", display: "flex", 
                            flexDirection: "column", justifyContent: "flex-end",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.1 }}>
                            <Disc size={120} color="#fff" strokeWidth={0.5} />
                        </div>
                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                                <span style={{ 
                                    fontFamily: headerFont, fontSize: "0.75rem", fontWeight: 500, 
                                    color: "rgba(255,255,255,0.7)", letterSpacing: "0.01em" 
                                }}>Master Catalog</span>
                                <h2 style={{ 
                                    fontFamily: headerFont, fontSize: "1.25rem", fontWeight: 700, 
                                    color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.015em" 
                                }}>All Tracks</h2>
                            </div>
                            <div style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{songCount}</span>
                                <ArrowRight size={14} color="#fff" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <AnimatePresence mode="popLayout">
                    {filteredCategories.map((playlist, idx) => {
                        const isNowPlaying = activePlaylistId === playlist.id;
                        return (
                            <motion.div
                                key={playlist.id}
                            >
                                <Link href={`/music/playlist/${playlist.slug || playlist.id}`} onClick={triggerHaptic} style={{ textDecoration: "none" }}>
                                    <div style={{
                                        aspectRatio: "1/1", borderRadius: "26px", position: "relative",
                                        overflow: "hidden", backgroundColor: playlist.coverColor || (theme === "dark" ? "#1E1B4B" : "#6366F1"),
                                        backgroundImage: !playlist.coverImage ? (theme === "dark" ? "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" : "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)") : "none",
                                        display: "flex", flexDirection: "column", justifyContent: "flex-end",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.1)"
                                    }}>
                                        {playlist.coverImage && (
                                            <img
                                                src={playlist.coverImage}
                                                style={{ 
                                                    position: "absolute", inset: 0, width: "100%", height: "100%", 
                                                    objectFit: "cover", opacity: 0.95
                                                }}
                                            />
                                        )}
                                        {/* Overlay Gradients */}
                                        <div style={{
                                            position: "absolute", inset: 0, zIndex: 1,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)"
                                        }} />

                                        {/* Now Playing Glow */}
                                        {isNowPlaying && isPlaying && (
                                            <motion.div
                                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                style={{
                                                    position: "absolute", inset: 0, zIndex: 2,
                                                    border: "2px solid #6366F1", borderRadius: "26px", pointerEvents: "none"
                                                }}
                                            />
                                        )}

                                        <div style={{ position: "relative", zIndex: 3, padding: "16px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                <h3 style={{ 
                                                    fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, 
                                                    color: "#fff", margin: 0, lineHeight: 1.1, textTransform: "uppercase" 
                                                }}>
                                                    {playlist.title}
                                                </h3>
                                                {isNowPlaying && isPlaying && (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                                                        <Disc size={14} color="#fff" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div style={{ 
                                                fontFamily: monoFont, fontSize: "0.55rem", fontWeight: 800, 
                                                color: "rgba(255,255,255,0.6)", marginTop: "4px", letterSpacing: "0.05em"
                                            }}>
                                                {playlist._count?.songs !== undefined ? `${playlist._count.songs} TRACKS` : playlist.vibes?.[0]}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: "center", padding: "42px 0", opacity: 0.5 }}
                >
                    <Disc size={48} style={{ margin: "0 auto 16px auto", display: "block" }} />
                    <p style={{ fontFamily: headerFont, fontWeight: 700 }}>No tracks found...</p>
                </motion.div>
                )}
                </div>
                </div>

                <style>{`
                    :root {
                        --explore-bottom-padding: 110px;
                    }
                    @media (max-width: 640px) {
                        :root {
                            --explore-bottom-padding: 86px;
                        }
                    }
                `}</style>
            </main>
    );
}
