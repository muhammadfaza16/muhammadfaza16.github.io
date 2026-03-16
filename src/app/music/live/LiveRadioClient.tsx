"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Radio, Play, Pause, SkipForward, RefreshCw, Volume2, Info, List } from "lucide-react";
import Link from "next/link";
import { useAudio } from "@/components/AudioContext";

export default function LiveRadioClient() {
    const { isPlaying, togglePlay, currentSong, duration, currentTime, seekTo } = useAudio();
    const [isSynced, setIsSynced] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0); // Mock elapsed since start (e.g. 10m 30s)
    
    // Mock Radio Data
    const radioInfo = {
        title: "Starlight Radio",
        startedAt: "21:00 PM",
        listeners: 124,
        nextSong: "Neffex — Grateful"
    };

    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    const handleSync = () => {
        // In real impl, fetch from /api/music/live and snap currentTime
        setIsSynced(true);
        // seekTo(expectedTotalOffset % currentSongDuration);
    };

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: "#F5F0EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 16px 40px 16px",
            color: "#000",
            overflow: "hidden"
        }}>
            <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                    <Link href="/music" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "4px", 
                                background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontWeight: 700, color: "#000",
                                fontSize: "0.75rem"
                            }}
                        >
                            <ChevronLeft size={14} /> Hub
                        </motion.button>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ 
                            width: "8px", height: "8px", borderRadius: "50%", background: "#FF4D4D",
                            boxShadow: "0 0 8px rgba(255,77,77,0.5)"
                        }} />
                        <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase" }}>
                            Live
                        </span>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ 
                            background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                            padding: "4px", cursor: "pointer"
                        }}
                    >
                        <Info size={16} />
                    </motion.button>
                </div>

                {/* Main Visualizer / Cover Art */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginTop: "12px" }}>
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1a1a1a 0%, #000 100%)",
                            border: "8px solid #000",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        {/* Vinyl Textures */}
                        <div style={{ position: "absolute", inset: 0, opacity: 0.1, background: "repeating-radial-gradient(circle, transparent 0, transparent 4px, rgba(255,255,255,0.2) 5px)" }} />
                        
                        {/* Center Label */}
                        <div style={{ 
                            width: "35%", height: "35%", borderRadius: "50%", background: "#fff", 
                            border: borderStyle, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center",
                            overflow: "hidden"
                        }}>
                             <img src="/logo.webp" alt="logo" style={{ width: "60%", opacity: 0.8 }} />
                        </div>

                        {/* Current Song Art Fallback */}
                        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.4 }}>
                             <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at center, #555 0%, #000 100%)" }} />
                        </div>
                    </motion.div>
                </div>

                {/* Info & Metadata */}
                <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.6rem", fontWeight: 700, color: "#666", textTransform: "uppercase" }}>Broadcast: {radioInfo.title}</span>
                        <span style={{ color: "#ccc" }}>|</span>
                        <span style={{ fontFamily: "monospace", fontSize: "0.6rem", fontWeight: 700, color: "#666", textTransform: "uppercase" }}>Start: {radioInfo.startedAt}</span>
                    </div>
                    <h2 style={{ 
                        fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, 
                        fontSize: "1.5rem", color: "#000", letterSpacing: "-0.04em", 
                        textTransform: "uppercase", margin: "0 0 4px 0", lineHeight: 1.1 
                    }}>
                        {currentSong?.title || "Connecting..."}
                    </h2>
                    <p style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "#666", margin: 0 }}>
                        UPCOMING: {radioInfo.nextSong}
                    </p>
                </div>

                {/* Timeline Section */}
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 800 }}>- 10:45</span>
                        <motion.button
                            onClick={handleSync}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: isSynced ? "#000" : "#fff",
                                color: isSynced ? "#fff" : "#000",
                                border: borderStyle,
                                borderRadius: "4px",
                                padding: "4px 10px",
                                fontFamily: "monospace",
                                fontSize: "0.6rem",
                                fontWeight: 900,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                boxShadow: isSynced ? "none" : "2px 2px 0 #000"
                            }}
                        >
                            <RefreshCw size={10} className={isSynced ? "" : "animate-spin"} />
                            SYNC LIVE
                        </motion.button>
                        <span style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 800, color: "#FF4D4D" }}>LIVE</span>
                    </div>

                    {/* Seekable Progress Bar */}
                    <div style={{ 
                        width: "100%", height: "24px", position: "relative", 
                        display: "flex", alignItems: "center", cursor: "pointer" 
                    }}>
                        <div style={{ width: "100%", height: "8px", background: "#e0e0e0", border: borderStyle, borderRadius: "4px", position: "relative" }}>
                            <div style={{ width: "75%", height: "100%", background: "#000", position: "absolute", left: 0, top: 0 }} />
                        </div>
                        {/* Knob */}
                        <div style={{ 
                            position: "absolute", left: "75%", width: "12px", height: "20px", 
                            background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                            transform: "translateX(-50%)"
                        }} />
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginTop: "12px" }}>
                    <motion.button whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <Volume2 size={24} />
                    </motion.button>
                    
                    <motion.button 
                        onClick={togglePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ 
                            width: "64px", height: "64px", borderRadius: "50%", 
                            background: "#000", color: "#fff", border: borderStyle, 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
                        }}
                    >
                        {isPlaying ? <Pause size={28} fill="#fff" /> : <Play size={28} fill="#fff" style={{ marginLeft: "4px" }} />}
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <List size={24} />
                    </motion.button>
                </div>

                {/* Listener Footer */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "20px", opacity: 0.6 }}>
                    <div style={{ display: "flex", -webkit-mask-image: "linear-gradient(to right, black 80%, transparent)" }}>
                         {/* Placeholder for listener avatars */}
                         <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#ddd", border: "1px solid #fff" }} />
                         <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#ccc", border: "1px solid #fff", marginLeft: "-8px" }} />
                         <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#bbb", border: "1px solid #fff", marginLeft: "-8px" }} />
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700 }}>{radioInfo.listeners} tuning in</span>
                </div>
            </div>
        </main>
    );
}
