"use client";

import { useState } from "react";
import { MessageSquareHeart, ChevronLeft, ChevronRight } from "lucide-react";

const LETTERS = [
    {
        category: "Waktu kamu ngerasa kecil",
        content: "Kamu terbuat dari debu bintang. Karbon yang sama yang bikin gunung dan lautan, juga ada di dalam kamu. Kamu punya hak yang sama untuk ada di alam semesta ini.",
        author: "Semesta"
    },
    {
        category: "Waktu kamu ragu sama diri sendiri",
        content: "Aku udah lihat kamu melewati badai-badai yang bisa hancurin orang lain. Kamu kuat bukan karena nggak ngerasa sakit, tapi karena tetap jalan meskipun sakit.",
        author: "Penggemar Diammu"
    },
    {
        category: "Waktu kamu capek",
        content: "Istirahat itu bukan kemalasan. Matahari aja terbenam setiap hari. Tidur yang nyenyak, dan percaya aku—dunia bisa nunggu.",
        author: "Malam"
    }
];

export function LettersOfLight() {
    const [index, setIndex] = useState(0);
    const next = () => setIndex((prev) => (prev + 1) % LETTERS.length);
    const prev = () => setIndex((prev) => (prev - 1 + LETTERS.length) % LETTERS.length);

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": "#8b5cf6" // Violet
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
                    background: `radial-gradient(circle at 50% 100%, var(--widget-accent), transparent 70%)`,
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
                        <MessageSquareHeart style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Surat Cahaya
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

                {/* Content */}
                <div style={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }} key={index} className="animate-fade-in">
                    {/* Category Pill */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        border: "1px solid var(--border)",
                        marginBottom: "1.5rem",
                        background: "var(--card-bg)"
                    }}>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            {LETTERS[index].category}
                        </span>
                    </div>

                    {/* The Letter */}
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.15rem, 3vw, 1.35rem)",
                        lineHeight: 1.5,
                        color: "var(--foreground)",
                        fontStyle: "italic",
                        marginBottom: "1.5rem",
                        maxWidth: "90%"
                    }}>
                        "{LETTERS[index].content}"
                    </p>

                    {/* Attribution */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                    }}>
                        <div style={{ width: "30px", height: "1px", background: "var(--border)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            fontStyle: "italic"
                        }}>
                            {LETTERS[index].author}
                        </span>
                        <div style={{ width: "30px", height: "1px", background: "var(--border)" }} />
                    </div>
                </div>

                {/* Separator */}
                <div style={{
                    width: "100%",
                    height: "1px",
                    background: "var(--border)",
                    opacity: 0.5,
                    marginTop: "1.5rem",
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
                                style={{
                                    width: i === index ? "24px" : "8px",
                                    height: "8px",
                                    borderRadius: "100px",
                                    background: i === index ? "var(--widget-accent)" : "var(--border)",
                                    transition: "all 0.3s ease"
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
