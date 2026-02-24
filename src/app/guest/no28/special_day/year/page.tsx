"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Map, Palette, Wind, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { MOOD_CONFIG, JournalEntry } from "@/types/journal";
import { useTheme } from "@/components/guest/no28/ThemeContext";

// --- Watercolor Components ---

const HandwrittenText = ({ children, style = {}, className = "" }: { children: React.ReactNode, style?: React.CSSProperties, className?: string }) => (
    <span className={`font-handwriting ${className}`} style={{ fontSize: "1.25rem", display: "inline-block", lineHeight: 1.2, ...style }}>
        {children}
    </span>
);

const WashStripe = ({ type = "blue" as "blue" | "sage" | "rose" | "ochre" | "lavender" }) => (
    <div className={`wc-wash-stripe wc-wash-stripe--${type}`} />
);

const AmbientPaintDrops = () => {
    const drops = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 10,
        size: 8 + Math.random() * 12,
        color: ["var(--wc-wash-blue-light)", "var(--wc-wash-sage-light)", "var(--wc-wash-rose-light)", "var(--wc-wash-ochre-light)"][Math.floor(Math.random() * 4)],
        blur: 1 + Math.random() * 3
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: "absolute", left: drop.left, top: "-20px", width: drop.size, height: drop.size,
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`, opacity: 0.3,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

// --- Dot Grid Component ---
const DotGrid = React.memo(({ total, filled, columns = 20, color = "var(--wc-accent)", size = "6px", customColors = {} }: { total: number, filled: number, columns?: number, color?: string, size?: string, customColors?: Record<number, string> }) => {
    const dots = useMemo(() => Array.from({ length: total }).map(() => ({ rotation: Math.random() * 10 - 5, scale: 0.8 + Math.random() * 0.4 })), [total]);

    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "5px", marginTop: "12px" }}>
            {dots.map((dot, i) => {
                const isToday = i === filled - 1;
                const isFinal = i === total - 1;
                const customColor = customColors[i];
                let dotColor = customColor || (i < filled ? color : "var(--wc-divider)");
                if (!customColor && isToday) dotColor = "var(--wc-ink)";

                return (
                    <motion.div key={i}
                        animate={isToday ? { scale: [1, 1.8, 1], opacity: [1, 0.7, 1] } : {}}
                        transition={isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                        style={{
                            width: size, height: size, borderRadius: isFinal ? "0" : "2px", background: dotColor, opacity: 1,
                            transform: `rotate(${dot.rotation}deg) scale(${isFinal ? 1.6 : 1})`,
                            boxShadow: isToday ? `0 0 6px ${dotColor}` : "none",
                            clipPath: isFinal ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : "none",
                            transition: "background-color 0.4s ease"
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
            setBeats(Math.floor((now.getTime() - birthDate.getTime()) / 1000 * 1.25));
        };
        updateBeats();
        const timer = setInterval(updateBeats, 1000);
        return () => clearInterval(timer);
    }, [birthDate]);

    if (beats === 0) return null;

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                <motion.div animate={{ scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
                    <Heart size={32} color="var(--wc-accent)" fill="var(--wc-accent)" style={{ opacity: 0.6 }} />
                </motion.div>
                <div style={{ textAlign: "center" }}>
                    <div className="font-serif-display" style={{ fontSize: "0.75rem", color: "var(--wc-text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}>Detak jantungmu sejak lahir</div>
                    <div className="font-serif-display" style={{ fontSize: isMobile ? "2.2rem" : "3.5rem", fontWeight: 400, color: "var(--wc-text-primary)", fontVariantNumeric: "tabular-nums", fontStyle: "italic" }}>
                        {beats.toLocaleString('id-ID')}
                    </div>
                </div>
                <motion.div animate={{ scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}>
                    <Heart size={32} color="var(--wc-accent)" fill="var(--wc-accent)" style={{ opacity: 0.6 }} />
                </motion.div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
                <HandwrittenText style={{ fontSize: "1.1rem", color: "var(--wc-text-accent)", opacity: 0.8 }}>
                    "Setiap detaknya adalah bukti bahwa kamu berharga."
                </HandwrittenText>
            </div>
        </div>
    );
};

export default function YearPage() {
    const [mounted, setMounted] = useState(false);
    const [stableNow, setStableNow] = useState<Date | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [wisdom, setWisdom] = useState("");
    const [journalColors, setJournalColors] = useState<Record<number, string>>({});
    const [usePaletteColors, setUsePaletteColors] = useState(false);
    const [dots, setDots] = useState("");
    const [showTimeCapsuleMessage, setShowTimeCapsuleMessage] = useState(false);
    const { tokens: T, mode } = useTheme();

    const birthDate = useMemo(() => new Date(2000, 10, 28), []);

    useEffect(() => {
        setMounted(true);
        const nowInit = new Date();
        setStableNow(nowInit);

        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);

        const savedPalettePref = localStorage.getItem("journal_use_palette");
        if (savedPalettePref === "true") setUsePaletteColors(true);

        const savedJournal = localStorage.getItem("journal_entries_25");
        if (savedJournal) {
            try {
                const entries = JSON.parse(savedJournal) as Record<string, JournalEntry>;
                const colorMap: Record<number, string> = {};
                let startOfPersonalYear = new Date(nowInit.getFullYear(), 10, 28);
                if (nowInit.getTime() < startOfPersonalYear.getTime()) {
                    startOfPersonalYear = new Date(nowInit.getFullYear() - 1, 10, 28);
                }
                startOfPersonalYear.setHours(0, 0, 0, 0);
                const endOfPersonalYear = new Date(startOfPersonalYear.getFullYear() + 1, 10, 28);
                endOfPersonalYear.setHours(0, 0, 0, 0);

                Object.values(entries).forEach(entry => {
                    const entryDate = new Date(entry.date);
                    entryDate.setHours(0, 0, 0, 0);
                    if (entryDate >= startOfPersonalYear && entryDate < endOfPersonalYear) {
                        const dayIndex = Math.floor((entryDate.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
                        if (dayIndex >= 0) colorMap[dayIndex] = MOOD_CONFIG[entry.category]?.color || "var(--wc-accent)";
                    }
                });
                setJournalColors(colorMap);
            } catch (e) { console.error("Failed to parse journal colors", e); }
        }

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

        const dotsInterval = setInterval(() => setDots(prev => prev === "..." ? "" : prev + "."), 600);
        return () => { window.removeEventListener('resize', check); clearInterval(dotsInterval); };
    }, []);

    if (!mounted || !stableNow) return null;

    const currentNow = stableNow;
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
    if (currentNow.getMonth() < 10 || (currentNow.getMonth() === 10 && currentNow.getDate() < 28)) age--;

    let targetBday = new Date(currentNow.getFullYear(), 10, 28);
    if (currentNowMidnight.getTime() > targetBday.getTime()) targetBday.setFullYear(currentNow.getFullYear() + 1);
    const daysUntilNext = Math.ceil((targetBday.getTime() - currentNowMidnight.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden", paddingBottom: "10rem",
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, transition: "background-color 0.5s ease"
        }}>
            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                            <Link href="/guest/no28/special_day" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "48px", height: "48px", backgroundColor: T.cardBg,
                                borderRadius: "14px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={24} />
                            </Link>
                            <div style={{ textAlign: "left" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, opacity: 0.8 }}>Tahun Istimewanya</div>
                                <HandwrittenText style={{ fontSize: "1rem", color: T.textAccent }}>365 hari perjalanan tahun ini</HandwrittenText>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>

                        {/* PERSONAL YEAR GRID CARD */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Link href="/guest/no28/journal" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                <div className="wc-card hover-ink-bleed" style={{ padding: isMobile ? "2.5rem 1.8rem" : "4rem 4rem", border: `1px solid ${T.cardBorder}` }}>
                                    <WashStripe type="sage" />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div className="wc-card" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>
                                                <Map size={16} color={T.accent} />
                                            </div>
                                            <h3 className="font-serif-display" style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px" }}>Lembaran Kisah Ke-{age + 1}</h3>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUsePaletteColors(v => { const n = !v; localStorage.setItem("journal_use_palette", String(n)); return n; }); }}
                                                className="wc-card" style={{ background: usePaletteColors ? "var(--wc-wash-ochre-light)" : "var(--wc-card-bg)", color: usePaletteColors ? "var(--wc-accent)" : "var(--wc-text-muted)", padding: "8px", borderRadius: "10px", border: `1px solid ${T.cardBorder}`, opacity: usePaletteColors ? 1 : 0.6 }}>
                                                <Palette size={18} />
                                            </button>
                                            <HandwrittenText style={{ fontSize: "1.2rem", color: T.textAccent, transform: "rotate(-3deg)" }}>ukir ceritamu...</HandwrittenText>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
                                        <div>
                                            <div className="font-serif-display" style={{ fontSize: "0.85rem", color: T.textSecondary, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>Halaman Yang Telah Diisi</div>
                                            <div className="font-serif-display" style={{ fontSize: isMobile ? "3rem" : "4.5rem", fontWeight: 400, color: T.textPrimary, lineHeight: 1, fontStyle: "italic" }}>
                                                {currentDayInPersonalYear} <span style={{ fontSize: "1.4rem", fontWeight: 300, color: T.textMuted }}>Hari</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <HandwrittenText style={{ fontSize: "1.3rem", color: T.textAccent }}>{daysLeftInPersonalYear} hari lagi...</HandwrittenText>
                                            <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "2px", marginTop: "4px" }}>MENUJU 28 NOV</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: "10px 0" }}>
                                        <DotGrid total={totalDaysInPersonalYear} filled={currentDayInPersonalYear} columns={isMobile ? 18 : 28} size={isMobile ? "4px" : "6px"} color="var(--wc-accent)" customColors={usePaletteColors ? journalColors : {}} />
                                        <div className="font-serif-display" style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, opacity: 0.6, letterSpacing: "1.5px" }}>
                                            <span>28 NOV {startOfPersonalYear.getFullYear()}</span>
                                            <span>28 NOV {endOfPersonalYear.getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.section>

                        {/* BIRTHDAY COUNTDOWN CARD */}
                        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div onClick={() => setShowTimeCapsuleMessage(true)} className="wc-card hover-ink-bleed" style={{ padding: "4rem 2rem", textAlign: "center", cursor: "pointer", border: `1px solid ${T.cardBorder}` }}>
                                <WashStripe type="ochre" />
                                <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 2rem", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                    <Image src="/time_capsule_icon_clean.webp" alt="Time Capsule" fill style={{ objectFit: "contain" }} />
                                </div>
                                <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "4px", marginBottom: "1rem" }}>Menuju 28 November</div>
                                <div className="font-serif-display" style={{ fontSize: isMobile ? "3.5rem" : "5rem", fontWeight: 400, color: T.textPrimary, lineHeight: 1, fontStyle: "italic" }}>
                                    {daysUntilNext} <span style={{ fontSize: "1.6rem", fontWeight: 300 }}>hari lagi<span style={{ display: "inline-block", width: "24px", textAlign: "left" }}>{dots}</span></span>
                                </div>
                                <div style={{ marginTop: "2rem" }}>
                                    <HandwrittenText style={{ fontSize: "1.1rem", opacity: 0.7 }}>ketuk untuk membuka pesan rahasia</HandwrittenText>
                                </div>
                            </div>
                        </motion.section>

                        {/* HEARTBEAT WIDGET CARD */}
                        <motion.section initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                            <div className="wc-card" style={{ padding: "4rem 2rem", border: `1px solid ${T.cardBorder}` }}>
                                <WashStripe type="rose" />
                                <HeartbeatWidget isMobile={isMobile} />
                            </div>
                        </motion.section>

                        {/* DAILY WISDOM CARD */}
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <div className="wc-card" style={{ padding: isMobile ? "4rem 2rem" : "6rem 5rem", position: "relative", overflow: "hidden", border: `1px solid ${T.cardBorder}` }}>
                                <WashStripe type="blue" />
                                {/* Watercolor Mark */}
                                <div style={{ position: "absolute", bottom: "-40px", right: "-30px", width: "180px", height: "180px", opacity: 0.1, transform: "rotate(-10deg)", pointerEvents: "none", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                    <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                </div>

                                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                                    <Wind size={32} color={T.accent} style={{ margin: "0 auto 2.5rem", opacity: 0.3 }} />
                                    <p className="font-serif" style={{ fontSize: isMobile ? "1.4rem" : "2rem", color: T.textPrimary, fontStyle: "italic", lineHeight: 1.7, fontWeight: 300, opacity: 0.9 }}>
                                        &ldquo;{wisdom}&rdquo;
                                    </p>
                                    <div style={{ marginTop: "4rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
                                        <div style={{ width: "40px", height: "1px", background: T.dividerColor, opacity: 0.5 }} />
                                        <HandwrittenText style={{ fontSize: "1.5rem", color: T.textAccent }}>Bait Untukmu</HandwrittenText>
                                        <div style={{ width: "40px", height: "1px", background: T.dividerColor, opacity: 0.5 }} />
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: "10rem", textAlign: "center" }}>
                        <HandwrittenText style={{ fontSize: "1.4rem", color: T.textMuted, opacity: 0.6 }}>
                            ...teruslah mengisi lembar-lembar baru.
                        </HandwrittenText>
                    </div>
                </Container>
            </main>

            {/* TIME CAPSULE POPUP */}
            <AnimatePresence>
                {showTimeCapsuleMessage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTimeCapsuleMessage(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: T.overlayBg, backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
                        <div style={{ position: "relative", width: "100%", maxWidth: "360px", height: "420px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                            <motion.div initial={{ y: 150, opacity: 0, rotate: -8 }} animate={{ y: -80, opacity: 1, rotate: 2 }} exit={{ y: 50, opacity: 0 }} transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                                style={{ width: "280px", background: "#fff", padding: "2.5rem 2rem", borderRadius: "4px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", textAlign: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🕰️</div>
                                <HandwrittenText style={{ fontSize: "1.2rem", color: T.textPrimary, lineHeight: 1.6, marginBottom: "1.5rem" }}>
                                    &ldquo;Maaf, pesan ini masih terlelap. <br />Ia akan terbangun untuk menyapamu tepat di hari istimewamu nanti.&rdquo;
                                </HandwrittenText>
                                <div className="font-serif-display" style={{ fontSize: "1.6rem", color: T.textAccent, fontStyle: "italic" }}>
                                    {daysUntilNext} hari lagi<span style={{ display: "inline-block", width: "24px", textAlign: "left", marginLeft: "2px" }}>{dots}</span>
                                </div>
                                <p style={{ marginTop: "2.5rem", fontSize: "0.75rem", color: T.textMuted, letterSpacing: "2px" }}>(KETUK UNTUK TUTUP)</p>
                            </motion.div>
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "140px", height: "140px", position: "relative", zIndex: 2, marginTop: "-50px", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                <Image src="/time_capsule_icon_clean.webp" alt="Time Capsule" fill style={{ objectFit: "contain" }} />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
