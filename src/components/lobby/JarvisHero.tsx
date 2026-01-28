"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/components/AudioContext";
import { Disc, Zap, Moon, Sun, Coffee } from "lucide-react";
import { JARVIS_THEMES, JarvisTheme } from "@/data/jarvisThemes";

interface SlotState {
    todayThemeId: string | null;
    // todayBurst removed to allow rotation
    usedThemeIds: string[];
}

interface JarvisState {
    lastActiveDate: string; // YYYY-MM-DD
    slots: {
        MORNING: SlotState;
        DAY: SlotState;
        AFTERNOON: SlotState;
        NIGHT: SlotState;
    };
}

const DEFAULT_SLOT_STATE: SlotState = {
    todayThemeId: null,
    usedThemeIds: []
};

const DEFAULT_STATE: JarvisState = {
    lastActiveDate: "",
    slots: {
        MORNING: { ...DEFAULT_SLOT_STATE },
        DAY: { ...DEFAULT_SLOT_STATE },
        AFTERNOON: { ...DEFAULT_SLOT_STATE },
        NIGHT: { ...DEFAULT_SLOT_STATE }
    }
};

export function JarvisHero() {
    const { isPlaying, currentSong, currentLyricText } = useAudio();
    const [mounted, setMounted] = useState(false);

    // Theme State
    const [activeTheme, setActiveTheme] = useState<JarvisTheme | null>(null);
    const [activeBurst, setActiveBurst] = useState<string>("");
    const [burstIndex, setBurstIndex] = useState<number>(0);


    // Persistence Logic
    useEffect(() => {
        setMounted(true);
        const now = new Date();
        const hour = now.getHours();
        const todayDate = now.toISOString().split('T')[0];

        // Determine Slot
        let slotKey: 'MORNING' | 'DAY' | 'AFTERNOON' | 'NIGHT' = 'NIGHT';
        if (hour >= 5 && hour < 11) slotKey = 'MORNING';
        else if (hour >= 11 && hour < 15) slotKey = 'DAY';
        else if (hour >= 15 && hour < 20) slotKey = 'AFTERNOON';
        else slotKey = 'NIGHT'; // 20:00 - 05:00

        // Load State
        let state: JarvisState = {
            lastActiveDate: "",
            slots: {
                MORNING: { ...DEFAULT_SLOT_STATE },
                DAY: { ...DEFAULT_SLOT_STATE },
                AFTERNOON: { ...DEFAULT_SLOT_STATE },
                NIGHT: { ...DEFAULT_SLOT_STATE }
            }
        };

        try {
            const stored = localStorage.getItem("jarvis_state");
            if (stored) {
                const parsed = JSON.parse(stored);
                // Migrate/Safety: If stored state has old structure, merge carefully
                state = { ...state, ...parsed };

                // Ensure slots exist (in case of partial state)
                (['MORNING', 'DAY', 'AFTERNOON', 'NIGHT'] as const).forEach(key => {
                    if (!state.slots[key]) state.slots[key] = { ...DEFAULT_SLOT_STATE };
                });
            }
        } catch (e) {
            console.error("Jarvis state parse error", e);
        }

        // Daily Reset Check
        if (state.lastActiveDate !== todayDate) {
            state.lastActiveDate = todayDate;
            (['MORNING', 'DAY', 'AFTERNOON', 'NIGHT'] as const).forEach(key => {
                state.slots[key].todayThemeId = null;
                // Burst reset not needed as it's not stored
            });
        }

        const currentSlotState = state.slots[slotKey];

        let targetTheme: JarvisTheme | undefined;
        let targetBurst: string = "";

        // 1. Try to load locked theme
        if (currentSlotState.todayThemeId) {
            targetTheme = JARVIS_THEMES.find(t => t.id === currentSlotState.todayThemeId);
        }

        // 2. If no locked theme, pick new one
        if (!targetTheme) {
            const allThemesInSlot = JARVIS_THEMES.filter(t => t.timeSlot === slotKey);
            const usedIds = currentSlotState.usedThemeIds || [];

            let available = allThemesInSlot.filter(t => !usedIds.includes(t.id));

            if (available.length === 0) {
                currentSlotState.usedThemeIds = [];
                available = allThemesInSlot;
            }

            if (available.length > 0) {
                targetTheme = available[Math.floor(Math.random() * available.length)];

                // Lock Theme
                currentSlotState.todayThemeId = targetTheme.id;
                currentSlotState.usedThemeIds = [...(currentSlotState.usedThemeIds || []), targetTheme.id];

                state.slots[slotKey] = currentSlotState;
                localStorage.setItem("jarvis_state", JSON.stringify(state));
            }
        }

        // 3. Apply Theme & Pick Random Burst (Every Mount)
        if (targetTheme) {
            setActiveTheme(targetTheme);

            // Initial Burst (Sequential Start)
            if (targetTheme.bursts.length > 0) {
                setBurstIndex(0);
                setActiveBurst(targetTheme.bursts[0]);
            }
        }

    }, []); // Run once on mount

    // Auto-Rotate Bursts
    useEffect(() => {
        if (!activeTheme || !activeBurst || activeTheme.bursts.length <= 1) return;

        // Reading Time Calculation
        // Approx 60ms per char. Min 4s (to read comfortably), Max 12s.
        const duration = Math.min(12000, Math.max(4000, activeBurst.length * 60));

        const timer = setTimeout(() => {
            // Sequential Rotation
            const nextIndex = (burstIndex + 1) % activeTheme.bursts.length;
            setBurstIndex(nextIndex);
            setActiveBurst(activeTheme.bursts[nextIndex]);
        }, duration);

        return () => clearTimeout(timer);
    }, [activeBurst, activeTheme]);

    if (!mounted) return null;

    // Determine Content based on Playback State
    const isSabotage = isPlaying && currentSong;

    const displayHeader = isSabotage ? "NOW PLAYING" : (activeTheme?.mode || "SYSTEM ONLINE");

    const displayMain = isSabotage
        ? (currentLyricText || currentSong.title.split("—")[1]?.trim() || currentSong.title)
        : (activeTheme?.greeting || "System initialization complete.");

    const displaySub = isSabotage
        ? (currentSong.title.split("—")[0]?.trim() || "Unknown Artist")
        : activeBurst;

    // Icon logic
    const renderIcon = () => {
        if (isSabotage) return <Disc size={16} className="animate-spin-slow" />;
        if (activeTheme?.timeSlot === 'MORNING') return <Coffee size={16} />;
        if (activeTheme?.timeSlot === 'DAY') return <Sun size={16} />;
        if (activeTheme?.timeSlot === 'AFTERNOON') return <Zap size={16} />;
        return <Moon size={16} />;
    };

    return (
        <section style={{
            padding: "0 1.5rem",
            marginBottom: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "480px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                {/* JARVIS WIDGET - iOS Style */}
                <div
                    style={{
                        background: "rgba(30, 30, 35, 0.4)", // Deeper, more "Pro" glass
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        borderRadius: "24px", // Matches iOS widgets
                        padding: "1.75rem",
                        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.03)", // Subtle border
                        minHeight: "220px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
                    }}
                >
                    {/* Header: Mode / Status */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: isSabotage ? "#34C759" : "rgba(255,255,255,0.45)", // Apple System Green or Muted
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "0.75rem"
                    }}>
                        <div style={{
                            color: isSabotage ? "#34C759" : "rgba(255,255,255,0.7)",
                            display: "flex", alignItems: "center"
                        }}>
                            {renderIcon()}
                        </div>
                        {displayHeader}
                    </div>

                    {/* Main Greeting / Lyric */}
                    <div style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        fontSize: isSabotage ? "1.35rem" : "1.25rem",
                        fontWeight: 600, // Semi-bold for headings
                        lineHeight: "1.35",
                        color: "rgba(255, 255, 255, 0.98)", // Primary Label Color
                        letterSpacing: "-0.015em", // Tight tracking like SF Pro
                        textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        minHeight: "3.5em",
                        paddingRight: "1rem"
                    }}>
                        {displayMain}
                    </div>

                    {/* Footer: Burst / Artist */}
                    <div style={{
                        marginTop: "auto",
                        paddingTop: "1.25rem",
                        borderTop: "1px solid rgba(255,255,255,0.08)", // Separator
                        fontFamily: isSabotage ? "var(--font-serif)" : "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
                        fontStyle: isSabotage ? "italic" : "normal",
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.65)", // Secondary Label Color
                        lineHeight: "1.5"
                    }}>
                        {isSabotage ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                🎵 {displaySub}
                            </span>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    width: "fit-content"
                                }}>
                                    <div style={{
                                        width: "5px", // Slightly smaller, refined dot
                                        height: "5px",
                                        borderRadius: "50%",
                                        backgroundColor: "#39ff14", // Keep user's neon green
                                        boxShadow: "0 0 6px #39ff14"
                                    }} />
                                    <span style={{
                                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.05em",
                                        color: "rgba(255,255,255,0.4)" // Muted label for "JARVIS"
                                    }}>JARVIS</span>
                                </div>
                                <span style={{
                                    color: "rgba(255,255,255,0.85)",
                                    display: "block",
                                    fontWeight: 400
                                }}>
                                    {displaySub}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Background Decorative Gradient */}
                    <div style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-20%",
                        width: "300px",
                        height: "300px",
                        background: isSabotage
                            ? "radial-gradient(circle, rgba(52, 199, 89, 0.12) 0%, rgba(0,0,0,0) 65%)" // Apple Green
                            : "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 65%)",
                        pointerEvents: "none",
                        zIndex: -1,
                        filter: "blur(50px)"
                    }} />
                </div>
            </div>
        </section>
    );
}
