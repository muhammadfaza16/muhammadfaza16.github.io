"use client";

import { useState } from "react";

const quotes = [
    // Top tier - Best quotes (weight: 3)
    { text: "Lo nggak harus selalu produktif. Kadang cukup survive aja udah achievement.", author: "Reality Check", weight: 3 },
    { text: "Overthinking nggak bikin masalah selesai, cuma bikin kepala pusing.", author: "Been There", weight: 3 },
    { text: "Comparison is the thief of joy. Fokus sama progress lo sendiri.", author: "Wisdom", weight: 3 },
    { text: "Burnout bukan badge of honor. Istirahat itu penting.", author: "Mental Health 101", weight: 3 },
    { text: "Yang penting konsisten, bukan perfect. Progress over perfection.", author: "Growth Mindset", weight: 3 },
    { text: "Red flag itu gratis. Lo yang milih buat ignore.", author: "Dating Truth", weight: 3 },
    { text: "Comfort zone itu nyaman, tapi nothing grows there.", author: "Growth Zone", weight: 3 },
    { text: "Lo adalah rata-rata dari 5 orang terdekat lo. Pilih circle dengan bijak.", author: "Environment", weight: 3 },
    { text: "Sabar itu bukan pasrah. Itu strategi.", author: "Patience 2.0", weight: 3 },
    { text: "Small steps > Big plans that never happen.", author: "Action > Planning", weight: 3 },
    { text: "Hustle culture itu scam. Yang kaya makin kaya, yang capek makin capek.", author: "Wake Up Call", weight: 3 },
    { text: "FOMO itu racun. JOMO itu obat.", author: "Digital Detox", weight: 3 },
    { text: "Boundaries bukan berarti egois. Itu self-preservation.", author: "Healthy Mind", weight: 3 },

    // High tier - Great quotes (weight: 2)
    { text: "Orang lain udah sukses? Bagus. Lo juga lagi di jalan lo sendiri.", author: "Santai Aja", weight: 2 },
    { text: "Gagal itu normal. Yang nggak normal itu nyerah sebelum nyoba.", author: "Common Sense", weight: 2 },
    { text: "Healing nggak harus mahal. Kadang cukup tidur cukup.", author: "Simple Truth", weight: 2 },
    { text: "Nggak semua orang harus ngerti lo. Yang penting lo ngerti diri sendiri.", author: "Self Care", weight: 2 },
    { text: "Lo nggak harus punya semua jawaban sekarang. It's okay to figure it out.", author: "Life Lesson", weight: 2 },
    { text: "Toxic positivity itu real. It's okay to not be okay.", author: "Honest Truth", weight: 2 },
    { text: "Jangan terlalu keras sama diri sendiri. Lo udah cukup berusaha.", author: "Self Compassion", weight: 2 },
    { text: "Nggak semua yang terlihat sukses itu bahagia. Jangan ketipu highlight reel.", author: "Social Media Truth", weight: 2 },
    { text: "Passion itu ketemu, bukan ditunggu. Coba dulu baru tau.", author: "Career Advice", weight: 2 },
    { text: "Gaji gede tapi mental breakdown? Worth it nggak tuh?", author: "Work-Life Balance", weight: 2 },
    { text: "Skill bisa dipelajari. Attitude susah diubah.", author: "HR Wisdom", weight: 2 },
    { text: "Resign bukan berarti kalah. Kadang itu self-respect.", author: "Know Your Worth", weight: 2 },
    { text: "Nggak semua hubungan harus dipertahankan. Some people are lessons.", author: "Moving On", weight: 2 },
    { text: "Quality over quantity. Mending 3 temen beneran daripada 100 kenalan.", author: "Friendship", weight: 2 },
    { text: "Lo nggak bisa fix orang yang nggak mau diperbaiki.", author: "Hard Lesson", weight: 2 },
    { text: "Investasi terbaik itu di diri sendiri. ROI-nya seumur hidup.", author: "Self Investment", weight: 2 },
    { text: "Takut gagal itu normal. Takut nyoba itu yang bahaya.", author: "Courage", weight: 2 },
    { text: "Opini orang tentang lo bukan urusan lo.", author: "Peace of Mind", weight: 2 },
    { text: "Hidup itu pendek buat drama yang nggak perlu.", author: "Keep It Simple", weight: 2 },
    { text: "Kebahagiaan itu inside job. Bukan dari external validation.", author: "Inner Peace", weight: 2 },
    { text: "Kerja keras itu penting. Kerja pintar lebih penting. Istirahat paling penting.", author: "Balance", weight: 2 },
    { text: "Viral bukan berarti valuable. Sepi bukan berarti nggak penting.", author: "Perspective", weight: 2 },
    { text: "Lo nggak harus jadi versi terbaik setiap hari. Cukup versi yang survive.", author: "Realistic Goals", weight: 2 },
    { text: "Growth itu nggak linear. Kadang mundur dulu baru maju.", author: "Process", weight: 2 },
    { text: "Healing is not linear. Kadang relapse, dan itu okay.", author: "Recovery", weight: 2 },
    { text: "Self-aware tapi tetep self-sabotage. The struggle is real.", author: "Work in Progress", weight: 2 },
    { text: "Mereka yang sukses juga pernah di titik nol. Bedanya mereka nggak berhenti.", author: "Keep Going", weight: 2 },

    // Normal tier - Good quotes (weight: 1)
    { text: "Sometimes the best decision is no decision. Biarkan waktu yang jawab.", author: "Patience", weight: 1 },
    { text: "Umur 20-an itu masa bingung. Semua orang juga sama kok.", author: "Quarter Life", weight: 1 },
    { text: "Network itu penting, tapi jangan fake. Orang bisa bedain.", author: "Networking 101", weight: 1 },
    { text: "Malu bertanya sesat di jalan. Malu nyoba sesat selamanya.", author: "Just Do It", weight: 1 },
    { text: "Belajar dari kesalahan orang lain lebih murah daripada bikin sendiri.", author: "Smart Move", weight: 1 },
    { text: "Buku bagus itu murah. Pengalaman mahal. Kebodohan lebih mahal lagi.", author: "Knowledge", weight: 1 },
    { text: "Uang bukan segalanya, tapi nggak punya uang juga ribet.", author: "Financial Reality", weight: 1 },
    { text: "Gaya hidup naik, income tetap? Recipe for disaster.", author: "Money Sense", weight: 1 },
    { text: "Nabung itu bukan sisa, tapi prioritas.", author: "Saving 101", weight: 1 },
    { text: "Flexing buat impress orang yang nggak peduli? Buat apa?", author: "Real Talk", weight: 1 },
    { text: "Kebutuhan vs keinginan. Dua hal yang sering ketuker.", author: "Spending Wisdom", weight: 1 },
    { text: "Busy bukan berarti produktif. Banyak gerak belum tentu maju.", author: "Efficiency", weight: 1 },
    { text: "Yesterday is history, tomorrow is mystery. Fokus ke today.", author: "Present Moment", weight: 1 },
    { text: "Nggak semua pertarungan harus dimenangkan. Pilih yang worth it.", author: "Pick Your Battles", weight: 1 },
    { text: "Hidup nggak harus selalu meaningful. Kadang cukup enjoyable.", author: "Lighten Up", weight: 1 },
    { text: "Multitasking itu mitos. Yang ada cuma switching yang capek.", author: "Focus 101", weight: 1 },
    { text: "Meeting yang harusnya email. Email yang harusnya chat. Chat yang harusnya diem aja.", author: "Corporate Life", weight: 1 },
    { text: "Deadline itu motivasi terbaik sekaligus terburuk.", author: "Procrastinator", weight: 1 },
    { text: "Followers banyak, temen curhat nol. Ironi media sosial.", author: "Online vs Offline", weight: 1 },
    { text: "Reply 'nanti' ke chat, tapi scroll TikTok 2 jam. We've all been there.", author: "Guilty", weight: 1 },
    { text: "Orang judging lo online? Block. Hidup lo, rules lo.", author: "Digital Peace", weight: 1 },
    { text: "Journal itu terapi yang lebih murah. Coba deh.", author: "Mental Hack", weight: 1 },
    { text: "Baca buku self-help doang tanpa action = entertainment.", author: "Harsh Truth", weight: 1 },
    { text: "Bayar pajak, bayar listrik, bayar internet. Welcome to adulthood.", author: "Adult 101", weight: 1 },
    { text: "Masak sendiri: hemat, sehat, tapi males.", author: "Grown Up Problems", weight: 1 },
    { text: "Tidur jam 10 sekarang jadi achievement, bukan punishment.", author: "Old Soul", weight: 1 },
    { text: "Weekend habis buat istirahat dari weekday yang harusnya nggak selelah itu.", author: "Burnout Gen", weight: 1 },
    { text: "Cuti tapi masih cek email. Toxic trait yang susah dilepas.", author: "Workaholic", weight: 1 },
    { text: "Marah itu valid. Tapi cara express-nya yang harus dijaga.", author: "Emotional Management", weight: 1 },
    { text: "Nangis bukan lemah. Nangis itu release.", author: "Crying is OK", weight: 1 },
    { text: "Kadang diam bukan berarti setuju. Kadang cuma capek debat.", author: "Choosing Peace", weight: 1 },
    { text: "Nggak semua advice cocok buat semua orang. Filter dulu.", author: "Context Matters", weight: 1 },
    { text: "Lo boleh iri, tapi jadikan motivasi bukan excuse.", author: "Jealousy Hack", weight: 1 },
    { text: "Gagal di depan umum itu malu. Nggak pernah nyoba sama sekali itu lebih malu.", author: "Regret", weight: 1 },
    { text: "Umur cuma angka? Iya, tapi deadline hidup tetep ada.", author: "Time Reality", weight: 1 },
];

export function RandomQuote() {
    const [quote, setQuote] = useState<typeof quotes[0] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shownIndices, setShownIndices] = useState<Set<number>>(new Set());

    // Weighted random selection from available indices
    const weightedRandomPick = (indices: number[]) => {
        const weights = indices.map(i => quotes[i].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < indices.length; i++) {
            random -= weights[i];
            if (random <= 0) return indices[i];
        }
        return indices[indices.length - 1];
    };

    const getRandomQuote = () => {
        setIsAnimating(true);

        // Get available indices (not yet shown)
        let availableIndices = quotes
            .map((_, i) => i)
            .filter(i => !shownIndices.has(i));

        // If all quotes have been shown, reset
        if (availableIndices.length === 0) {
            availableIndices = quotes.map((_, i) => i);
            setShownIndices(new Set());
        }

        // Shuffle animation effect
        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[randomIndex]);
            shuffleCount++;

            if (shuffleCount >= 8) {
                clearInterval(shuffleInterval);
                // Pick final quote using weighted selection
                const finalIndex = weightedRandomPick(availableIndices);
                setQuote(quotes[finalIndex]);
                setShownIndices(prev => new Set([...prev, finalIndex]));
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
