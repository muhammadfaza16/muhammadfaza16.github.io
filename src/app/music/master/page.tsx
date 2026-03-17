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
import { parseSongTitle } from "@/utils/songUtils";

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
    const [logError, setLogError] = useState<string | null>(null);
    const [isLogsUnlocked, setIsLogsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState("");
    
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
        if (type === "success") return "#059669"; // emerald-600 (darker)
        if (type === "error") return "#dc2626"; // red-600 (darker)
        return "#333"; // darker than #666
    };

    const fetchAccessLogs = async () => {
        setLoadingLogs(true);
        setLogError(null);
        try {
            // Using the MASTER_PIN requested by user
            const res = await fetch(`/api/music/logs?password=${MASTER_PIN}`);
            const data = await res.json();
            if (data.success) {
                setAccessLogs(data.logs);
            } else {
                setLogError(data.error || "Failed to load logs");
            }
        } catch (err: any) {
            console.error("Failed to fetch logs:", err);
            setLogError(err.message || "Network error");
        }
        setLoadingLogs(false);
    };

    useEffect(() => {
        if (activeModule === "logs") {
            fetchAccessLogs();
        }
    }, [activeModule]);

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    return (
        <main style={{
            minHeight: "100svh",
            padding: "16px 16px 120px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#f9f9f9",
            color: "#000",
            fontFamily: monoFont
        }}>
            <ZenHideable>
                <div style={{ padding: "1rem", paddingTop: "5rem" }}>
                    {/* System Shell */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        style={{
                            width: "100%", display: "flex", flexDirection: "column", gap: "24px"
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "8px" }}>
                            <h1 style={{
                                fontFamily: headerFont, fontSize: "1.5rem", fontWeight: 900,
                                color: "#000", margin: 0, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.03em"
                            }}>
                                Vault Master
                            </h1>
                            <p style={{
                                fontSize: "0.6rem", fontWeight: 700, color: "#888", marginTop: "6px", 
                                textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>
                                SYSTEM CONTROLS & MONITORING
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeModule === "dashboard" && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                    style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                                >
                                    {/* Player Intelligence Card */}
                                    <div style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.45)",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        borderRadius: "24px",
                                        padding: "20px",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "12px" }}>
                                            <Database size={16} color="#000" />
                                            <h2 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                Player Intelligence
                                            </h2>
                                        </div>
                                        
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.02em" }}>Catalog Weight</span>
                                            <span style={{ fontFamily: headerFont, fontSize: "1.1rem", fontWeight: 900, color: "#000" }}>
                                                {dbSongs.length > 0 ? `${dbSongs.length} TRACKS` : "..."}
                                            </span>
                                        </div>

                                        {playlistStats.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px", borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "16px" }}>
                                                {playlistStats.map(stat => (
                                                    <div key={stat.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <span style={{ fontFamily: headerFont, fontSize: "0.8rem", fontWeight: 800, color: "#000", letterSpacing: "-0.01em" }}>{stat.title}</span>
                                                            <span style={{ fontFamily: monoFont, fontSize: "0.55rem", fontWeight: 700, color: "#888", textTransform: "uppercase" }}>{stat.vibes.slice(0, 1).join(", ")}</span>
                                                        </div>
                                                        <span style={{ fontFamily: monoFont, fontSize: "0.8rem", fontWeight: 900, color: "#000" }}>{stat.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", borderTop: "1px solid rgba(0,0,0,0.03)", paddingTop: "12px" }}>
                                            <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: "#888", textTransform: "uppercase" }}>Status</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
                                                <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>Verified Online</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tool Buttons */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                                        {[
                                            { id: "playlist", icon: <ListMusic size={20} />, label: "Playlist Vault", sub: "Structural Database Control" },
                                            { id: "logs", icon: <Activity size={20} />, label: "Access Insight", sub: "Visitor Geolocation & Traffic" },
                                        ].map((tool) => (
                                            <motion.button
                                                key={tool.id}
                                                onClick={() => setActiveModule(tool.id as ModuleId)}
                                                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.8)" }}
                                                whileTap={{ scale: 0.99 }}
                                                style={{
                                                    backgroundColor: "rgba(255, 255, 255, 0.45)",
                                                    border: "1px solid rgba(0,0,0,0.05)",
                                                    borderRadius: "20px",
                                                    padding: "16px",
                                                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s ease"
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(0,0,0,0.1)"}}>
                                                        {tool.icon}
                                                    </div>
                                                    <div style={{ textAlign: "left" }}>
                                                        <div style={{ color: "#000", fontSize: "0.9rem", fontWeight: 900, fontFamily: headerFont, letterSpacing: "-0.01em", textTransform: "uppercase" }}>{tool.label}</div>
                                                        <div style={{ color: "#888", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", fontFamily: monoFont }}>{tool.sub}</div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeModule === "playlist" && (
                                <motion.div key="playlist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <motion.button
                                        onClick={() => setActiveModule("dashboard")}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ 
                                            color: "#888", fontSize: "0.65rem", fontWeight: 800, background: "transparent", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "12px",
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", fontFamily: monoFont, textTransform: "uppercase"
                                        }}
                                    >
                                        <ChevronLeft size={14} /> Back to dashboard
                                    </motion.button>
                                    
                                    <div style={{ 
                                        padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.45)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                                    }}>
                                        <PlaylistModule
                                            addLog={addLog}
                                            isBusy={isBusy}
                                            setIsBusy={setIsBusy}
                                            insetBox={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", background: "rgba(255,255,255,0.6)" }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeModule === "logs" && (
                                <motion.div key="logs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <motion.button
                                        onClick={() => setActiveModule("dashboard")}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ 
                                            color: "#888", fontSize: "0.65rem", fontWeight: 800, background: "transparent", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "12px",
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", fontFamily: monoFont, textTransform: "uppercase"
                                        }}
                                    >
                                        <ChevronLeft size={14} /> Back to dashboard
                                    </motion.button>
                                    
                                    <div style={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.45)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "300px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h3 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", color: "#000", letterSpacing: "0.05em" }}>Visitor Intelligence</h3>
                                            {isLogsUnlocked && (
                                                <button onClick={fetchAccessLogs} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                                                    <RefreshCw size={14} className={loadingLogs ? "animate-spin" : ""} />
                                                </button>
                                            )}
                                        </div>

                                        {!isLogsUnlocked ? (
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px 0" }}>
                                                <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Lock size={20} color="#888" />
                                                </div>
                                                <div style={{ textAlign: "center" }}>
                                                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#000", fontFamily: headerFont, textTransform: "uppercase" }}>Vault Protected</div>
                                                    <div style={{ fontSize: "0.55rem", fontWeight: 700, color: "#888", fontFamily: monoFont, textTransform: "uppercase", marginTop: "2px" }}>Enter Authorization PIN</div>
                                                </div>
                                                <input 
                                                    type="password" 
                                                    value={pinInput}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setPinInput(val);
                                                        if (val === MASTER_PIN) {
                                                            setIsLogsUnlocked(true);
                                                            setPinInput("");
                                                        }
                                                    }}
                                                    placeholder="••••"
                                                    autoFocus
                                                    style={{
                                                        width: "80px",
                                                        padding: "10px",
                                                        textAlign: "center",
                                                        fontSize: "1rem",
                                                        letterSpacing: "0.2em",
                                                        fontWeight: 900,
                                                        border: "1px solid rgba(0,0,0,0.1)",
                                                        borderRadius: "12px",
                                                        background: "#fff",
                                                        outline: "none",
                                                        fontFamily: monoFont
                                                    }}
                                                />
                                            </div>
                                        ) : loadingLogs ? (
                                            <div style={{ textAlign: "center", padding: "20px", fontFamily: monoFont, fontSize: "0.65rem", color: "#888" }}>SCANNING LOGS...</div>
                                        ) : (
                                            <div style={{ 
                                                display: "flex", flexDirection: "column", gap: "10px",
                                                maxHeight: "450px", overflowY: "auto", paddingRight: "4px"
                                            }}>
                                                {accessLogs.map(log => (
                                                    <div key={log.id} style={{ 
                                                        padding: "16px", backgroundColor: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(0,0,0,0.05)", 
                                                        borderRadius: "16px", display: "flex", flexDirection: "column", gap: "8px"
                                                    }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                <Globe size={12} color="#888" />
                                                                <span style={{ fontFamily: monoFont, fontSize: "0.75rem", fontWeight: 800, color: "#000" }}>
                                                                    {(log.ip === "::1" || log.ip === "127.0.0.1") ? "Localhost" : log.ip}
                                                                </span>
                                                            </div>
                                                            <span style={{ fontSize: "0.55rem", fontWeight: 800, fontFamily: monoFont, color: "#888", textTransform: "uppercase" }}>
                                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>

                                                        {log.songTitle && (() => {
                                                            const { cleanTitle, labels } = parseSongTitle(log.songTitle);
                                                            return (
                                                                <div style={{ padding: "8px 12px", background: "rgba(0,0,0,0.02)", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.03)" }}>
                                                                    <div style={{ fontSize: "0.5rem", fontWeight: 800, color: "#888", textTransform: "uppercase", marginBottom: "2px" }}>HEARING</div>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                                                        <div style={{ fontSize: "0.7rem", fontWeight: 900, color: "#000", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: headerFont }}>
                                                                            {cleanTitle}
                                                                        </div>
                                                                        {labels.map(label => (
                                                                            <span key={label} style={{
                                                                                fontSize: "0.38rem",
                                                                                fontFamily: headerFont,
                                                                                fontWeight: 800,
                                                                                backgroundColor: "rgba(0,0,0,0.04)",
                                                                                color: "rgba(0,0,0,0.5)",
                                                                                padding: "1px 5px",
                                                                                borderRadius: "100px",
                                                                                letterSpacing: "0.06em",
                                                                                textTransform: "uppercase",
                                                                                border: "1px solid rgba(0,0,0,0.05)",
                                                                                flexShrink: 0
                                                                            }}>{label}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}

                                                        {(log.city || log.country) && (
                                                            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                                                                <span>📍</span>
                                                                {log.city || "Unknown"}, {log.country || "Earth"}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Recent Activity Log */}
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", padding: "20px 0", marginTop: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                <Activity size={14} color="#888" />
                                <span style={{ color: "#888", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: monoFont }}>Recent Activity Log</span>
                            </div>
                            <div style={{ 
                                minHeight: "60px", 
                                padding: "16px", 
                                backgroundColor: "rgba(255, 255, 255, 0.45)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                borderRadius: "16px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                            }}>
                                {logs.length === 0 ? (
                                    <div style={{ color: "#aaa", fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700 }}>SYSTEM STANDBY...</div>
                                ) : (
                                    logs.slice(-4).map((log, i) => (
                                        <div key={i} style={{ color: logColor(log.type), fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700, marginBottom: "4px" }}>
                                            {log.text.toUpperCase()}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </ZenHideable>
        </main>
    );
}
