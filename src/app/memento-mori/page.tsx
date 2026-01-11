"use client";

import { Container } from "@/components/Container";
import { useEffect, useState } from "react";

// Assuming a life expectancy of 80 years
const YEARS = 80;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = YEARS * WEEKS_PER_YEAR;

// Assuming user birthday (This would ideally be configurable)
const BIRTH_DATE = new Date("2000-01-01"); // Placeholder birthdate

export default function MementoMoriPage() {
    const [mounted, setMounted] = useState(false);
    const [weeksLived, setWeeksLived] = useState(0);

    useEffect(() => {
        setMounted(true);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - BIRTH_DATE.getTime());
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        setWeeksLived(diffWeeks);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ paddingBottom: "8rem" }}>
            <section style={{
                minHeight: "50vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "8rem",
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
                            The Grid
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "15ch",
                            margin: "0 auto",
                            textAlign: "center"
                        }}>
                            Remember you must die.
                        </h1>
                        <p style={{
                            textAlign: "center",
                            marginTop: "2rem",
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            maxWidth: "600px",
                            margin: "2rem auto 0"
                        }}>
                            Your life in weeks. Each dot represents one week. Do not squander them.
                        </p>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "60rem", margin: "0 auto" }}>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        justifyContent: "center"
                    }}>
                        {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
                            const isLived = i < weeksLived;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        backgroundColor: isLived ? "var(--foreground)" : "transparent",
                                        border: isLived ? "none" : "1px solid var(--border)",
                                        opacity: isLived ? 0.8 : 0.4
                                    }}
                                    title={isLived ? "Past" : "Future"}
                                />
                            );
                        })}
                    </div>
                </div>
            </Container>
        </div>
    );
}
