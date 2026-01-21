"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useSanctuary } from "@/components/sanctuary/SanctuaryContext";

const TRUTHS = [
    "Kamu itu 'stardust'. Terbuat dari material yang sama kayak bintang-bintang. Kuat udah ada di DNA semestamu.",
    "Cahaya bintang butuh perjalanan panjang buat kelihatan. Usahamu juga gitu; mungkin belum kerasa sekarang, tapi 'cahaya'-nya lagi on the way. Tungguin.",
    "Matahari aja tenggelam tiap hari buat recharge. Masa kamu mau bersinar 24 jam non-stop? Istirahat itu hukum alam, bukan dosa.",
    "Semesta nggak pernah bikin produk gagal. Kalau kamu ada di sini, berarti eksistensimu emang dibutuhin buat keseimbangan kosmos. You belong here.",
    "Bumi muter pelan banget kalau dirasain, tapi dia nggak pernah berhenti. Kamu juga gitu. Pelan nggak apa-apa, asal orbitmu jalan terus."
];

export function MirrorOfTruth() {
    const { unlockedTruths, unlockTruth, lastTruthRevealDate } = useSanctuary();

    // Check if we can reveal a new truth today
    const today = new Date().toISOString().split('T')[0];
    const canRevealNew = lastTruthRevealDate !== today;

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

                    {!canRevealNew && (
                        <span style={{
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)",
                            opacity: 0.7
                        }}>
                            Besok lagi, ya.
                        </span>
                    )}
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
                        {TRUTHS.map((truth, i) => {
                            const isRevealed = unlockedTruths.includes(i);

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (isRevealed) return; // Do nothing if already revealed
                                        if (canRevealNew) unlockTruth(i);
                                    }}
                                    disabled={!isRevealed && !canRevealNew}
                                    className="rounded-xl border transition-all active:scale-95"
                                    style={{
                                        padding: "1rem 1.25rem",
                                        fontFamily: isRevealed ? "'Playfair Display', serif" : "var(--font-mono)",
                                        fontSize: isRevealed ? "1rem" : "0.7rem",
                                        fontStyle: isRevealed ? "italic" : "normal",
                                        textTransform: isRevealed ? "none" : "uppercase",
                                        letterSpacing: isRevealed ? "0" : "0.1em",
                                        color: isRevealed ? "var(--foreground)" : "var(--text-secondary)",
                                        minWidth: isRevealed ? "200px" : "auto",
                                        borderColor: isRevealed
                                            ? "var(--widget-accent)"
                                            : (!canRevealNew ? "transparent" : "var(--border)"),
                                        background: isRevealed
                                            ? "rgba(14, 165, 233, 0.05)"
                                            : (!canRevealNew ? "rgba(125,125,125,0.02)" : "rgba(125,125,125,0.05)"),
                                        cursor: isRevealed ? "default" : (!canRevealNew ? "not-allowed" : "pointer"),
                                        opacity: (!isRevealed && !canRevealNew) ? 0.5 : 1,

                                    }}
                                >
                                    {isRevealed ? truth : `Kebenaran ${i + 1}`}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
