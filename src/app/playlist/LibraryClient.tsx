"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Disc, Shuffle, ChevronLeft, Filter, Music, ArrowRight } from "lucide-react";
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
                        <div style={{ 
                            width: "32px", 
                            height: "32px", 
                            borderRadius: "8px", 
                            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}>
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.4), transparent 70%)",
                            }} />
                            <Disc size={16} color="#fff" style={{ position: "relative", zIndex: 1 }} />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: "0.85rem", fontFamily: headerFont, letterSpacing: "-0.02em", color: "#000" }}>BROWSE ALL CATALOG</span>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700, color: "#888" }}>{songCount || "--"} TRACKS</span>
                </motion.div>
            </Link>

            <div style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "20px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
                overflow: "hidden"
            }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 900, fontFamily: headerFont, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "#000" }}>
                        PLAYLISTS
                    </h3>
                    <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.7rem", color: "#888" }}>{filteredCategories.length} CATEGORIES</span>
                </div>

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
                                whileHover={{ x: 2, backgroundColor: "rgba(0,0,0,0.02)" }}
                                whileTap={{ scale: 0.99, backgroundColor: "rgba(0,0,0,0.04)" }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    borderBottom: "1px solid rgba(0,0,0,0.03)",
                                    transition: "all 0.2s ease",
                                    position: "relative"
                                }}
                            >
                                <div style={{ 
                                    width: "44px", 
                                    height: "44px", 
                                    borderRadius: "10px", 
                                    backgroundColor: playlist.coverColor || "#fff",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                }}>
                                    {playlist.coverImage ? (
                                        <img
                                            src={playlist.coverImage}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            className="mix-blend-multiply"
                                        />
                                    ) : (
                                        <Disc size={20} color="rgba(0,0,0,0.1)" />
                                    )}
                                    {isNowPlaying && isPlaying && (
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "rgba(0,0,0,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: 2
                                        }}>
                                            <Disc size={18} color="#fff" className="animate-spin-slow" />
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "#000", fontFamily: headerFont, letterSpacing: "-0.01em", lineHeight: 1.2, textTransform: "uppercase" }}>
                                        {playlist.title}
                                    </div>
                                    <div style={{ color: "#888", fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700, marginTop: "1px", textTransform: "uppercase" }}>
                                        {counts[playlist.id] !== undefined ? `${counts[playlist.id]} TRACKS` : `${playlist.vibes[0]}`}
                                    </div>
                                </div>
                                <ArrowRight size={16} color="#CCC" />
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}
