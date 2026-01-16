"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "./AudioContext";
import { Shuffle, SkipForward } from "lucide-react";

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
    if (hour >= 5 && hour < 8) return ["lowkey missing u", "kangen dikit (banyak)", "woke up smiling"];
    if (hour >= 8 && hour < 11) return ["distracted by u", "nungguin chat kamu", "kerja rasa rindu"];
    if (hour >= 11 && hour < 14) return ["butuh asupan (kamu)", "halfway to seeing u", "makan siang bareng yuk?"];
    if (hour >= 14 && hour < 17) return ["daydreaming rn", "bengong mikirin kamu", "afternoon slump < u"];
    if (hour >= 17 && hour < 19) return ["golden hour < u", "pengen telponan", "finally free (for u)"];
    if (hour >= 19 && hour < 22) return ["lagi dengerin lagu kita", "scrolling tapi kangen", "winding down w/ u on my mind"];
    if (hour >= 22 || hour < 2) return ["up thinking about us", "belum bobo?", "moonchild missing sun"];
    return ["dreaming of u. shh.", "3am thoughts of u", "kenapa belum tidur? (mikirin u)"];
}

// Smooth text transition component
function AnimatedText({ text, className }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [opacity, setOpacity] = useState(1);
    const [width, setWidth] = useState<number | "auto">("auto");
    const measureRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Initial measurement
        if (measureRef.current && width === "auto") {
            setWidth(measureRef.current.offsetWidth);
        }
    }, []);

    useEffect(() => {
        if (text === displayText) return;

        // 1. Fade out
        setOpacity(0);

        // 2. Measure new width immediately (measureRef has the new 'text')
        // We need a slight delay or force layout to ensure measureRef has updated?
        // Actually react renders measureRef with new `text` implicitly because we render `text` in it below.
        // But we need to wait for that render.
        // We can do this in a separate effect or just assume measuring works if we use a layout effect or similar?
        // Simpler: Set width inside the timeout? No, we want width to animate WITH the fade.

        // Let's use a small timeout to allow measuring the new text in the hidden span
        const measureTimer = setTimeout(() => {
            if (measureRef.current) {
                setWidth(measureRef.current.offsetWidth);
            }
        }, 0);

        // 3. Update Text after fade out
        const textTimer = setTimeout(() => {
            setDisplayText(text);
            setOpacity(1);
        }, 200); // 200ms match transition

        return () => {
            clearTimeout(measureTimer);
            clearTimeout(textTimer);
        };
    }, [text, displayText]);

    return (
        <span
            className={className}
            style={{
                display: "inline-flex", // Flex helps with width transition
                width: width === "auto" ? "auto" : `${width}px`,
                transition: "width 0.3s ease-in-out, opacity 0.2s ease-in-out",
                opacity: opacity,
                whiteSpace: "nowrap",
                overflow: "hidden", // Hide outgoing text if shrinking
                verticalAlign: "bottom", // Align properly
                position: "relative"
            }}
        >
            {/* Visible Text */}
            {displayText}

            {/* Hidden Measurement Span - Always renders the *target* text (prop) */}
            <span
                ref={measureRef}
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    height: 0,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    // Ensure it uses same font styling as parent
                    font: "inherit",
                    letterSpacing: "inherit",
                    textTransform: "inherit"
                }}
            >
                {text}
            </span>
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
            {[0, 1, 2, 3].map((key) => (
                <div
                    key={key}
                    style={{
                        display: "flex",
                        gap: "3rem",
                        animation: "marquee 25s linear infinite",
                        paddingRight: "3rem",
                        flexShrink: 0
                    }}
                >
                    {items.map((item, i) => (
                        <MarqueeItem
                            key={`${key}-${i}`}
                            id={`${key}-${i}`}
                            item={item}
                            onVisibilityChange={onVisibilityChange}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function getCheckInMessages(hour: number): string[] {
    // 05:00 - 10:59 (Morning)
    if (hour >= 5 && hour < 11) {
        return [
            "Morning. Mimpi aku ga?",
            "Hope ur day is as pretty as u.",
            "Semangat hari ini, aku pantau dari jauh 👀",
            "Sending u good energy (and a kiss) ✨",
            "Jangan lupa sarapan, manis."
        ];
    }
    // 11:00 - 14:59 (Mid-day / Lunch)
    if (hour >= 11 && hour < 15) {
        return [
            "Makan siang gih, jangan telat.",
            "Hydrate! (Send pic?) 💧",
            "Thinking of u at lunch.",
            "Bored? Gabut? Chat aku.",
            "Coba senyum dikit dong :)"
        ];
    }
    // 15:00 - 18:59 (Afternoon)
    if (hour >= 15 && hour < 19) {
        return [
            "Capek ya? Semangat kerjanya.",
            "Udah sore, jangan lembur teuing.",
            "Counting down to seeing u.",
            "Need a break? Call me.",
            "Take a deep breath. You got this."
        ];
    }
    // 19:00 - 22:59 (Evening)
    if (hour >= 19 && hour < 23) {
        return [
            "Cerita dong hari ini ngapain aja.",
            "Proud of u today.",
            "Wish u were here.",
            "Rest well, you did great.",
            "Dunia lagi berisik? Sini peluk."
        ];
    }
    // 23:00 - 04:59 (Late Night)
    return [
        "Bobo yuk, udah malem.",
        "Dream of me? Jk... unless?",
        "Miss u. G'night.",
        "Matikan hp, mimpikan aku.",
        "Jangan begadang, ga baik buat rindu."
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
    const { isPlaying, togglePlay, currentSong, isShuffle, toggleShuffle, nextSong } = useAudio();

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

        // Rotate check-in AND mood message every 20 seconds
        // "Rolling stock" effect
        const contentRotationInterval = setInterval(() => {
            setCheckInIndex((prev) => prev + 1);
            setMoodIndex((prev) => prev + 1);
        }, 20000);

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
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
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
                            margin: 0,
                            cursor: "pointer",
                            userSelect: "none"
                        }}
                        onClick={togglePlay}
                    >
                        {isPlaying ? "Khusus buat kamu 🥀" : "Ada lagu buat kamu ✨"}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "0.25rem" }}>
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
                                transition: "all 0.2s ease",
                                padding: "4px"
                            }}
                            className="hover:opacity-100"
                            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                        >
                            <Shuffle size={14} />
                        </div>

                        <button
                            onClick={togglePlay}
                            style={{
                                all: "unset",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                transition: "opacity 0.2s ease",
                                opacity: 0.7,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                                cursor: "pointer"
                            }}
                            className="group-hover:opacity-100"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? "⏸" : "▶"}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSong();
                            }}
                            style={{
                                all: "unset",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                transition: "opacity 0.2s ease",
                                opacity: 0.7,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                                cursor: "pointer"
                            }}
                            className="group-hover:opacity-100"
                            aria-label="Next Song"
                            title="Next Song"
                        >
                            <SkipForward size={14} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
