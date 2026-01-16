"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "./AudioContext";
import { Shuffle } from "lucide-react";

// Derived values from context now
// const playlist removed as it is handled by context for the active song

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getMoods(hour: number): string[] {
    if (hour >= 5 && hour < 8) return ["morning glow & missing u", "coffee first, you second", "sunrise kinda vibe"];
    if (hour >= 8 && hour < 11) return ["pretending to work, thinking of u", "email fatigue", "counting down to lunch"];
    if (hour >= 11 && hour < 14) return ["craving attention (and lunch)", "halfway through", "fueling up"];
    if (hour >= 14 && hour < 17) return ["sleepy eyes, dreamy mind", "afternoon slump hitting", "need a treat"];
    if (hour >= 17 && hour < 19) return ["golden hour lookin' at u", "chasing sunsets", "finally free"];
    if (hour >= 19 && hour < 22) return ["saving my battery for u", "scrolling paralysis", "winding down"];
    if (hour >= 22 || hour < 2) return ["romanticizing us rn", "overthinking hours", "moonchild mode"];
    return ["dreaming of u. shh.", "3am thoughts", "why am i awake?"];
}

// Smooth text transition component
function AnimatedText({ text, className }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [opacity, setOpacity] = useState(1);
    const [width, setWidth] = useState<number | "auto">("auto");
    const containerRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (text === displayText) return;

        // Start fade out
        setOpacity(0);

        const timer = setTimeout(() => {
            setDisplayText(text);
            setOpacity(1);
        }, 200); // 200ms fade out

        return () => clearTimeout(timer);
    }, [text, displayText]);

    return (
        <span
            className={className}
            style={{
                opacity: opacity,
                transition: "opacity 0.2s ease-in-out",
                display: "inline-block",
                whiteSpace: "nowrap"
            }}
        >
            {displayText}
        </span>
    );
}

// Individual Marquee Item with Visibility Tracking
function MarqueeItem({ item, id, onVisibilityChange }: {
    item: { icon: React.ReactNode; label: string; text: string; onClick?: () => void; className?: string };
    id: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
}) {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only observe "Checking in" items
        if (item.label !== "Checking in") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                onVisibilityChange(id, entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, [id, item.label, onVisibilityChange]);

    return (
        <div
            ref={itemRef}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: item.onClick ? "pointer" : "default",
                ... (item.onClick ? { userSelect: "none" } : {})
            }}
            onClick={item.onClick}
            className={item.className}
        >
            <span style={{ color: "var(--accent)" }}>{item.icon}</span>
            <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.7
            }}>
                {item.label}:
            </span>
            <AnimatedText
                text={item.text}
                className={item.className} // Pass class if needed
            />
        </div>
    );
}

// Helper for the continuous marquee
function ContinuousMarquee({ items, onVisibilityChange }: {
    items: { icon: React.ReactNode; label: string; text: string; onClick?: () => void; className?: string }[];
    onVisibilityChange: (id: string, isVisible: boolean) => void;
}) {
    return (
        <div style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
        }}>
            <div style={{
                display: "flex",
                gap: "3rem",
                animation: "marquee 25s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <MarqueeItem
                        key={`o-${i}`}
                        id={`o-${i}`}
                        item={item}
                        onVisibilityChange={onVisibilityChange}
                    />
                ))}
            </div>
            {/* Duplicate for infinite loop */}
            <div style={{
                display: "flex",
                gap: "3rem",
                animation: "marquee 25s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <MarqueeItem
                        key={`d-${i}`}
                        id={`d-${i}`}
                        item={item}
                        onVisibilityChange={onVisibilityChange}
                    />
                ))}
            </div>
        </div>
    );
}

function getCheckInMessages(hour: number): string[] {
    // 05:00 - 10:59 (Morning)
    if (hour >= 5 && hour < 11) {
        return [
            "Morning, sunshine ☀️",
            "Jangan skip sarapan ya, nanti lemes.",
            "Semangat hari ini, aku pantau dari jauh 👀",
            "Sending u good energy ✨",
            "Hope your coffee hits right today."
        ];
    }
    // 11:00 - 14:59 (Mid-day / Lunch)
    if (hour >= 11 && hour < 15) {
        return [
            "Jangan lupa makan siang, manis.",
            "Minum air putih yg banyak 💧",
            "Power nap bentar gih kalau capek.",
            "Thinking of you in the middle of chaos.",
            "Coba senyum dikit dong :)"
        ];
    }
    // 15:00 - 18:59 (Afternoon)
    if (hour >= 15 && hour < 19) {
        return [
            "Masih semangat kan kerjanya?",
            "Udah sore, jangan lembur teuing.",
            "Counting down to freedom (and u).",
            "Baterai sosial aman?",
            "Take a deep breath. You got this."
        ];
    }
    // 19:00 - 22:59 (Evening)
    if (hour >= 19 && hour < 23) {
        return [
            "Gimana harinya? Cerita dong.",
            "Mandi air anget enak kayaknya.",
            "Proud of you today.",
            "Rest well, you did great.",
            "Dunia lagi berisik? Istirahat sini dulu."
        ];
    }
    // 23:00 - 04:59 (Late Night)
    return [
        "Kok belum tidur? Kangen ya?",
        "Sleep tight, mimpi indah 🌙",
        "Jangan begadang, nanti sakit.",
        "Matikan hp, pejamkan mata.",
        "Dreaming of u. Shh."
    ];
}

export function CurrentlyStrip() {
    const [currentTime, setCurrentTime] = useState("");
    const [moods, setMoods] = useState<string[]>([]);
    const [moodIndex, setMoodIndex] = useState(0);
    const [checkInIndex, setCheckInIndex] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const [currentHour, setCurrentHour] = useState(new Date().getHours());

    // Global Audio Context
    const { isPlaying, togglePlay, currentSong, isShuffle, toggleShuffle } = useAudio();

    const checkInMessages = getCheckInMessages(currentHour);

    // Status items for the marquee
    const statusItems = [
        {
            icon: isPlaying ? "⏸" : "▶",
            label: isPlaying ? "Playing" : "Paused",
            text: currentSong.title,
            onClick: togglePlay,
            className: "hover:opacity-80 transition-opacity"
        },
        { icon: "◎", label: "Time", text: currentTime },
        { icon: "⚡", label: "Mood", text: moods[moodIndex % moods.length] || "" },
        { icon: "💌", label: "Checking in", text: checkInMessages[checkInIndex % checkInMessages.length] },
    ];

    // Tracker for checking-in visibility
    const visibleCheckIns = useRef(new Set<string>());

    const handleVisibilityChange = (id: string, isVisible: boolean) => {
        if (isVisible) {
            visibleCheckIns.current.add(id);
        } else {
            visibleCheckIns.current.delete(id);
        }
    };

    useEffect(() => {
        setIsHydrated(true);

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
            const h = now.getHours();
            setMoods(getMoods(h));
            setCurrentHour(h);
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Rotate check-in AND mood message every 10 seconds
        // "Rolling stock" effect
        const contentRotationInterval = setInterval(() => {
            setCheckInIndex((prev) => prev + 1);
            setMoodIndex((prev) => prev + 1);
        }, 10000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(contentRotationInterval);
        };
    }, []);

    if (!isHydrated) return null;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "1rem"
            }}>

            {/* Top: Marquee Pill */}
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "99px",
                    backgroundColor: "rgba(var(--background-rgb), 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    letterSpacing: "0.02em",
                    width: "clamp(300px, 90vw, 600px)",
                    overflow: "hidden"
                }}
                className="pause-on-hover"
            >
                <ContinuousMarquee items={statusItems} onVisibilityChange={handleVisibilityChange} />
            </div>

            {/* Bottom: Play Control */}
            <div
                style={{
                    height: "2rem", // Fixed height to prevent layout shift
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div
                    onClick={togglePlay}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                    className="group"
                >
                    <p
                        key={isPlaying ? "playing" : "idle"}
                        className="animate-fade-in group-hover:opacity-80 transition-opacity"
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: "0.95rem",
                            color: "var(--text-muted)",
                            margin: 0
                        }}
                    >
                        {isPlaying ? "Khusus buat kamu 🥀" : "Ada lagu buat kamu ✨"}
                    </p>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleShuffle();
                        }}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            color: currentSong ? (isShuffle ? "var(--accent)" : "var(--text-muted)") : "var(--text-muted)",
                            opacity: isShuffle ? 1 : 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease"
                        }}
                        className="hover:opacity-100"
                        title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                    >
                        <Shuffle size={14} />
                    </div>

                    <button
                        style={{
                            all: "unset",
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            transition: "opacity 0.2s ease",
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        className="group-hover:opacity-100"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>
                </div>
            </div>
        </div>
    );
}
