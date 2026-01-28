"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Activity, Zap, Grid3X3, Disc } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

// --- Enhanced Design System ---
const theme = {
    colors: {
        bg: "#000000",
        // Deeper, richer glass background
        cardBg: "rgba(30, 30, 35, 0.70)",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        cardBorderTop: "rgba(255, 255, 255, 0.25)", // Highlight source from top
        primary: "#FFD60A",
        secondary: "#32D74B",
        accent: "#0A84FF",
        danger: "#FF453A",
        textMain: "rgba(255, 255, 255, 0.98)",
        textMuted: "rgba(255, 255, 255, 0.55)",
        textDim: "rgba(255, 255, 255, 0.22)",
    },
    radii: {
        card: "32px", // Slightly more curvature for that 'Squircle' feel
        pill: "999px",
        sm: "10px",
    },
    shadows: {
        // Multi-layered shadow for depth
        card: `
            0 20px 40px -10px rgba(0,0,0,0.5),
            0 0 0 1px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.15)
        `,
        glow: "0 0 20px -5px",
    }
};

const BentoCard = ({
    children,
    className = "",
    colSpanMobile = 1,
    colSpanDesktop = 1,
    delay = 0
}: {
    children: React.ReactNode;
    className?: string;
    colSpanMobile?: number;
    colSpanDesktop?: number;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // Fix: Removed visual translation 'y' on hover to prevent cursor hit-test flickering
            whileHover={{
                scale: 1.01, // Subtle scale instead
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ delay: delay, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
                gridColumn: `span ${colSpanMobile}`,
                background: theme.colors.cardBg,
                // Advanced Blur + Saturation for vibrance
                backdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
                WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.1)",

                // Border handling (top light, bottom dark)
                borderTop: `1px solid ${theme.colors.cardBorderTop}`,
                borderBottom: `1px solid rgba(0,0,0,0.4)`,
                borderLeft: `1px solid ${theme.colors.cardBorder}`,
                borderRight: `1px solid ${theme.colors.cardBorder}`,

                borderRadius: theme.radii.card,
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: theme.shadows.card,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transformStyle: "preserve-3d" // GPU hint
            }}
            // Responsive logic is handled via CSS Grid classes inserted in main component
            className={`bento-card mobile-span-${colSpanMobile} desktop-span-${colSpanDesktop} ${className}`}
        >
            {/* Hover Outer Glow (safe) */}
            <motion.div
                className="card-glow"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: theme.radii.card,
                    boxShadow: `inset 0 0 20px rgba(255,255,255,0.05)`,
                    pointerEvents: "none",
                    zIndex: 2
                }}
            />

            {/* Specular Highlight / Sheen effect */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "radial-gradient(80% 80% at 50% -20%, rgba(255,255,255,0.12), transparent)",
                pointerEvents: "none",
                zIndex: 0
            }} />

            {/* Content Container to ensure Z-Index over the sheen */}
            <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {children}
            </div>
        </motion.div>
    );
};

// 1. Life Stats (Redesigned with Heartbeat)
const LifeStats = ({ birthDate }: { birthDate: Date }) => {
    const [stats, setStats] = useState({ monthsLived: 0, yearsLived: 0, daysLived: 0 });

    useEffect(() => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - birthDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

        setStats({ monthsLived: diffMonths, yearsLived: diffYears, daysLived: diffDays });
    }, [birthDate]);

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={1} delay={0.1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <motion.div
                    animate={{ scale: [1, 1.15, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: "rgba(48, 209, 88, 0.15)", color: theme.colors.secondary,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 10px ${theme.colors.secondary}40`
                    }}
                >
                    <Activity size={18} />
                </motion.div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.colors.secondary }}
                    />
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.colors.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Active
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <h2 style={{
                    fontSize: "3.2rem",
                    fontWeight: 800,
                    color: theme.colors.textMain,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    fontVariantNumeric: "tabular-nums"
                }}>
                    {stats.yearsLived}<span style={{ color: theme.colors.secondary, fontSize: "3.2rem" }}>.</span><span style={{ fontSize: "1.8rem", color: theme.colors.textMuted, fontWeight: 500 }}>{(stats.monthsLived % 12)}</span>
                </h2>
                <span style={{ fontSize: "0.9rem", fontWeight: 500, color: theme.colors.secondary }}>Years Active</span>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px", color: theme.colors.textMuted }}>
                    <span>System Status</span>
                    <span>{Math.round((stats.yearsLived / 80) * 100)}%</span>
                </div>
                <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", height: "6px", borderRadius: theme.radii.pill, overflow: "hidden" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.yearsLived / 80) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ background: theme.colors.secondary, height: "100%", borderRadius: theme.radii.pill }}
                    />
                </div>
            </div>
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
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.colors.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
                    animate={{ translateY: "600%", opacity: [0, 1, 0] }} // Approx height of grid
                    transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "linear" }}
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
            <p style={{ fontSize: "0.8rem", color: theme.colors.textMuted, marginTop: "1rem", fontWeight: 500, textAlign: "right" }}>
                <span style={{ color: theme.colors.textMain, fontWeight: 700 }}>{yearsLeft}</span> years remaining
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: theme.colors.textMain }}>Year Progress</h3>
                <span style={{ fontFamily: "monospace", color: theme.colors.accent, fontWeight: 700 }}>{year}</span>
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
                            animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
                            transition={isActive ? { repeat: Infinity, duration: Math.random() * 2 + 1, delay: Math.random() } : {}}
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
                    <span style={{ fontSize: "2.5rem", fontWeight: 700, color: theme.colors.textMain, letterSpacing: "-0.03em" }}>
                        {progress.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: "0.9rem", color: theme.colors.textMuted, marginBottom: "8px" }}>{daysLeft} days left</span>
                </div>

                <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, delay: 0.5 }}
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
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: "rgba(255, 214, 10, 0.15)",
                        color: theme.colors.primary,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem"
                    }}>
                        TODAY
                    </span>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.colors.textMain }}>{currentTime}</h2>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <Zap size={20} color={theme.colors.primary} style={{ display: "block" }} />
                        </motion.div>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: theme.colors.textMuted }}>Energy Cycle</div>
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
                                    height: baseHeight,
                                    opacity: isPast ? 0.4 : isCurrent ? 1 : 0.2,
                                    backgroundColor: isCurrent ? theme.colors.primary : theme.colors.textMain,
                                    scaleY: isCurrent ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    scaleY: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                                    default: { duration: 0.5 }
                                }}
                                style={{
                                    width: "100%",
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

// 5. Month & Calendar Combined
const CalendarBlock = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const currentMonthStr = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return (
        <BentoCard colSpanMobile={1} colSpanDesktop={2} delay={0.5}>
            <div style={{ display: "flex", gap: "2rem", height: "100%" }}>
                {/* Month Progress Circle */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.textMuted }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{currentMonthStr}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", marginTop: "1rem" }}>
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const isDone = dayNum <= currentDay;
                            const isToday = dayNum === currentDay;
                            return (
                                <motion.div
                                    key={i}
                                    animate={isToday ? { scale: [1, 1.1, 1], boxShadow: [`0 0 0px ${theme.colors.textMain}`, `0 0 10px ${theme.colors.textMain}`, `0 0 0px ${theme.colors.textMain}`] } : {}}
                                    transition={isToday ? { repeat: Infinity, duration: 3 } : {}}
                                    style={{
                                        aspectRatio: "1/1",
                                        borderRadius: "50%",
                                        background: isToday ? theme.colors.textMain : isDone ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.06)",
                                        // boxShadow moved to animate
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <span style={{ fontSize: "0.8rem", color: theme.colors.textMuted }}>
                            {daysInMonth - currentDay} days remaining
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: "1px", background: "rgba(255,255,255,0.1)" }} />

                {/* Mini Year Map */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem" }}>
                        {months.map((m, i) => {
                            const isCurrent = i === now.getMonth();
                            const isPast = i < now.getMonth();
                            return (
                                <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{
                                        fontSize: "0.8rem",
                                        fontWeight: isCurrent ? 800 : 500,
                                        color: isCurrent ? theme.colors.primary : isPast ? theme.colors.textDim : theme.colors.textMuted,
                                        textDecoration: isPast ? "line-through" : "none",
                                        opacity: isPast ? 0.5 : 1
                                    }}>
                                        {m}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};

export default function ClockPage() {
    const birthDate = new Date("2000-01-01"); // Configurable

    return (
        <div style={{
            minHeight: "100vh",
            background: "#000",
            color: "#fff",
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            overflowX: "hidden",
            overflowY: "scroll", // Force scrollbar to prevent layout shift
            position: "relative"
        }}>
            {/* Styles Injection for Bento Grid Layout */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .clock-container {
                    padding: 80px 20px 40px 20px;
                    max-width: 1000px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 10;
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
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

            {/* Navigation */}
            <Link href="/" style={{
                position: "fixed",
                top: "24px",
                left: "24px",
                zIndex: 50,
                width: "44px",
                height: "44px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
            }}>
                <ArrowLeft size={20} />
            </Link>

            <div className="clock-container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: "2rem" }}
                >
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                        Time<span style={{ color: theme.colors.textDim }}>piece</span>
                    </h1>
                    <p style={{ color: theme.colors.textMuted, fontSize: "1rem" }}>
                        Your temporal coordinates in the universe.
                    </p>
                </motion.div>

                <div className="bento-grid">
                    <LifeStats birthDate={birthDate} />
                    <LifeGrid birthDate={birthDate} />
                    <YearProgress />
                    <DayProgress />
                    <CalendarBlock />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1 }}
                    style={{ textAlign: "center", marginTop: "4rem", fontSize: "0.8rem", color: theme.colors.textDim }}
                >
                    Designed for Presence
                </motion.div>
            </div>
        </div>
    );
}
