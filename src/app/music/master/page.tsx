"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import {
    ChevronLeft,
    Database,
    Search,
    Download,
    Upload,
    CheckCircle2,
    XCircle,
    Clipboard,
    Loader2,
    Save,
    PenLine
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FlowState = "idle" | "fetching" | "editing" | "saving" | "done" | "error";

export default function MasterPanelPage() {
    const [url, setUrl] = useState("");
    const [flowState, setFlowState] = useState<FlowState>("idle");
    const [editTitle, setEditTitle] = useState("");
    const [pendingData, setPendingData] = useState<{ audioUrl: string; duration: number } | null>(null);
    const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" }[]>([]);
    const [lastSong, setLastSong] = useState<{ title: string } | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    useEffect(() => {
        if (flowState === "editing") titleInputRef.current?.focus();
    }, [flowState]);

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

    // STEP 1: Fetch + Upload (no DB save)
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
                addLog("Audio uploaded to cloud ✓", "success");
                addLog("Edit the title below, then save.", "info");

                // Move to editing state
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

    // STEP 2: Save with user-edited title
    const handleSave = async () => {
        if (!pendingData || !editTitle.trim()) return;

        setFlowState("saving");
        addLog(`Saving as: ${editTitle.trim()}`, "info");

        try {
            const res = await fetch("/api/music/master/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle.trim(),
                    audioUrl: pendingData.audioUrl,
                    duration: pendingData.duration
                })
            });

            const data = await res.json();

            if (data.success) {
                addLog("Saved to library ✓", "success");
                setLastSong({ title: editTitle.trim() });
                setFlowState("done");
                setPendingData(null);
                setEditTitle("");
            } else {
                addLog(data.error || "Save failed", "error");
                setFlowState("editing"); // stay in editing so user can retry
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
        setEditTitle("");
    };

    const ledColor = () => {
        if (flowState === "done") return "#39ff14";
        if (flowState === "error") return "#ef4444";
        if (flowState === "editing") return "#3b82f6";
        if (flowState === "idle") return "#71717a";
        return "#ff9f0a";
    };

    const logColor = (type: "info" | "success" | "error") => {
        if (type === "success") return "#39ff14";
        if (type === "error") return "#ef4444";
        return "#71717a";
    };

    const isBusy = flowState === "fetching" || flowState === "saving";

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#282828', zIndex: -1 }} />

            <ZenHideable>
                <main style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: isMobile ? "5rem 1rem 6rem" : "5rem 2.5rem 6rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Back */}
                    <Link href="/music">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                position: "fixed",
                                top: isMobile ? "1.5rem" : "2.5rem",
                                left: isMobile ? "1.5rem" : "2.5rem",
                                zIndex: 100,
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "8px 16px",
                                background: "#3f3f46", border: "1px solid #18181b",
                                borderBottom: "3px solid #18181b", borderRadius: "6px",
                                color: "#d4d4d8", textDecoration: "none",
                                fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ChevronLeft size={16} strokeWidth={3} />
                            <span>Hub</span>
                        </motion.div>
                    </Link>

                    {/* === CHASSIS === */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        style={{
                            width: "100%", maxWidth: "460px",
                            background: "#3f3f46",
                            border: "2px solid #18181b",
                            borderBottom: "8px solid #18181b",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            display: "flex", flexDirection: "column", gap: "1.25rem",
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.05)"
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Database size={18} color="#a1a1aa" strokeWidth={2.5} />
                                <span style={{ color: "#d4d4d8", fontWeight: 900, letterSpacing: "2px", fontSize: "1rem" }}>
                                    MASTER CTRL
                                </span>
                            </div>
                            <motion.div
                                animate={isBusy ? { opacity: [0.3, 1, 0.3] } : {}}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                style={{
                                    width: "8px", height: "8px", borderRadius: "50%",
                                    background: ledColor(),
                                    boxShadow: `0 0 ${isBusy ? "8px" : "3px"} ${ledColor()}`,
                                    border: "1px solid #111"
                                }}
                            />
                        </div>

                        {/* HOW IT WORKS (idle only) */}
                        <AnimatePresence>
                            {flowState === "idle" && logs.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{
                                        background: "#18181b", borderRadius: "8px",
                                        padding: "1rem", border: "1px solid #27272a",
                                    }}
                                >
                                    <p style={{ color: "#a1a1aa", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 0.75rem 0" }}>
                                        How it works
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                        {[
                                            { icon: <Clipboard size={14} />, text: "Paste a YouTube link below" },
                                            { icon: <Download size={14} />, text: "Audio is extracted & uploaded" },
                                            { icon: <PenLine size={14} />, text: "Edit the song title to your liking" },
                                            { icon: <Save size={14} />, text: "Save to your music library" },
                                        ].map((step, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ color: "#52525b", flexShrink: 0 }}>{step.icon}</div>
                                                <span style={{ color: "#a1a1aa", fontSize: "0.72rem", fontWeight: 500 }}>{step.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* PROGRESS LOG */}
                        <AnimatePresence>
                            {logs.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        background: "#18181b", borderRadius: "8px",
                                        padding: "1rem", border: "1px solid #27272a",
                                    }}
                                >
                                    {/* Status label */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        {flowState === "done" ? <CheckCircle2 size={14} color="#39ff14" strokeWidth={2.5} />
                                            : flowState === "error" ? <XCircle size={14} color="#ef4444" strokeWidth={2.5} />
                                                : flowState === "editing" ? <PenLine size={14} color="#3b82f6" strokeWidth={2.5} />
                                                    : <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={14} color="#ff9f0a" strokeWidth={2.5} /></motion.div>}
                                        <span style={{
                                            color: ledColor(), fontSize: "0.65rem",
                                            fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase"
                                        }}>
                                            {flowState === "fetching" ? "Extracting..." : flowState === "editing" ? "Edit Title" : flowState === "saving" ? "Saving..." : flowState === "done" ? "Complete" : flowState === "error" ? "Failed" : ""}
                                        </span>
                                    </div>

                                    <div style={{ maxHeight: "80px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem", scrollbarWidth: "none" }}>
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ fontFamily: "monospace", fontSize: "0.65rem", color: logColor(log.type), wordBreak: "break-all", lineHeight: 1.4, display: "flex", gap: "6px" }}
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

                        {/* EDITABLE TITLE FIELD (Step 2) */}
                        <AnimatePresence>
                            {flowState === "editing" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        background: "#18181b", borderRadius: "8px",
                                        padding: "1rem", border: "1px solid #3b82f6",
                                        display: "flex", flexDirection: "column", gap: "0.6rem"
                                    }}
                                >
                                    <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "#3b82f6", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                        Song Title
                                    </label>
                                    <input
                                        ref={titleInputRef}
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                        placeholder="Artist — Song Name"
                                        style={{
                                            background: "#111",
                                            border: "2px solid #27272a",
                                            borderRadius: "6px",
                                            padding: "0.75rem 0.8rem",
                                            color: "#e4e4e7",
                                            fontFamily: "monospace",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            outline: "none",
                                            boxShadow: "inset 0 3px 5px rgba(0,0,0,0.3)"
                                        }}
                                    />
                                    <p style={{ color: "#52525b", fontSize: "0.55rem", margin: 0 }}>
                                        Recommended format: Artist — Song Title (use em-dash —)
                                    </p>

                                    <motion.button
                                        onClick={handleSave}
                                        disabled={!editTitle.trim()}
                                        whileTap={{ scale: 0.95, y: 2 }}
                                        style={{
                                            background: "#282828",
                                            border: "2px solid #18181b",
                                            borderBottom: "5px solid #18181b",
                                            borderRadius: "8px",
                                            padding: "0.7rem 1rem",
                                            color: editTitle.trim() ? "#39ff14" : "#52525b",
                                            fontWeight: 900, letterSpacing: "1px", fontSize: "0.72rem",
                                            cursor: editTitle.trim() ? "pointer" : "not-allowed",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            gap: "8px",
                                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)"
                                        }}
                                    >
                                        <Save size={14} strokeWidth={2.5} />
                                        SAVE TO LIBRARY
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SUCCESS CARD */}
                        <AnimatePresence>
                            {lastSong && flowState === "done" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        background: "rgba(57, 255, 20, 0.06)",
                                        border: "1px solid rgba(57, 255, 20, 0.2)",
                                        borderRadius: "8px",
                                        padding: "0.75rem 1rem",
                                        display: "flex", alignItems: "center", gap: "10px"
                                    }}
                                >
                                    <CheckCircle2 size={18} color="#39ff14" strokeWidth={2} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: "#d4d4d8", fontSize: "0.78rem", fontWeight: 700, margin: 0 }}>{lastSong.title}</p>
                                        <p style={{ color: "#71717a", fontSize: "0.6rem", fontWeight: 500, margin: "2px 0 0 0" }}>Added to your library</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* FETCH ANOTHER (after done/error) */}
                        <AnimatePresence>
                            {(flowState === "done" || flowState === "error") && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={handleReset}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: "#282828",
                                        border: "2px solid #18181b",
                                        borderBottom: "4px solid #18181b",
                                        borderRadius: "8px",
                                        padding: "0.6rem",
                                        color: "#a1a1aa",
                                        fontWeight: 800, letterSpacing: "1px", fontSize: "0.65rem",
                                        cursor: "pointer",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    + Fetch Another
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* URL INPUT (Step 1) — only when idle or error */}
                        <AnimatePresence>
                            {(flowState === "idle" || flowState === "error") && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
                                >
                                    <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "#71717a", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                        YouTube URL
                                    </label>
                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        <motion.button
                                            onClick={handlePaste}
                                            whileTap={{ scale: 0.92 }}
                                            title="Paste from clipboard"
                                            style={{
                                                background: "#282828",
                                                border: "2px solid #18181b",
                                                borderBottom: "4px solid #18181b",
                                                borderRadius: "6px",
                                                padding: "0 0.65rem",
                                                color: "#71717a",
                                                cursor: "pointer",
                                                display: "flex", alignItems: "center",
                                            }}
                                        >
                                            <Clipboard size={14} strokeWidth={2.5} />
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
                                                flex: 1,
                                                background: "#18181b",
                                                border: "2px solid #27272a",
                                                borderRadius: "6px",
                                                padding: "0.7rem 0.8rem",
                                                color: "#d4d4d8",
                                                fontFamily: "monospace",
                                                fontSize: "0.75rem",
                                                outline: "none",
                                                boxShadow: "inset 0 3px 5px rgba(0,0,0,0.3)"
                                            }}
                                        />

                                        <motion.button
                                            onClick={handleFetch}
                                            disabled={!url || isBusy}
                                            whileTap={{ scale: 0.95, y: 2 }}
                                            style={{
                                                background: isBusy ? "#3f3f46" : "#282828",
                                                border: "2px solid #18181b",
                                                borderBottom: isBusy ? "2px solid #18181b" : "5px solid #18181b",
                                                borderRadius: "8px",
                                                padding: "0 1rem",
                                                color: isBusy ? "#52525b" : "#d4d4d8",
                                                fontWeight: 900, letterSpacing: "1px", fontSize: "0.72rem",
                                                cursor: (!url || isBusy) ? "not-allowed" : "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                gap: "6px",
                                                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)"
                                            }}
                                        >
                                            {isBusy ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                                    <Loader2 size={14} strokeWidth={2.5} />
                                                </motion.div>
                                            ) : <Search size={14} strokeWidth={2.5} />}
                                            <span>{isBusy ? "WAIT" : "FETCH"}</span>
                                        </motion.button>
                                    </div>
                                    <p style={{ color: "#52525b", fontSize: "0.58rem", margin: "2px 0 0 0", fontWeight: 500 }}>
                                        Playlist params are stripped automatically.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </main>
            </ZenHideable>
        </>
    );
}
