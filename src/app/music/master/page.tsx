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
import { YouTubeModule } from "./components/YouTubeModule";
import { RadioModule } from "./components/RadioModule";
import { PlaylistModule } from "./components/PlaylistModule";
import {
    LayoutDashboard,
    Youtube,
    Radio as RadioIcon,
    ListMusic,
    Settings,
    Activity
} from "lucide-react";
import { shellBg, shellBorder, shellRadius, shellShadow, insetBox } from "./components/sharedStyles";

const MASTER_PIN = "0000";

type ModuleId = "dashboard" | "youtube" | "radio" | "playlist" | "settings";

export default function MasterPanelPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useState("");
    const [pinError, setPinError] = useState(false);
    const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
    const [isBusy, setIsBusy] = useState(false);
    const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" }[]>([]);

    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    useEffect(() => {
        if (typeof window !== "undefined" && sessionStorage.getItem("master_unlocked") === "true") {
            setIsUnlocked(true);
        }
    }, []);

    const addLog = (text: string, type: "info" | "success" | "error" = "info") => {
        setLogs(prev => [...prev, { text, type }].slice(-10)); // Keep last 10
    };

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

    const ledColor = () => {
        if (isBusy) return "#ff9f0a";
        if (activeModule === "youtube") return "#ff0000";
        if (activeModule === "radio") return "#39ff14";
        if (activeModule === "playlist") return "#7c3aed";
        return "#3b82f6";
    };

    const logColor = (type: "info" | "success" | "error") => {
        if (type === "success") return "#39ff14";
        if (type === "error") return "#ef4444";
        return "#666";
    };

    // ─── Shared DAP shell styles ───
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
                                boxShadow: shellShadow, overflow: "visible",
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.25rem 0.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Activity size={10} color={ledColor()} />
                                    <span style={{ color: "#555", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
                                        {activeModule === "dashboard" ? "System Hub" : activeModule}
                                    </span>
                                </div>
                                <motion.div
                                    animate={isBusy ? { opacity: [0.3, 1, 0.3] } : {}}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: ledColor(),
                                        boxShadow: `0 0 ${isBusy ? "10px" : "2px"} ${ledColor()}`,
                                    }}
                                />
                            </div>

                            {/* Main Display */}
                            <div style={{ padding: "0.5rem 1rem 1.5rem", maxHeight: "calc(100dvh - 200px)", overflowY: "auto" }}>
                                <AnimatePresence mode="wait">
                                    {activeModule === "dashboard" && (
                                        <motion.div
                                            key="dashboard"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}
                                        >
                                            {[
                                                { id: "youtube", icon: <Youtube size={20} />, label: "YouTube", sub: "Fetch Audio", color: "#ff0000" },
                                                { id: "radio", icon: <RadioIcon size={20} />, label: "Radios", sub: "Manage Stations", color: "#39ff14" },
                                                { id: "playlist", icon: <ListMusic size={20} />, label: "Playlists", sub: "Curate Mixes", color: "#7c3aed" },
                                                { id: "settings", icon: <Settings size={20} />, label: "System", sub: "Access Logs", color: "#3b82f6" },
                                            ].map((tool) => (
                                                <motion.button
                                                    key={tool.id}
                                                    onClick={() => setActiveModule(tool.id as ModuleId)}
                                                    whileHover={{ y: -2, background: "#252525" }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        ...insetBox, padding: "1.25rem 1rem",
                                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                                                        cursor: "pointer", transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    <div style={{ color: tool.color, opacity: 0.8 }}>{tool.icon}</div>
                                                    <div style={{ textAlign: "center" }}>
                                                        <div style={{ color: "#aaa", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1px" }}>{tool.label}</div>
                                                        <div style={{ color: "#444", fontSize: "0.45rem", fontWeight: 600, textTransform: "uppercase" }}>{tool.sub}</div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeModule === "youtube" && (
                                        <motion.div key="youtube" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                            <YouTubeModule
                                                addLog={addLog}
                                                ledColor={ledColor}
                                                logColor={logColor}
                                                isBusy={isBusy}
                                                setIsBusy={setIsBusy}
                                                insetBox={insetBox}
                                            />
                                            <motion.button
                                                onClick={() => setActiveModule("dashboard")}
                                                style={{ marginTop: "1rem", color: "#444", fontSize: "0.55rem", fontWeight: 800, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                            >
                                                <ChevronLeft size={10} /> BACK TO HUB
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {activeModule === "radio" && (
                                        <motion.div key="radio" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                            <RadioModule
                                                addLog={addLog}
                                                isBusy={isBusy}
                                                setIsBusy={setIsBusy}
                                                insetBox={insetBox}
                                            />
                                            <motion.button
                                                onClick={() => setActiveModule("dashboard")}
                                                style={{ marginTop: "1rem", color: "#444", fontSize: "0.55rem", fontWeight: 800, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                            >
                                                <ChevronLeft size={10} /> BACK TO HUB
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {activeModule === "playlist" && (
                                        <motion.div key="playlist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                            <PlaylistModule
                                                addLog={addLog}
                                                isBusy={isBusy}
                                                setIsBusy={setIsBusy}
                                                insetBox={insetBox}
                                            />
                                            <motion.button
                                                onClick={() => setActiveModule("dashboard")}
                                                style={{ marginTop: "1rem", color: "#444", fontSize: "0.55rem", fontWeight: 800, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                            >
                                                <ChevronLeft size={10} /> BACK TO HUB
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {activeModule === "settings" && (
                                        <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ ...insetBox, padding: "2rem", textAlign: "center" }}>
                                            <Settings size={24} color="#333" style={{ marginBottom: "1rem" }} />
                                            <div style={{ color: "#aaa", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "2px" }}>SYSTEM SETTINGS</div>
                                            <div style={{ color: "#444", fontSize: "0.5rem", marginTop: "0.5rem" }}>Log audit trail pending...</div>
                                            <motion.button
                                                onClick={() => setActiveModule("dashboard")}
                                                style={{ marginTop: "1.5rem", color: "#3b82f6", fontSize: "0.55rem", fontWeight: 800, background: "none", border: "none", cursor: "pointer" }}
                                            >
                                                RETURN TO HUB
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer / Terminal Mini */}
                            <div style={{ borderTop: "1.5px solid #111", background: "rgba(0,0,0,0.2)", padding: "0.75rem 1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#666" }} />
                                    <span style={{ color: "#333", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>System Logs</span>
                                </div>
                                <div style={{ height: "40px", overflow: "hidden", pointerEvents: "none" }}>
                                    {logs.slice(-3).map((log, i) => (
                                        <div key={i} style={{ color: logColor(log.type), fontSize: "0.5rem", opacity: (i + 1) / 3, fontFamily: "monospace" }}>
                                            {log.text.slice(0, 45)}...
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </ZenHideable>
            )}
        </>
    );
}
