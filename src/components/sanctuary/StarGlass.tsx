"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

export function StarGlass() {
    const [text, setText] = useState("");
    const [isReleasing, setIsReleasing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRelease = () => {
        if (!text.trim()) return;
        setIsReleasing(true);
        setTimeout(() => {
            setText("");
            setIsReleasing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": "#f59e0b" // Amber
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
                        <Sparkles style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Tempat Lepas
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
                        marginBottom: "1rem"
                    }}>
                        Buang ke sini.
                    </h3>
                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        marginBottom: "2rem"
                    }}>
                        Tulis apapun yang membebani. Tekan lepas. Lihat dia jadi debu bintang.
                        <br />
                        <span style={{ fontStyle: "italic", opacity: 0.6, fontSize: "0.9rem" }}>(Nggak ada yang disimpan. Beneran hilang.)</span>
                    </p>

                    {showSuccess ? (
                        <div style={{
                            textAlign: "center",
                            padding: "3rem"
                        }} className="animate-fade-in">
                            <div style={{
                                width: "64px",
                                height: "64px",
                                margin: "0 auto 1.5rem",
                                borderRadius: "50%",
                                background: "rgba(var(--background-rgb), 0.5)",
                                border: "1px solid var(--widget-accent)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Sparkles style={{ width: "28px", height: "28px", color: "var(--widget-accent)" }} />
                            </div>
                            <p style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.25rem",
                                fontStyle: "italic",
                                color: "var(--foreground)"
                            }}>
                                Udah hilang. Kamu lebih ringan sekarang.
                            </p>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Aku lagi kepikiran soal..."
                                disabled={isReleasing}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    padding: "1rem",
                                    borderRadius: "0.75rem",
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    fontFamily: "'Source Serif 4', serif",
                                    fontSize: "1rem",
                                    color: "var(--foreground)",
                                    resize: "none",
                                    outline: "none",
                                    transition: "all 0.5s ease",
                                    opacity: isReleasing ? 0 : 1,
                                    transform: isReleasing ? "scale(0.95)" : "scale(1)"
                                }}
                            />

                            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    onClick={handleRelease}
                                    disabled={!text.trim() || isReleasing}
                                    className="h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center gap-2 transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)] px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em",
                                        fontWeight: 500
                                    }}
                                >
                                    <Send style={{ width: "14px", height: "14px" }} />
                                    {isReleasing ? "Melepas..." : "Lepaskan"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
