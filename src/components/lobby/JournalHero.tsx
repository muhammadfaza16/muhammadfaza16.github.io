"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/components/AudioContext";
import { JARVIS_THEMES, JarvisTheme } from "@/data/jarvisThemes";

interface SlotState {
    todayThemeId: string | null;
    usedThemeIds: string[];
}

interface JarvisState {
    lastActiveDate: string;
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

/* ── Dense Chaotic Scribble SVG ── */
const DenseScribble = () => (
    <svg
        className="scribble-draw"
        viewBox="0 0 260 180"
        style={{
            width: "clamp(180px, 55vw, 280px)",
            height: "auto",
            opacity: 0.75,
            transform: "rotate(-1.5deg)",
        }}
    >
        {/* Heavy ball of scribble — dense overlapping strokes */}
        <path d="M60 90 Q80 30 130 60 Q180 90 140 120 Q100 150 70 110 Q40 80 90 50 Q140 20 170 70 Q200 120 150 140 Q100 160 60 120 Q20 80 80 40"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M70 100 Q100 40 150 70 Q200 100 160 130 Q120 160 80 120 Q50 90 100 55 Q150 25 180 75 Q210 130 160 145"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M85 80 Q110 50 140 75 Q170 100 145 120 Q120 140 95 115 Q70 90 105 65 Q140 40 165 80"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M90 95 Q115 65 135 85 Q155 105 130 125 Q105 145 90 115 Q75 85 110 70 Q145 55 160 90"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* Cross-hatch marks inside scribble */}
        <path d="M100 70 L140 110 M135 65 L105 115 M110 85 L150 95" stroke="var(--ink-primary, #2c2420)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M115 75 Q130 95 120 110 Q108 100 118 80" stroke="var(--ink-primary, #2c2420)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
        {/* Extending wild strokes — outward scratches */}
        <path d="M55 110 Q30 90 25 70" stroke="var(--ink-primary, #2c2420)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.3" />
        <path d="M170 75 Q195 55 220 60" stroke="var(--ink-primary, #2c2420)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25" />
        <path d="M145 140 Q160 155 175 160" stroke="var(--ink-primary, #2c2420)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2" />
        {/* Dense interior fill scratches */}
        <path d="M95 90 Q120 70 135 90 Q150 110 125 115 Q100 120 95 95"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
        <path d="M108 82 Q125 92 118 108 Q110 98 115 85"
            stroke="var(--ink-primary, #2c2420)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.35" />
    </svg>
);

/* ── Heavy Strikethrough Bar ── */
const StrikethroughBar = () => (
    <svg viewBox="0 0 200 20" style={{
        width: "clamp(140px, 40vw, 200px)",
        height: "auto",
        position: "absolute",
        left: "5%",
        opacity: 0.5,
    }}>
        <path d="M5 10 Q40 6 100 10 Q160 14 195 9" stroke="var(--ink-primary, #2c2420)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M8 12 Q50 8 105 12 Q155 16 192 11" stroke="var(--ink-primary, #2c2420)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
);

export function JournalHero() {
    const { isPlaying, currentSong, currentLyricText } = useAudio();
    const [mounted, setMounted] = useState(false);
    const [activeTheme, setActiveTheme] = useState<JarvisTheme | null>(null);
    const [activeBurst, setActiveBurst] = useState<string>("");
    const [burstIndex, setBurstIndex] = useState<number>(0);
    const [burstFade, setBurstFade] = useState(true);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [themeVolNumber, setThemeVolNumber] = useState(0);

    // Clock
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 10000);
        return () => clearInterval(interval);
    }, []);

    // Persistence Logic
    useEffect(() => {
        setMounted(true);
        const now = new Date();
        const hour = now.getHours();
        const todayDate = now.toISOString().split('T')[0];

        let slotKey: 'MORNING' | 'DAY' | 'AFTERNOON' | 'NIGHT' = 'NIGHT';
        if (hour >= 5 && hour < 11) slotKey = 'MORNING';
        else if (hour >= 11 && hour < 15) slotKey = 'DAY';
        else if (hour >= 15 && hour < 20) slotKey = 'AFTERNOON';

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
                state = { ...state, ...parsed };
                (['MORNING', 'DAY', 'AFTERNOON', 'NIGHT'] as const).forEach(key => {
                    if (!state.slots[key]) state.slots[key] = { ...DEFAULT_SLOT_STATE };
                });
            }
        } catch (e) {
            console.error("Jarvis state parse error", e);
        }

        if (state.lastActiveDate !== todayDate) {
            state.lastActiveDate = todayDate;
            (['MORNING', 'DAY', 'AFTERNOON', 'NIGHT'] as const).forEach(key => {
                state.slots[key].todayThemeId = null;
            });
        }

        const currentSlotState = state.slots[slotKey];
        let targetTheme: JarvisTheme | undefined;

        if (currentSlotState.todayThemeId) {
            targetTheme = JARVIS_THEMES.find(t => t.id === currentSlotState.todayThemeId);
        }

        if (!targetTheme) {
            const allThemesInSlot = JARVIS_THEMES.filter(t => t.timeSlot === slotKey);
            const usedIds = currentSlotState.usedThemeIds || [];
            let available = allThemesInSlot.filter(t => !usedIds.includes(t.id));
            if (available.length === 0) { currentSlotState.usedThemeIds = []; available = allThemesInSlot; }
            if (available.length > 0) {
                targetTheme = available[Math.floor(Math.random() * available.length)];
                currentSlotState.todayThemeId = targetTheme.id;
                currentSlotState.usedThemeIds = [...(currentSlotState.usedThemeIds || []), targetTheme.id];
                state.slots[slotKey] = currentSlotState;
                localStorage.setItem("jarvis_state", JSON.stringify(state));
            }
        }

        if (targetTheme) {
            setActiveTheme(targetTheme);
            // Compute vol number from theme index
            const idx = JARVIS_THEMES.findIndex(t => t.id === targetTheme!.id);
            setThemeVolNumber(idx >= 0 ? idx + 1 : 1);
            if (targetTheme.bursts.length > 0) {
                setBurstIndex(0);
                setActiveBurst(targetTheme.bursts[0]);
            }
        }
    }, []);

    // Auto-Rotate Bursts
    useEffect(() => {
        if (!activeTheme || !activeBurst || activeTheme.bursts.length <= 1) return;
        const duration = Math.min(12000, Math.max(4000, activeBurst.length * 60));
        const timer = setTimeout(() => {
            setBurstFade(false);
            setTimeout(() => {
                const nextIndex = (burstIndex + 1) % activeTheme.bursts.length;
                setBurstIndex(nextIndex);
                setActiveBurst(activeTheme.bursts[nextIndex]);
                setBurstFade(true);
            }, 400);
        }, duration);
        return () => clearTimeout(timer);
    }, [activeBurst, activeTheme, burstIndex]);

    if (!mounted) return null;

    const isSabotage = isPlaying && currentSong;
    const displayMain = isSabotage
        ? (currentLyricText || currentSong.title.split("—")[1]?.trim() || currentSong.title)
        : (activeTheme?.greeting || "Halo, selamat datang.");
    const displaySub = isSabotage
        ? (currentSong.title.split("—")[0]?.trim() || "Unknown Artist")
        : activeBurst;
    const displayMode = isSabotage ? "NOW PLAYING" : (activeTheme?.mode || "SYSTEM");

    const dateString = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Build cascade lines from burst text (split words, indent progressively)
    const buildCascade = (text: string) => {
        if (!text) return [];
        const words = text.split(" ");
        // Group into chunks of 2-3 words
        const lines: { text: string; indent: number }[] = [];
        let i = 0;
        let indentLevel = 0;
        while (i < words.length) {
            const chunkSize = Math.min(2 + (i === 0 ? 1 : 0), words.length - i);
            const chunk = words.slice(i, i + chunkSize).join(" ");
            lines.push({ text: chunk, indent: indentLevel });
            i += chunkSize;
            indentLevel += 1;
        }
        return lines;
    };

    const cascadeLines = buildCascade(displaySub || "");

    return (
        <section style={{
            position: "absolute",
            inset: 0,
            padding: "0 clamp(1.5rem, 6vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1,
        }}>
            {/* ── TOP: Date + Bold Clock (ref 1: "Sunday, 05 October / 11:11") ── */}
            <div style={{
                paddingTop: "clamp(2rem, 6vh, 4rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}>
                <span className="font-journal-serif text-ink-secondary" style={{
                    fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)",
                    fontWeight: 500,
                    letterSpacing: "0.05em"
                }}>
                    {dateString}
                </span>
                <span className="font-journal-serif" style={{
                    fontSize: "clamp(4rem, 14vw, 6rem)",
                    fontWeight: 900,
                    lineHeight: 1.0,
                    color: "var(--ink-primary, #2c2420)",
                    letterSpacing: "-0.05em",
                    fontVariantNumeric: "tabular-nums"
                }}>
                    {currentTime}
                </span>
            </div>

            {/* ── Notification bar hints + circular icons (ref 1) ── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "clamp(0.5rem, 1.5vh, 1rem)",
                paddingRight: "0.25rem",
            }}>
                <div className="journal-bar-hint">
                    <span></span>
                    <span></span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {/* Lightning icon circle */}
                    <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "1.5px solid var(--ink-muted, #a0907d)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.4,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M7 1L3 7h3l-1 4 4-6H6l1-4z" stroke="var(--ink-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {/* Play icon circle */}
                    <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--ink-muted, #a0907d)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.3,
                    }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M3 2l5 3-5 3V2z" fill="var(--paper-bg, #fdfbf7)" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── RAW JOURNAL CONTENT ── */}
            <div style={{
                flex: 1,
                position: "relative",
                paddingTop: "clamp(0.75rem, 2.5vh, 1.5rem)",
            }}>
                {/* VOL. label (ref 3: "VOL. 1") */}
                <div className="journal-vol-label" style={{
                    marginBottom: "clamp(0.5rem, 1.5vh, 1rem)",
                    transform: "rotate(-0.3deg)",
                }}>
                    VOL. {themeVolNumber}
                </div>

                {/* Mode label — small uppercase */}
                <div style={{
                    fontSize: "clamp(0.6rem, 1.6vw, 0.7rem)",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-muted, #a0907d)",
                    marginBottom: "clamp(0.4rem, 1vh, 0.75rem)",
                    fontFamily: "'Nothing You Could Do', cursive",
                    opacity: 0.6,
                }}>
                    {displayMode}
                </div>

                {/* Main greeting — big, raw, handwritten (ref 1: the flowing text) */}
                <div className="font-journal-hand" style={{
                    fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
                    lineHeight: 1.45,
                    color: "var(--ink-primary, #2c2420)",
                    fontWeight: 500,
                    maxWidth: "80%",
                    height: "clamp(4rem, 10vh, 5.5rem)",
                    overflow: "hidden",
                    marginBottom: "clamp(0.5rem, 1.5vh, 1rem)",
                    transform: "rotate(-0.5deg)",
                }}>
                    {displayMain}
                </div>

                {/* Strikethrough decorated text (ref 3: crossed out lines) */}
                <div style={{
                    position: "relative",
                    marginBottom: "clamp(0.75rem, 2vh, 1.25rem)",
                    paddingLeft: "3%",
                }}>
                    <span className="font-journal-hand thick-strike" style={{
                        fontSize: "clamp(0.85rem, 2.8vw, 1.05rem)",
                        color: "var(--ink-secondary, #5d534a)",
                        opacity: 0.55,
                    }}>
                        {activeTheme?.bursts?.[Math.min(1, (activeTheme?.bursts?.length || 1) - 1)] || "..."}
                    </span>
                </div>

                {/* Dense scribble cluster (ref 1 & 3: heavy black ball) */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "-5%",
                    marginBottom: "clamp(0.5rem, 1.5vh, 1rem)",
                }}>
                    <DenseScribble />
                </div>

                {/* Cascade indent burst text (ref 3: "DON'T THINK / THINK / THINK...") */}
                <div className="cascade-indent" style={{
                    marginLeft: "clamp(15%, 6vw, 30%)",
                    opacity: burstFade ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    transform: "rotate(0.3deg)",
                    marginBottom: "clamp(0.5rem, 1vh, 0.75rem)",
                }}>
                    {isSabotage ? (
                        <span className="font-journal-hand" style={{
                            fontSize: "clamp(1rem, 3vw, 1.2rem)",
                            color: "var(--ink-accent, #b07d62)",
                        }}>
                            🎵 {displaySub}
                        </span>
                    ) : (
                        cascadeLines.map((line, i) => (
                            <span
                                key={i}
                                className="cascade-line"
                                style={{
                                    paddingLeft: `${line.indent * 1.2}rem`,
                                    opacity: 1 - (i * 0.08),
                                    animation: `journal-fade-in 0.8s ease ${0.3 + i * 0.15}s both`,
                                }}
                            >
                                {line.text}
                            </span>
                        ))
                    )}
                </div>

                {/* ── Scattered scrawl text fragments ── */}

                {/* Top-right — light pen */}
                <span className="scrawl scrawl-a" style={{
                    position: "absolute", right: "5%", top: "5%",
                    fontSize: "clamp(0.72rem, 2.2vw, 0.88rem)",
                    color: "var(--ink-muted)", opacity: 0.28,
                    transform: "rotate(2.5deg) skewX(-1.5deg)",
                    animation: "journal-fade-in 1.2s ease 0.8s both",
                }}>
                    pelan-pelan aja
                </span>

                {/* Right side, mid-upper — heavier ink */}
                <span className="scrawl scrawl-b" style={{
                    position: "absolute", right: "3%", top: "18%",
                    fontSize: "clamp(0.58rem, 1.7vw, 0.7rem)",
                    color: "var(--ink-secondary)", opacity: 0.25,
                    transform: "rotate(-1.8deg) skewY(0.8deg)",
                    animation: "journal-fade-in 1.2s ease 1.2s both",
                }}>
                    it&apos;s okay not to be okay
                </span>

                {/* Left side — larger, relaxed hand */}
                <span className="scrawl scrawl-d" style={{
                    position: "absolute", left: "2%", top: "42%",
                    fontSize: "clamp(0.7rem, 2.1vw, 0.85rem)",
                    color: "var(--ink-accent)", opacity: 0.25,
                    transform: "rotate(-3deg) skewX(1deg)",
                    animation: "journal-fade-in 1.2s ease 1.5s both",
                }}>
                    breathe...
                </span>

                {/* Right side — scratched out, frustrated */}
                <span className="scrawl scrawl-e scrawl-faded" style={{
                    position: "absolute", right: "8%", top: "38%",
                    fontSize: "clamp(0.52rem, 1.5vw, 0.64rem)",
                    color: "var(--ink-muted)",
                    transform: "rotate(2.2deg) skewX(-2deg)",
                    animation: "journal-fade-in 1.2s ease 1.8s both",
                    textDecoration: "line-through",
                    textDecorationThickness: "1.5px",
                }}>
                    i don&apos;t know anymore
                </span>

                {/* Center-left — pressed harder, bigger */}
                <span className="scrawl scrawl-d scrawl-heavy" style={{
                    position: "absolute", left: "8%", top: "55%",
                    fontSize: "clamp(0.85rem, 2.6vw, 1rem)",
                    color: "var(--ink-secondary)", opacity: 0.22,
                    transform: "rotate(1.2deg) skewY(-0.5deg)",
                    animation: "journal-fade-in 1.2s ease 2s both",
                }}>
                    keep going
                </span>

                {/* Dots — as if testing pen */}
                <span className="scrawl scrawl-c" style={{
                    position: "absolute", right: "12%", top: "52%",
                    fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
                    color: "var(--ink-muted)", opacity: 0.18,
                    transform: "rotate(-0.5deg)",
                    animation: "journal-fade-in 1.2s ease 2.2s both",
                }}>
                    · · ·
                </span>

                {/* Left lower-mid — tilted, different pen */}
                <span className="scrawl scrawl-a" style={{
                    position: "absolute", left: "3%", top: "68%",
                    fontSize: "clamp(0.58rem, 1.7vw, 0.7rem)",
                    color: "var(--ink-accent)", opacity: 0.22,
                    transform: "rotate(3.5deg) skewX(-1deg) skewY(1deg)",
                    animation: "journal-fade-in 1.2s ease 2.5s both",
                }}>
                    mungkin besok
                </span>

                {/* Right — multi-line, vulnerable */}
                <span className="scrawl scrawl-c scrawl-light" style={{
                    position: "absolute", right: "4%", top: "62%",
                    fontSize: "clamp(0.55rem, 1.6vw, 0.66rem)",
                    color: "var(--ink-secondary)", opacity: 0.2,
                    transform: "rotate(-2.5deg) skewX(0.5deg)",
                    maxWidth: "35%",
                    lineHeight: 1.7,
                    animation: "journal-fade-in 1.2s ease 2.8s both",
                }}>
                    i wish i could understand what i feel
                </span>

                {/* Top center — faded, like an old note */}
                <span className="scrawl scrawl-e scrawl-faded" style={{
                    position: "absolute", left: "35%", top: "2%",
                    fontSize: "clamp(0.52rem, 1.4vw, 0.62rem)",
                    color: "var(--ink-muted)",
                    transform: "rotate(1.5deg) skewY(0.8deg)",
                    animation: "journal-fade-in 1.2s ease 3s both",
                }}>
                    hal kecil pun berarti
                </span>

                {/* Center lower — casual scribble */}
                <span className="scrawl scrawl-b" style={{
                    position: "absolute", left: "15%", top: "73%",
                    fontSize: "clamp(0.55rem, 1.6vw, 0.67rem)",
                    color: "var(--ink-muted)", opacity: 0.2,
                    transform: "rotate(-1.5deg) skewX(1.2deg)",
                    animation: "journal-fade-in 1.2s ease 3.2s both",
                }}>
                    ga harus sempurna
                </span>

                {/* Right mid — crossed out, second thought */}
                <span className="scrawl scrawl-a" style={{
                    position: "absolute", right: "6%", top: "58%",
                    fontSize: "clamp(0.6rem, 1.8vw, 0.74rem)",
                    color: "var(--ink-secondary)", opacity: 0.18,
                    transform: "rotate(3deg) skewX(-1.5deg)",
                    textDecoration: "line-through",
                    textDecorationThickness: "1px",
                    animation: "journal-fade-in 1.2s ease 3.5s both",
                }}>
                    overthinking lagi
                </span>

                {/* Left lower — tiny, light pressure */}
                <span className="scrawl scrawl-c scrawl-light" style={{
                    position: "absolute", left: "5%", top: "63%",
                    fontSize: "clamp(0.48rem, 1.3vw, 0.58rem)",
                    color: "var(--ink-accent)", opacity: 0.2,
                    transform: "rotate(-3.5deg) skewX(0.8deg) skewY(-1deg)",
                    animation: "journal-fade-in 1.2s ease 3.8s both",
                }}>
                    be kind always
                </span>


                {/* ── Detailed sketch doodles (solid + interactive) ── */}

                {/* 🌹 Rose — vivid, solid colors */}
                <svg className="doodle-interactive" style={{
                    position: "absolute", right: "4%", top: "6%",
                    width: "clamp(55px, 16vw, 75px)",
                    height: "auto",
                    transform: "rotate(8deg)",
                    animation: "journal-fade-in 2s ease 1.2s both",
                    cursor: "pointer",
                }} viewBox="0 0 80 110" fill="none">
                    {/* Petals — rich solid pink */}
                    <path d="M40 28 Q55 18 58 30 Q62 42 48 42 Q40 42 40 35Z" fill="#e8627a" stroke="#c44d62" strokeWidth="1" strokeLinecap="round" />
                    <path d="M40 28 Q25 16 20 28 Q15 40 30 42 Q38 42 40 35Z" fill="#f07088" stroke="#c44d62" strokeWidth="1" strokeLinecap="round" />
                    <path d="M30 42 Q18 45 22 55 Q26 62 38 56Z" fill="#e8627a" stroke="#c44d62" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M48 42 Q60 46 56 56 Q52 63 42 56Z" fill="#d95570" stroke="#c44d62" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M38 56 Q32 64 36 68 Q40 70 44 66 Q48 62 42 56Z" fill="#f07088" stroke="#c44d62" strokeWidth="0.7" />
                    {/* Center spiral */}
                    <path d="M40 34 Q44 30 46 34 Q48 38 44 40 Q40 42 38 38 Q36 34 40 32 Q43 30 45 33" stroke="#a03050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M40 36 Q42 34 43 36 Q44 38 42 39 Q40 40 39 38" stroke="#8a2040" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    {/* Stem — bold green */}
                    <path d="M40 58 Q38 68 39 78 Q40 88 38 98" stroke="#2d8a2d" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M39 78 Q36 76 34 72" stroke="#2d8a2d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    {/* Thorns */}
                    <path d="M39 70 Q36 68 35 66" stroke="#2d8a2d" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M40 82 Q43 80 44 78" stroke="#2d8a2d" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Leaves — solid green */}
                    <path d="M34 72 Q26 68 22 72 Q26 76 34 72Z" fill="#4aad4a" stroke="#2d8a2d" strokeWidth="0.8" />
                    <path d="M34 72 L28 72" stroke="#2d8a2d" strokeWidth="0.6" strokeLinecap="round" />
                    <path d="M44 82 Q52 78 56 82 Q52 86 44 82Z" fill="#3d9d3d" stroke="#2d8a2d" strokeWidth="0.8" />
                    <path d="M44 82 L50 82" stroke="#2d8a2d" strokeWidth="0.6" strokeLinecap="round" />
                </svg>

                {/* 🐱 Sitting cat — vivid, solid colors */}
                <svg className="doodle-interactive" style={{
                    position: "absolute", left: "5%", top: "58%",
                    width: "clamp(50px, 14vw, 65px)",
                    height: "auto",
                    transform: "rotate(-3deg)",
                    animation: "journal-fade-in 2s ease 1.8s both",
                    cursor: "pointer",
                }} viewBox="0 0 70 100" fill="none">
                    {/* Body */}
                    <path d="M35 45 Q50 42 55 55 Q58 68 50 78 Q42 86 35 86 Q28 86 20 78 Q12 68 15 55 Q20 42 35 45Z"
                        fill="#f0c088" stroke="#c49050" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Head */}
                    <ellipse cx="35" cy="32" rx="14" ry="12" fill="#f5d0a0" stroke="#c49050" strokeWidth="1.5" />
                    {/* Left ear */}
                    <path d="M23 26 L17 12 L28 22" stroke="#c49050" strokeWidth="1.5" strokeLinejoin="round" fill="#f0c088" />
                    <path d="M20 18 L25 22" stroke="#e88090" strokeWidth="1" strokeLinecap="round" />
                    {/* Right ear */}
                    <path d="M47 26 L53 12 L42 22" stroke="#c49050" strokeWidth="1.5" strokeLinejoin="round" fill="#f0c088" />
                    <path d="M50 18 L45 22" stroke="#e88090" strokeWidth="1" strokeLinecap="round" />
                    {/* Eyes */}
                    <ellipse cx="29" cy="31" rx="2.8" ry="2.2" fill="#3a3025" />
                    <circle cx="28" cy="30.3" r="1" fill="#fff" opacity="0.8" />
                    <ellipse cx="41" cy="31" rx="2.8" ry="2.2" fill="#3a3025" />
                    <circle cx="40" cy="30.3" r="1" fill="#fff" opacity="0.8" />
                    {/* Nose */}
                    <path d="M34 35 L36 35 L35 36.5 Z" fill="#e8627a" />
                    {/* Mouth */}
                    <path d="M35 36.5 Q32 39 29 38" stroke="#c49050" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    <path d="M35 36.5 Q38 39 41 38" stroke="#c49050" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    {/* Whiskers */}
                    <path d="M12 30 L27 32" stroke="#c49050" strokeWidth="0.7" opacity="0.6" strokeLinecap="round" />
                    <path d="M10 34 L27 34" stroke="#c49050" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
                    <path d="M14 38 L28 36" stroke="#c49050" strokeWidth="0.7" opacity="0.4" strokeLinecap="round" />
                    <path d="M58 30 L43 32" stroke="#c49050" strokeWidth="0.7" opacity="0.6" strokeLinecap="round" />
                    <path d="M60 34 L43 34" stroke="#c49050" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
                    <path d="M56 38 L42 36" stroke="#c49050" strokeWidth="0.7" opacity="0.4" strokeLinecap="round" />
                    {/* Front paws */}
                    <path d="M25 78 Q22 86 20 90 Q22 92 26 90 Q28 86 28 80" stroke="#c49050" strokeWidth="1.2" fill="#f5d0a0" strokeLinecap="round" />
                    <path d="M45 78 Q48 86 50 90 Q48 92 44 90 Q42 86 42 80" stroke="#c49050" strokeWidth="1.2" fill="#f5d0a0" strokeLinecap="round" />
                    {/* Paw pads */}
                    <circle cx="23" cy="89" r="1.2" fill="#e88090" />
                    <circle cx="47" cy="89" r="1.2" fill="#e88090" />
                    {/* Tail */}
                    <path d="M50 75 Q60 72 62 62 Q64 52 58 48 Q55 46 54 50" stroke="#c49050" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Belly stripes */}
                    <path d="M30 55 Q35 52 40 55" stroke="#daa860" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M28 62 Q35 58 42 62" stroke="#daa860" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M26 69 Q35 65 44 69" stroke="#daa860" strokeWidth="0.8" strokeLinecap="round" />
                </svg>

                {/* ── SVG ink marks ── */}
                {/* Cross mark */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", right: "20%", top: "10%",
                    width: "18px", height: "18px", opacity: 0.15,
                    transform: "rotate(25deg)", animationDelay: "1s",
                }} viewBox="0 0 18 18">
                    <path d="M4 4 L14 14 M14 4 L4 14" stroke="var(--ink-primary)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Small circle */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", right: "30%", top: "48%",
                    width: "14px", height: "14px", opacity: 0.12,
                    animationDelay: "1.5s",
                }} viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="5" stroke="var(--ink-primary)" strokeWidth="1" fill="none" />
                </svg>

                {/* Dot cluster */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", left: "55%", top: "15%",
                    width: "20px", height: "10px", opacity: 0.1,
                    animationDelay: "2s",
                }} viewBox="0 0 20 10">
                    <circle cx="3" cy="5" r="1.5" fill="var(--ink-primary)" />
                    <circle cx="10" cy="5" r="1" fill="var(--ink-primary)" />
                    <circle cx="17" cy="5" r="1.5" fill="var(--ink-primary)" />
                </svg>

                {/* Diagonal stroke */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", left: "3%", top: "50%",
                    width: "24px", height: "24px", opacity: 0.12,
                    transform: "rotate(-15deg)", animationDelay: "1.8s",
                }} viewBox="0 0 24 24">
                    <path d="M4 20 L20 4" stroke="var(--ink-primary)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Arrow down */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", right: "2%", top: "45%",
                    width: "20px", height: "30px", opacity: 0.13,
                    transform: "rotate(5deg)", animationDelay: "2.2s",
                }} viewBox="0 0 20 30">
                    <path d="M10 2 L10 22 M5 17 L10 24 L15 17" stroke="var(--ink-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>

                {/* Small star mark */}
                <svg className="journal-ink-mark" style={{
                    position: "absolute", left: "45%", top: "65%",
                    width: "16px", height: "16px", opacity: 0.1,
                    transform: "rotate(15deg)", animationDelay: "2.8s",
                }} viewBox="0 0 16 16">
                    <path d="M8 1 L9.5 6 L15 6.5 L10.5 10 L12 15 L8 12 L4 15 L5.5 10 L1 6.5 L6.5 6 Z" stroke="var(--ink-primary)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                </svg>

                {/* Squiggly line */}
                <svg style={{
                    position: "absolute", right: "10%", top: "55%",
                    width: "60px", height: "8px", opacity: 0.12,
                }} viewBox="0 0 60 8">
                    <path d="M0 4 Q5 0 10 4 Q15 8 20 4 Q25 0 30 4 Q35 8 40 4 Q45 0 50 4 Q55 8 60 4" stroke="var(--ink-primary)" strokeWidth="1" fill="none" strokeLinecap="round" />
                </svg>

                {/* Afterthought text — lower right */}
                <div style={{
                    position: "absolute",
                    right: "3%",
                    bottom: "3%",
                    transform: "rotate(0.8deg)",
                }}>
                    <span className="journal-afterthought" style={{
                        display: "block",
                    }}>
                        {activeTheme?.bursts?.[Math.min(2, (activeTheme?.bursts?.length || 1) - 1)] || "..."}
                    </span>
                </div>
            </div>
        </section>
    );
}
