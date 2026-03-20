"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Radio, Play, Square, RefreshCw, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Playlist {
    id: string;
    title: string;
    slug: string;
}

interface LiveSession {
    id: string;
    isActive: boolean;
    startedAt: string;
    playlist: { id: string; title: string; slug: string };
}

export function LiveControlModule() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
    const [stationTitle, setStationTitle] = useState("");
    const [stationDesc, setStationDesc] = useState("");
    const [activeSessions, setActiveSessions] = useState<LiveSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/live-music");
            const data = await res.json();
            if (data.success) {
                setActiveSessions(data.sessions || []);
            }
        } catch {
            // Silent fail
        }
    }, []);

    const fetchPlaylists = useCallback(async () => {
        try {
            const res = await fetch("/api/music/master/playlists");
            const data = await res.json();
            if (data.success && data.playlists) {
                setPlaylists(data.playlists);
                if (data.playlists.length > 0 && !selectedPlaylistId) {
                    setSelectedPlaylistId(data.playlists[0].id);
                }
            }
        } catch {
            // Silent fail
        }
    }, [selectedPlaylistId]);

    useEffect(() => {
        Promise.all([fetchStatus(), fetchPlaylists()]).finally(() => setIsLoading(false));
    }, [fetchStatus, fetchPlaylists]);

    const handleGoLive = async () => {
        if (!selectedPlaylistId) return;
        setIsActioning(true);
        setStatusMessage(null);
        try {
            const res = await fetch("/api/live-music", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    action: "start", 
                    playlistId: selectedPlaylistId,
                    title: stationTitle,
                    description: stationDesc
                })
            });
            const data = await res.json();
            if (data.success) {
                setActiveSessions(prev => [data.session, ...prev]);
                setStationTitle("");
                setStationDesc("");
                setStatusMessage({ text: "LIVE SESSION STARTED", type: "success" });
            } else {
                setStatusMessage({ text: data.error || "Failed to go live", type: "error" });
            }
        } catch (err: any) {
            setStatusMessage({ text: err.message || "Network error", type: "error" });
        }
        setIsActioning(false);
    };

    const handleStopSession = async (sessionId?: string) => {
        setIsActioning(true);
        setStatusMessage(null);
        try {
            const res = await fetch("/api/live-music", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "stop", sessionId })
            });
            const data = await res.json();
            if (data.success) {
                if (sessionId) {
                    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
                    setStatusMessage({ text: "STATION STOPPED", type: "success" });
                } else {
                    setActiveSessions([]);
                    setStatusMessage({ text: "ALL SESSIONS STOPPED", type: "success" });
                }
            } else {
                setStatusMessage({ text: data.error || "Failed to stop", type: "error" });
            }
        } catch (err: any) {
            setStatusMessage({ text: err.message || "Network error", type: "error" });
        }
        setIsActioning(false);
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", gap: "12px" }} className="animate-pulse">
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
                <div style={{ width: "80px", height: "8px", borderRadius: "4px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }} />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Start Session Module */}
            <div style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.45)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "20px", padding: "20px",
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.03)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)", paddingBottom: "12px" }}>
                    <Play size={16} color={isDark ? "#FFF" : "#000"} />
                    <h2 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Start New Session
                    </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                    <div>
                        <label style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                            PLAYLIST
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={selectedPlaylistId}
                                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                                style={{
                                    width: "100%", padding: "12px 14px", appearance: "none",
                                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: "14px", color: isDark ? "#FFF" : "#000",
                                    fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 800,
                                    cursor: "pointer", outline: "none"
                                }}
                            >
                                {playlists.map(p => (
                                    <option key={p.id} value={p.id} style={{ background: isDark ? "#111" : "#FFF", color: isDark ? "#FFF" : "#000" }}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <label style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                                STATION TITLE
                            </label>
                            <input 
                                value={stationTitle}
                                onChange={e => setStationTitle(e.target.value)}
                                placeholder="e.g. Midnight Chill"
                                style={{
                                    width: "100%", padding: "12px 14px",
                                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: "14px", color: isDark ? "#FFF" : "#000",
                                    fontFamily: headerFont, fontSize: "0.8rem", fontWeight: 700,
                                    outline: "none"
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                                TAGLINE
                            </label>
                            <input 
                                value={stationDesc}
                                onChange={e => setStationDesc(e.target.value)}
                                placeholder="Optional description"
                                style={{
                                    width: "100%", padding: "12px 14px",
                                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: "14px", color: isDark ? "#FFF" : "#000",
                                    fontFamily: headerFont, fontSize: "0.8rem", fontWeight: 700,
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoLive}
                        disabled={isActioning || !selectedPlaylistId}
                        style={{
                            flex: 1, padding: "14px", borderRadius: "14px",
                            background: isDark ? "#6366F1" : "#000", color: "#FFF",
                            border: "none", cursor: (isActioning || !selectedPlaylistId) ? "not-allowed" : "pointer",
                            fontFamily: headerFont, fontWeight: 900, fontSize: "0.8rem",
                            textTransform: "uppercase", letterSpacing: "0.05em",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            opacity: (isActioning || !selectedPlaylistId) ? 0.7 : 1
                        }}
                    >
                        {isActioning ? <span className="animate-pulse">...</span> : <Radio size={16} />}
                        START BROADCAST
                    </motion.button>
                </div>

                {statusMessage && (
                    <div style={{
                        marginTop: "12px", padding: "10px 14px", borderRadius: "12px",
                        backgroundColor: statusMessage.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${statusMessage.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700,
                        color: statusMessage.type === "success" ? "#10B981" : "#EF4444",
                    }}>
                        {statusMessage.text}
                    </div>
                )}
            </div>

            {/* Active Sessions List */}
            <div style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.45)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "20px", padding: "20px",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Radio size={16} color={activeSessions.length > 0 ? "#EF4444" : "#666"} />
                        <h2 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Active Stations ({activeSessions.length})
                        </h2>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchStatus()}
                        style={{ background: "none", border: "none", color: isDark ? "rgba(255,255,255,0.4)" : "#666", cursor: "pointer" }}
                    >
                        <RefreshCw size={14} className={isActioning ? "animate-spin" : ""} />
                    </motion.button>
                </div>

                {activeSessions.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: headerFont, fontSize: "0.8rem", color: isDark ? "rgba(255,255,255,0.3)" : "#999", border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "#DDD"}`, borderRadius: "14px" }}>
                        NO ACTIVE BROADCASTS
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {activeSessions.map((session) => (
                            <div key={session.id} style={{
                                padding: "16px", borderRadius: "16px",
                                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
                                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                                display: "flex", alignItems: "center", justifyContent: "space-between"
                            }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                                        <h3 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.9rem", fontWeight: 900, color: isDark ? "#FFF" : "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {session.playlist.title}
                                        </h3>
                                    </div>
                                    <div style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "#666" }}>
                                        SESSION ID: {session.id.slice(0, 8)}... • STARTED {new Date(session.startedAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStopSession(session.id)}
                                    style={{
                                        width: "36px", height: "36px", borderRadius: "10px",
                                        background: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)",
                                        border: "none", color: "#EF4444", cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}
                                >
                                    <Square size={14} fill="currentColor" />
                                </motion.button>
                            </div>
                        ))}
                        
                        <button 
                            onClick={() => handleStopSession()}
                            style={{ 
                                marginTop: "10px", padding: "10px", background: "none", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, 
                                borderRadius: "10px", color: "#EF4444", fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 800, cursor: "pointer", textTransform: "uppercase" 
                            }}
                        >
                            Emergency Stop All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
