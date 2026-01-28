"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, Hourglass, TrendingUp, Sun, Grid3X3, BarChart2 } from "lucide-react";
import { BentoCard, theme } from "@/components/BentoCard";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

// Helper Functions
function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getMonthName(month: number): string {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[month];
}

function getDayName(day: number): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[day];
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function formatTime(num: number): string {
    return num.toString().padStart(2, '0');
}

export default function TimePage() {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [viewMode, setViewMode] = useState<'dots' | 'classic'>('dots');

    useEffect(() => {
        setMounted(true);
        setNow(new Date());
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const year = now.getFullYear();
    const month = now.getMonth();
    const dayOfMonth = now.getDate();
    const dayOfWeek = now.getDay();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const daysRemaining = totalDays - dayOfYear;
    const percentComplete = ((dayOfYear / totalDays) * 100).toFixed(1);
    const weekNumber = getWeekNumber(now);

    const hoursStr = formatTime(now.getHours());
    const minutesStr = formatTime(now.getMinutes());
    const secondsStr = formatTime(now.getSeconds());

    const monthData = Array.from({ length: 12 }, (_, i) => {
        const daysInThisMonth = getDaysInMonth(year, i);
        let daysPassedInMonth = 0;
        if (month > i) {
            daysPassedInMonth = daysInThisMonth;
        } else if (month === i) {
            daysPassedInMonth = dayOfMonth;
        }
        return {
            name: getMonthName(i).slice(0, 3),
            days: daysInThisMonth,
            percentage: (daysPassedInMonth / daysInThisMonth) * 100,
            isCurrent: month === i,
            isPast: month > i
        };
    });

    if (!mounted) return null;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: theme.colors.bg,
            color: theme.colors.textMain,
            fontFamily: "var(--font-sans)",
            overflowX: "hidden",
            position: "relative"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            <main style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "2rem 1.5rem 6rem",
                display: "flex",
                flexDirection: "column",
                gap: "2rem"
            }}>
                {/* Header Section */}
                <header style={{ textAlign: "center", marginBottom: "2rem", paddingTop: "4rem" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.02em",
                            color: "rgba(255,255,255,0.9)",
                            marginBottom: "0.5rem"
                        }}>
                            Time Perspective
                        </h1>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.9rem",
                            color: "rgba(255,255,255,0.5)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase"
                        }}>
                            Every second is a choice
                        </p>
                    </motion.div>
                </header>

                {/* Main Bento Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "1.5rem",
                    gridAutoRows: "minmax(180px, auto)"
                }}>

                    {/* 1. Big Clock (2x1) */}
                    <BentoCard colSpanDesktop={2} colSpanMobile={4} delay={0.1}>
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
                                <span className="animate-pulse" style={{ opacity: 0.5 }}>:</span>
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

                    {/* 2. Day of Year (1x1) */}
                    <BentoCard colSpanDesktop={1} colSpanMobile={2} delay={0.2}>
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.accent }}>
                                <Calendar size={20} />
                                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.8, textTransform: "uppercase" }}>Day of Year</span>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
                                    {dayOfYear}
                                </div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.5, marginTop: "0.25rem" }}>
                                    of {totalDays} days
                                </div>
                            </div>
                            {/* Mini Progress Bar */}
                            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(dayOfYear / totalDays) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                                    style={{ height: "100%", background: theme.colors.accent }}
                                />
                            </div>
                        </div>
                    </BentoCard>

                    {/* 3. Remaining (1x1) */}
                    <BentoCard colSpanDesktop={1} colSpanMobile={2} delay={0.3}>
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.primary }}>
                                <Hourglass size={20} />
                                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.8, textTransform: "uppercase" }}>Remaining</span>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
                                    {daysRemaining}
                                </div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.5, marginTop: "0.25rem" }}>
                                    days left
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: "4px",
                                        background: i < (daysRemaining / totalDays) * 10 ? theme.colors.primary : "rgba(255,255,255,0.1)",
                                        borderRadius: "1px"
                                    }} />
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* 4. Large Visualization (4x2 or 2x2 based on preference, let's go with full width 4xAuto) */}
                    <BentoCard colSpanDesktop={4} colSpanMobile={4} delay={0.4} className="min-h-[400px]">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: theme.colors.secondary }}>
                                <Grid3X3 size={20} />
                                <span style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                    Year Mapping
                                </span>
                            </div>

                            {/* View Toggle */}
                            <div style={{
                                display: "flex",
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: "8px",
                                padding: "4px"
                            }}>
                                <button
                                    onClick={() => setViewMode('dots')}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        background: viewMode === 'dots' ? "rgba(255,255,255,0.1)" : "transparent",
                                        color: viewMode === 'dots' ? "white" : "rgba(255,255,255,0.4)",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.85rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <Grid3X3 size={14} /> Dots
                                </button>
                                <button
                                    onClick={() => setViewMode('classic')}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        background: viewMode === 'classic' ? "rgba(255,255,255,0.1)" : "transparent",
                                        color: viewMode === 'classic' ? "white" : "rgba(255,255,255,0.4)",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.85rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <BarChart2 size={14} /> Bars
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, width: "100%", overflowY: "auto", maxHeight: "500px", paddingRight: "0.5rem" }}>
                            {viewMode === 'dots' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "6px",
                                        justifyContent: "center"
                                    }}
                                >
                                    {Array.from({ length: totalDays }, (_, i) => {
                                        const dayNum = i + 1;
                                        const isPast = dayNum < dayOfYear;
                                        const isToday = dayNum === dayOfYear;

                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    backgroundColor: isToday ? theme.colors.accent : (isPast ? "white" : "rgba(255,255,255,0.1)"),
                                                    opacity: isPast ? 0.3 : (isToday ? 1 : 0.2),
                                                    boxShadow: isToday ? `0 0 10px ${theme.colors.accent}` : "none",
                                                    transition: "all 0.3s ease"
                                                }}
                                                title={`Day ${dayNum}`}
                                            />
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                                >
                                    {/* Month Bars Grid */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                                        {monthData.map((m, i) => (
                                            <div key={i} style={{ opacity: m.isPast ? 0.5 : 1 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
                                                    <span style={{ color: m.isCurrent ? theme.colors.accent : "inherit" }}>{m.name}</span>
                                                    <span>{m.percentage.toFixed(0)}%</span>
                                                </div>
                                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${m.percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.05 }}
                                                        style={{
                                                            height: "100%",
                                                            background: m.isCurrent ? theme.colors.accent : (m.isPast ? "rgba(255,255,255,0.5)" : "transparent"),
                                                            borderRadius: "3px"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </BentoCard>

                    {/* 5. Week Stats (1x1) */}
                    <BentoCard colSpanDesktop={1} colSpanMobile={2} delay={0.5}>
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#FF9F0A" }}>
                                <Sun size={20} />
                                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.8, textTransform: "uppercase" }}>Current Week</span>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
                                    {weekNumber}
                                </div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.5, marginTop: "0.25rem" }}>
                                    of 52 weeks
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 6. Year Progress (1x1) */}
                    <BentoCard colSpanDesktop={1} colSpanMobile={2} delay={0.6}>
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.secondary }}>
                                <TrendingUp size={20} />
                                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.8, textTransform: "uppercase" }}>Progress</span>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
                                    {percentComplete}%
                                </div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.5, marginTop: "0.25rem" }}>
                                    almost there
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 7. Quote Footer (2x1) */}
                    <BentoCard colSpanDesktop={2} colSpanMobile={4} delay={0.7}>
                        <div style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            width: "100%"
                        }}>
                            <div style={{ maxWidth: "80%", margin: "0 auto" }}>
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.25rem",
                                    fontStyle: "italic",
                                    color: "rgba(255,255,255,0.8)",
                                    lineHeight: 1.5
                                }}>
                                    "Your time is limited. Don't waste it living someone else's life."
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.4)",
                                    marginTop: "1rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em"
                                }}>
                                    — Steve Jobs
                                </p>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </main>
        </div>
    );
}
