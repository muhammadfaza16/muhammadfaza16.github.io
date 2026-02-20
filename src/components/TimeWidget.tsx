"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function TimeWidget() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted || !time) {
        return (
            <div style={{ textAlign: "center", padding: "2rem", opacity: 0.5 }}>
                Loading time...
            </div>
        );
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Greeting based on time
    const getGreeting = () => {
        if (hours < 12) return "Selamat Pagi";
        if (hours < 15) return "Selamat Siang";
        if (hours < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    const getGreetingEmoji = () => {
        if (hours < 12) return "🌅";
        if (hours < 15) return "☀️";
        if (hours < 18) return "🌤️";
        return "🌙";
    };

    // Format time
    const formatTime = (n: number) => n.toString().padStart(2, "0");

    // Day of year
    const startOfYear = new Date(time.getFullYear(), 0, 0);
    const diff = time.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Week number
    const weekNumber = Math.ceil(dayOfYear / 7);

    // Format date
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayName = dayNames[time.getDay()];
    const monthName = monthNames[time.getMonth()];
    const dateString = `${dayName}, ${time.getDate()} ${monthName} ${time.getFullYear()}`;

    return (
        <div style={{
            padding: "3rem 0",
            textAlign: "center"
        }}>
            {/* Greeting */}
            <p style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                marginBottom: "0.5rem",
                letterSpacing: "0.05em"
            }}>
                {getGreetingEmoji()} {getGreeting()}
            </p>

            {/* Big Digital Clock */}
            <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(3rem, 10vw, 5rem)",
                fontWeight: 700,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                marginBottom: "0.5rem"
            }}>
                <span>{formatTime(hours)}</span>
                <span style={{ opacity: 0.5, animation: "pulse 1s ease-in-out infinite" }}>:</span>
                <span>{formatTime(minutes)}</span>
                <span style={{ opacity: 0.3 }}>:</span>
                <span style={{ opacity: 0.5, fontSize: "0.6em" }}>{formatTime(seconds)}</span>
            </div>

            {/* Date */}
            <p style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                marginBottom: "1.5rem"
            }}>
                {dateString}
            </p>

            {/* Quick Stats */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
                fontSize: "0.8rem",
                color: "var(--text-secondary)"
            }}>
                <span>📅 Hari ke-{dayOfYear}</span>
                <span>📆 Minggu ke-{weekNumber}</span>
                <span>🕐 WIB</span>
            </div>

            {/* Link to Time Page */}
            <Link
                href="/clock"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "999px",
                    backgroundColor: "var(--hover-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease"
                }}
                className="hover:opacity-80"
            >
                Lihat Detail Waktu →
            </Link>
        </div>
    );
}
