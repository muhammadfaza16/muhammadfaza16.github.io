"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Radio, Play, Square, RefreshCw, Loader2, ChevronDown } from "lucide-react";
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
    const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/live-music");
            const data = await res.json();
            if (data.success) {
                setCurrentSession(data.session || null);
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
                body: JSON.stringify({ action: "start", playlistId: selectedPlaylistId })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentSession(data.session);
                setStatusMessage({ text: "LIVE SESSION STARTED", type: "success" });
            } else {
                setStatusMessage({ text: data.error || "Failed to go live", type: "error" });
            }
        } catch (err: any) {
            setStatusMessage({ text: err.message || "Network error", type: "error" });
        }
        setIsActioning(false);
    };

    const handleStopLive = async () => {
        setIsActioning(true);
        setStatusMessage(null);
        try {
            const res = await fetch("/api/live-music", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "stop" })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentSession(null);
                setStatusMessage({ text: "LIVE SESSION STOPPED", type: "success" });
            } else {
                setStatusMessage({ text: data.error || "Failed to stop", type: "error" });
            }
        } catch (err: any) {
            setStatusMessage({ text: err.message || "Network error", type: "error" });
        }
        setIsActioning(false);
    };

    const isLive = currentSession?.isActive === true;

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <Loader2 size={24} className="animate-spin" color={isDark ? "#FFF" : "#000"} />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Status Card */}
            <div style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.45)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "20px", padding: "20px",
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.03)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)", paddingBottom: "12px" }}>
                    <Radio size={16} color={isLive ? "#EF4444" : (isDark ? "#FFF" : "#000")} />
                    <h2 style={{ margin: 0, fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Live Control
                    </h2>
                </div>

                {/* Current Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>
                        Broadcast Status
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <motion.div
                            animate={isLive ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                backgroundColor: isLive ? "#EF4444" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"),
                                boxShadow: isLive ? "0 0 10px rgba(239,68,68,0.5)" : "none"
                            }}
                        />
                        <span style={{
                            fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700,
                            color: isLive ? "#EF4444" : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
                            textTransform: "uppercase"
                        }}>
                            {isLive ? "ON AIR" : "OFF AIR"}
                        </span>
                    </div>
                </div>

                {/* Current playlist info if live */}
                {isLive && currentSession && (
                    <div style={{
                        padding: "12px", borderRadius: "14px", marginBottom: "16px",
                        background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.15)"
                    }}>
                        <div style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", marginBottom: "4px" }}>
                            NOW STREAMING
                        </div>
                        <div style={{ fontFamily: headerFont, fontSize: "0.9rem", fontWeight: 900, color: isDark ? "#FFF" : "#000" }}>
                            {currentSession.playlist.title}
                        </div>
                        <div style={{ fontFamily: monoFont, fontSize: "0.55rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginTop: "4px" }}>
                            STARTED {new Date(currentSession.startedAt).toLocaleTimeString()}
                        </div>
                    </div>
                )}

                {/* Playlist Picker (when not live) */}
                {!isLive && (
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                            SELECT PLAYLIST
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={selectedPlaylistId}
                                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                                style={{
                                    width: "100%", padding: "12px 14px", appearance: "none",
                                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: "14px", color: isDark ? "#FFF" : "#000",
                                    fontFamily: headerFont, fontSize: "0.85rem", fontWeight: 800,
                                    cursor: "pointer", outline: "none"
                                }}
                            >
                                {playlists.map(p => (
                                    <option key={p.id} value={p.id} style={{ background: isDark ? "#1A1A1A" : "#FFF", color: isDark ? "#FFF" : "#000" }}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    {isLive ? (
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStopLive}
                            disabled={isActioning}
                            style={{
                                flex: 1, padding: "14px", borderRadius: "14px",
                                background: "#EF4444", color: "#FFF",
                                border: "none", cursor: isActioning ? "not-allowed" : "pointer",
                                fontFamily: headerFont, fontWeight: 900, fontSize: "0.8rem",
                                textTransform: "uppercase", letterSpacing: "0.05em",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                opacity: isActioning ? 0.7 : 1
                            }}
                        >
                            {isActioning ? <Loader2 size={16} className="animate-spin" /> : <Square size={16} fill="#FFF" />}
                            STOP LIVE
                        </motion.button>
                    ) : (
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
                            {isActioning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="#FFF" />}
                            GO LIVE
                        </motion.button>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { fetchStatus(); }}
                        style={{
                            padding: "0 16px", borderRadius: "14px",
                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                            color: isDark ? "#FFF" : "#000", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <RefreshCw size={16} />
                    </motion.button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div style={{
                        marginTop: "12px", padding: "10px 14px", borderRadius: "12px",
                        backgroundColor: statusMessage.type === "success"
                            ? (isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)")
                            : (isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)"),
                        border: `1px solid ${statusMessage.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        fontFamily: monoFont, fontSize: "0.65rem", fontWeight: 700,
                        color: statusMessage.type === "success" ? "#10B981" : "#EF4444",
                        textTransform: "uppercase"
                    }}>
                        {statusMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
}
