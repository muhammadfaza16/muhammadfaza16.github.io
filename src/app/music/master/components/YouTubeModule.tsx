"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clipboard,
    Search,
    PenLine,
    Save,
    Loader2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { inputStyle } from "./sharedStyles";

interface YouTubeModuleProps {
    addLog: (text: string, type?: "info" | "success" | "error") => void;
    ledColor: () => string;
    logColor: (type: "info" | "success" | "error") => string;
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
    insetBox: any;
}

export function YouTubeModule({
    addLog,
    ledColor,
    logColor,
    isBusy,
    setIsBusy,
    insetBox
}: YouTubeModuleProps) {
    const [url, setUrl] = useState("");
    const [flowState, setFlowState] = useState<"idle" | "fetching" | "editing" | "saving" | "done" | "error">("idle");
    const [editArtist, setEditArtist] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [pendingData, setPendingData] = useState<{ audioUrl: string; duration: number } | null>(null);
    const [lastSong, setLastSong] = useState<{ artist: string; title: string } | null>(null);
    const [moduleLogs, setModuleLogs] = useState<{ text: string; type: "info" | "success" | "error" }[]>([]);

    const artistInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [moduleLogs]);

    useEffect(() => {
        if (flowState === "editing") artistInputRef.current?.focus();
    }, [flowState]);

    const internalAddLog = (text: string, type: "info" | "success" | "error" = "info") => {
        setModuleLogs(prev => [...prev, { text, type }]);
        addLog(text, type);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
            inputRef.current?.focus();
        } catch { }
    };

    const handleFetch = async () => {
        if (!url || isBusy) return;
        setIsBusy(true);
        setFlowState("fetching");
        setLastSong(null);
        setModuleLogs([]);
        internalAddLog(`Target: ${url}`);
        internalAddLog("Extracting audio...");
        try {
            const res = await fetch("/api/music/master/fetch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (data.success) {
                internalAddLog("Audio uploaded ✓", "success");
                internalAddLog("Review Artist & Title, then save.", "info");
                setEditArtist(data.suggestedArtist || "");
                setEditTitle(data.suggestedTitle || "");
                setPendingData({ audioUrl: data.audioUrl, duration: data.duration });
                setFlowState("editing");
                setUrl("");
            } else {
                setFlowState("error");
                internalAddLog(data.error || "Unknown error", "error");
            }
        } catch (error: any) {
            setFlowState("error");
            internalAddLog(error.message || "Network error", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const handleSave = async () => {
        if (!pendingData || !editTitle.trim()) return;
        setIsBusy(true);
        setFlowState("saving");
        internalAddLog(`Saving: ${editArtist} — ${editTitle}`, "info");
        try {
            const res = await fetch("/api/music/master/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    artist: editArtist.trim(),
                    title: editTitle.trim(),
                    audioUrl: pendingData.audioUrl,
                    duration: pendingData.duration
                })
            });
            const data = await res.json();
            if (data.success) {
                internalAddLog("Saved to library ✓", "success");
                setLastSong({ artist: editArtist.trim(), title: editTitle.trim() });
                setFlowState("done");
                setPendingData(null);
                setEditArtist("");
                setEditTitle("");
            } else {
                internalAddLog(data.error || "Save failed", "error");
                setFlowState("editing");
            }
        } catch (error: any) {
            internalAddLog(error.message || "Save error", "error");
            setFlowState("editing");
        } finally {
            setIsBusy(false);
        }
    };

    const handleReset = () => {
        setFlowState("idle");
        setModuleLogs([]);
        setLastSong(null);
        setPendingData(null);
        setEditArtist("");
        setEditTitle("");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* How It Works (idle only) */}
            <AnimatePresence>
                {flowState === "idle" && moduleLogs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ ...insetBox, padding: "0.85rem" }}
                    >
                        <p style={{ color: "#555", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.6rem 0" }}>
                            YouTube Fetcher
                        </p>
                        {[
                            { icon: <Clipboard size={12} />, text: "Paste a YouTube link" },
                            { icon: <Search size={12} />, text: "Audio extracted & uploaded" },
                            { icon: <PenLine size={12} />, text: "Edit Artist & Title" },
                            { icon: <Save size={12} />, text: "Save to library" },
                        ].map((step, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <div style={{ color: "#444", flexShrink: 0 }}>{step.icon}</div>
                                <span style={{ color: "#666", fontSize: "0.6rem", fontWeight: 500 }}>{step.text}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Log */}
            <AnimatePresence>
                {moduleLogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ ...insetBox, padding: "0.85rem" }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                            {flowState === "done" ? <CheckCircle2 size={12} color="#39ff14" strokeWidth={2.5} />
                                : flowState === "error" ? <XCircle size={12} color="#ef4444" strokeWidth={2.5} />
                                    : flowState === "editing" ? <PenLine size={12} color="#3b82f6" strokeWidth={2.5} />
                                        : <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={12} color="#ff9f0a" strokeWidth={2.5} /></motion.div>}
                            <span style={{ color: ledColor(), fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                                {flowState === "fetching" ? "Extracting..." : flowState === "editing" ? "Edit Metadata" : flowState === "saving" ? "Saving..." : flowState === "done" ? "Complete" : flowState === "error" ? "Failed" : "Idle"}
                            </span>
                        </div>
                        <div style={{ maxHeight: "70px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", scrollbarWidth: "none" }}>
                            {moduleLogs.map((log, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                                    style={{ fontFamily: "monospace", fontSize: "0.58rem", color: logColor(log.type), wordBreak: "break-all", lineHeight: 1.4, display: "flex", gap: "5px" }}
                                >
                                    <span style={{ opacity: 0.4 }}>›</span>
                                    <span>{log.text}</span>
                                </motion.div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editable Metadata (Step 2) */}
            <AnimatePresence>
                {flowState === "editing" && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ ...insetBox, padding: "0.85rem", borderColor: "#3b82f6", display: "flex", flexDirection: "column", gap: "0.6rem" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.55rem", fontWeight: 800, color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                Artist
                            </label>
                            <input
                                ref={artistInputRef}
                                type="text"
                                value={editArtist}
                                onChange={(e) => setEditArtist(e.target.value)}
                                placeholder="e.g. Lewis Capaldi"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.55rem", fontWeight: 800, color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                Song Title
                            </label>
                            <input
                                ref={titleInputRef}
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                placeholder="e.g. Someone You Loved"
                                style={inputStyle}
                            />
                        </div>

                        <motion.button
                            onClick={handleSave}
                            disabled={!editTitle.trim() || isBusy}
                            whileTap={{ scale: 0.95, y: 2 }}
                            style={{
                                background: "#1e1e1e", border: "1.5px solid #222", borderRadius: "8px",
                                padding: "0.75rem", color: editTitle.trim() ? "#39ff14" : "#444",
                                fontWeight: 800, letterSpacing: "1px", fontSize: "0.65rem",
                                cursor: editTitle.trim() ? "pointer" : "not-allowed",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "0.25rem"
                            }}
                        >
                            <Save size={12} strokeWidth={2.5} /> SAVE TO LIBRARY
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Card */}
            <AnimatePresence>
                {lastSong && flowState === "done" && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            background: "rgba(57, 255, 20, 0.04)",
                            border: "1.5px solid rgba(57, 255, 20, 0.15)",
                            borderRadius: "10px",
                            padding: "0.65rem 0.85rem",
                            display: "flex", alignItems: "center", gap: "8px"
                        }}
                    >
                        <CheckCircle2 size={16} color="#39ff14" strokeWidth={2} />
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#aaa", fontSize: "0.72rem", fontWeight: 700, margin: 0 }}>{lastSong.artist} — {lastSong.title}</p>
                            <p style={{ color: "#555", fontSize: "0.55rem", fontWeight: 500, margin: "2px 0 0 0" }}>Added to library</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fetch Another */}
            <AnimatePresence>
                {(flowState === "done" || flowState === "error") && (
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={handleReset}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            ...insetBox, padding: "0.55rem",
                            color: "#666", fontWeight: 800, letterSpacing: "1px",
                            fontSize: "0.6rem", cursor: "pointer", textTransform: "uppercase", textAlign: "center",
                        }}
                    >
                        + Fetch Another
                    </motion.button>
                )}
            </AnimatePresence>

            {/* URL Input (Step 1) */}
            <AnimatePresence>
                {(flowState === "idle" || flowState === "error") && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
                    >
                        <label style={{ fontSize: "0.55rem", fontWeight: 700, color: "#555", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                            YouTube URL
                        </label>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                            <motion.button
                                onClick={handlePaste}
                                whileTap={{ scale: 0.9 }}
                                title="Paste"
                                style={{
                                    ...insetBox, padding: "0 0.6rem",
                                    color: "#555", cursor: "pointer",
                                    display: "flex", alignItems: "center",
                                }}
                            >
                                <Clipboard size={13} strokeWidth={2.5} />
                            </motion.button>

                            <input
                                ref={inputRef}
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                                placeholder="https://youtube.com/watch?v=..."
                                disabled={isBusy}
                                style={{ ...inputStyle, flex: 1, padding: "0.6rem 0.7rem", fontSize: "0.65rem" }}
                            />

                            <motion.button
                                onClick={handleFetch}
                                disabled={!url || isBusy}
                                whileTap={{ scale: 0.95, y: 2 }}
                                style={{
                                    ...insetBox, padding: "0 0.85rem",
                                    color: (!url || isBusy) ? "#444" : "#aaa",
                                    fontWeight: 800, letterSpacing: "1px", fontSize: "0.65rem",
                                    cursor: (!url || isBusy) ? "not-allowed" : "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                                }}
                            >
                                {isBusy ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Loader2 size={13} strokeWidth={2.5} />
                                    </motion.div>
                                ) : <Search size={13} strokeWidth={2.5} />}
                                <span>{isBusy ? "..." : "GO"}</span>
                            </motion.button>
                        </div>
                        <p style={{ color: "#444", fontSize: "0.5rem", margin: "2px 0 0 0", fontWeight: 500 }}>
                            Playlist params stripped automatically.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
