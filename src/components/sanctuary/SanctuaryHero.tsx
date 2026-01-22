"use client";

import { useEffect, useState } from "react";
import { Sparkles, CloudSun, Sun, Sunset, Moon, PartyPopper } from "lucide-react";
import { ZenTeleport } from "@/components/sanctuary/ZenTeleport";
import { motion } from "framer-motion";

// Configuration
const BIRTH_DATE = { month: 10, day: 28 }; // November 28 (Month is 0-indexed in JS Date: 0=Jan, 10=Nov)

type TimePhase = "morning" | "afternoon" | "evening" | "night" | "latenight" | "birthday";
type DayType = "weekday" | "friday" | "weekend";

interface DynamicContent {
    greeting: string;
    message: string;
    icon: React.ElementType;
    accentColor: string;
    glowColor: string;
}

export function SanctuaryHero() {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [content, setContent] = useState<DynamicContent>({
        greeting: "Sini, pulang sebentar.",
        message: "Dunia di luar lagi berisik banget, ya? Gapapa. Taruh dulu berat di pundakmu di depan pintu.",
        icon: Sparkles,
        accentColor: "var(--accent)",
        glowColor: "rgba(37, 99, 235, 0.1)"
    });

    useEffect(() => {
        setMounted(true);

        const updateSystem = () => {
            const now = new Date();

            // Live Clock Format: 06:30 PM
            const timeFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            setCurrentTime(timeFormatter.format(now));

            // Content Logic (Synchronized with WIB)
            const wibString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
            const wibDate = new Date(wibString);

            const hour = wibDate.getHours();
            const day = wibDate.getDay(); // 0 = Sunday
            const date = wibDate.getDate();
            const month = wibDate.getMonth();

            let phase: TimePhase = "night";

            // Birthday Check override
            if (month === BIRTH_DATE.month && date === BIRTH_DATE.day) {
                phase = "birthday";
            } else {
                if (hour >= 1 && hour < 4) phase = "latenight";
                else if (hour >= 4 && hour < 11) phase = "morning";
                else if (hour >= 11 && hour < 15) phase = "afternoon";
                else if (hour >= 15 && hour < 18) phase = "evening";
                else phase = "night";
            }

            let dayType: DayType = "weekday";
            if (day === 5) dayType = "friday";
            if (day === 0 || day === 6) dayType = "weekend";

            setContent(getDynamicContent(phase, dayType));
        };

        updateSystem();
        const interval = setInterval(updateSystem, 1000); // Live clock needs 1s updates
        return () => clearInterval(interval);
    }, []);

    const getDynamicContent = (phase: TimePhase, dayType: DayType): DynamicContent => {

        if (phase === "birthday") {
            return {
                greeting: "Selamat Ulang Tahun.",
                message: "Hari ini semesta merayakanmu. Terima kasih sudah lahir dan bertahan sejauh ini. Doa terbaik untukmu.",
                icon: PartyPopper,
                accentColor: "#f43f5e", // Rose
                glowColor: "rgba(244, 63, 94, 0.15)"
            };
        }

        if (phase === "latenight") {
            return {
                greeting: "Belum bisa tidur?",
                message: "Gapapa. Pikiranmu aman di sini. Tarik napas, pelan-pelan istirahatin mata ya. Besok masih ada.",
                icon: Moon,
                accentColor: "#6366f1", // Indigo-500
                glowColor: "rgba(99, 102, 241, 0.1)"
            };
        }

        if (phase === "morning") {
            if (dayType === "weekend") {
                return {
                    greeting: "Pagi yang tenang.",
                    message: "Nggak ada alarm yang ngejar, nggak ada ekspektasi yang nunggu. Hari ini milikmu seutuhnya.",
                    icon: CloudSun,
                    accentColor: "#fbbf24", // Amber
                    glowColor: "rgba(251, 191, 36, 0.15)"
                };
            }
            return {
                greeting: "Selamat pagi.",
                message: "Udah siap menghadapi dunia lagi? Tarik napas dulu. Kamu lebih kuat dari rintangan hari ini.",
                icon: Sun,
                accentColor: "#fcd34d",
                glowColor: "rgba(252, 211, 77, 0.15)"
            };
        }

        if (phase === "afternoon") {
            if (dayType === "weekend") {
                return {
                    greeting: "Matahari di puncak.",
                    message: "Jangan lupa makan siang. Nikmatin jedanya, nggak usah buru-buru. Produktivitas bisa nunggu.",
                    icon: Sun,
                    accentColor: "#f59e0b",
                    glowColor: "rgba(245, 158, 11, 0.1)"
                };
            }
            return {
                greeting: "Tahan sebentar.",
                message: "Dunia lagi sibuk-sibuknya ya? Jangan lupa minum air. Kamu manusia, bukan robot korporat.",
                icon: Sun,
                accentColor: "#fbbf24",
                glowColor: "rgba(251, 191, 36, 0.1)"
            };
        }

        if (phase === "evening") {
            if (dayType === "friday") {
                return {
                    greeting: "Hampir bebas.",
                    message: "Minggu ini berat ya? Tapi lo berhasil lewatin. Sedikit lagi menuju kebebasan weekend.",
                    icon: Sunset,
                    accentColor: "#f43f5e",
                    glowColor: "rgba(244, 63, 94, 0.15)"
                };
            }
            return {
                greeting: "Langit mulai jingga.",
                message: "Saatnya nurunin tempo. Apa hal kecil yang bikin kamu senyum hari ini?",
                icon: Sunset,
                accentColor: "#fb7185",
                glowColor: "rgba(251, 113, 133, 0.15)"
            };
        }

        // Night (Default)
        return {
            greeting: "Sini, pulang sebentar.",
            message: "Dunia di luar berisik banget ya? Gapapa. Taruh dulu berat di pundakmu di sini. Kamu aman.",
            icon: Moon,
            accentColor: "#818cf8", // Indigo-400
            glowColor: "rgba(129, 140, 248, 0.1)"
        };
    };

    if (!mounted) return null;

    return (
        <header style={{
            marginBottom: "4rem",
            marginTop: "10rem",
            position: "relative",
            textAlign: "left"
        }}>
            {/* AMBIENT GLOW */}
            <motion.div
                animate={{ background: `radial-gradient(circle closest-side, ${content.glowColor}, transparent)` }}
                transition={{ duration: 2 }}
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '140%',
                    height: '200%',
                    zIndex: -1,
                    pointerEvents: 'none',
                    opacity: 0.6,
                    transform: 'translateZ(0)' // Hardware accel hint
                }}
            />

            {/* Dedication Badge & Clock */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    // Using a subtle glass effect that adapts slightly to the accent color
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '1.5rem',
                    color: content.accentColor,
                    backdropFilter: 'blur(8px)'
                }}>
                <content.icon size={12} />
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    opacity: 0.9,
                    display: 'flex',
                    gap: '0.6em',
                    alignItems: 'center'
                }}>
                    <span>Ruang Untukmu</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentTime}</span>
                </span>
            </motion.div>

            {/* Title */}
            <motion.h1
                key={content.greeting} // Animate on change
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.5rem, 9vw, 6rem)",
                    fontWeight: 400,
                    lineHeight: 0.95,
                    letterSpacing: "-0.04em",
                    marginBottom: "2.5rem",
                    color: "var(--foreground)",
                    maxWidth: "18ch",
                    position: "relative"
                }}>
                {content.greeting}
            </motion.h1>

            {/* Description */}
            <motion.p
                key={content.message}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                    fontSize: "1.35rem",
                    lineHeight: 1.6,
                    fontFamily: "'Source Serif 4', serif",
                    maxWidth: "38rem",
                    color: "var(--text-secondary)",
                    fontWeight: 300,
                    marginBottom: "4rem"
                }}>
                {content.message}
            </motion.p>

            {/* Separator */}
            <div style={{
                width: "100%",
                height: "1px",
                background: "linear-gradient(to right, transparent, var(--foreground), transparent)",
                opacity: 0.08,
                marginBottom: "4rem"
            }} />

            {/* Zen Teleport */}
            <div style={{
                marginBottom: "4rem",
                display: "flex",
                justifyContent: "center"
            }}>
                <ZenTeleport />
            </div>
        </header>
    );
}
