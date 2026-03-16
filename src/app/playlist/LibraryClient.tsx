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

    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

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
            backgroundColor: "#F5F0EB",
            color: "#000"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "16px" }}>
                <div style={{ width: "44px" }} /> {/* spacer */}
            </div>


            <div>
                <h1 style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    color: "#000",
                    margin: 0,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    letterSpacing: "-0.04em"
                }}>
                    Library
                </h1>
            </div>

            <div style={{
                width: "100%",
                height: "50px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: borderStyle,
                borderRadius: "12px",
                boxShadow: shadowStyle
            }}>
                <Search size={20} color="#000" />
                <input
                    type="text"
                    placeholder="Search playlists or vibes..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveVibe(""); // clear active vibe pill if manually typing
                    }}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#000",
                        fontSize: "1rem",
                        marginLeft: "12px",
                        fontFamily: "monospace",
                        fontWeight: 700
                    }}
                />
            </div>

            {/* Quick Vibe Filters */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Filter size={14} color="#666" />
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.7rem", color: "#666", textTransform: "uppercase" }}>Filter by Vibe</span>
                </div>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={() => { setSearchQuery(""); setActiveVibe(""); }}
                        style={{
                            padding: "4px 12px",
                            background: activeVibe === "" ? "#000" : "#fff",
                            color: activeVibe === "" ? "#fff" : "#000",
                            border: borderStyle,
                            borderRadius: "20px",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            boxShadow: "2px 2px 0 #000",
                            transition: "background 0.2s ease, color 0.2s ease"
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
                                    padding: "4px 12px",
                                    background: isSelected ? "#000" : "#fff",
                                    color: isSelected ? "#fff" : "#000",
                                    border: borderStyle,
                                    borderRadius: "20px",
                                    fontFamily: "system-ui, -apple-system, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    boxShadow: "2px 2px 0 #000",
                                    transition: "background 0.2s ease, color 0.2s ease"
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
                    whileHover={{ scale: 1.02, y: -2, boxShadow: "6px 6px 0 #000" }}
                    whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                        padding: "12px 16px",
                        background: "#fff",
                        border: borderStyle,
                        borderRadius: "12px",
                        boxShadow: shadowStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Disc size={20} color="#000" />
                        <span style={{ fontWeight: 900, fontSize: "0.95rem", fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.04em", textTransform: "uppercase" }}>Browse All Songs</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700, color: "#666" }}>{songCount || "--"} Tracks</span>
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
                                whileHover={{ scale: 1.02, y: -4, boxShadow: "6px 6px 0 #000" }}
                                whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    position: "relative",
                                    aspectRatio: "1/1",
                                    backgroundColor: playlist.coverColor || "#fff",
                                    border: borderStyle,
                                    borderRadius: "16px",
                                    boxShadow: shadowStyle,
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "background-color 0.2s ease"
                                }}
                            >
                                {playlist.coverImage && (
                                    <img
                                        src={playlist.coverImage}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 0, opacity: 0.8 }}
                                        className="mix-blend-multiply" 
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                )}
                                <div style={{ 
                                    position: "absolute", inset: 0, zIndex: -1, 
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    opacity: 0.2
                                }}>
                                    <Music size={40} color="#000" />
                                </div>
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)",
                                    zIndex: 1
                                }} />
                                
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "10px",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <div style={{ color: "#fff", fontWeight: 900, fontSize: "0.85rem", fontFamily: "system-ui, -apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                                        {playlist.title}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65rem", marginTop: "2px", fontFamily: "monospace", fontWeight: 700 }}>
                                        {counts[playlist.id] !== undefined ? `${counts[playlist.id]} TRACKS` : `${playlist.vibes[0]}`}
                                    </div>
                                </div>

                                {isNowPlaying && isPlaying && (
                                    <div style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: "#000",
                                        padding: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #fff",
                                        zIndex: 3
                                    }}>
                                        <Disc size={14} color="#fff" className="animate-spin" />
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
