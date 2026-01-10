"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const gojoQuotes = [
    "Nah, I'd win.",
    "You're weak.",
    "I'm the strongest.",
    "Click me~",
    "✨ Muryō Kūsho"
];

export function WanderingMascot() {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [direction, setDirection] = useState(1); // 1 = right, -1 = left
    const [isWalking, setIsWalking] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [quote, setQuote] = useState(gojoQuotes[0]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Randomize quote on hover
        if (isHovered) {
            setQuote(gojoQuotes[Math.floor(Math.random() * gojoQuotes.length)]);
        }
    }, [isHovered]);

    useEffect(() => {
        if (!isWalking) return;

        const moveInterval = setInterval(() => {
            setPosition(prev => {
                let newX = prev.x + (direction * 0.4);
                let newY = prev.y + (Math.sin(Date.now() / 1000) * 0.15);

                // Bounce at edges
                if (newX > 92) {
                    setDirection(-1);
                    newX = 92;
                } else if (newX < 8) {
                    setDirection(1);
                    newX = 8;
                }

                // Keep Y in bounds (lower on screen for global visibility)
                newY = Math.max(60, Math.min(90, newY));

                return { x: newX, y: newY };
            });
        }, 50);

        // Random pause and direction change
        const pauseInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsWalking(false);
                setTimeout(() => {
                    setIsWalking(true);
                    if (Math.random() > 0.5) {
                        setDirection(prev => -prev);
                    }
                }, 1000 + Math.random() * 2000);
            }
        }, 3000);

        return () => {
            clearInterval(moveInterval);
            clearInterval(pauseInterval);
        };
    }, [isWalking, direction]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 50,
                overflow: "hidden"
            }}
        >
            <Link
                href="/time"
                style={{
                    position: "absolute",
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%) scaleX(${direction})`,
                    pointerEvents: "auto",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: isWalking ? "none" : "transform 0.3s ease"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                title="✨ The Strongest!"
            >
                {/* Mascot Container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        animation: isWalking ? "gojo-walk 0.4s ease-in-out infinite" : "gojo-idle 2s ease-in-out infinite",
                        transform: isHovered ? "scale(1.15)" : "scale(1)",
                        transition: "transform 0.2s ease"
                    }}
                >
                    {/* Speech bubble on hover */}
                    {isHovered && (
                        <div style={{
                            position: "absolute",
                            top: "-32px",
                            left: "50%",
                            transform: `translateX(-50%) scaleX(${direction})`,
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            fontSize: "0.65rem",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                            animation: "fade-in 0.2s ease",
                            fontWeight: 600
                        }}>
                            {quote}
                            <div style={{
                                position: "absolute",
                                bottom: "-5px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "5px solid transparent",
                                borderRight: "5px solid transparent",
                                borderTop: "5px solid var(--foreground)"
                            }} />
                        </div>
                    )}

                    {/* Chibi Gojo Satoru */}
                    <svg
                        width="40"
                        height="52"
                        viewBox="0 0 40 52"
                        fill="none"
                        style={{
                            filter: isHovered
                                ? "drop-shadow(0 0 12px #60a5fa) drop-shadow(0 0 20px rgba(96, 165, 250, 0.5))"
                                : "drop-shadow(0 3px 6px rgba(0,0,0,0.15))"
                        }}
                    >
                        {/* Spiky White Hair */}
                        <path
                            d="M8 18C8 18 6 12 8 8C10 4 14 2 20 2C26 2 30 4 32 8C34 12 32 18 32 18"
                            fill="#f0f0f0"
                            stroke="#e0e0e0"
                            strokeWidth="0.5"
                        />
                        {/* Hair spikes */}
                        <path
                            d="M10 14L8 6L12 12M16 10L15 2L18 8M24 8L25 1L22 8M30 14L33 5L28 12"
                            stroke="#e8e8e8"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            style={{
                                animation: isWalking ? "hair-bounce 0.4s ease-in-out infinite" : "none"
                            }}
                        />
                        {/* More hair detail */}
                        <ellipse cx="20" cy="14" rx="11" ry="8" fill="#f5f5f5" />
                        <path d="M12 10C12 10 14 6 20 6C26 6 28 10 28 10" fill="#fafafa" />
                        
                        {/* Face/Head */}
                        <ellipse cx="20" cy="20" rx="10" ry="9" fill="#fce4d6" />
                        
                        {/* Blindfold */}
                        <rect
                            x="8"
                            y="16"
                            width="24"
                            height="6"
                            rx="2"
                            fill="#1a1a2e"
                        />
                        {/* Blindfold shine */}
                        <rect x="10" y="17" width="8" height="1.5" rx="0.75" fill="#2d2d44" opacity="0.6" />
                        
                        {/* Confident smirk */}
                        <path
                            d="M16 26Q20 28 24 26"
                            stroke="#c9a99a"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                        {/* Body - Black Uniform */}
                        <path
                            d="M12 28C12 28 10 30 10 34V44C10 46 12 48 14 48H26C28 48 30 46 30 44V34C30 30 28 28 28 28H12Z"
                            fill="#1a1a2e"
                        />
                        {/* Uniform collar */}
                        <path
                            d="M14 28L20 32L26 28"
                            stroke="#2d2d44"
                            strokeWidth="1"
                            fill="none"
                        />
                        {/* High collar detail */}
                        <rect x="17" y="28" width="6" height="4" fill="#1a1a2e" />
                        <line x1="20" y1="28" x2="20" y2="32" stroke="#2d2d44" strokeWidth="0.5" />
                        
                        {/* Arms */}
                        <ellipse cx="8" cy="36" rx="3" ry="4" fill="#1a1a2e" />
                        <ellipse cx="32" cy="36" rx="3" ry="4" fill="#1a1a2e" />
                        
                        {/* Hands */}
                        <circle cx="8" cy="40" r="2.5" fill="#fce4d6" />
                        <circle cx="32" cy="40" r="2.5" fill="#fce4d6" />
                        
                        {/* Legs */}
                        <rect x="13" y="46" width="5" height="6" rx="2" fill="#1a1a2e" />
                        <rect x="22" y="46" width="5" height="6" rx="2" fill="#1a1a2e" />
                        
                        {/* Glow effect when hovered - Infinity aura */}
                        {isHovered && (
                            <>
                                <circle cx="20" cy="30" r="18" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.3">
                                    <animate attributeName="r" from="15" to="22" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.4" to="0" dur="1s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="20" cy="30" r="12" fill="none" stroke="#93c5fd" strokeWidth="0.5" opacity="0.5">
                                    <animate attributeName="r" from="10" to="18" dur="0.8s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.5" to="0" dur="0.8s" repeatCount="indefinite" />
                                </circle>
                            </>
                        )}
                    </svg>

                    {/* Shadow */}
                    <div style={{
                        width: "24px",
                        height: "8px",
                        backgroundColor: "var(--foreground)",
                        borderRadius: "50%",
                        opacity: 0.12,
                        marginTop: "-4px",
                        animation: isWalking ? "shadow-pulse 0.4s ease-in-out infinite" : "none"
                    }} />
                </div>
            </Link>

            {/* Keyframe animations */}
            <style jsx global>{`
                @keyframes gojo-walk {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-4px) rotate(2deg); }
                }
                
                @keyframes gojo-idle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2px); }
                }
                
                @keyframes hair-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-1px); }
                }
                
                @keyframes shadow-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.12; }
                    50% { transform: scale(0.85); opacity: 0.08; }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(5px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </div>
    );
}
