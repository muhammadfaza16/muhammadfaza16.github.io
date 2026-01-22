"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

import { GlassCard } from "@/components/sanctuary/ui/GlassCard";

export function StarGlass() {
    const [text, setText] = useState("");
    const [isReleasing, setIsReleasing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRelease = () => {
        if (!text.trim()) return;
        setIsReleasing(true);
        // Duration matches the cosmic animation
        setTimeout(() => {
            setText("");
            setIsReleasing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 2000);
    };

    return (
        <div style={{ position: "relative" }}>
            <GlassCard accentColor="#f59e0b">
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
                            <div style={{ position: "relative" }}>
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
                                        transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        opacity: isReleasing ? 0 : 1,
                                        transform: isReleasing ? "scale(1.1) translateY(-20px)" : "scale(1) translateY(0)",
                                        filter: isReleasing ? "blur(20px) brightness(2) contrast(1.5)" : "blur(0px) brightness(1) contrast(1)",
                                        letterSpacing: isReleasing ? "1em" : "normal",
                                        clipPath: isReleasing ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" // Wipe effect
                                    }}
                                />

                                {/* Cosmic Particles - Shatter Effect */}
                                {isReleasing && (
                                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    position: "absolute",
                                                    left: `${Math.random() * 100}%`,
                                                    top: `${Math.random() * 100}%`,
                                                    width: `${Math.random() * 6 + 2}px`,
                                                    height: `${Math.random() * 6 + 2}px`,
                                                    borderRadius: "2px", // Square particles like glass shards
                                                    background: "var(--widget-accent)",
                                                    opacity: 0,
                                                    boxShadow: "0 0 10px var(--widget-accent)",
                                                    animation: `shatterUp ${1.5 + Math.random()}s ease-out forwards`,
                                                    animationDelay: `${Math.random() * 0.5}s`
                                                }}
                                            />
                                        ))}
                                        {/* Inline Keyframes for Shatter */}
                                        <style jsx>{`
                                            @keyframes shatterUp {
                                                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                                                100% { transform: translateY(-150px) rotate(${Math.random() * 360}deg) scale(0); opacity: 0; }
                                            }
                                        `}</style>
                                    </div>
                                )}
                            </div>

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
                                    {isReleasing ? "Meluruhkan..." : "Lepaskan"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
