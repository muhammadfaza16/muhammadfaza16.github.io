"use client";

import { useRouter } from "next/navigation";
import { Headphones, Sparkles } from "lucide-react";
import { useZen } from "@/components/ZenContext";
import { useAudio } from "@/components/AudioContext";

export function ZenTeleport() {
    const router = useRouter();
    const { setZen } = useZen();
    const { togglePlay, isPlaying } = useAudio();

    const handleTeleport = () => {
        // Enable Zen mode with return path, start music if not playing, then navigate to homepage
        setZen(true, "/sanctuary"); // Will return to sanctuary when exiting Zen
        if (!isPlaying) {
            togglePlay(); // Start playing music to trigger immersive experience
        }
        router.push("/");
    };

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
                padding: "clamp(2rem, 5vw, 3rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                transition: "all 0.5s ease",
                textAlign: "center"
            }}>
                {/* Bloom Effect - More dramatic */}
                <div style={{
                    position: "absolute",
                    inset: "0",
                    background: `radial-gradient(circle at 50% 50%, var(--widget-accent), transparent 60%)`,
                    opacity: 0.12,
                    zIndex: 0,
                    transition: "background 0.5s ease"
                }} />

                {/* Floating Stars Decoration */}
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    opacity: 0.2
                }}>
                    <Sparkles style={{ width: "16px", height: "16px", color: "var(--widget-accent)" }} />
                </div>
                <div style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "1rem",
                    opacity: 0.2
                }}>
                    <Sparkles style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                </div>

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Icon */}
                    <div style={{
                        width: "80px",
                        height: "80px",
                        margin: "0 auto 1.5rem",
                        borderRadius: "50%",
                        background: "rgba(var(--background-rgb), 0.5)",
                        border: "2px solid var(--widget-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }} className="animate-pulse">
                        <Headphones style={{ width: "32px", height: "32px", color: "var(--widget-accent)" }} />
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: "var(--foreground)",
                        marginBottom: "1rem"
                    }}>
                        Butuh pelarian sebentar?
                    </h3>

                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        marginBottom: "2rem",
                        maxWidth: "35ch",
                        margin: "0 auto 2rem"
                    }}>
                        Masuk ke mode immersive. Musik, bintang-bintang, dan keheningan. Cuma kamu dan semesta.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={handleTeleport}
                        className="group"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "1rem 2rem",
                            borderRadius: "100px",
                            background: "var(--widget-accent)",
                            border: "none",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 10px 30px -10px var(--widget-accent)"
                        }}
                    >
                        <Headphones style={{ width: "18px", height: "18px" }} />
                        <span>Masuk Mode Zen</span>
                    </button>

                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-secondary)",
                        opacity: 0.5,
                        marginTop: "1.5rem"
                    }}>
                        Kamu dibawa ke halaman utama, tapi lebih sunyi
                    </p>
                </div>
            </div>
        </div>
    );
}
