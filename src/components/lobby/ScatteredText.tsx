"use client";

import { useEffect, useState } from "react";

/* ── SVG Doodle Components ── */

const DoodleStar = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path
            d="M12 2 L14.5 8.5 L21 9.5 L16.5 14 L17.5 21 L12 17.5 L6.5 21 L7.5 14 L3 9.5 L9.5 8.5 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ strokeDasharray: "none" }}
        />
    </svg>
);

const DoodleMoon = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path
            d="M20 14.5C19.2 17.8 16.5 20.3 13 20.9C8.5 21.7 4.2 18.7 3.1 14.3C2.3 11.3 3.2 8.2 5.3 6.1C5.8 5.6 6.8 5.7 6.8 6.5C6.8 8.5 7.5 10.5 9 12C10.5 13.5 12.5 14.3 14.5 14.3C15.5 14.3 16.5 15 16 15.3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
        />
        <circle cx="15" cy="5" r="0.8" fill="currentColor" opacity="0.4" />
        <circle cx="18" cy="8" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
);

const DoodleCoffee = ({ size = 28, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
        <path d="M6 10 L6 22 Q6 24 8 24 L18 24 Q20 24 20 22 L20 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M20 13 Q24 13 24 16 Q24 19 20 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M4 10 L22 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Steam */}
        <path d="M10 7 Q11 4 10 2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M14 6 Q15 3.5 14 1" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
);

const DoodleFlower = ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={style}>
        <circle cx="11" cy="9" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
        <ellipse cx="11" cy="5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
        <ellipse cx="14.5" cy="7.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" transform="rotate(60 14.5 7.5)" />
        <ellipse cx="14" cy="11.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" transform="rotate(120 14 11.5)" />
        <ellipse cx="11" cy="13" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" transform="rotate(180 11 13)" />
        <ellipse cx="8" cy="11.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" transform="rotate(240 8 11.5)" />
        <ellipse cx="7.5" cy="7.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" transform="rotate(300 7.5 7.5)" />
        <path d="M11 14 L11 21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M11 17 Q8 16 7 14" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
);

const DoodleCloud = ({ size = 30, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 30 18" fill="none" style={style}>
        <path
            d="M6 14 Q2 14 2 11 Q2 8 5 7 Q5 3 9 3 Q12 3 13 5 Q14 2 18 2 Q22 2 23 5 Q27 5 27 9 Q27 14 23 14 Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

const DoodleHeart = ({ size = 18, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
        <path
            d="M9 16 C5 12 1 9 1 5.5 C1 3 3 1 5.5 1 C7 1 8.5 2 9 3.5 C9.5 2 11 1 12.5 1 C15 1 17 3 17 5.5 C17 9 13 12 9 16Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

const SquigglyLine = ({ width = 60, style }: { width?: number; style?: React.CSSProperties }) => (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} fill="none" style={style}>
        <path
            d={`M0 4 ${Array.from({ length: Math.floor(width / 10) }, (_, i) =>
                `Q${i * 10 + 5} ${i % 2 === 0 ? 0 : 8} ${(i + 1) * 10} 4`
            ).join(' ')}`}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

const DoodleArrow = ({ size = 30, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 30 15" fill="none" style={style}>
        <path d="M2 8 Q10 6 28 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M24 4 L28 8 L24 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

/* ── Scattered Items ── */

interface ScatteredItem {
    type: "text" | "doodle";
    // Text props
    text?: string;
    strikethrough?: boolean;
    font?: "hand" | "sketch";
    // Shared
    x: string;
    y: string;
    rotation: number;
    fontSize?: string;
    opacity: number;
    color?: string;
    // Doodle
    doodle?: "star" | "moon" | "coffee" | "flower" | "cloud" | "heart" | "squiggle" | "arrow";
    doodleSize?: number;
}

const ITEMS: ScatteredItem[] = [
    // Doodles — colorful visual objects
    { type: "doodle", doodle: "star", x: "72%", y: "48%", rotation: 12, opacity: 0.35, doodleSize: 22, color: "#e8a87c" },
    { type: "doodle", doodle: "coffee", x: "10%", y: "55%", rotation: -5, opacity: 0.28, doodleSize: 30, color: "#8b6f4e" },
    { type: "doodle", doodle: "moon", x: "78%", y: "65%", rotation: -8, opacity: 0.3, doodleSize: 24, color: "#7a6fae" },
    { type: "doodle", doodle: "flower", x: "25%", y: "75%", rotation: 6, opacity: 0.3, doodleSize: 24, color: "#d4849a" },
    { type: "doodle", doodle: "cloud", x: "55%", y: "80%", rotation: 3, opacity: 0.22, doodleSize: 28, color: "#7aaccf" },
    { type: "doodle", doodle: "heart", x: "85%", y: "58%", rotation: -15, opacity: 0.3, doodleSize: 18, color: "#e07a7a" },
    { type: "doodle", doodle: "squiggle", x: "15%", y: "68%", rotation: -2, opacity: 0.2, color: "#8fbc8f" },
    { type: "doodle", doodle: "arrow", x: "60%", y: "72%", rotation: -10, opacity: 0.18, doodleSize: 32, color: "#c9a960" },

    // Text fragments — with color
    { type: "text", text: "breathe...", x: "62%", y: "52%", rotation: -1.5, fontSize: "1.05rem", opacity: 0.28, font: "hand", color: "#8fbc8f" },
    { type: "text", text: "keep going", x: "18%", y: "62%", rotation: 2, fontSize: "0.8rem", opacity: 0.22, strikethrough: true, font: "sketch", color: "#a0907d" },
    { type: "text", text: "it's okay", x: "50%", y: "88%", rotation: -0.8, fontSize: "0.85rem", opacity: 0.25, font: "hand", color: "#c4886b" },
    { type: "text", text: "pelan-pelan", x: "65%", y: "60%", rotation: 1.2, fontSize: "0.7rem", opacity: 0.2, font: "sketch", color: "#7aaccf" },
    { type: "text", text: "·  ·  ·", x: "40%", y: "70%", rotation: 0, fontSize: "0.9rem", opacity: 0.15, font: "hand", color: "#d4849a" },
];

const DoodleRenderer = ({ item }: { item: ScatteredItem }) => {
    const size = item.doodleSize || 24;
    switch (item.doodle) {
        case "star": return <DoodleStar size={size} />;
        case "moon": return <DoodleMoon size={size} />;
        case "coffee": return <DoodleCoffee size={size} />;
        case "flower": return <DoodleFlower size={size} />;
        case "cloud": return <DoodleCloud size={size} />;
        case "heart": return <DoodleHeart size={size} />;
        case "squiggle": return <SquigglyLine width={50} />;
        case "arrow": return <DoodleArrow size={size} />;
        default: return null;
    }
};

export function ScatteredText() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden"
        }}>
            {ITEMS.map((item, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: item.x,
                        top: item.y,
                        transform: `rotate(${item.rotation}deg)`,
                        opacity: item.opacity,
                        color: item.color || "var(--ink-primary, #2c2420)",
                        userSelect: "none",
                        animation: `journal-fade-in 2s ease ${0.5 + i * 0.2}s both`
                    }}
                >
                    {item.type === "doodle" ? (
                        <DoodleRenderer item={item} />
                    ) : (
                        <span
                            className={item.font === "hand" ? "font-journal-hand" : "font-journal-sketch"}
                            style={{
                                fontSize: item.fontSize || "0.9rem",
                                textDecoration: item.strikethrough ? "line-through" : "none",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {item.text}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
