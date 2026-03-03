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
    Search
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MASTER_PIN = "0000";

type FlowState = "idle" | "fetching" | "editing" | "saving" | "done" | "error";

export default function MasterPanelPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useState("");
    const [pinError, setPinError] = useState(false);
    const [url, setUrl] = useState("");
    const [flowState, setFlowState] = useState<FlowState>("idle");
    const [editArtist, setEditArtist] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [pendingData, setPendingData] = useState<{ audioUrl: string; duration: number } | null>(null);
    const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" }[]>([]);
    const [lastSong, setLastSong] = useState<{ artist: string; title: string } | null>(null);
    const artistInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    useEffect(() => {
        if (flowState === "editing") artistInputRef.current?.focus();
    }, [flowState]);

    useEffect(() => {
        if (typeof window !== "undefined" && sessionStorage.getItem("master_unlocked") === "true") {
            setIsUnlocked(true);
        }
    }, []);

    const handleUnlock = () => {
        if (pin === MASTER_PIN) {
            setIsUnlocked(true);
            setPinError(false);
            sessionStorage.setItem("master_unlocked", "true");
        } else {
            setPinError(true);
            setPin("");
        }
    };

    const addLog = (text: string, type: "info" | "success" | "error" = "info") => {
        setLogs(prev => [...prev, { text, type }]);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
            inputRef.current?.focus();
        } catch { }
    };

    const handleFetch = async () => {
        if (!url || flowState === "fetching") return;
        setFlowState("fetching");
        setLastSong(null);
        setLogs([]);
        addLog(`Target: ${url}`);
        addLog("Extracting audio...");
        try {
            const res = await fetch("/api/music/master/fetch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (data.success) {
                addLog("Audio uploaded ✓", "success");
                addLog("Review Artist & Title, then save.", "info");
                setEditArtist(data.suggestedArtist || "");
                setEditTitle(data.suggestedTitle || "");
                setPendingData({ audioUrl: data.audioUrl, duration: data.duration });
                setFlowState("editing");
                setUrl("");
            } else {
                setFlowState("error");
                addLog(data.error || "Unknown error", "error");
            }
        } catch (error: any) {
            setFlowState("error");
            addLog(error.message || "Network error", "error");
        }
    };

    const handleSave = async () => {
        if (!pendingData || !editTitle.trim()) return;
        setFlowState("saving");
        addLog(`Saving: ${editArtist} — ${editTitle}`, "info");
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
                addLog("Saved to library ✓", "success");
                setLastSong({ artist: editArtist.trim(), title: editTitle.trim() });
                setFlowState("done");
                setPendingData(null);
                setEditArtist("");
                setEditTitle("");
            } else {
                addLog(data.error || "Save failed", "error");
                setFlowState("editing");
            }
        } catch (error: any) {
            addLog(error.message || "Save error", "error");
            setFlowState("editing");
        }
    };

    const handleReset = () => {
        setFlowState("idle");
        setLogs([]);
        setLastSong(null);
        setPendingData(null);
        setEditArtist("");
        setEditTitle("");
    };

    const ledColor = () => {
        if (flowState === "done") return "#39ff14";
        if (flowState === "error") return "#ef4444";
        if (flowState === "editing") return "#3b82f6";
        if (flowState === "idle") return "#555";
        return "#ff9f0a";
    };

    const logColor = (type: "info" | "success" | "error") => {
        if (type === "success") return "#39ff14";
        if (type === "error") return "#ef4444";
        return "#666";
    };

    const isBusy = flowState === "fetching" || flowState === "saving";

    // ─── Shared DAP shell styles ───
    const shellBg = "linear-gradient(180deg, #2d2d2d 0%, #252525 100%)";
    const shellBorder = "2px solid #111";
    const shellRadius = "24px";
    const shellShadow = "0 40px 70px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)";
    const insetBox = { background: "#1e1e1e", border: "1.5px solid #2a2a2a", borderRadius: "10px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" };
    const backBtn = {
        position: "fixed" as const, top: "1.25rem", left: "1.25rem", zIndex: 100,
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", background: "#2a2a2a", border: "1.5px solid #333",
        borderRadius: "8px", color: "#777", textDecoration: "none",
        fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px",
    };

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a1a1a', zIndex: -1 }} />

            {/* === PIN LOCK === */}
            {!isUnlocked ? (
                <main style={{
                    minHeight: "100dvh", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", padding: "1rem",
                }}>
                    <Link href="/music" style={{ textDecoration: "none" }}>
                        <motion.div style={backBtn} whileTap={{ scale: 0.95 }}>
                            <ChevronLeft size={14} strokeWidth={2.5} /><span>Hub</span>
                        </motion.div>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            width: "100%", maxWidth: "300px",
                            background: shellBg, border: shellBorder, borderRadius: shellRadius,
                            padding: "2rem 1.5rem",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem",
                            boxShadow: shellShadow,
                        }}
                    >
                        <div style={{
                            ...insetBox,
                            width: "44px", height: "44px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Lock size={20} color="#666" strokeWidth={2.5} />
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ color: "#aaa", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "3px", margin: 0, textTransform: "uppercase" }}>
                                Master Ctrl
                            </h2>
                            <p style={{ color: "#444", fontSize: "0.6rem", fontWeight: 500, margin: "6px 0 0 0" }}>
                                Enter access code
                            </p>
                        </div>

                        <motion.div
                            animate={pinError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6rem" }}
                        >
                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setPinError(false); }}
                                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                                placeholder="• • • •"
                                autoFocus
                                style={{
                                    width: "100%", ...insetBox,
                                    padding: "0.85rem", color: "#aaa",
                                    fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 700,
                                    textAlign: "center", letterSpacing: "8px", outline: "none",
                                    borderColor: pinError ? "#ef4444" : "#2a2a2a",
                                }}
                            />
                            {pinError && (
                                <p style={{ color: "#ef4444", fontSize: "0.6rem", fontWeight: 600, textAlign: "center", margin: 0 }}>
                                    Wrong code.
                                </p>
                            )}
                        </motion.div>

                        <motion.button
                            onClick={handleUnlock}
                            disabled={pin.length < 4}
                            whileTap={{ scale: 0.95, y: 2 }}
                            style={{
                                width: "100%", ...insetBox,
                                padding: "0.75rem",
                                color: pin.length >= 4 ? "#aaa" : "#444",
                                fontWeight: 800, letterSpacing: "2px", fontSize: "0.7rem",
                                cursor: pin.length >= 4 ? "pointer" : "not-allowed",
                                textAlign: "center",
                            }}
                        >
                            UNLOCK
                        </motion.button>
                    </motion.div>
                </main>

            ) : (

                /* === UNLOCKED: MASTER PANEL === */
                <ZenHideable>
                    <main style={{
                        minHeight: "100dvh", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", padding: "1rem",
                        position: "relative", zIndex: 1,
                    }}>
                        <Link href="/music" style={{ textDecoration: "none" }}>
                            <motion.div style={backBtn} whileTap={{ scale: 0.95 }}>
                                <ChevronLeft size={14} strokeWidth={2.5} /><span>Hub</span>
                            </motion.div>
                        </Link>

                        {/* DAP Chassis */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 250, damping: 25 }}
                            style={{
                                width: "100%", maxWidth: "380px",
                                background: shellBg, border: shellBorder, borderRadius: shellRadius,
                                display: "flex", flexDirection: "column",
                                boxShadow: shellShadow, overflow: "hidden",
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.25rem 0.5rem" }}>
                                <span style={{ color: "#555", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
                                    Master Control
                                </span>
                                <motion.div
                                    animate={isBusy ? { opacity: [0.3, 1, 0.3] } : {}}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: ledColor(),
                                        boxShadow: `0 0 ${isBusy ? "6px" : "2px"} ${ledColor()}`,
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div style={{ padding: "0.5rem 1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                                {/* How It Works (idle only) */}
                                <AnimatePresence>
                                    {flowState === "idle" && logs.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            style={{ ...insetBox, padding: "0.85rem" }}
                                        >
                                            <p style={{ color: "#555", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.6rem 0" }}>
                                                How it works
                                            </p>
                                            {[
                                                { icon: <Clipboard size={12} />, text: "Paste a YouTube link" },
                                                { icon: <Search size={12} />, text: "Audio extracted & uploaded" },
                                                { icon: <PenLine size={12} />, text: "Edit the title" },
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
                                    {logs.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ ...insetBox, padding: "0.85rem" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                                                {flowState === "done" ? <CheckCircle2 size={12} color="#39ff14" strokeWidth={2.5} />
                                                    : flowState === "error" ? <XCircle size={12} color="#ef4444" strokeWidth={2.5} />
                                                        : flowState === "editing" ? <PenLine size={12} color="#3b82f6" strokeWidth={2.5} />
                                                            : <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={12} color="#ff9f0a" strokeWidth={2.5} /></motion.div>}
                                                <span style={{ color: ledColor(), fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                                                    {flowState === "fetching" ? "Extracting..." : flowState === "editing" ? "Edit Title" : flowState === "saving" ? "Saving..." : flowState === "done" ? "Complete" : flowState === "error" ? "Failed" : ""}
                                                </span>
                                            </div>
                                            <div style={{ maxHeight: "70px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", scrollbarWidth: "none" }}>
                                                {logs.map((log, i) => (
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
                                                    style={{
                                                        background: "#151515", border: "1.5px solid #222", borderRadius: "6px",
                                                        padding: "0.6rem 0.7rem", color: "#ccc",
                                                        fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600,
                                                        outline: "none", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)"
                                                    }}
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
                                                    style={{
                                                        background: "#151515", border: "1.5px solid #222", borderRadius: "6px",
                                                        padding: "0.6rem 0.7rem", color: "#ccc",
                                                        fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600,
                                                        outline: "none", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)"
                                                    }}
                                                />
                                            </div>

                                            <motion.button
                                                onClick={handleSave}
                                                disabled={!editTitle.trim()}
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
                                                    style={{
                                                        flex: 1, ...insetBox,
                                                        padding: "0.6rem 0.7rem", color: "#aaa",
                                                        fontFamily: "monospace", fontSize: "0.65rem",
                                                        outline: "none",
                                                    }}
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
                        </motion.div>
                    </main>
                </ZenHideable>
            )}
        </>
    );
}
