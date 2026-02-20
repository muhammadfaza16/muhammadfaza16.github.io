"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Activity, Zap, Grid3X3, Disc } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

// --- Enhanced Design System ---
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { BentoCard, theme } from "@/components/BentoCard";

// 1. Life Stats (Redesigned with Living Tickers)
const LifeStats = ({ birthDate }: { birthDate: Date }) => {
    const [stats, setStats] = useState({
        yearsLived: 0,
        daysLived: 0,
        hoursLived: 0,
        heartbeats: 0,
        breaths: 0,
        distanceTraveled: 0
    });

    useEffect(() => {
        const calculateStats = () => {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - birthDate.getTime());

            // Basic Time Stats
            const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Biological Tickers (Approximations)
            // Heart: Avg 80 bpm -> 1.333 beats per sec
            // Breath: Avg 16 bpm -> 0.266 breaths per sec
            // Earth Speed: 29.78 km/s
            const secondsAlive = diffTime / 1000;

            setStats({
                yearsLived: years,
                daysLived: days,
                hoursLived: Math.floor(diffTime / (1000 * 60 * 60)),
                heartbeats: Math.floor(secondsAlive * 1.3333),
                breaths: Math.floor(secondsAlive * 0.2666),
                distanceTraveled: Math.floor(secondsAlive * 29.78)
            });
        };

        // High frequency update for "Living" feel
        const interval = setInterval(calculateStats, 100);
        calculateStats(); // Initial call

        return () => clearInterval(interval);
    }, [birthDate]);

    // Format number with commas
    const fmt = (n: number) => new Intl.NumberFormat().format(n);

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={1} delay={0.2}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Activity size={20} color={theme.colors.danger} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.colors.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                        Biological Engine
                    </span>
                </div>

                {/* Pulse Indicator */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.colors.danger }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Heartbeats */}
                <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", fontWeight: 700, color: theme.colors.textMain }}>
                            {fmt(stats.heartbeats)}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: theme.colors.danger }}>bpm</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: theme.colors.textDim }}>Total Heartbeats</span>
                </div>

                {/* Breaths */}
                <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", fontWeight: 700, color: theme.colors.textMain }}>
                            {fmt(stats.breaths)}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: theme.colors.secondary }}>rpm</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: theme.colors.textDim }}>Total Breaths</span>
                </div>

                {/* Cosmic Distance */}
                <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700, color: theme.colors.textMain }}>
                            {fmt(stats.distanceTraveled)}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: theme.colors.accent }}>km</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: theme.colors.textDim }}>Orbit Traveled (Earth)</span>
                </div>
            </div>

            {/* Background EKG Visualization */}
            <svg
                style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "60px", opacity: 0.1, pointerEvents: "none" }}
                viewBox="0 0 300 60"
            >
                <motion.path
                    d="M0,30 L20,30 L25,10 L35,50 L40,30 L300,30"
                    fill="none"
                    stroke={theme.colors.danger}
                    strokeWidth="2"
                    initial={{ pathLength: 0, x: -300 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </BentoCard>
    );
};

// 2. Life Grid (Memento Mori with Scannner Effect)
const LifeGrid = ({ birthDate }: { birthDate: Date }) => {
    const yearsExpected = 80;
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    const yearsLeft = yearsExpected - age;
    const dots = Array.from({ length: yearsExpected }, (_, i) => i < age);

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={1} delay={0.2}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "rgba(255, 69, 58, 0.15)", color: theme.colors.danger,
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <Grid3X3 size={18} />
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, color: theme.colors.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                    Perspective
                </span>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 1fr)",
                gap: "5px",
                width: "100%",
                flex: 1,
                alignContent: "center",
                position: "relative"
            }}>
                {/* Scanner Line - Optimized with TranslateY to prevent Layout Thrashing */}
                <motion.div
                    initial={{ top: 0, translateY: "-100%", opacity: 0 }}
                    animate={{ translateY: "600%", opacity: [0, 0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 6, delay: 2, ease: "linear" }}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: "20px",
                        background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)",
                        zIndex: 10,
                        pointerEvents: "none"
                    }}
                />

                {dots.map((isLived, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        style={{
                            aspectRatio: "1/1",
                            borderRadius: "1px", // Square pixels
                            background: isLived ? theme.colors.textMain : "rgba(255,255,255,0.06)", // Solid vs Ghost
                            opacity: isLived ? 0.9 : 1,
                        }}
                    >
                        {isLived && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.3, 0] }}
                                transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 2 }}
                                style={{ width: "100%", height: "100%", background: "#fff" }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: theme.colors.textMuted, marginTop: "1rem", fontWeight: 500, textAlign: "right", letterSpacing: "0.02em" }}>
                <span style={{ color: theme.colors.textMain, fontWeight: 800, fontSize: "0.9rem" }}>{yearsLeft}</span> years remaining
            </p>
        </BentoCard>
    );
};

// 3. Year Progress
const YearProgress = () => {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const totalDays = 365 + (year % 4 === 0 ? 1 : 0);
    const progress = (dayOfYear / totalDays) * 100;
    const daysLeft = totalDays - dayOfYear;

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={2} delay={0.3}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: theme.colors.textMain, letterSpacing: "-0.02em", fontFamily: "'Playfair Display', serif" }}>Year Progress</h3>
                <span style={{ fontFamily: "var(--font-mono)", color: theme.colors.accent, fontWeight: 800, letterSpacing: "0.05em" }}>{year}</span>
            </div>

            {/* Matrix / DNA Strip Visual */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2px",
                height: "60px",
                overflow: "hidden",
                maskImage: "linear-gradient(to bottom, black 80%, transparent)" // Fade out bottom
            }}>
                {Array.from({ length: 140 }).map((_, i) => {
                    const isActive = i < (dayOfYear / totalDays) * 140;
                    return (
                        <motion.div
                            key={i}
                            animate={isActive ? { opacity: [0.8, 0.3, 0.8] } : {}}
                            transition={isActive ? { repeat: Infinity, duration: 5, delay: Math.random() * 4, ease: [0.4, 0, 0.2, 1] } : {}}
                            style={{
                                width: "4px",
                                height: "12px",
                                background: isActive ? theme.colors.accent : "rgba(255,255,255,0.05)",
                                borderRadius: "1px",
                                opacity: isActive ? 1 : 0.3
                            }}
                        />
                    );
                })}
            </div>

            <div style={{ marginTop: "auto", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6px" }}>
                    <span style={{ fontSize: "3.2rem", fontWeight: 900, color: theme.colors.textMain, letterSpacing: "-0.05em", lineHeight: 1 }}>
                        {progress.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: theme.colors.textMuted, marginBottom: "8px", letterSpacing: "-0.01em" }}>{daysLeft} days left</span>
                </div>

                <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${theme.colors.accent}, #5AC8FA)`,
                            borderRadius: "2px",
                            boxShadow: `0 0 10px ${theme.colors.accent}60`,
                            position: "relative"
                        }}
                    >
                        {/* Leading Sparkle */}
                        <div style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translate(50%, -50%)",
                            width: "8px",
                            height: "8px",
                            background: "#fff",
                            borderRadius: "50%",
                            boxShadow: "0 0 10px #fff"
                        }} />
                    </motion.div>
                </div>
            </div>
        </BentoCard>
    );
};

// 4. Day Progress (Interactive Bar Chart)
const DayProgress = () => {
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [hoverHour, setHoverHour] = useState<number | null>(null);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const current = now.getTime() - start.getTime();
            const perc = (current / (end.getTime() - start.getTime())) * 100;
            setProgress(perc);

            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const currentHour = new Date().getHours();

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={2} delay={0.4}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                    <span style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "rgba(255, 214, 10, 0.15)",
                        color: theme.colors.primary,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)"
                    }}>
                        Today
                    </span>
                    <h2 style={{
                        fontSize: "3.2rem",
                        fontWeight: 900,
                        color: theme.colors.textMain,
                        letterSpacing: "-0.05em",
                        lineHeight: 1
                    }}>
                        {currentTime}
                    </h2>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <Zap size={20} color={theme.colors.primary} style={{ display: "block" }} />
                        </motion.div>
                    </div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: theme.colors.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Energy</div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", height: "100px", gap: "4px", position: "relative" }}>
                {/* Progress Indicator Line */}
                <div style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "0",
                    width: "100%",
                    height: "2px",
                    background: theme.colors.cardBorder,
                    borderRadius: "2px"
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: theme.colors.primary,
                        boxShadow: `0 0 8px ${theme.colors.primary}`,
                        position: "relative"
                    }}>
                        <div style={{ position: "absolute", right: 0, top: "-4px", width: "2px", height: "10px", background: "#fff" }} />
                    </div>
                </div>

                {hours.map((h) => {
                    const isPast = h < currentHour;
                    const isCurrent = h === currentHour;
                    const isHovered = hoverHour === h;

                    // Base heights for current, past, and future
                    const baseHeight = isCurrent ? "70%" : isPast ? "35%" : "20%";

                    return (
                        <div key={h} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                            <motion.div
                                onMouseEnter={() => setHoverHour(h)}
                                onMouseLeave={() => setHoverHour(null)}
                                initial={{ height: "20%" }}
                                animate={{
                                    scaleY: isCurrent ? 0.75 : isPast ? 0.35 : 0.2, // Use pure scale for height logic
                                    opacity: isPast ? 0.4 : isCurrent ? 1 : 0.2,
                                    backgroundColor: isCurrent ? theme.colors.primary : theme.colors.textMain,
                                }}
                                transition={{
                                    default: { duration: 1, ease: [0.23, 1, 0.32, 1] }
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%", // Fill container, let scaleY handle visual height
                                    borderRadius: "4px",
                                    position: "relative",
                                    transformOrigin: "bottom"
                                }}
                            >
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            position: "absolute",
                                            bottom: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            marginBottom: "8px",
                                            background: "rgba(255,255,255,0.9)",
                                            backdropFilter: "blur(4px)",
                                            color: "#000",
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            pointerEvents: "none",
                                            whiteSpace: "nowrap",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                            zIndex: 20
                                        }}>
                                        {h}:00
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </BentoCard>
    );
};

// Helper Functions
function getMonthName(month: number): string {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[month];
}

function getDayName(day: number): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[day];
}

function formatTime(num: number): string {
    return num.toString().padStart(2, '0');
}

// 5. Big Clock (Imported from Time page)
const BigClock = () => {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const year = now.getFullYear();
    const month = now.getMonth();
    const dayOfMonth = now.getDate();
    const dayOfWeek = now.getDay();

    const hoursStr = formatTime(now.getHours());
    const minutesStr = formatTime(now.getMinutes());
    const secondsStr = formatTime(now.getSeconds());

    if (!mounted) return (
        <BentoCard colSpanMobile={1} colSpanDesktop={2} delay={0.1}>
            <div style={{ height: "100%", width: "100%" }} />
        </BentoCard>
    );

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={2} delay={0.1}>
            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(3.5rem, 6vw, 5rem)",
                    fontWeight: 200,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.5rem"
                }}>
                    <span>{hoursStr}</span>
                    <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        style={{ opacity: 0.5 }}
                    >:</motion.span>
                    <span>{minutesStr}</span>
                    <span style={{ fontSize: "0.4em", opacity: 0.4, fontWeight: 400 }}>{secondsStr}</span>
                </div>
                <div style={{
                    marginTop: "1rem",
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic"
                }}>
                    {getDayName(dayOfWeek)}, {dayOfMonth} {getMonthName(month)} {year}
                </div>
            </div>
        </BentoCard>
    );
};

const BIRTH_DATE = new Date("2000-01-01"); // Configurable shared constant

export default function ClockPage() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#000",
            color: "#fff",
            fontFamily: "var(--font-sans)",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
            overflowX: "hidden",
            overflowY: "scroll", // Force scrollbar to prevent layout shift
            position: "relative"
        }}>
            {/* Styles Injection for Bento Grid Layout */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .clock-container {
                    padding: 2rem 1.5rem 6rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 10;
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                
                @media (min-width: 768px) {
                    .bento-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .bento-card.desktop-span-2 { grid-column: span 2; }
                }

                @media (min-width: 1100px) {
                     .bento-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .bento-card.desktop-span-1 { grid-column: span 1; }
                    .bento-card.desktop-span-2 { grid-column: span 2; }
                    .bento-card.desktop-span-4 { grid-column: span 4; }
                }
            `}} />

            {/* Background Layer */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
                {/* Vignette */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, #000 120%)" }} />
            </div>

            {/* Standard Back Button */}
            <StandardBackButton href="/" />

            <div className="clock-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ marginBottom: "2rem", textAlign: "center", paddingTop: "2rem" }}
                >
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.2,
                        marginBottom: "0.5rem"
                    }}>
                        Time<motion.span
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ repeat: Infinity, duration: 5, ease: [0.4, 0, 0.2, 1] }}
                        >piece</motion.span>
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                    }}>
                        Your temporal coordinates in the universe.
                    </p>
                </motion.div>

                <div className="bento-grid">
                    <BigClock />
                    <LifeStats birthDate={BIRTH_DATE} />
                    <LifeGrid birthDate={BIRTH_DATE} />
                    <YearProgress />
                    <DayProgress />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 2 }}
                    style={{
                        textAlign: "center",
                        marginTop: "6rem",
                        paddingBottom: "4rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem"
                    }}
                >
                    <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: theme.colors.textMuted,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)"
                    }}>
                        Memento Mori
                    </span>
                    <p style={{
                        fontSize: "0.9rem",
                        color: theme.colors.textDim,
                        fontStyle: "italic",
                        maxWidth: "300px",
                        margin: "0 auto",
                        lineHeight: 1.6
                    }}>
                        "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'"
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
