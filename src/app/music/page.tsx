"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ListMusic, ChevronLeft, ArrowRight, Sparkles, LibraryBig, Music } from "lucide-react";
import { motion } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";

const INDO_ARTISTS = [
    'Sheila on 7', 'Noah', 'Ungu', 'Samsons', 'D\'masiv', 'St12', 'Hijau Daun', 'Vagetoz', 
    'Vierra', 'Virgoun', 'Virzha', 'Wali', 'Slam', 'Exists', 'Exist', 'Spoon', 'Screen', 'Ukays', 
    'Ella', 'Stings', 'Taxi', 'Taxi Band', 'Utopia', 'For Revenge', 'Fredy', 'Geisha', 
    'Element', 'Eren', 'Janji', 'Desy Ratnasari', 'David Bayu', 'Daun Jatuh', 'Last Child',
    'Lyodra', 'Andra', 'Dewa', 'Tulus', 'Risalah'
];

const MENU_ITEMS = [
    { id: "songs", label: "All Songs", subtitle: "Full Library", icon: LibraryBig, href: "/playlist/all" },
    { id: "playlists", label: "Playlists", subtitle: "Curated Sets", icon: ListMusic, href: "/playlist" },
];


export default function AudioHubPage() {
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

        // Log access
        fetch("/api/music/log", { method: "POST" }).catch(() => { });
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

    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: "#F5F0EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 16px 120px 16px",
            color: "#000"
        }}>
            <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "16px" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "4px", 
                                background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontWeight: 700, color: "#000",
                                fontSize: "0.75rem",
                                transition: "background 0.2s ease"
                            }}
                        >
                            <ChevronLeft size={14} /> Back
                        </motion.button>
                    </Link>
                    <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                        AUDIO
                    </span>
                    <div style={{ width: "44px" }} /> {/* Spacer to balance flex-between */}
                </div>


                {/* Home Dashboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "8px" }}>
                    
                    {/* Quick Access / Library */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <LibraryBig size={16} />
                            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Library</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {MENU_ITEMS.map((item) => (
                                <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4, boxShadow: "6px 6px 0 #000" }}
                                        whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            backgroundColor: "#fff",
                                            border: borderStyle,
                                            boxShadow: "4px 4px 0 #000",
                                            padding: "12px 16px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s ease"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "36px", height: "36px", border: borderStyle, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}>
                                                <item.icon size={18} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1rem", color: "#000", letterSpacing: "-0.04em", textTransform: "uppercase" }}>{item.label}</span>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>{item.subtitle}</span>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} color="#000" />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Playlists */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Sparkles size={16} />
                                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Featured</span>
                            </div>
                            <Link href="/playlist" style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, color: "#666", textDecoration: "none" }}>SEE ALL</Link>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {PLAYLIST_CATEGORIES.slice(0, 4).map((playlist) => (
                                <Link key={playlist.id} href={`/playlist/${playlist.id}`} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -4, boxShadow: "6px 6px 0 #000" }}
                                        whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1/1",
                                            backgroundColor: playlist.coverColor || "#fff",
                                            border: borderStyle,
                                            boxShadow: "4px 4px 0 #000",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s ease"
                                        }}
                                    >
                                        {playlist.coverImage && (
                                            <img
                                                src={playlist.coverImage}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 0, opacity: 0.6 }}
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
                                            padding: "12px",
                                            zIndex: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}>
                                            <div style={{ 
                                                color: "#fff", 
                                                fontWeight: 900, 
                                                fontSize: "0.75rem", 
                                                fontFamily: "system-ui, -apple-system, sans-serif", 
                                                textTransform: "uppercase", 
                                                letterSpacing: "-0.04em", 
                                                lineHeight: 1.1,
                                                marginBottom: "2px"
                                            }}>
                                                {playlist.title}
                                            </div>
                                            <div style={{ 
                                                color: "rgba(255,255,255,0.8)", 
                                                fontSize: "0.6rem", 
                                                fontFamily: "monospace", 
                                                fontWeight: 700,
                                                textTransform: "uppercase"
                                            }}>
                                                {counts[playlist.id] !== undefined ? `${counts[playlist.id]} TRACKS` : `${playlist.vibes[0]}`}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
