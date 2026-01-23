"use client";

import Link from "next/link";
import { Ticket, ArrowRight, Music } from "lucide-react";
import { useState } from "react";

export function ConcertEntryTile() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            <Link
                href="/sanctuary/concerts"
                style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.5s ease',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    borderColor: isHovered ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.1)', // Pink accent
                    cursor: 'pointer'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background Effect */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.1), transparent 70%)',
                    opacity: isHovered ? 0.8 : 0.4,
                    transition: 'opacity 0.5s'
                }} />

                <div style={{
                    position: 'relative',
                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem"
                }}>
                    {/* Header Row: Icon Pill + Arrow */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        {/* Icon Pill */}
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "100px",
                            border: "1px solid #ec4899", // Pink-500
                            background: "rgba(236, 72, 153, 0.1)"
                        }}>
                            <Ticket style={{ width: "12px", height: "12px", color: "#ec4899" }} />
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                color: "#ec4899",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 600
                            }}>
                                The Stage
                            </span>
                        </span>

                        {/* Arrow */}
                        <div style={{
                            opacity: isHovered ? 1 : 0.5,
                            transform: isHovered ? "translateX(4px)" : "translateX(0)",
                            transition: "all 0.3s ease",
                            color: isHovered ? "#ec4899" : "var(--text-secondary)"
                        }}>
                            <ArrowRight size={18} />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: isHovered ? "#ec4899" : "var(--foreground)",
                            marginBottom: "0.5rem",
                            transition: "color 0.3s ease"
                        }}>
                            Live Events
                        </h3>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.05rem",
                            lineHeight: 1.6,
                            color: "var(--text-secondary)",
                            maxWidth: "40ch"
                        }}>
                            Masuk ke venue spesial untuk sesi dengar bareng. Tiket tersedia terbatas.
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
