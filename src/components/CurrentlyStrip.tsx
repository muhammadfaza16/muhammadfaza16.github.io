"use client";

import { useState, useEffect, useRef } from "react";

const playlist = [
    {
        title: "The Man Who Can't Be Moved — The Script",
        audioUrl: "/audio/the-man-who-cant-be-moved.mp3",
    }
];

// const playlist = [
//     {
//         title: "Sally Sendiri — Noah",
//         lyrics: [
//             "Biar Sally mencariku...",
//             "Biarkan dia terbang jauh...",
//             "Dalam hatinya hanya satu...",
//             "Jauh hatinya hanya ku..."
//         ]
//     },
//     {
//         title: "Kukatakan Dengan Indah — Noah",
//         lyrics: [
//             "Kukatakan dengan indah...",
//             "Dengan terluka hatiku hampa...",
//             "Sepertinya luka menghampirinya...",
//             "Kau beri rasa yang berbeda..."
//         ]
//     },
//     {
//         title: "Andaikan Kau Datang — Noah",
//         lyrics: [
//             "Terlalu indah dilupakan...",
//             "Terlalu sedih dikenangkan...",
//             "Setelah aku jauh berjalan...",
//             "Dan kau kutinggalkan..."
//         ]
//     },
//     {
//         title: "Jalani Mimpi — Noah",
//         lyrics: [
//             "Ingatlah dikala engkau sanggup...",
//             "Melihat matahari...",
//             "Hangatnya masih terbawa...",
//             "Untuk melangkah hari ini..."
//         ]
//     },
// ];

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getMood(hour: number): string {
    if (hour >= 5 && hour < 8) return "sedang mengumpulkan nyawa";
    if (hour >= 8 && hour < 11) return "pura-pura produktif";
    if (hour >= 11 && hour < 13) return "butuh asupan kafein";
    if (hour >= 13 && hour < 15) return "melawan kantuk pasca-makan";
    if (hour >= 15 && hour < 18) return "mengejar deadline (atau senja)";
    if (hour >= 18 && hour < 21) return "rebahan is my passion";
    if (hour >= 21 && hour < 23) return "overthinking mode: on";
    if (hour >= 23 || hour < 2) return "tersesat di YouTube";
    return "zombie mode activated";
}

// Helper for the continuous marquee
function ContinuousMarquee({ items }: { items: { icon: React.ReactNode; label: string; text: string; onClick?: () => void; className?: string }[] }) {
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
                animation: "marquee 10s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <div
                        key={`o-${i}`}
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
                        <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{item.text}</span>
                    </div>
                ))}
            </div>
            {/* Duplicate for infinite loop */}
            <div style={{
                display: "flex",
                gap: "3rem",
                animation: "marquee 10s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <div
                        key={`d-${i}`}
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
                        <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useTheme } from "./ThemeProvider";

// ... (existing code)

export function CurrentlyStrip() {
    const [songIndex, setSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [mood, setMood] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Theme integration
    const { theme, setTheme } = useTheme();
    const wasSwitchedRef = useRef(false);

    // Audio ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Melancholy Mode Effect
    useEffect(() => {
        if (isPlaying && setTheme) {
            if (theme === "light") {
                setTheme("dark");
                wasSwitchedRef.current = true;
            }
        } else if (setTheme) {
            // When paused/stopped, revert only if we switched it
            if (wasSwitchedRef.current) {
                setTheme("light");
                wasSwitchedRef.current = false;
            }
        }
    }, [isPlaying, theme, setTheme]);

    // Derived values
    const currentSong = playlist[songIndex % playlist.length] || playlist[0];

    // Toggle Play
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

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
        { icon: "⚡", label: "Mood", text: mood },
    ];

    useEffect(() => {
        setSongIndex(Math.floor(Math.random() * playlist.length));
        setIsHydrated(true);

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
            setMood(getMood(now.getHours()));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        const songInterval = setInterval(() => {
            setSongIndex((prev) => {
                const nextIndex = (prev + 1) % playlist.length;
                return nextIndex;
            });
        }, 180000); // 3 mins

        return () => {
            clearInterval(timeInterval);
            clearInterval(songInterval);
        };
    }, []);

    // Handle song change effect ... (same as before)
    useEffect(() => {
        if (audioRef.current && currentSong.audioUrl) {
            const currentSrc = audioRef.current.src;
            if (!currentSrc.includes(currentSong.audioUrl)) {
                audioRef.current.src = currentSong.audioUrl;
                audioRef.current.load();

                if (isPlaying) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            if (e.name !== 'AbortError') {
                                console.error("Auto-play failed:", e);
                                setIsPlaying(false);
                            }
                        });
                    }
                }
            }
        }
    }, [currentSong, isPlaying]);

    if (!isHydrated) return null;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: "1rem"
        }}>
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                    console.error("Audio error:", e);
                    setIsPlaying(false);
                }}
            />

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
                <ContinuousMarquee items={statusItems} />
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <p
                        key={isPlaying ? "playing" : "idle"}
                        className="animate-fade-in"
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: "0.95rem",
                            color: "var(--text-muted)",
                            margin: 0
                        }}
                    >
                        {isPlaying ? "selamat menikmati, nona cantik!" : "Mainkan"}
                    </p>
                    <button
                        onClick={togglePlay}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            transition: "opacity 0.2s ease",
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        className="hover:opacity-100"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>
                </div>
            </div>
        </div>
    );
}
