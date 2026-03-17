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
                    <h1 style={{ 
                        fontFamily: headerFont, 
                        fontWeight: 900, 
                        fontSize: "1.4rem", 
                        textTransform: "uppercase", 
                        letterSpacing: "-0.04em",
                        margin: 0,
                        color: "#000",
                        lineHeight: 1
                    }}>
                        Music
                    </h1>
                    <div style={{ width: "44px" }} />
                </div>

                {/* Home Dashboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    
                    {/* Music Activity Widget (Multifunctional) */}
                    <AnimatePresence mode="wait">
                        {currentSong && (
                            <motion.div
                                key="active-vibe-refined"
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                style={{
                                    ...cardStyle,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0px",
                                    padding: "0px",
                                    backgroundColor: "rgba(255, 255, 255, 0.45)",
                                    backdropFilter: "blur(24px) saturate(180%)",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    boxShadow: isPlaying 
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
                                            } : {}}
                                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                            style={{ 
                                                width: "6px", 
                                                height: "6px", 
                                                borderRadius: "50%", 
                                                backgroundColor: isPlaying ? "#6366F1" : "rgba(0,0,0,0.12)",
                                            }} 
                                        />
                                        <span style={{ 
                                            fontFamily: headerFont, 
                                            fontWeight: 800, 
                                            fontSize: "0.55rem", 
                                            letterSpacing: "0.12em", 
                                            color: isPlaying ? "#000" : "#AAA",
                                            textTransform: "uppercase"
                                        }}>
                                            {isPlaying ? "Now Playing" : "Paused"}
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
                                                color={isPlaying ? "#fff" : "#BBB"} 
                                                style={{ zIndex: 2, opacity: isPlaying ? 0.9 : 0.5 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                                        <AnimatePresence mode="wait">
                                            <motion.div 
                                                key={currentSong.title}
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div style={{ 
                                                    fontFamily: headerFont, 
                                                    fontWeight: 900, 
                                                    fontSize: "0.95rem", 
                                                    color: "#000",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    letterSpacing: "-0.02em",
                                                    lineHeight: 1.1
                                                }}>
                                                    {currentSong.title.split("—")[1]?.trim() || currentSong.title}
                                                </div>
                                                <div style={{ 
                                                    fontFamily: headerFont, 
                                                    fontWeight: 700, 
                                                    fontSize: "0.7rem", 
                                                    color: "rgba(0,0,0,0.45)",
                                                    letterSpacing: "0.01em",
                                                    marginTop: "2px"
                                                }}>
                                                    {currentSong.title.split("—")[0]?.trim() || "Unknown"}
                                                </div>
                                            </motion.div>
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
                                            backgroundColor: isPlaying ? "#000" : "rgba(0,0,0,0.05)",
                                            border: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            zIndex: 2,
                                            color: isPlaying ? "#fff" : "#000"
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

                    {/* Library Section */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "4px" }}>
                            <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 10px rgba(99, 102, 241, 0.2)"
                            }}>
                                <LibraryBig size={12} color="#fff" />
                            </div>
                            <span style={{ 
                                fontFamily: headerFont, 
                                fontWeight: 800, 
                                fontSize: "0.7rem", 
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#000" 
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
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", justifyContent: "space-between", paddingLeft: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "6px",
                                    background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 10px rgba(236, 72, 153, 0.2)"
                                }}>
                                    <Sparkles size={12} color="#fff" />
                                </div>
                                <span style={{ 
                                    fontFamily: headerFont, 
                                    fontWeight: 800, 
                                    fontSize: "0.7rem", 
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    color: "#000"
                                }}>Handpicked Playlists</span>
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
