"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const TRUTHS = [
    "Kamu lebih kuat dari yang kamu kira. Serius.",
    "Usahamu itu penting, meskipun nggak ada yang lihat.",
    "Istirahat bukan kelemahan. Kamu berhak capek.",
    "Kamu layak dicintai, dan dimaafin. Terutama oleh dirimu sendiri.",
    "Langkah kecil tetap langkah. Pelan nggak apa-apa."
];

export function MirrorOfTruth() {
    const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": "#0ea5e9" // Cyan
        } as React.CSSProperties}>
            <div style={{
                borderRadius: "1.5rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                transition: "all 0.5s ease"
            }}>
                {/* Bloom Effect */}
                <div style={{
                    position: "absolute",
                    inset: "0",
                    background: `radial-gradient(circle at center, var(--widget-accent), transparent 70%)`,
                    opacity: 0.08,
                    zIndex: 0,
                    transition: "background 0.5s ease"
                }} />

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                    position: "relative",
                    zIndex: 1
                }}>
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        border: "1px solid var(--widget-accent)",
                        background: "rgba(var(--background-rgb), 0.5)"
                    }}>
                        <Sparkles style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Cermin Jujur
                        </span>
                    </span>
                </div>

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: "var(--foreground)",
                        marginBottom: "1rem",
                        textAlign: "center"
                    }}>
                        Ketuk satu. Aku kasih kejujuran.
                    </h3>
                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        marginBottom: "2rem",
                        textAlign: "center"
                    }}>
                        Kadang kita perlu diingatkan hal-hal yang kita lupa tentang diri sendiri.
                    </p>

                    {/* Truth Cards */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                        {TRUTHS.map((truth, i) => (
                            <button
                                key={i}
                                onClick={() => setRevealedIndex(revealedIndex === i ? null : i)}
                                className="rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                                style={{
                                    padding: "1rem 1.25rem",
                                    fontFamily: revealedIndex === i ? "'Playfair Display', serif" : "var(--font-mono)",
                                    fontSize: revealedIndex === i ? "1rem" : "0.7rem",
                                    fontStyle: revealedIndex === i ? "italic" : "normal",
                                    textTransform: revealedIndex === i ? "none" : "uppercase",
                                    letterSpacing: revealedIndex === i ? "0" : "0.1em",
                                    color: revealedIndex === i ? "var(--foreground)" : "var(--text-secondary)",
                                    minWidth: revealedIndex === i ? "200px" : "auto",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {revealedIndex === i ? truth : `Kebenaran ${i + 1}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
