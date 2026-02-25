"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Map, Palette, Wind, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { MOOD_CONFIG, JournalEntry } from "@/types/journal";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";
import "../../../../globals.css";

// --- Shared UI ---

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT'", color: "#a0907d", fontSize: "1.2rem", display: "inline-block", lineHeight: 1.2, ...style }}>{children}</span>
);

// --- Handmade Primitives ---

const TinyObject = ({ emoji, size = 16, top, left, right, bottom, rotate = 0, delay = 0 }: {
    emoji: string; size?: number;
    top?: string; left?: string; right?: string; bottom?: string;
    rotate?: number; delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: "backOut" }}
        style={{
            position: "absolute", top, left, right, bottom,
            fontSize: size, lineHeight: 1, zIndex: 3,
            transform: `rotate(${rotate}deg)`, pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
        }}
    >
        {emoji}
    </motion.div>
);

const WashiTape = ({ color = "#f5c6d0", rotate = -1, width = "90px" }: { color?: string; rotate?: number; width?: string }) => (
    <div style={{
        position: "absolute", top: "-1px", left: "50%",
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width, height: "22px",
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`,
        opacity: 0.85, borderRadius: "1px", zIndex: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    }} />
);

const SectionDivider = ({ label }: { label?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2.5rem 0 1.5rem" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e2d9" }} />
        <span style={{ fontSize: "12px", opacity: 0.4 }}>🌸</span>
        {label && <HandwrittenNote style={{ fontSize: "1.1rem" }}>{label}</HandwrittenNote>}
        <span style={{ fontSize: "12px", opacity: 0.4 }}>🌸</span>
        <div style={{ flex: 1, height: "1px", background: "#e8e2d9" }} />
    </div>
);

// --- Hand-drawn Dot Grid Tracker ---
const DotGrid = React.memo(({ total, filled, columns = 20, color = "#b07d62", customColors = {} }: { total: number, filled: number, columns?: number, color?: string, customColors?: Record<number, string> }) => {
    // Generate slightly irregular properties for a hand-drawn look
    const dots = useMemo(() => Array.from({ length: total }).map(() => ({
        rotation: Math.random() * 10 - 5,
        scaleX: 0.85 + Math.random() * 0.3,
        scaleY: 0.85 + Math.random() * 0.3,
        borderRadius: `${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}%`
    })), [total]);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px", marginTop: "10px" }}>
            {dots.map((dot, i) => {
                const isToday = i === filled - 1;
                const isLast = i === total - 1;
                const customColor = customColors[i];
                let dotColor = customColor || (i < filled ? color : "transparent");
                let borderColor = customColor || (i < filled ? color : "#d8d3cj");

                if (!customColor && isToday) { dotColor = "#d2691e"; borderColor = "#d2691e"; }

                const size = isLast ? "12px" : "8px";

                return (
                    <motion.div key={i}
                        animate={isToday ? { scale: [1, 1.3, 1], opacity: [1, 0.8, 1] } : {}}
                        transition={isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" as const } : {}}
                        style={{
                            width: size, height: size,
                            borderRadius: isLast ? "2px" : dot.borderRadius,
                            background: dotColor, opacity: 1,
                            border: `1.5px solid ${borderColor}`,
                            transform: `rotate(${dot.rotation}deg) scaleX(${dot.scaleX}) scaleY(${dot.scaleY})`,
                            boxShadow: isToday ? `0 0 6px ${dotColor}88` : "none",
                            clipPath: isLast ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : "none"
                        }}
                    />
                );
            })}
        </div>
    );
});
DotGrid.displayName = "DotGrid";

// --- Heartbeat Widget ---
const HeartbeatWidget = ({ isMobile }: { isMobile?: boolean }) => {
    const [beats, setBeats] = useState<number>(0);
    const birthDate = useMemo(() => new Date(2000, 10, 28), []);

    useEffect(() => {
        const updateBeats = () => {
            const now = new Date();
            setBeats(Math.floor((now.getTime() - birthDate.getTime()) / 1000 * 1.2));
        };
        updateBeats();
        const timer = setInterval(updateBeats, 1000);
        return () => clearInterval(timer);
    }, [birthDate]);

    if (beats === 0) return null;

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.857, repeat: Infinity, ease: "easeInOut" as const }}>
                    <Heart size={28} color="#b07d62" fill="#b07d62" style={{ opacity: 0.8 }} />
                </motion.div>
                <div>
                    <div style={{ fontSize: "0.7rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.3rem" }}>Detak jantungmu sejak lahir</div>
                    <div style={{ fontSize: isMobile ? "1.8rem" : "2.5rem", fontWeight: 900, color: "#b07d62", fontFamily: "'Crimson Pro', serif", fontVariantNumeric: "tabular-nums" }}>
                        {beats.toLocaleString('id-ID')}
                    </div>
                </div>
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.857, repeat: Infinity, ease: "easeInOut" as const, delay: 0.4 }}>
                    <Heart size={28} color="#b07d62" fill="#b07d62" style={{ opacity: 0.8 }} />
                </motion.div>
            </div>
            <HandwrittenNote style={{ marginTop: "1rem", fontSize: "1rem", opacity: 0.7 }}>
                &ldquo;...dan setiap detaknya adalah bukti bahwa kamu berharga.&rdquo;
            </HandwrittenNote>
        </div>
    );
};

// --- Page ---

export default function YearPage() {
    const [mounted, setMounted] = useState(false);
    const [stableNow, setStableNow] = useState<Date | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [wisdom, setWisdom] = useState("");
    const [journalColors, setJournalColors] = useState<Record<number, string>>({});
    const [usePaletteColors, setUsePaletteColors] = useState(false);
    const [dots, setDots] = useState("");
    const [showTimeCapsuleMessage, setShowTimeCapsuleMessage] = useState(false);
    const { tokens: T } = useTheme();

    const birthDate = new Date(2000, 10, 28);

    useEffect(() => {
        setMounted(true);
        const nowInit = new Date();
        setStableNow(nowInit);

        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);

        // Load palette preference
        const savedPalettePref = localStorage.getItem("journal_use_palette");
        if (savedPalettePref === "true") setUsePaletteColors(true);

        // Fetch Journal Colors
        const savedJournal = localStorage.getItem("journal_entries_25");
        if (savedJournal) {
            try {
                const entries = JSON.parse(savedJournal) as Record<string, JournalEntry>;
                const colorMap: Record<number, string> = {};
                const currentYear = nowInit.getFullYear();
                let startOfPersonalYear = new Date(currentYear, 10, 28);
                if (nowInit.getTime() < startOfPersonalYear.getTime()) {
                    startOfPersonalYear = new Date(currentYear - 1, 10, 28);
                }
                startOfPersonalYear.setHours(0, 0, 0, 0);
                const endOfPersonalYear = new Date(startOfPersonalYear.getFullYear() + 1, 10, 28);
                endOfPersonalYear.setHours(0, 0, 0, 0);

                Object.values(entries).forEach(entry => {
                    const entryDate = new Date(entry.date);
                    entryDate.setHours(0, 0, 0, 0);
                    if (entryDate >= startOfPersonalYear && entryDate < endOfPersonalYear) {
                        const dayIndex = Math.floor((entryDate.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
                        if (dayIndex >= 0) colorMap[dayIndex] = MOOD_CONFIG[entry.category]?.color || "#b07d62";
                    }
                });
                setJournalColors(colorMap);
            } catch (e) { console.error("Failed to parse journal colors", e); }
        }

        // Daily wisdom
        const dailyWisdoms = [
            "Kamu adalah alasan di balik senyuman yang merekah hari ini, meski terkadang kamu tak menyadarinya.",
            "Setiap langkah yang kamu tapaki adalah guratan berharga dalam kanvas waktu.",
            "Hari ini adalah selembar kertas kosong yang menanti sentuhan ketulusanmu.",
            "Tetaplah melangkah dengan caramu yang paling tenang.",
            "Kebahagiaanmu adalah prioritas utama yang harus kamu jaga di sini, saat ini.",
            "Terimalah dirimu apa adanya, dekaplah setiap detik yang kamu miliki dengan rasa syukur.",
            "Jangan pernah biarkan semangatmu redup hanya karena dunia belum siap menerimanya."
        ];
        setWisdom(dailyWisdoms[nowInit.getDate() % dailyWisdoms.length]);

        // Dots animation
        const dotsInterval = setInterval(() => setDots(prev => prev === "..." ? "" : prev + "."), 500);

        return () => { window.removeEventListener('resize', check); clearInterval(dotsInterval); };
    }, []);

    if (!mounted || !stableNow) return null;

    const currentNow = stableNow;

    // Personal Year Calculations
    let startOfPersonalYear = new Date(currentNow.getFullYear(), 10, 28);
    if (currentNow.getTime() < startOfPersonalYear.getTime()) {
        startOfPersonalYear = new Date(currentNow.getFullYear() - 1, 10, 28);
    }
    startOfPersonalYear.setHours(0, 0, 0, 0);
    const endOfPersonalYear = new Date(startOfPersonalYear.getFullYear() + 1, 10, 28);
    endOfPersonalYear.setHours(0, 0, 0, 0);

    const totalDaysInPersonalYear = Math.round((endOfPersonalYear.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentNowMidnight = new Date(currentNow);
    currentNowMidnight.setHours(0, 0, 0, 0);
    const currentDayInPersonalYear = Math.floor((currentNowMidnight.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysLeftInPersonalYear = Math.max(0, totalDaysInPersonalYear - currentDayInPersonalYear + 1);

    let age = currentNow.getFullYear() - birthDate.getFullYear();
    const m = currentNow.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentNow.getDate() < birthDate.getDate())) age--;

    // Days until next birthday
    const nowMid = new Date(currentNow);
    nowMid.setHours(0, 0, 0, 0);
    let target = new Date(currentNow.getFullYear(), 10, 28);
    if (nowMid.getTime() > target.getTime()) target.setFullYear(currentNow.getFullYear() + 1);
    const daysUntil = Math.ceil((target.getTime() - nowMid.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div style={{ backgroundColor: T.pageBg, backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, minHeight: "100svh", color: T.textPrimary, fontFamily: "'Crimson Pro', serif, -apple-system", position: "relative", overflowX: "hidden", paddingBottom: "5rem", transition: "background-color 0.5s ease, color 0.5s ease" }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: T.paperTexture, zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "4rem 0" : "6rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <Link href="/guest/no28/special_day" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: T.buttonBg, border: `2px solid ${T.buttonBorder}`, borderRadius: "12px", color: T.buttonText, boxShadow: T.buttonShadow, transition: "all 0.3s ease" }}>
                                <ArrowLeft size={22} strokeWidth={2} />
                            </Link>
                            <div>
                                <div style={{ fontSize: "0.65rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700 }}>Tahun Istimewanya</div>
                                <HandwrittenNote style={{ fontSize: "1.1rem", color: T.textAccent }}>365 hari perjalanan tahun ini</HandwrittenNote>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* ============================== */}
                    {/* SECTION 1: Personal Year Grid  */}
                    {/* ============================== */}
                    <motion.section initial={{ opacity: 1, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Link href="/guest/no28/journal" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                            <div style={{ background: "#fff", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", borderRadius: "6px", border: "1px solid #e8e2d9", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem", transition: "transform 0.2s", position: "relative" }}>
                                <WashiTape color="#d1e3dd" rotate={2} width="110px" />
                                <TinyObject emoji="🌿" size={15} top="20px" right="20px" rotate={10} delay={0.2} />

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Map size={14} color="#a0907d" style={{ opacity: 0.8 }} />
                                        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>Lembaran Kisah Ke-{age + 1}</h3>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); const newVal = !usePaletteColors; setUsePaletteColors(newVal); localStorage.setItem("journal_use_palette", String(newVal)); }}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", opacity: usePaletteColors ? 1 : 0.4, transition: "opacity 0.2s" }} title="Toggle Mood Colors">
                                            <Palette size={16} color="#b07d62" />
                                        </button>
                                        <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
                                            style={{ fontFamily: "'Caveat', cursive", fontSize: "1.2rem", color: "#b07d62", transform: "rotate(-2deg)" }}>
                                            ukir ceritamu...
                                        </motion.div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                                    <div>
                                        <div style={{ fontSize: "0.8rem", color: "#a0907d", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase" }}>Halaman Yang Telah Kamu Isi</div>
                                        <div style={{ fontSize: "4.5rem", fontWeight: 700, color: "#b07d62", lineHeight: 1, fontFamily: "'Caveat', cursive" }}>
                                            {currentDayInPersonalYear} <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.2rem", fontWeight: 300, color: "#4e4439", fontStyle: "italic" }}>Hari</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <HandwrittenNote style={{ fontSize: "1.3rem" }}>{daysLeftInPersonalYear} hari lagi...</HandwrittenNote>
                                        <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", fontWeight: 700 }}>MENUJU 28 NOV</div>
                                    </div>
                                </div>

                                <div style={{ position: "relative", padding: "10px 0" }}>
                                    <DotGrid total={totalDaysInPersonalYear} filled={currentDayInPersonalYear} columns={isMobile ? 18 : 25} color="#b07d62" customColors={usePaletteColors ? journalColors : {}} />
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.7rem", fontWeight: 700, color: "#aaa", fontFamily: "'Crimson Pro', serif" }}>
                                        <span>28 NOV {startOfPersonalYear.getFullYear()}</span>
                                        <span>28 NOV {endOfPersonalYear.getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.section>

                    {/* ============================== */}
                    {/* SECTION 2: Birthday Countdown  */}
                    {/* ============================== */}
                    <SectionDivider label="Menuju hari istimewamu" />

                    <motion.section initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div
                            onClick={() => setShowTimeCapsuleMessage(true)}
                            style={{ background: "#fff", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", borderRadius: "6px", border: "1px solid #e8e2d9", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: isMobile ? "3rem 1.5rem" : "4rem 2.5rem", textAlign: "center", cursor: "pointer", position: "relative" }}
                        >
                            <TinyObject emoji="🌷" size={15} top="20px" left="20px" rotate={-15} delay={0.4} />

                            <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 1.5rem" }}>
                                <Image src="/time_capsule_icon_clean.webp" alt="Time Capsule" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "0.5rem", fontFamily: "'Crimson Pro', serif", fontWeight: 700 }}>Menuju 28 November</div>
                            <div style={{ fontSize: isMobile ? "4rem" : "5rem", fontWeight: 700, color: "#b07d62", fontFamily: "'Caveat', cursive", lineHeight: 1 }}>
                                {daysUntil} <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.2rem", fontWeight: 300, fontStyle: "italic" }}>hari lagi<span style={{ display: "inline-block", width: "24px", textAlign: "left" }}>{dots}</span></span>
                            </div>
                            <HandwrittenNote style={{ fontSize: "1.15rem", marginTop: "1rem", opacity: 0.7 }}>
                                ketuk untuk membuka pesan rahasia
                            </HandwrittenNote>
                        </div>
                    </motion.section>

                    {/* ============================== */}
                    {/* SECTION 3: Heartbeat Counter   */}
                    {/* ============================== */}
                    <SectionDivider label="Irama kehidupanmu" />

                    <motion.section initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div style={{ background: "#fff", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", borderRadius: "6px", border: "1px solid #e8e2d9", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: isMobile ? "3rem 1.5rem" : "4rem 2.5rem" }}>
                            <HeartbeatWidget isMobile={isMobile} />
                        </div>
                    </motion.section>

                    {/* ============================== */}
                    {/* SECTION 4: Daily Wisdom Quote  */}
                    {/* ============================== */}
                    <SectionDivider label="Bait untukmu hari ini" />

                    <motion.section initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div style={{ background: "#fefbfc", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", borderRadius: "6px", border: "1px solid #e8e2d9", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: isMobile ? "3rem 1.8rem" : "6rem 4rem", position: "relative", overflow: "hidden" }}>
                            <WashiTape color="#f5d5c0" rotate={-1} width="120px" />
                            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "140px", height: "140px", opacity: 0.7, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" as const }}>
                                <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                                <Wind size={24} color="#b07d62" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? "2rem" : "2.6rem", fontWeight: 700, color: "#b07d62", marginBottom: "1rem", lineHeight: 1.2 }}>
                                    &ldquo;{wisdom}&rdquo;
                                </h3>
                                <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                    <HandwrittenNote style={{ fontSize: "1.4rem" }}>Bait Untukmu</HandwrittenNote>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Footer */}
                    <div style={{ marginTop: "5rem", textAlign: "center" }}>
                        <div style={{ width: "40px", height: "1px", background: "#b07d62", margin: "0 auto 1.5rem", opacity: 0.3 }} />
                        <HandwrittenNote style={{ fontSize: "1.2rem", color: "#b07d62" }}>
                            ...teruslah mengisi lembar-lembar baru.
                        </HandwrittenNote>
                    </div>
                </Container>
            </main>

            {/* Time Capsule Popup */}
            <AnimatePresence>
                {showTimeCapsuleMessage && (
                    <motion.div initial={{ opacity: 1, }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowTimeCapsuleMessage(false)}
                        style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
                    >
                        <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                            <motion.div initial={{ y: 100, opacity: 0, scale: 0.8, rotate: -5 }} animate={{ y: -80, opacity: 1, scale: 1, rotate: 2 }} exit={{ y: 0, opacity: 0, scale: 0.8 }} transition={{ delay: 0.8, duration: 1, type: "spring" as const, bounce: 0.3 }}
                                style={{ width: "280px", background: "#fdf8f0", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", padding: "2rem", border: "1px solid #d2b48c", borderRadius: "2px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", position: "relative", zIndex: 1, textAlign: "center" }}>
                                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕰️</div>
                                <HandwrittenNote style={{ fontSize: "1.2rem", color: "#4e4439", lineHeight: 1.6 }}>
                                    &ldquo;Maaf, pesan ini masih terlelap. <br />Ia akan terbangun untuk menyapamu tepat di hari istimewamu nanti.&rdquo;
                                </HandwrittenNote>
                                <HandwrittenNote style={{ fontSize: "1.4rem", color: "#b07d62", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
                                    {daysUntil} hari lagi<span style={{ display: "inline-block", width: "24px", textAlign: "left", marginLeft: "2px" }}>{dots}</span>
                                </HandwrittenNote>
                                <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "1.5rem", fontStyle: "italic" }}>(ketuk di luar untuk menutup)</div>
                            </motion.div>
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [0.5, 1.2, 1], opacity: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                                transition={{ scale: { duration: 0.5 }, opacity: { duration: 0.3 }, rotate: { delay: 0.5, duration: 0.6, ease: "easeInOut" as const } }}
                                style={{ width: "120px", height: "120px", position: "relative", zIndex: 2, marginTop: "-40px", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" }}>
                                <Image src="/time_capsule_icon_clean.webp" alt="Envelope" fill style={{ objectFit: "contain" }} />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
