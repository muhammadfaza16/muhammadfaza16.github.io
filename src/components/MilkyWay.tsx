"use client";

import { useZen } from "./ZenContext";

/**
 * A subtle Milky Way band effect that appears in the background.
 * More visible in Zen mode for immersive experience.
 */
export function MilkyWay() {
    const { isZen } = useZen();

    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1, // Above background but below content
                overflow: "hidden",
                opacity: isZen ? 1 : 0.5, // Much more visible
                transition: "opacity 1s ease-in-out"
            }}
        >
            {/* Main Milky Way band - diagonal across screen */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-30%",
                    width: "200%",
                    height: "60%",
                    background: `
                        linear-gradient(
                            135deg,
                            transparent 0%,
                            transparent 25%,
                            rgba(200, 180, 255, 0.08) 30%,
                            rgba(180, 160, 240, 0.15) 38%,
                            rgba(160, 140, 220, 0.22) 44%,
                            rgba(140, 130, 200, 0.28) 48%,
                            rgba(150, 140, 210, 0.32) 50%,
                            rgba(140, 130, 200, 0.28) 52%,
                            rgba(160, 140, 220, 0.22) 56%,
                            rgba(180, 160, 240, 0.15) 62%,
                            rgba(200, 180, 255, 0.08) 70%,
                            transparent 75%,
                            transparent 100%
                        )
                    `,
                    filter: "blur(30px)",
                    transform: "rotate(-25deg)",
                    animation: "milkyway-drift 120s linear infinite"
                }}
            />

            {/* Secondary subtle cloud layer */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "-20%",
                    width: "180%",
                    height: "40%",
                    background: `
                        linear-gradient(
                            140deg,
                            transparent 0%,
                            transparent 35%,
                            rgba(220, 200, 255, 0.02) 40%,
                            rgba(200, 180, 240, 0.06) 48%,
                            rgba(180, 170, 230, 0.08) 50%,
                            rgba(200, 180, 240, 0.06) 52%,
                            rgba(220, 200, 255, 0.02) 60%,
                            transparent 65%,
                            transparent 100%
                        )
                    `,
                    filter: "blur(50px)",
                    transform: "rotate(-30deg)",
                    animation: "milkyway-drift 180s linear infinite reverse"
                }}
            />

            {/* Dust lane (darker stripe through the middle) */}
            <div
                style={{
                    position: "absolute",
                    top: "5%",
                    left: "-25%",
                    width: "180%",
                    height: "15%",
                    background: `
                        linear-gradient(
                            135deg,
                            transparent 0%,
                            transparent 40%,
                            rgba(20, 10, 40, 0.15) 48%,
                            rgba(30, 20, 50, 0.2) 50%,
                            rgba(20, 10, 40, 0.15) 52%,
                            transparent 60%,
                            transparent 100%
                        )
                    `,
                    filter: "blur(20px)",
                    transform: "rotate(-25deg)",
                    mixBlendMode: "multiply"
                }}
            />

            <style>{`
                @keyframes milkyway-drift {
                    0% { transform: rotate(-25deg) translateX(0); }
                    100% { transform: rotate(-25deg) translateX(50px); }
                }
            `}</style>
        </div>
    );
}
