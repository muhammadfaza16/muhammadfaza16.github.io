"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ListMusic, ChevronLeft, ArrowRight, Sparkles, LibraryBig, Music, Play, Pause, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import { useAudio, useTime } from "@/components/AudioContext";

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
    const { currentSong, isPlaying, togglePlay, setIsPlayerExpanded } = useAudio();
    const { currentTime, duration } = useTime();

    const [dbSongs, setDbSongs] = useState<any[]>([]);
    const counts = useMemo(() => {
        if (!dbSongs.length) return {};
        
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
        return newCounts;
    }, [dbSongs]);

    const cardStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    };

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: "#F8F5F2", // Slightly more luminous cream
            backgroundImage: "radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.5) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.3) 0, transparent 50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 16px 140px 16px",
            color: "#1A1A1A"
        }}>
            <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "24px" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "6px", 
                                background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.05)",
                                padding: "8px 14px", cursor: "pointer", 
                                fontFamily: headerFont, fontWeight: 700, color: "#000",
                                fontSize: "0.85rem", borderRadius: "100px",
                                backdropFilter: "blur(8px)",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                            }}
                        >
                            <ChevronLeft size={16} /> Back
                        </motion.button>
                    </Link>
                    <span style={{ 
                        fontFamily: headerFont, 
                        fontWeight: 900, 
                        fontSize: "1.2rem", 
                        textTransform: "uppercase", 
                        letterSpacing: "-0.03em",
                        background: "linear-gradient(180deg, #000 0%, #444 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Audio Hub
                    </span>
                    <div style={{ width: "44px" }} />
                </div>

                {/* Home Dashboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    
                    {/* Music Activity Widget (Multifunctional) */}
                    <AnimatePresence>
                        {currentSong && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    ...cardStyle,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0px",
                                    padding: "0px",
                                    backgroundColor: "rgba(255, 255, 255, 0.45)",
                                    border: "1px solid rgba(255, 255, 255, 0.6)",
                                    overflow: "hidden"
                                }}
                            >
                                {/* Activity Label Bar */}
                                <div style={{ 
                                    padding: "8px 16px", 
                                    borderBottom: "1px solid rgba(0,0,0,0.03)", 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center" 
                                }}>
                                    <span style={{ 
                                        fontFamily: headerFont, 
                                        fontWeight: 900, 
                                        fontSize: "0.6rem", 
                                        letterSpacing: "0.1em", 
                                        color: isPlaying ? "#000" : "#888",
                                        textTransform: "uppercase"
                                    }}>
                                        {isPlaying ? "• Active Vibe" : currentTime > 0 ? "Continue Listening" : "On Standby"}
                                    </span>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <div style={{ width: "4px", height: "4px", borderRadius: "10px", backgroundColor: isPlaying ? "#000" : "rgba(0,0,0,0.1)" }} />
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div 
                                    onClick={() => setIsPlayerExpanded(true)}
                                    style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "12px", 
                                        padding: "12px 16px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <div style={{ 
                                        width: "44px", 
                                        height: "44px", 
                                        borderRadius: "12px",
                                        background: "linear-gradient(45deg, #FFD93D, #FF80AB)",
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                                    }}>
                                        <Disc className={isPlaying ? "animate-spin-slow" : ""} size={20} color="#fff" />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ 
                                            fontFamily: headerFont, 
                                            fontWeight: 900, 
                                            fontSize: "0.85rem", 
                                            color: "#000",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            letterSpacing: "-0.01em"
                                        }}>
                                            {currentSong.title.split("—")[1]?.trim() || currentSong.title}
                                        </div>
                                        <div style={{ 
                                            fontFamily: headerFont, 
                                            fontWeight: 600, 
                                            fontSize: "0.65rem", 
                                            color: "#888",
                                            letterSpacing: "0.01em"
                                        }}>
                                            {currentSong.title.split("—")[0]?.trim() || "Unknown Artist"}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlay();
                                        }}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "100px",
                                            backgroundColor: "#000",
                                            border: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {isPlaying ? <Pause size={14} color="#fff" fill="#fff" /> : <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: "1.5px" }} />}
                                    </motion.button>
                                </div>

                                {/* Slim Progress Bar Strip */}
                                <div style={{ width: "100%", height: "2px", backgroundColor: "rgba(0,0,0,0.03)", position: "relative" }}>
                                    <motion.div 
                                        initial={false}
                                        animate={{ width: `${(currentTime / duration) * 100}%` }}
                                        style={{ 
                                            height: "100%", 
                                            backgroundColor: isPlaying ? "#000" : "#AAA"
                                        }} 
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Library Section */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingLeft: "4px" }}>
                            <LibraryBig size={16} color="#666" />
                            <span style={{ 
                                fontFamily: headerFont, 
                                fontWeight: 800, 
                                fontSize: "0.75rem", 
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#666" 
                            }}>Explore Library</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {MENU_ITEMS.map((item) => (
                                <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ y: -4, scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            ...cardStyle,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            padding: "12px 14px"
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
                                                backgroundColor: "#000", 
                                                color: "#fff",
                                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                                            }}>
                                                <item.icon size={18} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                                                <span style={{ 
                                                    fontFamily: headerFont, 
                                                    fontWeight: 900, 
                                                    fontSize: "0.95rem", 
                                                    color: "#000", 
                                                    letterSpacing: "-0.01em" 
                                                }}>{item.label}</span>
                                                <span style={{ 
                                                    fontFamily: monoFont, 
                                                    fontSize: "0.6rem", 
                                                    color: "#888", 
                                                    fontWeight: 600, 
                                                    textTransform: "uppercase" 
                                                }}>{item.subtitle}</span>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} color="#CCC" />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", justifyContent: "space-between", paddingLeft: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Sparkles size={16} color="#666" />
                                <span style={{ 
                                    fontFamily: headerFont, 
                                    fontWeight: 800, 
                                    fontSize: "0.75rem", 
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "#666" 
                                }}>Featured Vibes</span>
                            </div>
                            <Link href="/playlist" style={{ 
                                fontFamily: headerFont, 
                                fontSize: "0.65rem", 
                                fontWeight: 800, 
                                color: "#AAA", 
                                textDecoration: "none",
                                letterSpacing: "0.05em"
                            }}>SEE ALL</Link>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {PLAYLIST_CATEGORIES.slice(0, 4).map((playlist) => (
                                <Link key={playlist.id} href={`/playlist/${playlist.id}`} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1/1",
                                            backgroundColor: playlist.coverColor || "#fff",
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
                                                    opacity: 0.7 
                                                }}
                                                className="mix-blend-multiply" 
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                        <div style={{ 
                                            position: "absolute", inset: 0, zIndex: -1, 
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            opacity: 0.15
                                        }}>
                                            <Music size={48} color="#000" />
                                        </div>
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
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
