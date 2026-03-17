"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Disc, Shuffle, ChevronLeft, Filter, Music } from "lucide-react";
import { useAudio } from "@/components/AudioContext";
import { motion } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const INDO_ARTISTS = [
    'Sheila on 7', 'Noah', 'Ungu', 'Samsons', 'D\'masiv', 'St12', 'Hijau Daun', 'Vagetoz', 
    'Vierra', 'Virgoun', 'Virzha', 'Wali', 'Slam', 'Exists', 'Exist', 'Spoon', 'Screen', 'Ukays', 
    'Ella', 'Stings', 'Taxi', 'Taxi Band', 'Utopia', 'For Revenge', 'Fredy', 'Geisha', 
    'Element', 'Eren', 'Janji', 'Desy Ratnasari', 'David Bayu', 'Daun Jatuh', 'Last Child',
    'Lyodra', 'Andra', 'Dewa', 'Tulus', 'Risalah'
];

export default function LibraryClient({ songCount }: { songCount: number }) {
    const { isPlaying, activePlaylistId } = useAudio();
    const searchParams = useSearchParams();
    const initialVibe = searchParams.get('vibe') || "";
    const [searchQuery, setSearchQuery] = useState(initialVibe);
    const [activeVibe, setActiveVibe] = useState(initialVibe);
    const [dbSongs, setDbSongs] = useState<any[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetch("/api/music/songs")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.songs) {
                    setDbSongs(data.songs);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!dbSongs.length) return;
        
        const newCounts: Record<string, number> = {};
        PLAYLIST_CATEGORIES.forEach(p => {
            if (p.id === 'indo-hits') {
                newCounts[p.id] = dbSongs.filter(s => 
                    INDO_ARTISTS.some(artist => s.title.toLowerCase().includes(artist.toLowerCase()))
                ).length;
            } else if (p.id === 'international-favorites') {
                newCounts[p.id] = dbSongs.filter(s => 
                    !INDO_ARTISTS.some(artist => s.title.toLowerCase().includes(artist.toLowerCase()))
                ).length;
            } else {
                newCounts[p.id] = dbSongs.filter(s => 
                    p.songTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase()))
                ).length;
            }
        });
        setCounts(newCounts);
    }, [dbSongs]);

    // Update search query when vibe parameter changes
    useEffect(() => {
        const vibe = searchParams.get('vibe');
        if (vibe) {
            setSearchQuery(vibe);
            setActiveVibe(vibe);
        }
    }, [searchParams]);

    const VIBES = ["Melancholic", "Epic", "Morning", "Acoustic", "Space", "Pop", "Love"];

    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const filteredCategories = useMemo(() => {
        return PLAYLIST_CATEGORIES.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vibes.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <main style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100svh",
            padding: "16px 16px 120px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            backgroundColor: "#f9f9f9",
            color: "#000"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "16px" }}>
                <div style={{ width: "44px" }} /> {/* spacer */}
            </div>


            <div>
                <h1 style={{
                    fontFamily: headerFont,
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#000",
                    margin: 0,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    letterSpacing: "-0.03em"
                }}>
                    Library
                </h1>
            </div>

            <div style={{
                width: "100%",
                height: "44px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
                <Search size={18} color="#888" />
                <input
                    type="text"
                    placeholder="Search library..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveVibe(""); 
                    }}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#000",
                        fontSize: "0.9rem",
                        marginLeft: "10px",
                        fontFamily: monoFont,
                        fontWeight: 600
                    }}
                />
            </div>

            {/* Quick Vibe Filters */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <Filter size={12} color="#888" />
                    <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>VIBE FILTER</span>
                </div>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={() => { setSearchQuery(""); setActiveVibe(""); }}
                                style={{
                                    padding: "4px 14px",
                                    background: activeVibe === "" ? "#000" : "rgba(255, 255, 255, 0.8)",
                                    color: activeVibe === "" ? "#fff" : "#666",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    borderRadius: "100px",
                                    fontFamily: headerFont,
                                    fontWeight: 800,
                                    fontSize: "0.7rem",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    boxShadow: activeVibe === "" ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                                    transition: "all 0.2s ease"
                                }}
                    >
                        All
                    </motion.button>
                    {VIBES.map(vibe => {
                        const isSelected = activeVibe.toLowerCase() === vibe.toLowerCase();
                        return (
                            <motion.button
                                key={vibe}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => { setSearchQuery(vibe); setActiveVibe(vibe); }}
                                style={{
                                    padding: "4px 14px",
                                    background: isSelected ? "#000" : "rgba(255, 255, 255, 0.8)",
                                    color: isSelected ? "#fff" : "#666",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    borderRadius: "100px",
                                    fontFamily: headerFont,
                                    fontWeight: 800,
                                    fontSize: "0.7rem",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {vibe}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <Link href="/playlist/all" onClick={triggerHaptic} style={{ textDecoration: "none", marginTop: "4px" }}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{
                        padding: "14px 18px",
                        background: "rgba(255, 255, 255, 0.45)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Disc size={16} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: "0.85rem", fontFamily: headerFont, letterSpacing: "-0.02em", color: "#000" }}>BROWSE ALL CATOLOG</span>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700, color: "#888" }}>{songCount || "--"} TRACKS</span>
                </motion.div>
            </Link>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "12px"
            }}>
                {filteredCategories.map((playlist) => {
                    const isNowPlaying = activePlaylistId === playlist.id;

                    return (
                        <Link
                            key={playlist.id}
                            href={`/playlist/${playlist.id}`}
                            onClick={triggerHaptic}
                            style={{ textDecoration: "none" }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                style={{
                                    position: "relative",
                                    aspectRatio: "1/1.1",
                                    backgroundColor: playlist.coverColor || "#fff",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    borderRadius: "18px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.03)"
                                }}
                            >
                                {playlist.coverImage && (
                                    <img
                                        src={playlist.coverImage}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 0, opacity: 0.85 }}
                                        className="mix-blend-multiply"
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
                                    padding: "12px",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <div style={{ color: "#fff", fontWeight: 900, fontSize: "0.8rem", fontFamily: headerFont, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                                        {playlist.title}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.55rem", marginTop: "2px", fontFamily: monoFont, fontWeight: 700 }}>
                                        {counts[playlist.id] !== undefined ? `${counts[playlist.id]} TRACKS` : `${playlist.vibes[0]}`}
                                    </div>
                                </div>

                                {isNowPlaying && isPlaying && (
                                    <div style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: "rgba(0,0,0,0.15)",
                                        backdropFilter: "blur(8px)",
                                        padding: "6px",
                                        borderRadius: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 3
                                    }}>
                                        <Disc size={12} color="#fff" className="animate-spin-slow" />
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}

            </div>
        </main>
    );
}
