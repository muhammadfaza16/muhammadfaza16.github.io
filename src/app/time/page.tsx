"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import { Clock, Calendar, Hourglass, TrendingUp, Sun } from "lucide-react";

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

// Get day name in Indonesian
function getDayName(day: number): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[day];
}

// Get days in each month
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

// Format time with leading zeros
function formatTime(num: number): string {
    return num.toString().padStart(2, '0');
}

// Stat Card Component
function StatCard({
    icon: Icon,
    value,
    label,
    sublabel
}: {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
    sublabel: string;
}) {
    return (
        <div style={{
            padding: "clamp(1.25rem, 3vw, 1.75rem)",
            backgroundColor: "var(--card-bg)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease"
        }} className="hover:border-[var(--border-strong)]">
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "clamp(0.75rem, 2vw, 1rem)",
                color: "var(--accent)"
            }}>
                <Icon className="w-4 h-4" />
                <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-muted)"
                }}>
                    {label}
                </span>
            </div>
            <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(2rem, 6vw, 2.75rem)",
                fontWeight: 200,
                color: "var(--foreground)",
                marginBottom: "0.35rem",
                letterSpacing: "-0.03em",
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                color: "var(--text-secondary)",
                fontStyle: "italic"
            }}>
                {sublabel}
            </div>
        </div>
    );
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
    const dayOfWeek = now.getDay();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const daysRemaining = totalDays - dayOfYear;
    const percentComplete = ((dayOfYear / totalDays) * 100).toFixed(1);
    const weekNumber = getWeekNumber(now);

    // Time components
    const hours = now.getHours();
    const hoursStr = formatTime(hours);
    const minutes = formatTime(now.getMinutes());

    // Full date string
    const fullDate = `${getDayName(dayOfWeek)}, ${dayOfMonth} ${getMonthName(month)} ${year}`;

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
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <div className="animate-fade-in-up" style={{ textAlign: "center" }}>
                        {/* Status Pill */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "99px",
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Clock</span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)",
                            color: "var(--foreground)",
                            maxWidth: "16ch",
                            margin: "0 auto"
                        }}>
                            Every second is a choice.
                        </h1>

                        {/* The Big Clock */}
                        <div style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(5rem, 18vw, 12rem)",
                            fontWeight: 100,
                            color: "var(--foreground)",
                            letterSpacing: "-0.05em",
                            lineHeight: 0.85,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: "clamp(0.5rem, 2vw, 1rem)",
                            margin: "clamp(1.5rem, 3vh, 2rem) 0"
                        }}>
                            <span>{hoursStr}</span>
                            <span style={{ opacity: 0.3, fontSize: "clamp(2.5rem, 10vw, 6rem)", animation: "pulse 2s infinite" }}>:</span>
                            <span>{minutes}</span>
                        </div>

                        {/* Date */}
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            color: "var(--text-muted)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            {fullDate}
                        </p>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            fontStyle: "italic",
                            maxWidth: "45ch",
                            margin: "0 auto",
                            lineHeight: 1.6
                        }}>
                            Waktu adalah komoditas paling berharga.
                            Sekali habis, takkan kembali lagi.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "42rem", margin: "0 auto" }}>

                    {/* Stats Grid */}
                    <section style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "clamp(1rem, 3vw, 1.5rem)"
                        }}>
                            <StatCard
                                icon={Calendar}
                                value={dayOfYear}
                                label="Day of Year"
                                sublabel={`Hari ke-${dayOfYear} dari ${totalDays}`}
                            />
                            <StatCard
                                icon={Hourglass}
                                value={daysRemaining}
                                label="Days Remaining"
                                sublabel="Masih ada waktu"
                            />
                            <StatCard
                                icon={Sun}
                                value={weekNumber}
                                label="Week"
                                sublabel={`Minggu ke-${weekNumber} tahun ini`}
                            />
                            <StatCard
                                icon={TrendingUp}
                                value={`${percentComplete}%`}
                                label="Year Progress"
                                sublabel={parseFloat(percentComplete) < 25 ? "Baru mulai" : parseFloat(percentComplete) < 50 ? "Hampir setengah" : parseFloat(percentComplete) < 75 ? "Lewat pertengahan" : "Mendekati akhir"}
                            />
                        </div>
                    </section>

                    {/* Visualization Section */}
                    <section style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                        }}>
                            <Hourglass className="w-4 h-4" style={{ color: "var(--accent)" }} />
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                fontWeight: 500,
                                margin: 0,
                                flex: 1
                            }}>
                                Perspective
                            </h2>
                            <button
                                onClick={() => setViewMode(viewMode === 'dots' ? 'classic' : 'dots')}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                                    color: "var(--text-secondary)",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    padding: 0
                                }}
                            >
                                {viewMode === 'dots' ? 'Bar View' : 'Dot View'}
                            </button>
                        </div>

                        {/* DOTS VIEW */}
                        {viewMode === 'dots' && (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                justifyContent: "center",
                                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                                backgroundColor: "var(--card-bg)",
                                borderRadius: "16px",
                                border: "1px solid var(--border)"
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
                                                backgroundColor: isToday ? "var(--accent)" : "var(--foreground)",
                                                opacity: isPast ? 0.2 : isToday ? 1 : 0.06,
                                                transform: isToday ? "scale(1.8)" : "none",
                                                transition: "all 0.3s ease"
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* CLASSIC VIEW (BARS) */}
                        {viewMode === 'classic' && (
                            <div style={{
                                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                                backgroundColor: "var(--card-bg)",
                                borderRadius: "16px",
                                border: "1px solid var(--border)"
                            }}>
                                {/* Year Bar */}
                                <div style={{ marginBottom: "clamp(2rem, 4vh, 2.5rem)" }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "0.75rem",
                                        fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                                        fontFamily: "var(--font-mono)",
                                        color: "var(--text-secondary)"
                                    }}>
                                        <span>{year} Progress</span>
                                        <span style={{ color: "var(--accent)" }}>{percentComplete}%</span>
                                    </div>
                                    <div style={{
                                        width: "100%",
                                        height: "8px",
                                        background: "var(--hover-bg)",
                                        borderRadius: "4px",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}>
                                        <div style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            height: "100%",
                                            width: `${percentComplete}%`,
                                            background: "var(--accent)",
                                            borderRadius: "4px",
                                            transition: "width 0.5s ease"
                                        }} />
                                    </div>
                                </div>

                                {/* Month Bars */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "clamp(1rem, 2vw, 1.5rem)"
                                }}>
                                    {monthData.map((m, i) => (
                                        <div key={i} style={{ opacity: m.isPast || m.isCurrent ? 1 : 0.4 }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "0.5rem",
                                                fontSize: "clamp(0.75rem, 1.8vw, 0.85rem)",
                                                fontFamily: "var(--font-mono)",
                                                color: m.isCurrent ? "var(--accent)" : "var(--text-secondary)"
                                            }}>
                                                <span style={{ fontWeight: m.isCurrent ? 600 : 400 }}>{m.name}</span>
                                                {m.isCurrent && <span>{m.percentage.toFixed(0)}%</span>}
                                                {m.isPast && <span style={{ color: "var(--text-muted)" }}>✓</span>}
                                            </div>
                                            <div style={{
                                                width: "100%",
                                                height: "3px",
                                                background: "var(--hover-bg)",
                                                borderRadius: "2px",
                                                position: "relative",
                                                overflow: "hidden"
                                            }}>
                                                <div style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    top: 0,
                                                    height: "100%",
                                                    width: `${m.percentage}%`,
                                                    background: m.isCurrent ? "var(--accent)" : "var(--foreground)",
                                                    borderRadius: "2px"
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Inspirational Footer */}
                    <div style={{
                        marginTop: "clamp(2rem, 4vh, 3rem)",
                        paddingTop: "clamp(2rem, 4vh, 3rem)",
                        borderTop: "1px solid var(--border)",
                        textAlign: "center"
                    }}>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                            fontStyle: "italic",
                            color: "var(--text-secondary)",
                            maxWidth: "30ch",
                            margin: "0 auto",
                            lineHeight: 1.5
                        }}>
                            "Your time is limited. Don't waste it living someone else's life."
                        </p>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                            color: "var(--text-muted)",
                            marginTop: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em"
                        }}>
                            — Steve Jobs
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
}
