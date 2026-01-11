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
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
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
    const seconds = formatTime(now.getSeconds());

    // Greeting logic
    const getGreeting = () => {
        if (hours < 12) return "Selamat Pagi";
        if (hours < 15) return "Selamat Siang";
        if (hours < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    // Calculate month progress data
    const monthData = Array.from({ length: 12 }, (_, i) => {
        const daysInThisMonth = getDaysInMonth(year, i);
        const monthStart = new Date(year, i, 1);
        const monthEnd = new Date(year, i + 1, 0);

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
        <Container>
            <div
                className="animate-fade-in-up"
                style={{
                    maxWidth: "60rem",
                    margin: "0 auto",
                    paddingTop: "3rem",
                    paddingBottom: "4rem",
                    minHeight: "80vh"
                }}
            >
                {/* Live Clock Section */}
                <header style={{
                    textAlign: "center",
                    marginBottom: "4rem"
                }}>
                    <h2 style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.5rem",
                        fontWeight: 300,
                        fontStyle: "italic",
                        marginBottom: "1rem",
                        color: "var(--text-secondary)"
                    }}>
                        {getGreeting()}, Pengelana Waktu.
                    </h2>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(3rem, 12vw, 7rem)",
                        fontWeight: 200,
                        color: "var(--foreground)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: "0.5rem"
                    }}>
                        <span>{hoursStr}</span>
                        <span style={{ opacity: 0.4, animation: "pulse 1s ease-in-out infinite" }}>:</span>
                        <span>{minutes}</span>
                        <span style={{ opacity: 0.4, animation: "pulse 1s ease-in-out infinite" }}>:</span>
                        <span style={{ opacity: 0.6 }}>{seconds}</span>
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                    marginBottom: "4rem"
                }}>
                    {[
                        { value: dayOfYear, label: "Hari ke-", accent: false },
                        { value: daysRemaining, label: "Sisa Hari", accent: false },
                        { value: `W${weekNumber}`, label: `Minggu ke-${weekNumber}`, accent: false },
                        { value: `${percentComplete}%`, label: "Progres Tahun", accent: true }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "1.25rem",
                                borderRadius: "12px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                textAlign: "center",
                                transition: "all 0.3s ease"
                            }}
                            className="card-hover"
                        >
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.75rem",
                                fontWeight: 300,
                                color: stat.accent ? "var(--accent)" : "var(--foreground)",
                                marginBottom: "0.25rem"
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em"
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visualization Section - with Toggle */}
                <div style={{
                    marginBottom: "4rem"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center", // Changed from 'end' for better vertical alignment when wrapped
                        marginBottom: "1.5rem",
                        flexWrap: "wrap", // Allow wrapping
                        gap: "1rem" // Add gap for wrapped items
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem", // Reduced gap
                            flexWrap: "wrap" // Allow title and toggle to wrap
                        }}>
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.15em",
                                whiteSpace: "nowrap" // Prevent title break
                            }}>
                                {viewMode === 'dots' ? 'Grid Kehidupan' : 'Bar Progress'} {year}
                            </div>

                            {/* Toggle Button */}
                            <button
                                onClick={() => setViewMode(viewMode === 'dots' ? 'classic' : 'dots')}
                                style={{
                                    background: "transparent",
                                    border: "1px solid var(--border)",
                                    borderRadius: "999px",
                                    padding: "4px 8px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.6rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap" // Prevent button break
                                }}
                                className="hover:bg-[var(--hover-bg)]"
                            >
                                {viewMode === 'dots' ? (
                                    <>
                                        <span>Show Bars</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                    </>
                                ) : (
                                    <>
                                        <span>Show Dots</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {viewMode === 'dots' && (
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem", // Slightly smaller
                                color: "var(--text-secondary)",
                                display: "flex",
                                gap: "0.75rem", // Slightly smaller gap
                                flexWrap: "wrap"
                            }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-secondary)", opacity: 0.2 }}></span> Lewat
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--foreground)", boxShadow: "0 0 8px var(--foreground)" }}></span> Hari Ini
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1px solid var(--border)" }}></span> Nanti
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Container with Min Height to prevent layout jumps - Optimized for performance */}
                    <div style={{ minHeight: "500px", position: "relative" }}>
                        {/* View: Dots Grid */}
                        <div
                            style={{
                                display: viewMode === 'dots' ? 'flex' : 'none',
                                flexWrap: "wrap",
                                gap: "6px",
                                justifyContent: "center", // Center the grid
                                maxWidth: "900px", // Constrain width for better shape
                                margin: "0 auto",
                                animation: viewMode === 'dots' ? "fadeInOpacity 0.4s ease-out forwards" : "none"
                            }}>
                            {Array.from({ length: totalDays }, (_, i) => {
                                const dayNum = i + 1;
                                const isPast = dayNum < dayOfYear;
                                const isToday = dayNum === dayOfYear;
                                const isFuture = dayNum > dayOfYear;

                                // Calculate date for tooltip
                                const date = new Date(year, 0, dayNum);
                                const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                                return (
                                    <div
                                        key={i}
                                        title={`${dateStr} (Hari ke-${dayNum})`}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: isPast ? "var(--text-secondary)" : isToday ? "var(--foreground)" : "transparent",
                                            border: isFuture ? "1px solid var(--border)" : "none",
                                            opacity: isPast ? 0.2 : 1,
                                            boxShadow: isToday ? "0 0 10px 2px rgba(var(--foreground-rgb), 0.3)" : "none",
                                            transform: isToday ? "scale(1.2)" : "scale(1)",
                                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                            cursor: "crosshair",
                                            position: "relative"
                                        }}
                                        className={isToday ? "animate-pulse-slow" : "hover:scale-150 hover:bg-[var(--foreground)] hover:opacity-100"}
                                    />
                                );
                            })}
                        </div>

                        {/* View: Classic Bars */}
                        <div
                            style={{
                                display: viewMode === 'classic' ? 'block' : 'none',
                                animation: viewMode === 'classic' ? "fadeInOpacity 0.4s ease-out forwards" : "none"
                            }}
                        >
                            {/* Month Progress Bars */}
                            <div style={{
                                padding: "1.5rem",
                                borderRadius: "16px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                marginBottom: "2rem"
                            }}>
                                <div style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "var(--text-secondary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.15em",
                                    marginBottom: "1.25rem"
                                }}>
                                    Rekap Bulanan
                                </div>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(12, 1fr)",
                                    gap: "4px"
                                }}>
                                    {monthData.map((m, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "80px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "var(--border)",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease"
                                                }}
                                                title={`${m.fullName}: ${m.passed}/${m.days} hari (${m.percentage.toFixed(0)}%)`}
                                                onMouseEnter={() => setHoveredDay(i)}
                                                onMouseLeave={() => setHoveredDay(null)}
                                            >
                                                <div style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: `${m.percentage}%`,
                                                    backgroundColor: m.isCurrent
                                                        ? "var(--foreground)"
                                                        : m.isPast
                                                            ? "var(--text-secondary)"
                                                            : "transparent",
                                                    transition: "height 0.5s ease",
                                                    borderRadius: "4px"
                                                }} />
                                                {m.isCurrent && (
                                                    <div style={{
                                                        position: "absolute",
                                                        bottom: `${m.percentage}%`,
                                                        left: "50%",
                                                        transform: "translateX(-50%)",
                                                        width: "8px",
                                                        height: "8px",
                                                        backgroundColor: "var(--background)",
                                                        border: "2px solid var(--foreground)",
                                                        borderRadius: "50%",
                                                        transition: "bottom 0.5s ease"
                                                    }} />
                                                )}
                                            </div>
                                            <span style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.6rem",
                                                color: m.isCurrent ? "var(--foreground)" : "var(--text-secondary)",
                                                fontWeight: m.isCurrent ? 600 : 400,
                                                textTransform: "uppercase"
                                            }}>
                                                {m.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {hoveredDay !== null && (
                                    <div style={{
                                        marginTop: "1rem",
                                        padding: "0.75rem",
                                        borderRadius: "8px",
                                        backgroundColor: "var(--hover-bg)",
                                        textAlign: "center",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.75rem",
                                        color: "var(--text-secondary)"
                                    }}>
                                        <strong style={{ color: "var(--foreground)" }}>{monthData[hoveredDay].fullName}</strong>
                                        {" · "}
                                        {monthData[hoveredDay].passed} dari {monthData[hoveredDay].days} hari
                                        {" · "}
                                        {monthData[hoveredDay].percentage.toFixed(1)}% selesai
                                    </div>
                                )}
                            </div>

                            {/* Year Progress Bar */}
                            <div style={{
                                padding: "1.5rem",
                                borderRadius: "16px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                marginBottom: "2rem"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "1rem"
                                }}>
                                    <span style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: "var(--text-secondary)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em"
                                    }}>
                                        Perjalanan Tahun Ini
                                    </span>
                                    <span style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "1.5rem",
                                        fontWeight: 300,
                                        color: "var(--foreground)"
                                    }}>
                                        {year}
                                    </span>
                                </div>
                                <div style={{
                                    height: "12px",
                                    width: "100%",
                                    backgroundColor: "var(--border)",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    position: "relative"
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${percentComplete}%`,
                                        background: "linear-gradient(90deg, var(--text-secondary), var(--foreground))",
                                        borderRadius: "6px",
                                        transition: "width 0.5s ease",
                                        position: "relative"
                                    }}>
                                        <div style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: "4px",
                                            height: "18px",
                                            backgroundColor: "var(--foreground)",
                                            borderRadius: "2px",
                                            boxShadow: "0 0 10px var(--foreground)"
                                        }} />
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "0.75rem",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--text-secondary)"
                                }}>
                                    <span>1 Jan</span>
                                    <span>{percentComplete}% selesai</span>
                                    <span>31 Des</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Perspective Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "4rem"
                }}>
                    {[
                        {
                            label: "Jam Tersisa",
                            value: (daysRemaining * 24).toLocaleString('id-ID'),
                            sub: "waktu untuk berkarya"
                        },
                        {
                            label: "Akhir Pekan",
                            value: Math.ceil(daysRemaining / 7).toString(),
                            sub: "kesempatan istirahat"
                        },
                        {
                            label: "Bulan",
                            value: (12 - month - 1 + (1 - dayOfMonth / getDaysInMonth(year, month))).toFixed(1),
                            sub: "untuk perubahan"
                        }
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: "1.5rem",
                            borderRadius: "16px",
                            border: "1px solid var(--border)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            textAlign: "center"
                        }}>
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "2rem",
                                fontWeight: 300,
                                color: "var(--foreground)"
                            }}>
                                {item.value}
                            </span>
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--foreground)",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em"
                            }}>
                                {item.label}
                            </span>
                            <span style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "0.8rem",
                                color: "var(--text-secondary)",
                                fontStyle: "italic",
                                marginTop: "0.25rem"
                            }}>
                                {item.sub}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quote */}
                <footer style={{
                    textAlign: "center",
                    padding: "2rem",
                    borderTop: "1px solid var(--border)",
                    marginTop: "2rem"
                }}>
                    <p style={{
                        fontFamily: "var(--font-serif)",
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
    );
}
