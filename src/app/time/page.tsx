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

// Get month name
function getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
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

    useEffect(() => {
        setMounted(true);
        setNow(new Date());

        // Update every second for live clock
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
    const totalWeeks = 52;

    // Time components
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const seconds = formatTime(now.getSeconds());

    // Calculate month progress data
    const monthData = Array.from({ length: 12 }, (_, i) => {
        const daysInThisMonth = getDaysInMonth(year, i);
        const monthStart = new Date(year, i, 1);
        const monthEnd = new Date(year, i + 1, 0);
        const startDayOfYear = getDayOfYear(monthStart);
        const endDayOfYear = getDayOfYear(monthEnd);

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
                    marginBottom: "3rem"
                }}>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(3rem, 12vw, 7rem)",
                        fontWeight: 200,
                        color: "var(--foreground)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: "0.5rem"
                    }}>
                        <span>{hours}</span>
                        <span style={{ opacity: 0.4, animation: "pulse 1s ease-in-out infinite" }}>:</span>
                        <span>{minutes}</span>
                        <span style={{ opacity: 0.4, animation: "pulse 1s ease-in-out infinite" }}>:</span>
                        <span style={{ opacity: 0.6 }}>{seconds}</span>
                    </div>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em"
                    }}>
                        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                    marginBottom: "3rem"
                }}>
                    {[
                        { value: dayOfYear, label: "Day of Year", accent: false },
                        { value: daysRemaining, label: "Days Left", accent: false },
                        { value: `W${weekNumber}`, label: `of ${totalWeeks} Weeks`, accent: false },
                        { value: `${percentComplete}%`, label: "Year Complete", accent: true }
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
                        Monthly Breakdown
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
                                    title={`${m.fullName}: ${m.passed}/${m.days} days (${m.percentage.toFixed(0)}%)`}
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
                            {monthData[hoveredDay].passed} of {monthData[hoveredDay].days} days
                            {" · "}
                            {monthData[hoveredDay].percentage.toFixed(1)}% complete
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
                            Year Progress
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
                        <span>Jan 1</span>
                        <span>{percentComplete}% complete</span>
                        <span>Dec 31</span>
                    </div>
                </div>

                {/* Life Perspective Section */}
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
                        marginBottom: "1rem"
                    }}>
                        Time Perspective
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem"
                    }}>
                        {[
                            {
                                label: "Hours left this year",
                                value: (daysRemaining * 24).toLocaleString()
                            },
                            {
                                label: "Minutes left today",
                                value: ((24 - now.getHours()) * 60 - now.getMinutes()).toLocaleString()
                            },
                            {
                                label: "Weekends remaining",
                                value: Math.ceil(daysRemaining / 7).toString()
                            },
                            {
                                label: "Months left",
                                value: (12 - month - 1 + (1 - dayOfMonth / getDaysInMonth(year, month))).toFixed(1)
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: "1rem",
                                borderRadius: "8px",
                                backgroundColor: "var(--hover-bg)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.25rem"
                            }}>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "1.25rem",
                                    fontWeight: 300,
                                    color: "var(--foreground)"
                                }}>
                                    {item.value}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--text-secondary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em"
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote */}
                <footer style={{
                    marginTop: "2rem",
                    textAlign: "center",
                    padding: "2rem",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, var(--hover-bg), transparent)"
                }}>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        maxWidth: "500px",
                        margin: "0 auto"
                    }}>
                        "The bad news is time flies. The good news is you're the pilot."
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-secondary)",
                        marginTop: "0.75rem",
                        opacity: 0.6
                    }}>
                        — Michael Altshuler
                    </p>
                </footer>
            </div>
        </Container>
    );
}
