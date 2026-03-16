"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import {
    ChevronLeft,
    CheckCircle2,
    XCircle,
    Clipboard,
    Loader2,
    Save,
    PenLine,
    Lock,
    Search,
    ListMusic,
    Settings,
    Activity,
    Database,
    RefreshCw,
    Globe,
    Clock,
    Users
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaylistModule } from "./components/PlaylistModule";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";

const MASTER_PIN = "0000";

type ModuleId = "dashboard" | "playlist" | "settings" | "logs";

export default function MasterPanelPage() {
    const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
    const [isBusy, setIsBusy] = useState(false);
    const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" }[]>([]);
    
    // Music Stats
    const [dbSongs, setDbSongs] = useState<any[]>([]);
    const [accessLogs, setAccessLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    
    // Computed Stats
    const playlistStats = useMemo(() => {
        if (!dbSongs.length) return [];
        return PLAYLIST_CATEGORIES.map(category => {
            const count = dbSongs.filter(song =>
                category.songTitles.some((title: string) =>
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            ).length;
            return { title: category.title, count, vibes: category.vibes };
        });
    }, [dbSongs]);

    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

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

    const addLog = (text: string, type: "info" | "success" | "error" = "info") => {
        setLogs(prev => [...prev, { text, type }].slice(-10)); // Keep last 10
    };

    const logColor = (type: "info" | "success" | "error") => {
        if (type === "success") return "#10b981"; // emerald-500
        if (type === "error") return "#ef4444"; // red-500
        return "#666";
    };

    const fetchAccessLogs = async () => {
        setLoadingLogs(true);
        try {
            // Using the MASTER_PIN for simplicity as it's the music-specific master password
            const res = await fetch(`/api/music/logs?password=faza123`);
            const data = await res.json();
            if (data.success) {
                setAccessLogs(data.logs);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        }
        setLoadingLogs(false);
    };

    useEffect(() => {
        if (activeModule === "logs") {
            fetchAccessLogs();
        }
    }, [activeModule]);

    // Neo-brutalist shared styles
    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";
    const insetBox = { border: borderStyle, background: "#fff" };

    const backBtn = {
        position: "fixed" as const, top: "1.25rem", left: "1.25rem", zIndex: 100,
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", background: "#fff", border: borderStyle,
        boxShadow: "2px 2px 0 #000", color: "#000", textDecoration: "none",
        fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" as const, fontFamily: "monospace"
    };

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#F5F0EB', zIndex: -1 }} />

            {/* === MASTER PANEL === */}
            <ZenHideable>
                        <main style={{
                            minHeight: "100dvh", display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "flex-start", padding: "1rem", paddingTop: "5rem",
                            paddingBottom: "120px"
                        }}>

                            {/* System Shell */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                                style={{
                                    width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "24px"
                                }}
                            >
                                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                                    <h1 style={{
                                        fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "2rem", fontWeight: 900,
                                        color: "#000", margin: 0, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.04em"
                                    }}>
                                        SETTINGS
                                    </h1>
                                </div>

                                <AnimatePresence mode="wait">
                                {activeModule === "dashboard" && (
                                    <motion.div
                                        key="dashboard"
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                                    >
                                        
                                        {/* Player Data Section */}
                                        <div style={{
                                            ...insetBox, background: "#000", color: "#fff", padding: "16px", boxShadow: shadowStyle, display: "flex", flexDirection: "column", gap: "12px"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #333", paddingBottom: "12px" }}>
                                                <Database size={20} color="#fff" />
                                                <h2 style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                                                    Player Data
                                                </h2>
                                            </div>
                                            
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>Total Tracks</span>
                                                <span style={{ fontFamily: "monospace", fontSize: "1.25rem", fontWeight: 900, color: "#fff" }}>
                                                    {dbSongs.length > 0 ? dbSongs.length : <Loader2 size={16} className="animate-spin" />}
                                                </span>
                                            </div>

                                            {/* Detailed Breakdown */}
                                            {playlistStats.length > 0 && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", borderTop: "2px dashed #333", paddingTop: "16px" }}>
                                                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                                                        Catalog Breakdown
                                                    </span>
                                                    {playlistStats.map(stat => (
                                                        <div key={stat.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.9rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{stat.title}</span>
                                                                <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>{stat.vibes.slice(0, 2).join(", ")}</span>
                                                            </div>
                                                            <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 900, color: "#fff" }}>{stat.count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>Status</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <div style={{ width: "8px", height: "8px", background: "#10b981", border: "1px solid #fff" }} />
                                                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>Online</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>Last Update</span>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>Just Now</span>
                                            </div>
                                        </div>

                                        {/* Modules */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                                            {[
                                                { id: "playlist", icon: <ListMusic size={24} />, label: "Manage Master Playlist", sub: "Add, remove, or edit songs in DB" },
                                                { id: "logs", icon: <Activity size={24} />, label: "Access Logs", sub: "Track visitor IP and geolocation" },
                                            ].map((tool) => (
                                                <motion.button
                                                    key={tool.id}
                                                    onClick={() => setActiveModule(tool.id as ModuleId)}
                                                    whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                                    style={{
                                                        ...insetBox, padding: "16px", boxShadow: shadowStyle,
                                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                                        cursor: "pointer", transition: "background 0.2s"
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <div style={{ width: "40px", height: "40px", border: borderStyle, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                            {tool.icon}
                                                        </div>
                                                        <div style={{ textAlign: "left" }}>
                                                            <div style={{ color: "#000", fontSize: "1rem", fontWeight: 900, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.04em", textTransform: "uppercase" }}>{tool.label}</div>
                                                            <div style={{ color: "#666", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", fontFamily: "monospace", marginTop: "4px" }}>{tool.sub}</div>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}



                                {activeModule === "playlist" && (
                                    <motion.div key="playlist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <motion.button
                                            onClick={() => setActiveModule("dashboard")}
                                            whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                            style={{ 
                                                color: "#000", fontSize: "0.85rem", fontWeight: 800, background: "#fff", border: borderStyle, boxShadow: "4px 4px 0 #000", 
                                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", fontFamily: "monospace" 
                                            }}
                                        >
                                            <ChevronLeft size={16} /> BACK TO SETTINGS
                                        </motion.button>
                                        
                                        <div style={{ padding: "16px", background: "#fff", border: borderStyle, boxShadow: shadowStyle }}>
                                            <PlaylistModule
                                                addLog={addLog}
                                                isBusy={isBusy}
                                                setIsBusy={setIsBusy}
                                                insetBox={insetBox}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {activeModule === "logs" && (
                                    <motion.div key="logs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <motion.button
                                            onClick={() => setActiveModule("dashboard")}
                                            whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                            style={{ 
                                                color: "#000", fontSize: "0.85rem", fontWeight: 800, background: "#fff", border: borderStyle, boxShadow: "4px 4px 0 #000", 
                                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", fontFamily: "monospace" 
                                            }}
                                        >
                                            <ChevronLeft size={16} /> BACK TO SETTINGS
                                        </motion.button>
                                        
                                        <div style={{ padding: "16px", background: "#fff", border: borderStyle, boxShadow: shadowStyle, display: "flex", flexDirection: "column", gap: "16px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <h3 style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1rem", fontWeight: 900, textTransform: "uppercase" }}>Visitor History</h3>
                                                <button onClick={fetchAccessLogs} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}>
                                                    <RefreshCw size={14} className={loadingLogs ? "animate-spin" : ""} />
                                                </button>
                                            </div>

                                            {loadingLogs ? (
                                                <div style={{ textAlign: "center", padding: "20px", fontFamily: "monospace", fontSize: "0.8rem", color: "#666" }}>Loading logs...</div>
                                            ) : accessLogs.length === 0 ? (
                                                <div style={{ textAlign: "center", padding: "20px", fontFamily: "monospace", fontSize: "0.8rem", color: "#666" }}>No logs yet.</div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    {accessLogs.map(log => (
                                                        <div key={log.id} style={{ padding: "12px", background: "#f9f9f9", border: "1px solid #000", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                    <Globe size={12} />
                                                                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 900 }}>{log.ip}</span>
                                                                </div>
                                                                <span style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: "monospace", color: "#666" }}>
                                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            {(log.city || log.country) && (
                                                                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#000", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                                    📍 {log.city || "Unknown City"}, {log.country || "Unknown Country"}
                                                                </div>
                                                            )}
                                                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", color: "#888", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                <Users size={10} />
                                                                {log.userAgent}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* System Logs */}
                            <div style={{ borderTop: "2px dashed #000", padding: "16px 0", marginTop: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                    <Activity size={16} color="#000" />
                                    <span style={{ color: "#000", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "monospace" }}>System Logs</span>
                                </div>
                                <div style={{ minHeight: "60px", padding: "12px", background: "#e5e5e5", border: borderStyle }}>
                                    {logs.length === 0 ? (
                                        <div style={{ color: "#666", fontSize: "0.75rem", fontFamily: "monospace" }}>No recent activity.</div>
                                    ) : (
                                        logs.slice(-4).map((log, i) => (
                                            <div key={i} style={{ color: logColor(log.type), fontSize: "0.75rem", opacity: (i + 1) / 4 + 0.25, fontFamily: "monospace", marginBottom: "4px" }}>
                                                {log.text}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </ZenHideable>
        </>
    );
}
