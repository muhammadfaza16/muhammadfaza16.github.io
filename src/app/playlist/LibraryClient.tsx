"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Disc, Shuffle, ChevronLeft, Filter, Music, ArrowRight, Sparkles, Flame, Clock, Heart, Compass } from "lucide-react";
import { useAudio, useTime } from "@/components/AudioContext";
import { parseSongTitle } from "@/utils/songUtils";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

// INDO_ARTISTS moved to database categories


const VIBE_TAGS = [
    { label: "All", value: "", icon: Sparkles },
    { label: "Indo", value: "Indo", icon: Music },
    { label: "Viral", value: "Main Character", icon: Flame },
    { label: "Relax", value: "Melancholic", icon: Clock },
    { label: "Love", value: "Love", icon: Heart },
];

export default function LibraryClient({ songCount }: { songCount: number }) {
    const { isPlaying, activePlaylistId } = useAudio();
    const { theme } = useTheme();
    const searchParams = useSearchParams();
    const initialVibe = searchParams.get('vibe') || "";
    const [searchQuery, setSearchQuery] = useState("");
    const [activeVibe, setActiveVibe] = useState(initialVibe);
    const [dbSongs, setDbSongs] = useState<any[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        setIsLoading(true);
        fetch("/api/music/songs")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.songs) {
                    setDbSongs(data.songs);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    // Restore scroll position
    useEffect(() => {
        if (!isLoading && mounted && scrollContainerRef.current && scrollYRef.current > 0) {
            scrollContainerRef.current.scrollTop = scrollYRef.current;
        }
    }, [isLoading, mounted]);

    useEffect(() => {
        if (!dbSongs.length) return;
        
        const newCounts: Record<string, number> = {};
        PLAYLIST_CATEGORIES.forEach(p => {
            if (p.id === 'indo-hits') {
                newCounts[p.id] = dbSongs.filter(s => s.category === 'Indo').length;
            } else if (p.id === 'international-favorites') {
                newCounts[p.id] = dbSongs.filter(s => s.category === 'Luar').length;
            } else {
                newCounts[p.id] = dbSongs.filter(s => 
                    p.songTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase()))
                ).length;
            }
        });

        setCounts(newCounts);
    }, [dbSongs]);

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
        return PLAYLIST_CATEGORIES.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVibe = activeVibe === "" || p.vibes.includes(activeVibe) || p.title.includes(activeVibe);
            return matchesSearch && matchesVibe;
        });
    }, [searchQuery, activeVibe]);

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <div 
            className="w-full flex flex-col items-center pt-8 pb-[100px] px-4"
            style={{ 
                isolation: "isolate",
                transition: "all 0.5s ease",
                transform: "translateZ(0)"
            }}
        >
        <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header Section */}
            <header style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                    width: "32px", height: "32px", borderRadius: "8px", 
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(99, 102, 241, 0.2)"
                }}>
                    <Compass size={16} color="#fff" />
                </div>
                <h1 style={{
                    fontFamily: headerFont, fontSize: "1rem", fontWeight: 800,
                    margin: 0, letterSpacing: "0.02em", textTransform: "uppercase",
                    color: theme === "dark" ? "#FFF" : "#000"
                }}>
                    Curated Archives
                </h1>
            </header>

            {/* Search & Filters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                    height: "52px", borderRadius: "18px", padding: "0 18px",
                    backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
                    display: "flex", alignItems: "center", gap: "12px",
                    border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(0)",
                    boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.02)"
                }}>
                    <Search size={20} style={{ opacity: 0.4 }} />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1, background: "transparent", border: "none", outline: "none",
                            color: "inherit", fontSize: "1rem", fontFamily: headerFont, fontWeight: 600
                        }}
                    />
                </div>

                {/* Vibe Selector */}
                <div style={{ 
                    display: "flex", gap: "10px", overflowX: "auto", padding: "4px 0 12px 0",
                    scrollbarWidth: "none", msOverflowStyle: "none" 
                }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {VIBE_TAGS.map((vibe) => (
                        <motion.button
                            key={vibe.label}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { triggerHaptic(); setActiveVibe(vibe.value); }}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px",
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
                {/* Global Catalog Large Card */}
                <Link href="/playlist/all" onClick={triggerHaptic} style={{ textDecoration: "none", gridColumn: "span 2" }}>
                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            height: "120px", borderRadius: "24px", padding: "20px",
                            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
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
                                    fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 800, 
                                    color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" 
                                }}>Master Catalog</span>
                                <h2 style={{ 
                                    fontFamily: headerFont, fontSize: "1.05rem", fontWeight: 900, 
                                    color: "#fff", margin: 0, lineHeight: 1 
                                }}>ALL TRACKS</h2>
                            </div>
                            <div style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>{songCount}</span>
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
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Link href={`/playlist/${playlist.id}`} onClick={triggerHaptic} style={{ textDecoration: "none" }}>
                                    <div style={{
                                        aspectRatio: "1/1", borderRadius: "20px", position: "relative",
                                        overflow: "hidden", backgroundColor: playlist.coverColor,
                                        display: "flex", flexDirection: "column", justifyContent: "flex-end",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.1)"
                                    }}>
                                        {playlist.coverImage && (
                                            <img
                                                src={playlist.coverImage}
                                                style={{ 
                                                    position: "absolute", inset: 0, width: "100%", height: "100%", 
                                                    objectFit: "cover", opacity: 0.85
                                                }}
                                                className="mix-blend-multiply" 
                                            />
                                        )}
                                        {/* Overlay Gradients */}
                                        <div style={{
                                            position: "absolute", inset: 0, zIndex: 1,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                                        }} />

                                        {/* Now Playing Glow */}
                                        {isNowPlaying && isPlaying && (
                                            <motion.div
                                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                style={{
                                                    position: "absolute", inset: 0, zIndex: 2,
                                                    border: "2px solid #6366F1", borderRadius: "24px", pointerEvents: "none"
                                                }}
                                            />
                                        )}

                                        <div style={{ position: "relative", zIndex: 3, padding: "16px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                <h3 style={{ 
                                                    fontFamily: headerFont, fontSize: "0.9rem", fontWeight: 900, 
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
                                                fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 800, 
                                                color: "rgba(255,255,255,0.6)", marginTop: "4px", letterSpacing: "0.05em"
                                            }}>
                                                {counts[playlist.id] || playlist.vibes[0]}
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
                    style={{ textAlign: "center", padding: "40px 0", opacity: 0.5 }}
                >
                    <Disc size={48} style={{ margin: "0 auto 16px auto", display: "block" }} />
                    <p style={{ fontFamily: headerFont, fontWeight: 700 }}>No vibes found...</p>
                </motion.div>
            )}
                </div>
        </div>
    );
}
