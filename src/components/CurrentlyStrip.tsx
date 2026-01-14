"use client";

import { useState, useEffect } from "react";
import { Headphones, BookOpen, Wrench, Clock, Sparkles } from "lucide-react";

const playlist = [
    "Sally Sendiri — Noah",
    "Kukatakan Dengan Indah — Noah",
    "Andaikan Kau Datang — Noah",
];



const greetings = {
    morning: [
        "Joule per second? No, I measure energy in 'messages from you'. ⚡",
        "Pagi. Entropi semesta meningkat, tapi perasaanku ke kamu tetap tertib. 🧊",
        "Compiling my day... Missing dependency: You. 🧩",
        "Matahari terbit itu fenomena fisika, kalau kamu balas chat itu fenomena hati. ☀️",
        "Coffee: 100%. Motivation: 50%. Thoughts of you: Overflowing. ☕",
        "Statistik bilang kemungkinanku bahagia naik 200% kalau kamu sapa. 📈",
        "Newton's First Law: I will stay in bed unless acted upon by your text. 🛌",
        "Pagi. Kamu itu konstanta di variabel kehidupanku yang kacau. 📐",
        "Photosynthesis mode: on. But instead of sunlight, I need your attention. 🌱",
        "Kalau oksigen itu kebutuhan primer, kamu itu kebutuhan... eh, primer juga deh. 🫧",
        "Bangun. Dunia butuh orang pintar, aku butuh kamu. 🧠",
        "Morning. My brain is loading, but my heart is already thinking of you. 🔄",
        "Secangkir kopi dan notifikasi darimu: Resep awet muda. 🧂",
        "Hypothesis: Today will be great. Proof: You exist. 📝"
    ],
    afternoon: [
        "Siang. Hipotesis: Aku butuh kamu. Eksperimen: Chat ini. 🧪",
        "Prokrastinasi produktif: Mikirin skenario kita nanti sore. 🎬",
        "Lunch break? More like 'Daydreaming about you' break. 🥪",
        "Gravitasi itu lemah dibanding daya tarik notifikasimu. 🪐",
        "Sedang mengalkulasi rindu. Hasilnya: Tak terhingga. ♾️",
        "Panas jakarta kalah sama panasnya rindu ini (cringe tapi sayang kan?). 🔥",
        "Thermodynamics says heat flows, but my cool melts when I see you. 🍦",
        "Siang. Jangan lupa makan, energi butuh asupan, hati butuh kepastian. 🍛",
        "Work in progress. 90% coding, 10% wondering what you're doing. 💾",
        "Lagi sibuk? Sama, sibuk nyari alasan buat nge-chat kamu. 📱",
        "Siang. Matahari di atas kepala, kamu di dalam kepala. 🌤️",
        "Is it just me, or did time stop when I looked at your photo? ⏱️",
        "Refraction index: 1.0. My focus on you: Absolute. 🔍",
        "Siang. Kalau kamu elemen tabel periodik, kamu pasti Copper (Cu) dan Tellurium (Te). Cute. 🧪"
    ],
    evening: [
        "Sore. Langit oranye, mood rindu, logika macet. 🌇",
        "Golden hour photography is cool, but have you seen your own smile? 📸",
        "Kalau senja itu data, kamu itu insight-nya. 📊",
        "Pulang kerja, otak shutdown, mode kangen activated. 🔌",
        "Langitnya estetik, kayak kamu pas lagi cerita random. 🎨",
        "Sore. Efek Doppler: Semakin kamu mendekat, frekuensi jantungku makin tinggi. 💓",
        "Sunset is nature's way of saying 'job well done'. You are my reward. 🏆",
        "Kalau lelah, ingat: gravitasi bumi menarikmu ke bawah, tapi aku menarikmu ke pelukan (virtual). 🫂",
        "Sore. Kopi habis, senja tipis, rindu makin sadis. ☕",
        "Parsing sunset colors... Error: Beauty overload, just like you. 😵",
        "Evening. The sky is blushing, probably because it saw you. 😳",
        "Sore. Mau tebak-tebakan fisika? Kenapa aku jatuh? Karena ada gaya tarik kamu. 🍎",
        "Commuting home. Destination: You (in my mind at least). 🚇"
    ],
    night: [
        "Malam. Dark matter itu misterius, kayak kenapa aku kangen kamu. 🌌",
        "Sleep is crucial, but talking to you creates more serotonin. 🧬",
        "Di antara miliaran bintang, aku sibuk nyari satu: Kamu. 🔭",
        "Apakah kita quantum entangled? Soalnya aku kerasa kalau kamu mikirin aku. ⚛️",
        "Goodnight. Jangan lupa simpan rindunya buat besok pagi. 📦",
        "Malam. Teori relativitas: 1 menit nunggu balesanmu = 1 jam. ⏳",
        "Schrödinger's text: Aku belum tau kamu kangen atau nggak sebelum kamu bales. 📦",
        "Malam. Kalau bintang bisa bicara, mereka pasti ngomongin kamu. ✨",
        "Are you a black hole? Because no information (or thought) can escape you. 🕳️",
        "Sleep mode: Initiated. Dream module: Loading 'You'. 💤",
        "Malam. Tidur gih, biar besok bisa jadi alasan orang lain (aku) senyum lagi. 🌙",
        "Big Bang theory? More like Big Bang-et kangennya. 💥",
        "Universe expansion is accelerating, just like my feelings for you. 🚀",
        "Goodnight. You interact with my dreams via strong nuclear force. 💫"
    ]
};

function getGreeting(hour: number): string {
    let pool: string[];
    if (hour >= 5 && hour < 12) {
        pool = greetings.morning;
    } else if (hour >= 12 && hour < 17) {
        pool = greetings.afternoon;
    } else if (hour >= 17 && hour < 21) {
        pool = greetings.evening;
    } else {
        pool = greetings.night;
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function MarqueeContent({ currentSong, currentTime, greeting, previousGreeting, isTransitioning }: {
    currentSong: string;
    currentTime: string;
    greeting: string;
    previousGreeting: string;
    isTransitioning: boolean;
}) {
    const staticItems = [
        { icon: Clock, label: "Time", value: currentTime },
        { icon: Headphones, label: "Listening", value: currentSong },
        { icon: BookOpen, label: "Reading", value: "Thinking, Fast and Slow — Daniel Kahneman" },
        { icon: Wrench, label: "Building", value: "AI Brand Strategist" },
    ];

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            paddingRight: "2.5rem" // Gap before the next copy
        }}>
            {/* Vibes item with crossfade - fixed width container */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: 'var(--font-mono), "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif',
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                }}
            >
                <Sparkles className="w-3 h-3" style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span>Vibes:</span>
                {/* Crossfade container - uses the longer text for width */}
                <span style={{
                    position: "relative",
                    display: "inline-block",
                    color: "var(--foreground)",
                    width: "650px", // Fixed width to prevent layout shifts
                    overflow: "hidden", // Ensure no overflow
                    verticalAlign: "bottom" // Align with icon
                }}>
                    {/* Old greeting - fades out */}
                    <span style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        opacity: isTransitioning ? 1 : 0,
                        transition: "opacity 1.2s ease-in-out"
                    }}>
                        {previousGreeting}
                    </span>
                    {/* New greeting - fades in */}
                    <span style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        opacity: isTransitioning ? 0 : 1,
                        transition: "opacity 1.2s ease-in-out"
                    }}>
                        {greeting}
                    </span>
                    {/* Spacer to give height implicitly if needed, or just rely on absolute. 
                        Since they are absolute, the parent needs height. 
                        Line-height is usually sufficient. 
                        Add a &nbsp; just to be safe for line-height.
                    */}
                    &nbsp;
                </span>
            </div>

            {/* Static items */}
            {staticItems.map((item, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontFamily: 'var(--font-mono), "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif',
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        flexShrink: 0
                    }}
                >
                    <item.icon className="w-3 h-3" style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <span>{item.label}:</span>
                    <span style={{ color: "var(--foreground)" }}>
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

export function CurrentlyStrip() {
    const [songIndex, setSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [previousGreeting, setPreviousGreeting] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Initial setup
        const initialGreeting = getGreeting(new Date().getHours());
        setGreeting(initialGreeting);
        setPreviousGreeting(initialGreeting);

        // Update time every second
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Rotate songs every 3 minutes
        const songInterval = setInterval(() => {
            setSongIndex((prev) => (prev + 1) % playlist.length);
        }, 3 * 60 * 1000);

        // Rotate greeting every 15 seconds with crossfade effect
        const greetingInterval = setInterval(() => {
            const newGreeting = getGreeting(new Date().getHours());

            // Start transition - old text will fade out, new will fade in
            setIsTransitioning(true);

            // Immediately set the new greeting (crossfade handles the visual)
            setGreeting((current) => {
                setPreviousGreeting(current); // Save current as previous for crossfade
                return newGreeting;
            });

            // End transition after crossfade completes
            setTimeout(() => {
                setIsTransitioning(false);
            }, 1200); // Match the CSS transition duration

        }, 60000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(songInterval);
            clearInterval(greetingInterval);
        };
    }, []);

    const currentSong = playlist[songIndex % playlist.length] || playlist[0];

    return (
        <div style={{
            overflow: "hidden",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "0.5rem 0",
            position: "relative"
        }}>
            {/* Fade edges */}
            <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "40px",
                background: "linear-gradient(90deg, var(--background) 0%, transparent 100%)",
                zIndex: 1,
                pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "40px",
                background: "linear-gradient(270deg, var(--background) 0%, transparent 100%)",
                zIndex: 1,
                pointerEvents: "none"
            }} />

            {/* Running text - two copies for seamless loop */}
            <div
                className="marquee-track"
                style={{
                    display: "flex",
                    width: "max-content",
                    animation: "marquee 30s linear infinite",
                    willChange: "transform",
                    transform: "translate3d(0, 0, 0)",
                    backfaceVisibility: "hidden" as const
                }}
            >
                {/* 
                   We pass the same greeting state to both copies.
                   Since we have global smooth transition state (isTransitioning),
                   both copies will fade out/in simultaneously, creating a smooth effect
                   regardless of where they are on screen.
                */}
                <MarqueeContent
                    currentSong={currentSong}
                    currentTime={currentTime}
                    greeting={greeting}
                    previousGreeting={previousGreeting}
                    isTransitioning={isTransitioning}
                />
                <MarqueeContent
                    currentSong={currentSong}
                    currentTime={currentTime}
                    greeting={greeting}
                    previousGreeting={previousGreeting}
                    isTransitioning={isTransitioning}
                />
            </div>
        </div>
    );
}
