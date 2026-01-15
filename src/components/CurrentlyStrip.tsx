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
    if (hour >= 5 && hour < 9) return "loading...";
    if (hour >= 9 && hour < 12) return "in focus mode";
    if (hour >= 12 && hour < 14) return "recharging";
    if (hour >= 14 && hour < 17) return "deep in work";
    if (hour >= 17 && hour < 20) return "winding down";
    if (hour >= 20 && hour < 23) return "reflective";
    return "in night mode";
}

export function CurrentlyStrip() {
    const [songIndex, setSongIndex] = useState(() =>
        Math.floor(Math.random() * playlist.length)
    );
    const [vibeIndex, setVibeIndex] = useState(() =>
        Math.floor(Math.random() * vibes.length)
    );
    const [currentTime, setCurrentTime] = useState("");
    const [mood, setMood] = useState("");
    const [activeSlide, setActiveSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const slideRef = useRef(0);

    useEffect(() => {
        // Update time and mood
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
            setMood(getMood(now.getHours()));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Rotate songs every 3 minutes (more realistic)
        const songInterval = setInterval(() => {
            setSongIndex((prev) => (prev + 1) % playlist.length);
        }, 3 * 60 * 1000);

        // Rotate slides every 5 seconds with gentle crossfade
        const slideInterval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveSlide((prev) => {
                    const next = (prev + 1) % 4;
                    slideRef.current = next;

                    // Only change vibe when transitioning TO the quote slide (index 3)
                    if (next === 3) {
                        setVibeIndex((v) => (v + 1) % vibes.length);
                    }

                    return next;
                });
                setIsTransitioning(false);
            }, 400);
        }, 5000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(songInterval);
            clearInterval(slideInterval);
        };
    }, []);

    const currentSong = playlist[songIndex % playlist.length] || playlist[0];
    const currentVibe = vibes[vibeIndex % vibes.length] || vibes[0];

    // Four ambient messages that rotate: Song → Time → Mood → Quote
    const slides = [
        `♪ ${currentSong}`,
        currentTime,
        mood,
        `"${currentVibe}"`,
    ];

    return (
        <div
            style={{
                padding: "0.75rem 0",
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.02em",
                position: "relative",
                overflow: "hidden",
                height: "2rem",
            }}
        >
            {/* Single line, crossfade between slides */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? "translateY(-4px)" : "translateY(0)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
            >
                {slides[activeSlide]}
            </div>
        </div>
    );
}

