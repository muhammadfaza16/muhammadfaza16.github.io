"use client";

import { Container } from "@/components/Container";
import { useRouter } from "next/navigation";
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

// Format time with leading zeros
function formatTime(num: number): string {
    return num.toString().padStart(2, '0');
}

export default function TimePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        setNow(new Date());

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSurpriseMe = () => {
        const pages = ['/ideas', '/til', '/bookshelf', '/links', '/memento-mori'];
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        router.push(randomPage);
    };

    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const daysRemaining = totalDays - dayOfYear;
    const percentComplete = ((dayOfYear / totalDays) * 100).toFixed(6);

    // Time components
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const seconds = formatTime(now.getSeconds());

    if (!mounted) {
        return null;
    }

    return (
        <div style={{ paddingBottom: "8rem" }}>
            <section style={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "6rem",
                paddingBottom: "4rem"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.9rem",
                            color: "var(--accent)",
                            display: "block",
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            textAlign: "center"
                        }}>
                            The Chronometer
                        </span>

                        {/* Big Clock */}
                        <div style={{
                            textAlign: "center",
                            marginBottom: "4rem"
                        }}>
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(4rem, 15vw, 10rem)",
                                fontWeight: 400,
                                letterSpacing: "-0.04em",
                                lineHeight: 0.9,
                                color: "var(--foreground)",
                                fontVariantNumeric: "tabular-nums"
                            }}>
                                <span>{hours}</span>
                                <span style={{ opacity: 0.3, animation: "pulse 2s infinite" }}>:</span>
                                <span>{minutes}</span>
                                <span style={{ opacity: 0.3, animation: "pulse 2s infinite" }}>:</span>
                                <span style={{ opacity: 0.5, fontSize: "0.5em" }}>{seconds}</span>
                            </h1>
                        </div>

                        {/* Quote & Surprise */}
                        <div style={{ textAlign: "center", marginBottom: "6rem" }}>
                            <p style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "1.5rem",
                                fontStyle: "italic",
                                color: "var(--text-secondary)",
                                marginBottom: "2rem"
                            }}>
                                "Time is the incomprehensible dimension."
                            </p>
                            <button
                                onClick={handleSurpriseMe}
                                className="group"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.9rem",
                                    padding: "0.8rem 1.5rem",
                                    borderRadius: "99px",
                                    border: "1px solid var(--border)",
                                    background: "transparent",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}
                            >
                                Surprise Me
                                <span className="group-hover:rotate-12 transition-transform">🎲</span>
                            </button>
                        </div>

                        {/* Progress Bars */}
                        <div style={{ maxWidth: "40rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>
                            {/* Year Progress */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Year Progress ({year})</span>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{percentComplete}%</span>
                                </div>
                                <div style={{ width: "100%", height: "2px", background: "var(--border)", position: "relative" }}>
                                    <div style={{ width: `${percentComplete}%`, height: "100%", background: "var(--foreground)", position: "absolute", top: 0, left: 0 }} />
                                </div>
                                <div style={{ marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "right" }}>
                                    {daysRemaining} days remaining
                                </div>
                            </div>

                            {/* Day Progress */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Day Progress</span>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 * 100).toFixed(2)}%</span>
                                </div>
                                <div style={{ width: "100%", height: "2px", background: "var(--border)", position: "relative" }}>
                                    <div style={{ width: `${((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 * 100)}%`, height: "100%", background: "var(--foreground)", position: "absolute", top: 0, left: 0 }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </Container>
            </section>
        </div>
    );
}
