"use client";

import { useState, useEffect, useRef } from "react";

const playlist = [
    "Sally Sendiri — Noah",
    "Kukatakan Dengan Indah — Noah",
    "Andaikan Kau Datang — Noah",
    "Jalani Mimpi — Noah",
];

// Subtle quotes — life philosophy with hidden depth, not sadboy
const vibes = [
    "Beberapa hal terbaik datang dari kebetulan yang tidak direncanakan.",
    "Waktu tidak mengulang, tapi mengajarkan.",
    "Ada keindahan di cerita yang tidak dilanjutkan.",
    "Tidak semua yang berharga harus dimiliki.",
    "Kadang jarak adalah bentuk penghormatan.",
    "Yang penting bukan apa yang terjadi, tapi apa yang kamu pelajari.",
    "Ada orang yang datang untuk mengajarkan, bukan untuk tinggal.",
    "Hidup terlalu singkat untuk tidak jujur pada diri sendiri.",
    "Beberapa pintu tertutup agar kamu temukan jendela.",
    "Masa lalu adalah guru, bukan penjara.",
    "Tidak semua perjalanan harus sampai tujuan.",
    "Ada yang lebih indah dari jawaban: pertanyaan yang tepat.",
    "Keberanian bukan tidak takut, tapi tetap melangkah.",
    "Setiap orang membawa cerita yang tidak kita ketahui.",
    "Sederhana itu pilihan, bukan keterbatasan.",
];

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
function ContinuousMarquee({ items }: { items: { icon: string; label: string; text: string }[] }) {
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
                    <div key={`o-${i}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                    <div key={`d-${i}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

export function CurrentlyStrip() {
    const [songIndex, setSongIndex] = useState(0);
    const [vibeIndex, setVibeIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [mood, setMood] = useState("");
    const [isVibeFading, setIsVibeFading] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Derived values
    const currentSong = playlist[songIndex % playlist.length] || playlist[0];
    const currentVibe = vibes[vibeIndex % vibes.length] || vibes[0];

    // Status items for the marquee
    const statusItems = [
        { icon: "♪", label: "Listening", text: currentSong },
        { icon: "◎", label: "Time", text: currentTime },
        { icon: "⚡", label: "Mood", text: mood },
    ];

    useEffect(() => {
        setSongIndex(Math.floor(Math.random() * playlist.length));
        setVibeIndex(Math.floor(Math.random() * vibes.length));
        setIsHydrated(true);

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
            setMood(getMood(now.getHours()));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        const songInterval = setInterval(() => {
            setSongIndex((prev) => (prev + 1) % playlist.length);
        }, 180000); // 3 mins

        // Rotate vibes every 10 seconds with fade
        const vibeInterval = setInterval(() => {
            setIsVibeFading(true);
            setTimeout(() => {
                setVibeIndex((prev) => (prev + 1) % vibes.length);
                setIsVibeFading(false);
            }, 500); // Wait for fade out
        }, 10000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(songInterval);
            clearInterval(vibeInterval);
        };
    }, []);

    if (!isHydrated) return null;

    return (
        <div style={{
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
            >
                <ContinuousMarquee items={statusItems} />
            </div>

            {/* Bottom: Vibe / Quote with Fade Animation */}
            <div
                style={{
                    height: "2rem", // Fixed height to prevent layout shift
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "0.95rem",
                        color: "var(--text-muted)",
                        textAlign: "center",
                        maxWidth: "60ch",
                        margin: 0,
                        opacity: isVibeFading ? 0 : 1,
                        transform: isVibeFading ? "translateY(5px)" : "translateY(0)",
                        transition: "all 0.5s ease-in-out"
                    }}
                >
                    "{currentVibe}"
                </p>
            </div>
        </div>
    );
}
