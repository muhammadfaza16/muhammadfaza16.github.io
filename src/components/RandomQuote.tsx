"use client";

import { useState } from "react";

const quotes = [
    // Original quotes
    { text: "Lo nggak harus selalu produktif. Kadang cukup survive aja udah achievement.", author: "Reality Check" },
    { text: "Orang lain udah sukses? Bagus. Lo juga lagi di jalan lo sendiri.", author: "Santai Aja" },
    { text: "Gagal itu normal. Yang nggak normal itu nyerah sebelum nyoba.", author: "Common Sense" },
    { text: "Overthinking nggak bikin masalah selesai, cuma bikin kepala pusing.", author: "Been There" },
    { text: "Healing nggak harus mahal. Kadang cukup tidur cukup.", author: "Simple Truth" },
    { text: "Comparison is the thief of joy. Fokus sama progress lo sendiri.", author: "Wisdom" },
    { text: "Nggak semua orang harus ngerti lo. Yang penting lo ngerti diri sendiri.", author: "Self Care" },
    { text: "Burnout bukan badge of honor. Istirahat itu penting.", author: "Mental Health 101" },
    { text: "Sometimes the best decision is no decision. Biarkan waktu yang jawab.", author: "Patience" },
    { text: "Lo nggak harus punya semua jawaban sekarang. It's okay to figure it out.", author: "Life Lesson" },
    { text: "Toxic positivity itu real. It's okay to not be okay.", author: "Honest Truth" },
    { text: "Umur 20-an itu masa bingung. Semua orang juga sama kok.", author: "Quarter Life" },
    { text: "Jangan terlalu keras sama diri sendiri. Lo udah cukup berusaha.", author: "Self Compassion" },
    { text: "Yang penting konsisten, bukan perfect. Progress over perfection.", author: "Growth Mindset" },
    { text: "Nggak semua yang terlihat sukses itu bahagia. Jangan ketipu highlight reel.", author: "Social Media Truth" },

    // New quotes - Career & Work
    { text: "Passion itu ketemu, bukan ditunggu. Coba dulu baru tau.", author: "Career Advice" },
    { text: "Gaji gede tapi mental breakdown? Worth it nggak tuh?", author: "Work-Life Balance" },
    { text: "Skill bisa dipelajari. Attitude susah diubah.", author: "HR Wisdom" },
    { text: "Network itu penting, tapi jangan fake. Orang bisa bedain.", author: "Networking 101" },
    { text: "Resign bukan berarti kalah. Kadang itu self-respect.", author: "Know Your Worth" },

    // New quotes - Relationships
    { text: "Nggak semua hubungan harus dipertahankan. Some people are lessons.", author: "Moving On" },
    { text: "Red flag itu gratis. Lo yang milih buat ignore.", author: "Dating Truth" },
    { text: "Quality over quantity. Mending 3 temen beneran daripada 100 kenalan.", author: "Friendship" },
    { text: "Lo nggak bisa fix orang yang nggak mau diperbaiki.", author: "Hard Lesson" },
    { text: "Boundaries bukan berarti egois. Itu self-preservation.", author: "Healthy Mind" },

    // New quotes - Growth & Learning
    { text: "Malu bertanya sesat di jalan. Malu nyoba sesat selamanya.", author: "Just Do It" },
    { text: "Belajar dari kesalahan orang lain lebih murah daripada bikin sendiri.", author: "Smart Move" },
    { text: "Comfort zone itu nyaman, tapi nothing grows there.", author: "Growth Zone" },
    { text: "Investasi terbaik itu di diri sendiri. ROI-nya seumur hidup.", author: "Self Investment" },
    { text: "Buku bagus itu murah. Pengalaman mahal. Kebodohan lebih mahal lagi.", author: "Knowledge" },

    // New quotes - Money & Life
    { text: "Uang bukan segalanya, tapi nggak punya uang juga ribet.", author: "Financial Reality" },
    { text: "Gaya hidup naik, income tetap? Recipe for disaster.", author: "Money Sense" },
    { text: "Nabung itu bukan sisa, tapi prioritas.", author: "Saving 101" },
    { text: "Flexing buat impress orang yang nggak peduli? Buat apa?", author: "Real Talk" },
    { text: "Kebutuhan vs keinginan. Dua hal yang sering ketuker.", author: "Spending Wisdom" },

    // New quotes - Mindset
    { text: "Lo adalah rata-rata dari 5 orang terdekat lo. Pilih circle dengan bijak.", author: "Environment" },
    { text: "Takut gagal itu normal. Takut nyoba itu yang bahaya.", author: "Courage" },
    { text: "Busy bukan berarti produktif. Banyak gerak belum tentu maju.", author: "Efficiency" },
    { text: "Opini orang tentang lo bukan urusan lo.", author: "Peace of Mind" },
    { text: "Yesterday is history, tomorrow is mystery. Fokus ke today.", author: "Present Moment" },

    // New quotes - Life Philosophy
    { text: "Hidup itu pendek buat drama yang nggak perlu.", author: "Keep It Simple" },
    { text: "Nggak semua pertarungan harus dimenangkan. Pilih yang worth it.", author: "Pick Your Battles" },
    { text: "Sabar itu bukan pasrah. Itu strategi.", author: "Patience 2.0" },
    { text: "Kebahagiaan itu inside job. Bukan dari external validation.", author: "Inner Peace" },
    { text: "Hidup nggak harus selalu meaningful. Kadang cukup enjoyable.", author: "Lighten Up" },
];

export function RandomQuote() {
    const [quote, setQuote] = useState<typeof quotes[0] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const getRandomQuote = () => {
        setIsAnimating(true);

        // Shuffle animation effect
        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[randomIndex]);
            shuffleCount++;

            if (shuffleCount >= 8) {
                clearInterval(shuffleInterval);
                setIsAnimating(false);
            }
        }, 80);
    };

    return (
        <div style={{
            maxWidth: "42rem",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1
        }} className="animate-fade-in">
            <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                marginBottom: "1rem",
                color: "white"
            }}>
                🎲 Wisdom Gacha
            </h2>
            <p style={{
                fontSize: "1rem",
                opacity: 0.7,
                marginBottom: "2rem",
                fontWeight: 300,
                lineHeight: 1.7
            }}>
                Butuh reminder random buat hari ini? Tekan tombol di bawah.
            </p>

            {/* Quote Display */}
            <div style={{
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
                padding: "1.5rem",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
            }}>
                {quote ? (
                    <div style={{
                        opacity: isAnimating ? 0.5 : 1,
                        transition: "opacity 0.2s ease"
                    }}>
                        <p style={{
                            fontSize: "1.25rem",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                            marginBottom: "0.75rem",
                            color: "white"
                        }}>
                            "{quote.text}"
                        </p>
                        <p style={{
                            fontSize: "0.875rem",
                            opacity: 0.6
                        }}>
                            — {quote.author}
                        </p>
                    </div>
                ) : (
                    <p style={{ opacity: 0.5, fontStyle: "italic" }}>
                        Tekan tombol untuk dapat quote...
                    </p>
                )}
            </div>

            {/* Button */}
            <button
                onClick={getRandomQuote}
                disabled={isAnimating}
                style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "1rem 2rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderRadius: "50px",
                    border: "none",
                    cursor: isAnimating ? "wait" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: isAnimating ? 0.7 : 1,
                    transform: isAnimating ? "scale(0.98)" : "scale(1)"
                }}
                className="hover:opacity-90 active:scale-95"
            >
                {isAnimating ? "🎰 Rolling..." : "✨ I'm Feeling Lucky"}
            </button>
        </div>
    );
}
