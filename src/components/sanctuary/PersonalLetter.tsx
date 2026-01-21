"use client";

import { useState } from "react";
import { Mail, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const LETTERS = [
    {
        date: "21 Januari 2026",
        title: "Hal kecil yang aku ingat",
        content: `Aku nggak tahu kapan kamu baca ini. Mungkin tengah malam, mungkin pas lagi capek, mungkin pas lagi seneng.

Tapi aku mau kamu tahu satu hal: aku sering kepikiran soal cara kamu ketawa. Yang spontan itu. Yang keluar tanpa izin.

Ada sesuatu di situ yang bikin dunia rasanya... lebih baik.

Jaga dirimu, ya.`,
        closing: "Yang selalu kagum"
    },
    {
        date: "15 Januari 2026",
        title: "Catatan malam",
        content: `Malam ini, pas lagi kerja, tiba-tiba kepikiran:

"Semoga dia baik-baik aja."

Itu aja. Nggak ada yang muluk-muluk.

Cuma harap kamu tidur cukup, makan teratur, dan nggak terlalu keras sama diri sendiri.

Karena kamu layak diperlakukan dengan lembut. Terutama oleh dirimu sendiri.`,
        closing: "Dari kejauhan"
    },
    {
        date: "8 Januari 2026",
        title: "Sesuatu yang perlu kamu dengar",
        content: `Aku tahu kamu sering ragu sama dirimu sendiri.

Tapi dari sudut pandangku—yang mungkin lebih jernih karena nggak hidup di kepalamu—kamu luar biasa.

Bukan karena sempurna. Tapi karena tetap berusaha meski capek. Tetap baik meski dunia kadang nggak.

Itu bukan hal kecil. Itu keberanian.`,
        closing: "Pengagum rahasia"
    }
];

export function PersonalLetter() {
    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const next = () => setIndex((prev) => (prev + 1) % LETTERS.length);
    const prev = () => setIndex((prev) => (prev - 1 + LETTERS.length) % LETTERS.length);

    const letter = LETTERS[index];

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": "#ec4899" // Pink
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
                    background: `radial-gradient(circle at 50% 0%, var(--widget-accent), transparent 70%)`,
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
                        <Mail style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Surat Untukmu
                        </span>
                    </span>

                    <span style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-secondary)",
                        opacity: 0.5
                    }}>
                        {index + 1} / {LETTERS.length}
                    </span>
                </div>

                {/* Letter Content */}
                <div style={{ position: "relative", zIndex: 1 }} key={index} className="animate-fade-in">
                    {/* Date & Title */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--widget-accent)",
                            display: "block",
                            marginBottom: "0.5rem"
                        }}>
                            {letter.date}
                        </span>
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: "var(--foreground)"
                        }}>
                            {letter.title}
                        </h3>
                    </div>

                    {/* Letter Body */}
                    <div style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                        color: "var(--foreground)",
                        whiteSpace: "pre-line",
                        marginBottom: "2rem"
                    }}>
                        {letter.content}
                    </div>

                    {/* Closing */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1.5rem"
                    }}>
                        <div style={{ width: "30px", height: "1px", background: "var(--border)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            fontStyle: "italic"
                        }}>
                            {letter.closing}
                        </span>
                        <Heart style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                    </div>
                </div>

                {/* Separator */}
                <div style={{
                    width: "100%",
                    height: "1px",
                    background: "var(--border)",
                    opacity: 0.5,
                    marginBottom: "1rem"
                }} />

                {/* Footer Controls */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    position: "relative",
                    zIndex: 1
                }}>
                    <button
                        onClick={prev}
                        className="h-10 w-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronLeft style={{ width: "16px", height: "16px" }} />
                    </button>

                    {/* Dots */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {LETTERS.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setIndex(i)}
                                style={{
                                    width: i === index ? "24px" : "8px",
                                    height: "8px",
                                    borderRadius: "100px",
                                    background: i === index ? "var(--widget-accent)" : "var(--border)",
                                    transition: "all 0.3s ease",
                                    cursor: "pointer"
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="h-10 w-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronRight style={{ width: "16px", height: "16px" }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
