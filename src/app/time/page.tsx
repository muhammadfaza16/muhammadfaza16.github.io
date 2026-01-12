"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";

// Check if year is a leap year
function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get day of year (1-indexed)
function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Get week number of the year
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Get month name in Indonesian
function getMonthName(month: number): string {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[month];
}

// Get days in each month
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

// Format time with leading zeros
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

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const year = now.getFullYear();
    const month = now.getMonth();
    const dayOfMonth = now.getDate();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const daysRemaining = totalDays - dayOfYear;
    const percentComplete = ((dayOfYear / totalDays) * 100).toFixed(2);
    const weekNumber = getWeekNumber(now);

    // Time components
    const hours = now.getHours();
    const hoursStr = formatTime(hours);
    const minutes = formatTime(now.getMinutes());
    // const seconds = formatTime(now.getSeconds());

    // Calculate month progress data
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
            fullName: getMonthName(i),
            days: daysInThisMonth,
            passed: daysPassedInMonth,
            percentage: (daysPassedInMonth / daysInThisMonth) * 100,
            isCurrent: month === i,
            isPast: month > i
        };
    });

    if (!mounted) {
        return (
            <Container>
                <div style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--foreground)",
                        animation: "pulse 1s ease-in-out infinite"
                    }} />
                </div>
            </Container>
        );
    }

    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "65ch", margin: "0 auto" }}>

                    {/* 1. Header: The Clock */}
                    <header style={{ marginBottom: "8rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "3rem",
                            fontWeight: 400,
                            letterSpacing: "-0.05em",
                            marginBottom: "1rem",
                            color: "var(--foreground)"
                        }}>
                            Time.
                        </h1>
                        <div style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(4rem, 12vw, 8rem)",
                            fontWeight: 100, // Ultra thin
                            color: "var(--foreground)",
                            letterSpacing: "-0.05em",
                            lineHeight: 0.9,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: "1rem"
                        }}>
                            <span>{hoursStr}</span>
                            <span style={{ opacity: 0.3, fontSize: "clamp(2rem, 6vw, 4rem)", animation: "pulse 2s infinite" }}>:</span>
                            <span>{minutes}</span>
                        </div>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            marginTop: "2rem",
                            fontStyle: "italic"
                        }}>
                            "Waktu adalah nyawa."
                        </p>
                    </header>

                    {/* 2. Stats Grid - Minimalist */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "4rem",
                        marginBottom: "8rem",
                        textAlign: "center"
                    }}>
                        {[
                            { label: "Hari ke-", value: dayOfYear },
                            { label: "Sisa", value: daysRemaining },
                            { label: "Minggu", value: weekNumber },
                            { label: "Progress", value: `${percentComplete}%` },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "3rem",
                                    fontWeight: 200,
                                    color: "var(--foreground)",
                                    marginBottom: "0.5rem",
                                    letterSpacing: "-0.03em"
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontFamily: "'Source Serif 4', serif",
                                    fontSize: "1rem",
                                    color: "var(--text-secondary)",
                                    fontStyle: "italic"
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3. Visualization */}
                    <div style={{ marginBottom: "8rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem", alignItems: "baseline" }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "2rem",
                                fontWeight: 400,
                            }}>
                                Perspective
                            </h2>
                            <button
                                onClick={() => setViewMode(viewMode === 'dots' ? 'classic' : 'dots')}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.85rem",
                                    color: "var(--text-secondary)",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    padding: 0
                                }}
                            >
                                Switch View
                            </button>
                        </div>

                        {/* DOTS VIEW */}
                        {viewMode === 'dots' && (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                justifyContent: "center"
                            }}>
                                {Array.from({ length: totalDays }, (_, i) => {
                                    const dayNum = i + 1;
                                    const isPast = dayNum < dayOfYear;
                                    const isToday = dayNum === dayOfYear;

                                    return (
                                        <div
                                            key={i}
                                            title={`Day ${dayNum}`}
                                            style={{
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                backgroundColor: "var(--foreground)",
                                                opacity: isPast ? 0.1 : isToday ? 1 : 0.05, // Very subtle future
                                                transform: isToday ? "scale(1.5)" : "none",
                                                transition: "all 0.3s ease"
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* CLASSIC VIEW (BARS) */}
                        {viewMode === 'classic' && (
                            <div>
                                {/* Year Bar */}
                                <div style={{ marginBottom: "3rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                        <span>2025 Progress</span>
                                        <span>{percentComplete}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: "2px", background: "var(--border)", position: "relative" }}>
                                        <div style={{
                                            position: "absolute", left: 0, top: 0, height: "100%",
                                            width: `${percentComplete}%`,
                                            background: "var(--foreground)"
                                        }} />
                                    </div>
                                </div>

                                {/* Month Bars */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                                    {monthData.map((m, i) => (
                                        <div key={i} style={{ opacity: m.isPast || m.isCurrent ? 1 : 0.3 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                                <span>{m.name}</span>
                                                {m.isCurrent && <span>{m.percentage.toFixed(0)}%</span>}
                                            </div>
                                            <div style={{ width: "100%", height: "1px", background: "var(--border)", position: "relative" }}>
                                                <div style={{
                                                    position: "absolute", left: 0, top: 0, height: "100%",
                                                    width: `${m.percentage}%`,
                                                    background: "var(--foreground)"
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quote */}
                    <footer style={{
                        textAlign: "center",
                        paddingTop: "2rem",
                        borderTop: "1px solid var(--border)",
                        marginTop: "2rem"
                    }}>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.1rem",
                            color: "var(--text-secondary)",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                            maxWidth: "600px",
                            margin: "0 auto"
                        }}>
                            "Waktu adalah nyawa. Kehilangan uang bisa dicari, kehilangan waktu takkan kembali."
                        </p>
                    </footer>

                </div>
            </Container>
        </section>
    );
}
