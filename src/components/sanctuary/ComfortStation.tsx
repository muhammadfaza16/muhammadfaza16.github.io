"use client";

import { useState } from "react";
import { Wind, Moon, Heart, X, Play, Pause } from "lucide-react";

type Mode = "anxious" | "lonely" | "sleepless" | null;

const content = {
    anxious: {
        title: "Tarik napas bareng, yuk.",
        affirmation: "Kamu di sini. Kamu aman. Apapun yang terjadi di luar sana, di sini cuma ada kamu dan ketenangan.",
        icon: Wind,
        color: "#10b981" // Emerald
    },
    lonely: {
        title: "Kamu nggak sendirian.",
        affirmation: "Mungkin kamu nggak tahu, tapi ada yang selalu mikirin kamu. Bahkan di momen paling sunyi.",
        icon: Heart,
        color: "#ec4899" // Pink
    },
    sleepless: {
        title: "Istirahat dulu, nggak apa-apa.",
        affirmation: "Dunia bisa nunggu. Tugasmu sekarang cuma satu: lepaskan semuanya, dan tidur dengan tenang.",
        icon: Moon,
        color: "#8b5cf6" // Violet
    }
};

export function ComfortStation() {
    const [mode, setMode] = useState<Mode>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const activeContent = mode ? content[mode] : null;
    const ActiveIcon = activeContent?.icon || Wind;
    const accentColor = activeContent?.color || "var(--accent)";

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": accentColor
        } as React.CSSProperties}>
            <div style={{
                borderRadius: "1.5rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                position: "relative",
                overflow: "hidden",
                minHeight: mode ? "480px" : "400px",
                display: "flex",
                flexDirection: "column",
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
                        <Wind style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Pojok Tenang
                        </span>
                    </span>
                </div>

                {/* IDLE STATE */}
                {!mode && (
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 1
                    }} className="animate-fade-in">
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: "var(--foreground)",
                            marginBottom: "1rem"
                        }}>
                            Lagi gimana hari ini?
                        </h3>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.05rem",
                            lineHeight: 1.7,
                            color: "var(--text-secondary)",
                            marginBottom: "2rem",
                            maxWidth: "30ch"
                        }}>
                            Nggak perlu cerita kalau belum siap. Aku cuma mau tahu kamu baik-baik aja.
                        </p>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                            {(["anxious", "lonely", "sleepless"] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className="h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)] px-4"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em"
                                    }}
                                >
                                    {m === "anxious" && "Cemas"}
                                    {m === "lonely" && "Kesepian"}
                                    {m === "sleepless" && "Susah Tidur"}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ACTIVE STATE */}
                {mode && activeContent && (
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 1
                    }} className="animate-fade-in">
                        {/* Close Button */}
                        <button
                            onClick={() => { setMode(null); setIsPlaying(false); }}
                            className="h-10 w-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                            style={{ position: "absolute", top: 0, right: 0 }}
                        >
                            <X style={{ width: "16px", height: "16px" }} />
                        </button>

                        {/* Breathing Circle */}
                        <div style={{
                            width: "120px",
                            height: "120px",
                            marginBottom: "2rem",
                            borderRadius: "50%",
                            border: "2px solid var(--widget-accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }} className={mode === "anxious" ? "animate-breathe" : "animate-pulse"}>
                            <ActiveIcon style={{ width: "48px", height: "48px", color: "var(--widget-accent)" }} />
                        </div>

                        {/* Title & Affirmation */}
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: "var(--foreground)",
                            marginBottom: "1rem"
                        }}>{activeContent.title}</h3>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.15rem, 3vw, 1.35rem)",
                            lineHeight: 1.5,
                            color: "var(--foreground)",
                            fontStyle: "italic",
                            marginBottom: "2rem",
                            maxWidth: "40ch"
                        }}>
                            "{activeContent.affirmation}"
                        </p>

                        {/* Play Button */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center gap-2 transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)] px-4"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.15em",
                                fontWeight: 500
                            }}
                        >
                            {isPlaying ? <Pause style={{ width: "14px", height: "14px" }} /> : <Play style={{ width: "14px", height: "14px" }} />}
                            {isPlaying ? "Jeda" : "Putar Suara Alam"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
