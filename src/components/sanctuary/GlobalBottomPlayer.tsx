"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAudio } from "../AudioContext";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronUp, Repeat1, ListMusic, Disc, FileText, Search } from "lucide-react";

export function GlobalBottomPlayer() {
    const {
        isPlaying, togglePlay, nextSong, prevSong,
        currentSong, currentTime, duration, seekTo,
        shuffleMode, toggleShuffle, repeatMode, toggleRepeat,
        activePlaybackMode, activeLyrics, queue,
        isPlayerExpanded: isExpanded, setIsPlayerExpanded: setIsExpanded
    } = useAudio();

    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'cover' | 'lyrics'>('cover');
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => setIsMounted(true), []);

    // Crucial bugfix: If the user navigates to a new page (e.g., from Playlist back to Home), 
    // the expanded player should intrinsically collapse so it doesn't jump scare them or block the UI.
    const pathname = usePathname();
    useEffect(() => {
        // Only collapse if we are explicitly navigating AWAY from the expanded state and NOT auto-expanding
        if (typeof window !== "undefined" && sessionStorage.getItem("autoExpandPlayer") !== "true") {
             setIsExpanded(false);
        }
    }, [pathname, setIsExpanded]);

    // Handle auto-expand flag from Home widget
    useEffect(() => {
        if (pathname === '/music' && typeof window !== "undefined") {
            // Add a tiny delay to ensure LayoutShell has fully mounted the player before expanding
            const timer = setTimeout(() => {
                if (sessionStorage.getItem("autoExpandPlayer") === "true") {
                    setIsExpanded(true);
                    sessionStorage.removeItem("autoExpandPlayer");
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [pathname, setIsExpanded]);

    // Prevent background scrolling when player is expanded
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    if (!isMounted) return null;

    if (activePlaybackMode === 'none' || !currentSong) return null;

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const songTitle = currentSong.title.split("—")[1]?.trim() || currentSong.title;
    const songArtist = currentSong.title.split("—")[0]?.trim() || "Unknown Artist";

    // Neo-Brutalist Base Styles
    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";
    
    // Wrap the entire component logic in AnimatePresence so exit animations can actually fire
    return (
        <AnimatePresence>
            {!isExpanded ? null : (
                <motion.div
                    key="expanded-player"
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.5, bottom: 0 }}
                onDragEnd={(e, info) => {
                    if (info.offset.y < -100) setIsExpanded(false);
                }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100svh",
                    backgroundColor: "#F5F0EB",
                    zIndex: 100001,
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px 16px 32px 16px",
                    overflow: "hidden",
                    color: "#000"
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "16px" }}>
                    <motion.button 
                        whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                        onClick={() => setIsExpanded(false)}
                        style={{ 
                            background: "#fff", 
                            border: borderStyle, 
                            boxShadow: "2px 2px 0 #000", 
                            padding: "8px", 
                            cursor: "pointer", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}
                    >
                        <ChevronUp size={24} color="#000" />
                    </motion.button>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", color: "#000" }}>
                        Now Playing
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                            onClick={() => setShowQueueModal(true)}
                            style={{ 
                                width: "44px", height: "44px", 
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "transparent",
                                border: "none",
                                color: "#000",
                                cursor: "pointer"
                            }}
                        >
                            <ListMusic size={20} />
                        </button>
                        <button 
                            onClick={() => setActiveTab(activeTab === 'lyrics' ? 'cover' : 'lyrics')}
                            style={{ 
                                width: "44px", height: "44px", 
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: activeTab === 'lyrics' ? "#000" : "transparent",
                                border: activeTab === 'lyrics' ? "2px solid #000" : "none",
                                color: activeTab === 'lyrics' ? "#fff" : "#000",
                                cursor: "pointer"
                            }}
                        >
                            <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "1.2rem" }}>TXT</span>
                        </button>
                    </div>
                </div>

                <div style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    backgroundColor: "#fff",
                    border: borderStyle,
                    boxShadow: shadowStyle,
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative"
                }}>
                    {activeTab === 'cover' && (
                        <div style={{
                            width: "100%", height: "100%",
                            background: "linear-gradient(180deg, #87CEEB 0%, #FDB99B 50%, #7EC850 50%, #5DAE3B 100%)",
                            position: "relative",
                            overflow: "hidden",
                            imageRendering: "pixelated"
                        }}>
                            <style>
                                {`
                                    @keyframes groundScroll {
                                        from { transform: translateX(0); }
                                        to { transform: translateX(-50%); }
                                    }
                                    @keyframes personBob1 {
                                        0%, 100% { transform: translateY(0); }
                                        50% { transform: translateY(-6px); }
                                    }
                                    @keyframes personBob2 {
                                        0%, 100% { transform: translateY(-6px); }
                                        50% { transform: translateY(0); }
                                    }
                                    @keyframes cloudDrift {
                                        from { transform: translateX(110%); }
                                        to { transform: translateX(-160%); }
                                    }
                                    @keyframes heartFloat {
                                        0%, 100% { transform: scale(1) translateY(0); }
                                        50% { transform: scale(1.3) translateY(-8px); }
                                    }
                                    @keyframes noteDrift {
                                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                                        100% { transform: translateY(-30px) rotate(15deg); opacity: 0; }
                                    }
                                    @keyframes sunPulse {
                                        0%, 100% { transform: scale(1); }
                                        50% { transform: scale(1.08); }
                                    }
                                    @keyframes birdFly {
                                        from { transform: translateX(-20%); }
                                        to { transform: translateX(500%); }
                                    }
                                `}
                            </style>

                            {/* ☀ Pixel Sun */}
                            <div style={{
                                position: "absolute", top: "4%", right: "10%",
                                animation: isPlaying ? "sunPulse 3s ease-in-out infinite" : "none"
                            }}>
                                <svg width="56" height="56" viewBox="0 0 28 28" fill="#FFD93D" style={{ shapeRendering: "crispEdges" }}>
                                    {/* Core */}
                                    <rect x="10" y="10" width="8" height="8" />
                                    <rect x="8" y="12" width="12" height="4" />
                                    <rect x="12" y="8" width="4" height="12" />
                                    {/* Rays */}
                                    <rect x="13" y="2" width="2" height="4" />
                                    <rect x="13" y="22" width="2" height="4" />
                                    <rect x="2" y="13" width="4" height="2" />
                                    <rect x="22" y="13" width="4" height="2" />
                                    <rect x="4" y="4" width="2" height="2" />
                                    <rect x="22" y="4" width="2" height="2" />
                                    <rect x="4" y="22" width="2" height="2" />
                                    <rect x="22" y="22" width="2" height="2" />
                                </svg>
                            </div>

                            {/* ☁ Pixel Cloud 1 */}
                            <div style={{
                                position: "absolute", top: "10%", left: 0, width: "100%",
                                animation: isPlaying ? "cloudDrift 18s linear infinite" : "none"
                            }}>
                                <svg width="72" height="32" viewBox="0 0 18 8" fill="#fff" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="4" y="0" width="4" height="2" />
                                    <rect x="2" y="2" width="10" height="2" />
                                    <rect x="0" y="4" width="14" height="2" />
                                    <rect x="10" y="0" width="4" height="2" />
                                    <rect x="8" y="2" width="8" height="2" />
                                    <rect x="2" y="6" width="14" height="2" />
                                </svg>
                            </div>

                            {/* ☁ Pixel Cloud 2 */}
                            <div style={{
                                position: "absolute", top: "24%", left: "55%", width: "100%",
                                animation: isPlaying ? "cloudDrift 26s linear -10s infinite" : "none"
                            }}>
                                <svg width="56" height="24" viewBox="0 0 14 6" fill="#fff" opacity="0.8" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="2" y="0" width="4" height="2" />
                                    <rect x="0" y="2" width="10" height="2" />
                                    <rect x="6" y="0" width="4" height="2" />
                                    <rect x="1" y="4" width="12" height="2" />
                                </svg>
                            </div>

                            {/* 🐦 Pixel Birds */}
                            <div style={{
                                position: "absolute", top: "16%", left: 0,
                                animation: isPlaying ? "birdFly 7s linear infinite" : "none"
                            }}>
                                <svg width="24" height="12" viewBox="0 0 12 6" fill="#333" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="0" y="2" width="2" height="2" />
                                    <rect x="2" y="0" width="2" height="2" />
                                    <rect x="4" y="2" width="2" height="2" />
                                    <rect x="6" y="0" width="2" height="2" />
                                    <rect x="8" y="2" width="2" height="2" />
                                    <rect x="10" y="4" width="2" height="2" />
                                </svg>
                            </div>
                            <div style={{
                                position: "absolute", top: "22%", left: 0,
                                animation: isPlaying ? "birdFly 9s linear -3s infinite" : "none"
                            }}>
                                <svg width="18" height="10" viewBox="0 0 12 6" fill="#555" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="0" y="2" width="2" height="2" />
                                    <rect x="2" y="0" width="2" height="2" />
                                    <rect x="4" y="2" width="2" height="2" />
                                    <rect x="6" y="0" width="2" height="2" />
                                    <rect x="8" y="2" width="2" height="2" />
                                </svg>
                            </div>

                            {/* 🌲 Pixel Tree Left */}
                            <div style={{ position: "absolute", bottom: "18%", left: "4%" }}>
                                <svg width="40" height="56" viewBox="0 0 10 14" fill="none" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="4" y="10" width="2" height="4" fill="#8B5E3C" />
                                    <rect x="3" y="0" width="4" height="2" fill="#2E7D32" />
                                    <rect x="2" y="2" width="6" height="2" fill="#388E3C" />
                                    <rect x="1" y="4" width="8" height="2" fill="#43A047" />
                                    <rect x="0" y="6" width="10" height="2" fill="#4CAF50" />
                                    <rect x="1" y="8" width="8" height="2" fill="#388E3C" />
                                </svg>
                            </div>

                            {/* 🌲 Pixel Tree Right */}
                            <div style={{ position: "absolute", bottom: "18%", right: "3%" }}>
                                <svg width="36" height="52" viewBox="0 0 10 14" fill="none" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="4" y="10" width="2" height="4" fill="#8B5E3C" />
                                    <rect x="3" y="0" width="4" height="2" fill="#2E7D32" />
                                    <rect x="2" y="2" width="6" height="2" fill="#388E3C" />
                                    <rect x="1" y="4" width="8" height="2" fill="#43A047" />
                                    <rect x="0" y="6" width="10" height="2" fill="#4CAF50" />
                                    <rect x="1" y="8" width="8" height="2" fill="#388E3C" />
                                </svg>
                            </div>

                            {/* 🌸 Pixel Flowers on ground */}
                            <div style={{
                                position: "absolute", bottom: "11%", left: 0, width: "200%",
                                display: "flex", gap: "28px",
                                animation: isPlaying ? "groundScroll 5s linear infinite" : "none"
                            }}>
                                {[
                                    "#E53935", "#FFD93D", "#EC407A", "#FF7043", "#AB47BC",
                                    "#E53935", "#FFD93D", "#EC407A", "#FF7043", "#AB47BC",
                                    "#E53935", "#FFD93D", "#EC407A", "#FF7043", "#AB47BC"
                                ].map((c, i) => (
                                    <svg key={i} width="12" height="16" viewBox="0 0 6 8" fill="none" style={{ shapeRendering: "crispEdges", flexShrink: 0 }}>
                                        <rect x="2" y="4" width="2" height="4" fill="#388E3C" />
                                        <rect x="2" y="0" width="2" height="2" fill={c} />
                                        <rect x="0" y="2" width="2" height="2" fill={c} />
                                        <rect x="4" y="2" width="2" height="2" fill={c} />
                                        <rect x="2" y="2" width="2" height="2" fill="#FFD93D" />
                                    </svg>
                                ))}
                            </div>

                            {/* Ground dashes */}
                            <div style={{
                                position: "absolute", bottom: "20%", left: 0, width: "200%", height: "4px",
                                background: "repeating-linear-gradient(90deg, #3E8E2E 0, #3E8E2E 12px, transparent 12px, transparent 20px)",
                                animation: isPlaying ? "groundScroll 0.8s linear infinite" : "none"
                            }} />

                            {/* ❤ Pixel Heart */}
                            <div style={{
                                position: "absolute", top: "30%", left: "42%",
                                animation: isPlaying ? "heartFloat 1.8s ease-in-out infinite" : "none"
                            }}>
                                <svg width="28" height="24" viewBox="0 0 14 12" fill="#E53935" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="2" y="0" width="4" height="2" />
                                    <rect x="8" y="0" width="4" height="2" />
                                    <rect x="0" y="2" width="14" height="2" />
                                    <rect x="0" y="4" width="14" height="2" />
                                    <rect x="2" y="6" width="10" height="2" />
                                    <rect x="4" y="8" width="6" height="2" />
                                    <rect x="6" y="10" width="2" height="2" />
                                </svg>
                            </div>

                            {/* 🎵 Pixel Music Note 1 */}
                            <div style={{
                                position: "absolute", top: "34%", left: "24%",
                                animation: isPlaying ? "noteDrift 2.5s ease-out infinite" : "none"
                            }}>
                                <svg width="16" height="20" viewBox="0 0 8 10" fill="#333" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="2" y="0" width="6" height="2" />
                                    <rect x="6" y="0" width="2" height="6" />
                                    <rect x="0" y="6" width="4" height="4" />
                                </svg>
                            </div>

                            {/* 🎵 Pixel Music Note 2 */}
                            <div style={{
                                position: "absolute", top: "36%", left: "66%",
                                animation: isPlaying ? "noteDrift 3s ease-out -1s infinite" : "none"
                            }}>
                                <svg width="14" height="18" viewBox="0 0 8 10" fill="#555" style={{ shapeRendering: "crispEdges" }}>
                                    <rect x="2" y="0" width="6" height="2" />
                                    <rect x="6" y="0" width="2" height="6" />
                                    <rect x="0" y="6" width="4" height="4" />
                                </svg>
                            </div>

                            {/* ===== PIXEL BOY (left, chasing) ===== */}
                            <div style={{
                                position: "absolute", bottom: "20%", left: "20%", width: "60px", height: "80px",
                                animation: isPlaying ? "personBob1 0.4s ease-in-out infinite" : "none"
                            }}>
                                <svg width="60" height="80" viewBox="0 0 15 20" fill="none" style={{ shapeRendering: "crispEdges" }}>
                                    {/* Hair */}
                                    <rect x="5" y="0" width="5" height="1" fill="#4A3728" />
                                    <rect x="4" y="1" width="7" height="2" fill="#4A3728" />
                                    {/* Head */}
                                    <rect x="5" y="3" width="5" height="4" fill="#FFDBB4" />
                                    <rect x="4" y="4" width="1" height="2" fill="#FFDBB4" />
                                    {/* Eyes */}
                                    <rect x="6" y="4" width="1" height="1" fill="#333" />
                                    <rect x="8" y="4" width="1" height="1" fill="#333" />
                                    {/* Mouth */}
                                    <rect x="6" y="6" width="3" height="1" fill="#C97" />
                                    {/* Shirt (blue) */}
                                    <rect x="4" y="7" width="7" height="4" fill="#42A5F5" />
                                    <rect x="3" y="7" width="1" height="1" fill="#42A5F5" />
                                    {/* Front arm */}
                                    <rect x="11" y="7" width="1" height="1" fill="#FFDBB4" />
                                    <rect x="12" y="8" width="1" height="1" fill="#FFDBB4" />
                                    {/* Back arm */}
                                    <rect x="3" y="8" width="1" height="1" fill="#FFDBB4" />
                                    <rect x="2" y="9" width="1" height="1" fill="#FFDBB4" />
                                    {/* Pants (indigo) */}
                                    <rect x="4" y="11" width="7" height="3" fill="#5C6BC0" />
                                    {/* Front leg */}
                                    <rect x="8" y="14" width="2" height="3" fill="#5C6BC0" />
                                    <rect x="10" y="16" width="2" height="2" fill="#5C6BC0" />
                                    {/* Back leg */}
                                    <rect x="5" y="14" width="2" height="3" fill="#5C6BC0" />
                                    <rect x="3" y="16" width="2" height="2" fill="#5C6BC0" />
                                    {/* Shoes */}
                                    <rect x="2" y="18" width="3" height="2" fill="#E53935" />
                                    <rect x="10" y="18" width="3" height="2" fill="#E53935" />
                                </svg>
                            </div>

                            {/* ===== PIXEL GIRL (right, running ahead) ===== */}
                            <div style={{
                                position: "absolute", bottom: "20%", left: "52%", width: "60px", height: "80px",
                                animation: isPlaying ? "personBob2 0.4s ease-in-out infinite" : "none"
                            }}>
                                <svg width="60" height="80" viewBox="0 0 15 20" fill="none" style={{ shapeRendering: "crispEdges" }}>
                                    {/* Hair (long flowing) */}
                                    <rect x="5" y="0" width="5" height="1" fill="#5D3418" />
                                    <rect x="4" y="1" width="7" height="2" fill="#5D3418" />
                                    <rect x="3" y="3" width="1" height="6" fill="#5D3418" />
                                    <rect x="11" y="3" width="1" height="4" fill="#5D3418" />
                                    {/* Head */}
                                    <rect x="5" y="3" width="5" height="4" fill="#FFDBB4" />
                                    <rect x="4" y="4" width="1" height="2" fill="#FFDBB4" />
                                    {/* Eyes */}
                                    <rect x="6" y="4" width="1" height="1" fill="#333" />
                                    <rect x="8" y="4" width="1" height="1" fill="#333" />
                                    {/* Blush */}
                                    <rect x="5" y="5" width="1" height="1" fill="#FFB4B4" />
                                    <rect x="9" y="5" width="1" height="1" fill="#FFB4B4" />
                                    {/* Mouth */}
                                    <rect x="6" y="6" width="3" height="1" fill="#C97" />
                                    {/* Dress top (pink) */}
                                    <rect x="4" y="7" width="7" height="3" fill="#EC407A" />
                                    {/* Skirt (flared) */}
                                    <rect x="3" y="10" width="9" height="1" fill="#EC407A" />
                                    <rect x="2" y="11" width="11" height="1" fill="#EC407A" />
                                    <rect x="1" y="12" width="13" height="2" fill="#EC407A" />
                                    {/* Front arm */}
                                    <rect x="11" y="8" width="1" height="1" fill="#FFDBB4" />
                                    <rect x="12" y="9" width="1" height="1" fill="#FFDBB4" />
                                    {/* Back arm */}
                                    <rect x="3" y="7" width="1" height="1" fill="#FFDBB4" />
                                    <rect x="2" y="8" width="1" height="1" fill="#FFDBB4" />
                                    {/* Front leg */}
                                    <rect x="8" y="14" width="2" height="3" fill="#FFDBB4" />
                                    <rect x="10" y="16" width="2" height="2" fill="#FFDBB4" />
                                    {/* Back leg */}
                                    <rect x="5" y="14" width="2" height="3" fill="#FFDBB4" />
                                    <rect x="3" y="16" width="2" height="2" fill="#FFDBB4" />
                                    {/* Shoes */}
                                    <rect x="2" y="18" width="3" height="2" fill="#FF80AB" />
                                    <rect x="10" y="18" width="3" height="2" fill="#FF80AB" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lyrics' && (
                        <div style={{
                            width: "100%",
                            height: "100%",
                            padding: "16px",
                            overflowY: "auto",
                            fontFamily: "monospace",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                        }}>
                            {activeLyrics.length > 0 ? activeLyrics.map((lyric, idx) => {
                                const isActive = lyric.time <= currentTime && (idx === activeLyrics.length - 1 || activeLyrics[idx + 1].time > currentTime);
                                return (
                                    <p key={idx} style={{
                                        margin: "4px 0",
                                        color: isActive ? "#000" : "#999",
                                        fontWeight: isActive ? 700 : 400,
                                        transition: "color 0.2s"
                                    }}>
                                        {lyric.text || "♪"}
                                    </p>
                                );
                            }) : (
                                <p style={{ margin: "auto", color: "#999", fontStyle: "italic" }}>No lyrics available...</p>
                            )}
                        </div>
                    )}

                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    paddingBottom: "16px"
                }}>
                    {/* Info */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <h2 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.75rem", margin: "0 0 8px 0", lineHeight: 1.1, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#000" }}>
                            {songTitle}
                        </h2>
                        <p style={{ fontFamily: "monospace", fontSize: "1rem", margin: 0, color: "#333" }}>
                            {songArtist}
                        </p>
                    </div>

                    {/* Seek Bar */}
                    <div style={{ width: "100%" }}>
                        <div 
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                seekTo(pct * duration);
                            }}
                            style={{
                                width: "100%",
                                height: "16px",
                                backgroundColor: "#fff",
                                border: borderStyle,
                                boxShadow: "2px 2px 0 #000",
                                cursor: "pointer",
                                position: "relative"
                            }}
                        >
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: `${(currentTime / (duration || 1)) * 100}%`,
                                backgroundColor: "#000",
                                transition: "width 0.1s linear"
                            }} />
                            <div style={{
                                position: "absolute",
                                top: -4,
                                bottom: -4,
                                width: "8px",
                                backgroundColor: "#fff",
                                border: "2px solid #000",
                                left: `calc(${(currentTime / (duration || 1)) * 100}% - 4px)`,
                                transition: "left 0.1s linear"
                            }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700 }}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <NeoButton onClick={toggleShuffle} active={shuffleMode}>
                            <Shuffle size={20} color={shuffleMode ? "#fff" : "#000"} />
                        </NeoButton>
                        <NeoButton onClick={() => prevSong()} size="large">
                            <SkipBack size={24} fill="#000" color="#000" />
                        </NeoButton>
                        <NeoButton onClick={togglePlay} size="extra-large">
                            {isPlaying ? <Pause size={32} fill="#000" color="#000" /> : <Play size={32} fill="#000" color="#000" />}
                        </NeoButton>
                        <NeoButton onClick={() => nextSong()} size="large">
                            <SkipForward size={24} fill="#000" color="#000" />
                        </NeoButton>
                        <NeoButton onClick={toggleRepeat} active={repeatMode !== 'off'}>
                            {repeatMode === 'one' ? <Repeat1 size={20} color="#fff" /> : <Repeat size={20} color={repeatMode === 'all' ? "#fff" : "#000"} />}
                        </NeoButton>
                    </div>
                </div>
                
                {/* --- Dedicated Queue Modal Overlay --- */}
                <AnimatePresence>
                    {showQueueModal && (
                        <motion.div
                            key="queue-modal"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            style={{
                                position: "fixed",
                                top: 0, left: 0, right: 0, bottom: 0,
                                height: "100svh",
                                backgroundColor: "#F5F0EB",
                                zIndex: 100002, // Ensure it floats above the expanded player
                                display: "flex",
                                flexDirection: "column",
                                padding: "24px 16px 32px 16px"
                            }}
                        >
                            {/* Queue Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", marginTop: "16px" }}>
                                <motion.button 
                                    whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                    onClick={() => setShowQueueModal(false)}
                                    style={{ 
                                        background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                        padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" 
                                    }}
                                >
                                    <ChevronUp size={24} color="#000" style={{ transform: "rotate(-90deg)" }} />
                                </motion.button>
                                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                                    QUEUE
                                </span>
                                <div style={{ width: "44px" }} />
                            </div>

                            {/* Search Bar */}
                            <div style={{ 
                                display: "flex", alignItems: "center", gap: "12px", 
                                background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                padding: "12px 16px", marginBottom: "24px"
                            }}>
                                <Search size={20} color="#000" />
                                <input
                                    type="text"
                                    placeholder="Search in Queue..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        border: "none", outline: "none", width: "100%",
                                        fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, color: "#000"
                                    }}
                                />
                            </div>

                            {/* Songs List */}
                            <div style={{
                                flex: 1,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "#fff",
                                border: borderStyle,
                                boxShadow: shadowStyle,
                            }}>
                                {queue
                                    .map((song, idx) => ({ song, originalIndex: idx }))
                                    .filter(({ song }) => song.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(({ song, originalIndex }) => {
                                        const isCurrent = currentSong && song.audioUrl === currentSong.audioUrl;
                                        return (
                                            <motion.div
                                                key={`${song.audioUrl}-${originalIndex}`}
                                                whileTap={{ backgroundColor: isCurrent ? "#000" : "rgba(0,0,0,0.05)" }}
                                                onClick={() => {
                                                    useAudio().jumpToSong(originalIndex);
                                                setShowQueueModal(false);
                                            }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "16px",
                                                backgroundColor: isCurrent ? "#000" : "transparent",
                                                color: isCurrent ? "#fff" : "#000",
                                                borderBottom: "2px solid #000",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <div style={{ width: "24px", textAlign: "center", fontWeight: 900, fontFamily: "monospace", fontSize: "0.9rem" }}>
                                                {isCurrent && isPlaying ? (
                                                    <Disc className="animate-spin" size={16} color="#fff" />
                                                ) : (originalIndex + 1)}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 900, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.04em" }}>
                                                    {song.title.split("—")[1]?.trim() || song.title}
                                                </div>
                                                <div style={{ color: isCurrent ? "#ccc" : "#666", fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 700 }}>
                                                    {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Helper Neo-Brutalist Button
function NeoButton({ children, onClick, active = false, size = "normal" }: { children: React.ReactNode, onClick: (e: React.MouseEvent) => void, active?: boolean, size?: "normal" | "large" | "extra-large" }) {
    const dim = size === "normal" ? "44px" : size === "large" ? "56px" : "72px";
    
    return (
        <motion.button
            whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
            onClick={onClick}
            style={{
                width: dim,
                height: dim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? "#000" : "#fff",
                border: "2px solid #000",
                boxShadow: "2px 2px 0 #000",
                cursor: "pointer",
                borderRadius: "0",
                color: active ? "#fff" : "#000"
            }}
        >
            {children}
        </motion.button>
    );
}
