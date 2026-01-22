"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/sanctuary/ui/GlassCard";

export function MemoryBoxTile() {
    return (
        <div style={{ position: "relative" }}>
            <Link href="/sanctuary/chronosphere" className="block group">
                <GlassCard
                    accentColor="#fbbf24"
                    className="transition-all duration-500 hover:border-[#fbbf24]/30"
                >
                    {/* Content Container */}
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>

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
                                border: "1px solid var(--widget-accent)",
                                background: "rgba(var(--background-rgb), 0.5)"
                            }}>
                                <Clock style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--widget-accent)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    fontWeight: 600
                                }}>
                                    Kronosphere
                                </span>
                            </span>

                            {/* Arrow */}
                            <div style={{
                                opacity: 0.5,
                                transform: "translateX(0)",
                                transition: "all 0.3s ease",
                                color: "var(--text-secondary)"
                            }} className="group-hover:translate-x-1 group-hover:text-[var(--widget-accent)] group-hover:opacity-100">
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
                                color: "var(--foreground)",
                                marginBottom: "0.5rem",
                                transition: "color 0.3s ease"
                            }} className="group-hover:text-[var(--widget-accent)]">
                                Kotak Kenangan
                            </h3>
                            <p style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "1.05rem",
                                lineHeight: 1.6,
                                color: "var(--text-secondary)",
                                maxWidth: "40ch"
                            }}>
                                Simpan yang berharga di sini. Biar nggak hilang dimakan waktu.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </Link>
        </div>
    );
}
