"use client";

import React, { useState } from "react";
import { BarChart2, Play, Search, Heart, Disc, Music2 } from "lucide-react";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { useAudio, PLAYLIST } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, PanInfo } from "framer-motion";

export default function ImmersiveMusicPage() {
    const { isPlaying, currentSong, jumpToSong } = useAudio();
    const { isZen, setZen } = useZen();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSongClick = (index: number) => {
        jumpToSong(index);
        setZen(true); // Enter Zen Mode immediately
    };

    const filteredPlaylist = PLAYLIST
        .map((song, index) => ({ ...song, originalIndex: index }))
        .filter(song =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <>
            {/* Global Styles for this page */}
            <style dangerouslySetInnerHTML={{
                __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
        /* Lock viewport but allow vertical scroll if in library mode */
        html, body { 
            overflow: ${isZen ? 'hidden' : 'auto'} !important; 
            overscroll-behavior: none; 
            touch-action: pan-y; 
            height: 100svh !important; 
            background: #000;
        }
      `}} />

            {/* Ambient Background (Always present) */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "120vh",
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden"
            }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            {/* VIEW SWITCHER */}
            {isZen ? (
                // --- ZEN MODE (IMMERSIVE PLAYER) ---
                <motion.main
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }} // Allow pull down feel
                    onDragEnd={(e: any, info: PanInfo) => {
                        if (info.offset.y > 150) { // Threshold to dismiss
                            setZen(false);
                        }
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100svh",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        background: "rgba(0,0,0,0.4)", // Slight dim
                        backdropFilter: "blur(20px)"
                    }}
                >
                    {/* Handle Bar to indicate swipeability */}
                    <div style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: "rgba(255,255,255,0.3)",
                        borderRadius: "2px",
                        position: "absolute",
                        top: "16px",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }} />

                    <div style={{
                        width: "100%",
                        maxWidth: "500px",
                        transform: "scale(1.1)",
                    }}>
                        <CurrentlyStrip />
                    </div>
                </motion.main>
            ) : (
                // --- LIBRARY MODE (PLAYLIST SELECTION) ---
                <main style={{
                    position: "relative",
                    zIndex: 10,
                    minHeight: "100svh",
                    padding: "4rem 1.5rem 2rem 1.5rem",
                    maxWidth: "600px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem"
                }}>
                    {/* Header Bento */}
                    <div>
                        <h1 style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            color: "white",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.02em"
                        }}>
                            Library
                        </h1>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem"
                        }}>
                            {/* Card 1 */}
                            <div style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                                backdropFilter: "blur(10px)",
                                padding: "1.25rem",
                                borderRadius: "20px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "120px"
                            }}>
                                <Heart className="text-pink-500" size={24} />
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "white" }}>Favorites</span>
                            </div>
                            {/* Card 2 */}
                            <div style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                                backdropFilter: "blur(10px)",
                                padding: "1.25rem",
                                borderRadius: "20px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "120px"
                            }}>
                                <Disc className="text-blue-500" size={24} />
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "white" }}>Albums</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: "50px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 16px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)"
                    }}>
                        <Search size={20} color="rgba(255,255,255,0.4)" />
                        <input
                            type="text"
                            placeholder="Search songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "white",
                                fontSize: "1rem",
                                marginLeft: "12px",
                                fontFamily: "var(--font-sans)",
                            }}
                        />
                    </div>

                    {/* Song List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h3 style={{
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "0.5rem",
                            marginLeft: "4px"
                        }}>
                            All Songs ({PLAYLIST.length})
                        </h3>

                        {filteredPlaylist.map((song) => {
                            const isActive = currentSong?.title === song.title; // Simple check
                            const originalIndex = song.originalIndex;

                            return (
                                <div
                                    key={originalIndex}
                                    onClick={() => handleSongClick(originalIndex)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        padding: "12px 16px",
                                        borderRadius: "16px",
                                        backgroundColor: isActive
                                            ? "rgba(255,255,255,0.15)"
                                            : "rgba(255,255,255,0.03)",
                                        cursor: "pointer",
                                        border: "1px solid rgba(255,255,255,0.02)",
                                        transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)"
                                    }}
                                    className="hover:bg-white/10 active:scale-[0.98]"
                                >
                                    {/* Index / Icon */}
                                    <div style={{
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isActive ? "var(--accent)" : "rgba(255,255,255,0.4)",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                        fontFamily: "var(--font-mono)"
                                    }}>
                                        {isActive && isPlaying ? (
                                            <BarChart2 size={16} className="animate-pulse" />
                                        ) : (
                                            originalIndex + 1
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: "white",
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            fontFamily: "var(--font-sans)",
                                            marginBottom: "2px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {song.title.split("—")[1]?.trim() || song.title}
                                        </div>
                                        <div style={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                        </div>
                                    </div>

                                    {/* Play Btn Hint */}
                                    <div style={{
                                        opacity: 0.3,
                                    }} className="group-hover:opacity-100 transition-opacity">
                                        <Play size={16} fill="white" stroke="none" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}
        </>
    );
}
