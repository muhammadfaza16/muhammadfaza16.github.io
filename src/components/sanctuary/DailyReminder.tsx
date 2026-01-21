"use client";

import { useState, useEffect } from "react";
import { Sun } from "lucide-react";
import { useSanctuary } from "@/components/sanctuary/SanctuaryContext";

const REMINDERS = [
    "Hari ini, cukup jadi dirimu. Itu udah lebih dari cukup.",
    "Kalau capek, istirahat. Bukan menyerah, tapi sayang diri.",
    "Kamu nggak harus punya semua jawaban hari ini.",
    "Minum air. Tarik napas. Kamu lagi baik-baik aja.",
    "Progress kecil tetap progress. Jangan remehkan langkahmu.",
    "Hari ini belum selesai, tapi kamu udah sampai sini. Itu keren.",
    "Nggak semua beban harus kamu pikul sendiri.",
    "Apapun yang terjadi kemarin, hari ini halaman baru.",
    "Kamu lebih kuat dari keraguan di kepalamu.",
    "Santai. Dunia nggak akan runtuh kalau kamu istirahat sebentar.",
    "Seseorang di luar sana lagi mikirin kamu dengan hangat.",
    "Kamu berhak punya hari yang tenang.",
    "Nggak apa-apa kalau hari ini cuma survival mode.",
    "Kebaikanmu itu dilihat, meski kamu nggak sadar.",
    "Jangan lupa makan, ya. Serius.",
    "Kamu udah melewati 100% hari-hari terberatmu.",
    "Hari ini, izinkan dirimu untuk nggak sempurna.",
    "Napas dalam. Kamu aman di sini.",
    "Kadang, sekadar 'masih ada' itu udah pencapaian.",
    "Kamu pantas dirawat dengan lembut. Terutama oleh dirimu.",
    "Apapun yang kamu rasakan sekarang, itu valid.",
    "Slow down. Nggak ada yang ngejar kamu.",
    "Kamu boleh senang tanpa merasa bersalah.",
    "Hari ini, fokus ke satu hal aja. Sisanya bisa nanti.",
    "Terima kasih udah bertahan sampai hari ini.",
    "Kamu nggak harus selalu kuat. Boleh lembek sesekali.",
    "Ingat: badai pasti berlalu. Kamu pernah buktikan itu.",
    "Self-compassion bukan kelemahan, itu wisdom.",
    "Kamu udah cukup. Sejak dulu, sebenernya.",
    "Hari ini, semoga ada hal kecil yang bikin kamu senyum.",
    "Istirahat bukan reward, tapi kebutuhan."
];

export function DailyReminder() {
    const { dailyQuoteIndex, refreshDailyQuote } = useSanctuary();

    useEffect(() => {
        refreshDailyQuote(REMINDERS.length);
    }, [refreshDailyQuote]);

    const reminder = REMINDERS[dailyQuoteIndex] || REMINDERS[0];

    return (
        <div style={{
            position: "relative",
            // @ts-ignore
            "--widget-accent": "#10b981" // Emerald
        } as React.CSSProperties}>
            <div style={{
                borderRadius: "1.5rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                transition: "all 0.5s ease"
            }}>
                {/* Bloom Effect */}
                <div style={{
                    position: "absolute",
                    inset: "0",
                    background: `radial-gradient(circle at 50% 50%, var(--widget-accent), transparent 70%)`,
                    opacity: 0.08,
                    zIndex: 0,
                    transition: "background 0.5s ease"
                }} />

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    position: "relative",
                    zIndex: 1
                }}>
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        border: "1px solid var(--widget-accent)",
                        background: "rgba(var(--background-rgb), 0.5)"
                    }}>
                        <Sun style={{ width: "12px", height: "12px", color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Pengingat Hari Ini
                        </span>
                    </span>
                </div>

                {/* Reminder Content */}
                <div style={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                    padding: "1rem 0"
                }}>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                        lineHeight: 1.5,
                        color: "var(--foreground)",
                        fontStyle: "italic"
                    }}>
                        "{reminder}"
                    </p>
                </div>
            </div>
        </div>
    );
}
