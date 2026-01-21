"use client";

import { useState, useEffect } from "react";
import { Wind, Moon, Heart, X, Play, Pause, Sparkles } from "lucide-react";
import { useSanctuary } from "@/components/sanctuary/SanctuaryContext";

type Mode = "anxious" | "lonely" | "sleepless" | null;

const content = {
    anxious: {
        title: "Gravitasi lagi berat ya?",
        affirmation: "Pelan-pelan aja. Lepasin beban di pundak sejenak. Biarin mereka ngapung di angkasa. Di sini gravitasi nol. Kamu boleh melayang, nggak perlu napak dulu.",
        icon: Wind,
        color: "#10b981" // Emerald
    },
    lonely: {
        title: "Satu orbit sama aku.",
        affirmation: "Di semesta seluas ini, wajar kok ngerasa kecil dan sendirian. Tapi liat deh, bintang aja butuh jarak gelap biar bisa bersinar. Kamu nggak sendiri, kita cuma lagi ada di konstelasi yang beda.",
        icon: Heart,
        color: "#ec4899" // Pink
    },
    sleepless: {
        title: "Nebula di kepala masih aktif?",
        affirmation: "Isi kepalamu pasti lagi warna-warni banget ya. Nggak apa-apa, biarin mereka muter kayak galaksi. Pejamin mata, bayangin kamu astronaut yang lagi drifting di sunyinya angkasa. Aman. Senyap.",
        icon: Moon,
        color: "#8b5cf6" // Violet
    }
};

export function ComfortStationV2() {
    const { setMood } = useSanctuary();
    const [mode, setMode] = useState<Mode>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Audio refs (Future implementation)
    // const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleSetMode = (m: Mode) => {
        setMode(m);
        setMood(m);
        setIsPlaying(false); // Reset audio when changing mode
    };

    const activeContent = mode ? content[mode] : null;
    const ActiveIcon = activeContent?.icon || Wind;
    const accentColor = activeContent?.color || "var(--accent)";

    // Breathing Animation Variants
    const breatheVariants = {
        inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
        hold: { scale: 1.5, opacity: 1, transition: { duration: 4 } },
        exhale: { scale: 1.0, opacity: 0.8, transition: { duration: 4, ease: "easeInOut" } }
    };

    const [breathState, setBreathState] = useState("inhale");

    useEffect(() => {
        if (mode === "anxious") {
            const sequence = async () => {
                while (true) { // Infinite loop for breathing
                    setBreathState("inhale");
                    await new Promise(r => setTimeout(r, 4000));
                    setBreathState("hold");
                    await new Promise(r => setTimeout(r, 4000));
                    setBreathState("exhale");
                    await new Promise(r => setTimeout(r, 4000));
                }
            };
            // Simplification: CSS/Framer is better than this potential memory leak loop if not handled carefully.
            // Using direct Framer Motion animate prop with keyframes is safer and cleaner.
        }
    }, [mode]);

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
                        padding: "0.5rem 1.25rem",
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
                            Jujur-jujuran Aja
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

                        {/* Clean Spacer */}
                        <div style={{ height: "2rem" }} />

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
                            Mood kamu lagi warna apa hari ini? Cerita sini, nggak bakal ada yang nge-judge kok.
                        </p>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                            {(["anxious", "lonely", "sleepless"] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleSetMode(m)}
                                    className="h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)] backdrop-blur-sm"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        paddingLeft: "24px",
                                        paddingRight: "24px",
                                        whiteSpace: "nowrap",
                                        minWidth: "fit-content"
                                    }}
                                >
                                    {m === "anxious" && "Kepala Ruwet"}
                                    {m === "lonely" && "Butuh Temen"}
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

                        {/* Visual for Mode */}
                        <div style={{
                            width: "120px",
                            height: "120px",
                            marginBottom: "2rem",
                            borderRadius: "50%",
                            border: "2px solid var(--widget-accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }} className={mode === "anxious" ? "animate-breathe-custom" : "animate-pulse"}>
                            {/* CSS for custom breathe will be added globally or inline style simulation */}
                            {/* Using a simple CSS approach for now to stay lightweight without framer refactor heavyweight */}
                            <style jsx>{`
                                @keyframes breathe {
                                    0%, 100% { transform: scale(1); opacity: 0.8; }
                                    50% { transform: scale(1.3); opacity: 1; }
                                }
                                .animate-breathe-custom {
                                    animation: breathe 8s infinite ease-in-out;
                                }
                            `}</style>
                            <ActiveIcon style={{ width: "48px", height: "48px", color: "var(--widget-accent)" }} />

                            {/* Text Guide for Anxious Mode */}
                            {mode === "anxious" && (
                                <div style={{
                                    position: "absolute",
                                    bottom: "-2rem",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    whiteSpace: "nowrap",
                                    fontSize: "0.75rem",
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--widget-accent)",
                                    opacity: 0.8
                                }}>
                                    Tarik... Hembuskan...
                                </div>
                            )}
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
                            className="h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center gap-2 transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 500,
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                whiteSpace: "nowrap",
                                minWidth: "fit-content"
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
