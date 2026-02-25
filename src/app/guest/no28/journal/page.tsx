"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, X, Calendar, PenLine, Sparkles, ChevronLeft, ChevronRight, Quote, Trash2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container"; // Adjust path if needed
import { MOOD_CONFIG, JournalEntry, MoodCategory } from "@/types/journal";
import "../../../globals.css";

// --- Components ---

const WashiTape = ({ color, rotate = "0deg", width = "90px" }: { color: string, rotate?: string, width?: string }) => (
    <div style={{
        position: "absolute",
        top: "-12px",
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate})`,
        width: width,
        height: "24px",
        backgroundColor: color,
        opacity: 0.9,
        zIndex: 10,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        borderRadius: "2px",
    }}>
        <div style={{ width: "100%", height: "100%", opacity: 0.1, background: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
    </div>
);

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{
        fontFamily: "'Caveat', cursive, 'Brush Script MT'",
        color: "#8a7058",
        fontSize: "1.2rem",
        display: "inline-block",
        lineHeight: 1.2,
        ...style
    }}>
        {children}
    </span>
);

const TinyObject = ({ emoji, size = 16, top, left, right, bottom, rotate = 0, delay = 0 }: {
    emoji: string; size?: number;
    top?: string; left?: string; right?: string; bottom?: string;
    rotate?: number; delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: "backOut" }}
        style={{
            position: "absolute", top, left, right, bottom,
            fontSize: size, lineHeight: 1, zIndex: 3,
            transform: `rotate(${rotate}deg)`, pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
        }}
    >
        {emoji}
    </motion.div>
);

// --- Ambient Components ---

const NoiseOverlay = () => (
    <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.05,
        backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
        backgroundSize: "200px 200px"
    }} />
);

const FloatingParticles = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        {[...Array(8)].map((_, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: `${80 + Math.random() * 20}%`,
                    width: "3px", height: "3px",
                    background: "#b07d62",
                    borderRadius: "50%",
                    filter: "blur(1px)",
                    animation: `floatParticle ${12 + Math.random() * 10}s linear ${i * 2}s infinite`
                }}
            />
        ))}
    </div>
);

const FallingPetals = () => {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${Math.random() * 100}%`,
                        width: 8 + Math.random() * 6,
                        height: 8 + Math.random() * 6,
                        borderRadius: "50% 0 50% 50%",
                        background: "linear-gradient(135deg, #f0d0d0 0%, #e6ccb2 100%)", // Warmer/Earthier tone for Journal
                        willChange: "transform, opacity",
                        animation: `fallPetal ${12 + Math.random() * 5}s linear ${Math.random() * 8}s infinite`
                    }}
                />
            ))}
        </div>
    );
};

// Butterflies removed to clean up UI as per premium editorial goal.
// SVG filters (watercolors/rough-paper) removed to optimize render pipeline and remove visual clutter.

// --- Main Page ---

export default function JournalPage() {
    const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [usePaletteColors, setUsePaletteColors] = useState(false);

    // Modal State
    const [noteInput, setNoteInput] = useState("");
    const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);

    // Initial Data Fetch & Simulation
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const saved = localStorage.getItem("journal_entries_25");
        let parsed = {};
        if (saved) {
            try {
                parsed = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse journal entries", e);
            }
        }

        const isInitialized = localStorage.getItem("journal_initialized_25"); // Check initialization flag

        // Force Simulation ONLY if not initialized (First visit)
        if (!isInitialized) {
            seedSimulationData(parsed);
        } else {
            setEntries(parsed);
        }

        const savedPalettePref = localStorage.getItem("journal_use_palette");
        if (savedPalettePref === "true") {
            setUsePaletteColors(true);
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const togglePalette = () => {
        const newValue = !usePaletteColors;
        setUsePaletteColors(newValue);
        localStorage.setItem("journal_use_palette", String(newValue));
    };

    const seedSimulationData = (existing: Record<string, JournalEntry> = {}) => {
        const demoEntries: Record<string, JournalEntry> = { ...existing };
        const today = new Date();

        const moods: MoodCategory[] = ['grateful', 'energetic', 'mixed', 'peaceful', 'grateful'];
        const notes = [
            "Akhirnya ngerjain fitur ini selesai juga. ✨",
            "Mencoba rute pulang yang beda, ternyata nemu spot sunset yang bagus banget di jembatan layang.",
            "Hari yang lumayan berat. Banyak deadline numpuk dan rasanya overwhelm. But I survived.",
            "Hujan seharian. Cuma menghabiskan waktu di kasur sambil baca novel lama. Suasananya tenang banget.",
            "Video call sama keluarga di rumah. Selalu seneng denger kabar mereka sehat semua."
        ];

        // Generate 5 days back
        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];

            // Only overwrite if not exists to preserve user's real today entry if any
            if (!demoEntries[dateKey]) {
                demoEntries[dateKey] = {
                    date: dateKey,
                    note: notes[i],
                    category: moods[i],
                    timestamp: Date.now() - i * 86400000,
                    isTemplate: true // Mark as template
                };
            }
        }

        setEntries(demoEntries);
        localStorage.setItem("journal_entries_25", JSON.stringify(demoEntries));
        localStorage.setItem("journal_initialized_25", "true"); // Mark as initialized
    };

    // Save Entry
    const handleSave = () => {
        if (!selectedDate || !selectedMood) return;
        const dateKey = selectedDate.toISOString().split('T')[0];

        const newEntry: JournalEntry = {
            date: dateKey,
            note: noteInput,
            category: selectedMood,
            timestamp: Date.now()
        };

        const updatedEntries = { ...entries, [dateKey]: newEntry };
        setEntries(updatedEntries);
        localStorage.setItem("journal_entries_25", JSON.stringify(updatedEntries));
        setSelectedDate(null); // Close modal
    };

    // Date Logic
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    const todayEntry = entries[todayKey];

    // Group Days by Month
    const months = useMemo(() => {
        const groups: { title: string, days: Date[] }[] = [];
        // Show context: Start a bit before today if needed, or just the personal year
        const start = new Date("2025-11-28");
        const end = new Date("2026-11-28");
        let current = new Date(start);

        while (current < end) {
            const monthName = current.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            let lastGroup = groups[groups.length - 1];

            if (!lastGroup || lastGroup.title !== monthName) {
                lastGroup = { title: monthName, days: [] };
                groups.push(lastGroup);
            }

            lastGroup.days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return groups;
    }, []);

    // Filter months to show initially (Current Month only)
    const currentMonthTitle = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const visibleMonths = showFullHistory ? months : months.filter(m => m.title === currentMonthTitle);

    const openModal = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const entry = entries[dateKey];

        setSelectedDate(date);
        setNoteInput(entry ? entry.note : "");
        setSelectedMood(entry ? entry.category : null);
    };

    const handleDelete = () => {
        if (!selectedDate) return;
        if (!confirm("Yakin ingin menghapus lembaran ini? Kenangan ini akan hilang selamanya.")) return;

        const dateKey = selectedDate.toISOString().split('T')[0];
        const newEntries = { ...entries };
        delete newEntries[dateKey];

        setEntries(newEntries);
        localStorage.setItem("journal_entries_25", JSON.stringify(newEntries));
        setSelectedDate(null);
    };

    if (!mounted) return null;

    return (
        <div style={{
            minHeight: "100svh",
            background: "#fbf9f6",
            backgroundImage: "radial-gradient(#e5e0d8 0.7px, transparent 0)",
            backgroundSize: "24px 24px",
            color: "#4e4439",
            fontFamily: "'Crimson Pro', serif",
            paddingBottom: "80px",
            position: "relative",
            overflowX: "hidden"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            <NoiseOverlay />
            <FloatingParticles />
            <FallingPetals />

            {/* Header */}
            <div style={{
                position: "sticky", top: 0, zIndex: 40,
                background: "rgba(251, 249, 246, 0.9)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(176, 125, 98, 0.05)",
                padding: "2rem 1rem" // Increased top/bottom padding
            }}>
                <Container>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Link href="/guest/no28/special_day" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", background: "#fff", border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a", borderRadius: "12px", color: "#5a5a5a", transition: "all 0.2s ease"
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translate(-1px, -1px)";
                                e.currentTarget.style.boxShadow = "4px 4px 0px #5a5a5a";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "2px 2px 0px #5a5a5a";
                            }}
                        >
                            <ArrowLeft size={22} strokeWidth={2} />
                        </Link>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#b07d62", fontFamily: "'Caveat', cursive", marginRight: "auto", marginLeft: "1rem" }}>Palet Perasaan</h1>

                        <div
                            onClick={togglePalette}
                            style={{
                                cursor: "pointer",
                                padding: "6px 12px",
                                background: usePaletteColors ? "#f0e6d2" : "#fff",
                                borderRadius: "20px",
                                border: "1px solid #e8e2d9",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.85rem",
                                transition: "all 0.2s",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                            }}
                        >
                            <span>{usePaletteColors ? "🎨 Palet" : "🟤 Default"}</span>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>

                {/* HERO: Today's Focus */}
                <div style={{ padding: "0 1rem", maxWidth: "500px", margin: "0 auto 4rem" }}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => openModal(today)}
                        className="hover:scale-[1.01] active:scale-[0.99] transition-transform duration-300"
                        style={{
                            background: "#fff",
                            borderRadius: "2px", // Sharp corners for card feel
                            padding: "3rem 2rem",
                            boxShadow: "0 20px 50px -10px rgba(176, 125, 98, 0.2), 0 0 0 1px rgba(0,0,0,0.02)",
                            position: "relative",
                            cursor: "pointer",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        {/* Realistic Paper Texture */}
                        <div style={{ position: "absolute", inset: 0, opacity: 0.8, backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", pointerEvents: "none", mixBlendMode: "multiply" }} />
                        {/* WashiTape Decoration */}
                        <WashiTape color="#e6ccb2" rotate="-2deg" width="110px" />
                        <TinyObject emoji="🌷" size={18} top="20px" right="20px" rotate={15} delay={0.2} />

                        {/* Date - Minimal Aesthetic */}
                        <div style={{
                            fontFamily: "'Crimson Pro', serif",
                            fontSize: "1.2rem",
                            fontStyle: "italic",
                            color: "#b07d62",
                            marginBottom: "1.5rem",
                            marginTop: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            opacity: 0.9
                        }}>
                            <span style={{ height: "1px", width: "20px", background: "#b07d62", opacity: 0.4 }} />
                            {today.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
                            <span style={{ height: "1px", width: "20px", background: "#b07d62", opacity: 0.4 }} />
                        </div>

                        <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "2.8rem", color: "#4e4439", margin: "0 0 0.5rem", lineHeight: 1 }}>
                            Cerita Hari Ini
                        </h2>
                        <p style={{ fontSize: "0.95rem", color: "#8a7058", fontStyle: "italic", marginBottom: "2rem", opacity: 0.8, maxWidth: "380px" }}>
                            "Apapun warna harimu ini, ia adalah bagian dari lukisan utuh perjalananmu."
                        </p>

                        {todayEntry ? (
                            <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                                {todayEntry.isTemplate && (
                                    <div style={{
                                        position: "absolute", top: "0", right: "0",
                                        fontSize: "0.65rem", fontWeight: 700, color: "#aaa",
                                        border: "1px solid #ccc", padding: "2px 6px", borderRadius: "4px",
                                        letterSpacing: "1px", textTransform: "uppercase"
                                    }}>
                                        CONTOH
                                    </div>
                                )}
                                <div style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    background: MOOD_CONFIG[todayEntry.category].color,
                                    padding: "6px 16px", borderRadius: "20px",
                                    marginBottom: "1.5rem", color: "#fff",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                }}>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{MOOD_CONFIG[todayEntry.category].label}</span>
                                </div>
                                <div style={{ position: "relative", padding: "0 10px" }}>
                                    <Quote size={24} color="#e0d0c0" style={{ position: "absolute", top: -15, left: -10 }} />
                                    <p style={{ fontStyle: "italic", color: "#5d5448", fontSize: "1.25rem", lineHeight: 1.6, margin: "0", fontFamily: "'Crimson Pro', serif" }}>
                                        {todayEntry.note || "Halaman kosong..."}
                                    </p>
                                    <Quote size={24} color="#e0d0c0" style={{ position: "absolute", bottom: -15, right: -10, transform: "scaleX(-1)" }} />
                                </div>
                                <div style={{ marginTop: "2.5rem", fontSize: "0.75rem", color: "#b07d62", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.6 }}>Ketuk untuk menyunting</div>
                            </div>
                        ) : (
                            <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ margin: "1rem auto 2rem" }}
                                >
                                    <PenLine size={40} color="#d2b48c" strokeWidth={1} />
                                </motion.div>
                                <p style={{ fontSize: "1.1rem", color: "#8a7058", fontStyle: "italic", marginBottom: "2rem" }}>
                                    "Apa warna langitmu hari ini?"
                                </p>
                                <div style={{
                                    display: "inline-block",
                                    padding: "12px 30px",
                                    background: "#4e4439",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                }}>
                                    Mulai Menulis
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* VISIBLE HISTORY (Filled Entries Only) */}
                <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
                    {Object.values(entries).filter(e => e.date !== todayKey).length > 0 && (
                        <div style={{ padding: "0 0 2rem", textAlign: "center" }}>
                            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#b07d62", fontFamily: "'Caveat', cursive", margin: 0, letterSpacing: "1px" }}>
                                Lembaran Lalu
                            </h3>
                            <div style={{ width: "40px", height: "3px", background: "#e8e2d9", margin: "8px auto 0", borderRadius: "2px" }} />
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {Object.values(entries)
                            .filter(e => e.date !== todayKey) // Exclude today
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Newest first
                            .map((entry, i) => (
                                <motion.div
                                    key={entry.date}
                                    initial={{ opacity: 1, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => openModal(new Date(entry.date))}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    style={{
                                        position: "relative",
                                        cursor: "pointer"
                                    }}
                                >
                                    {/* The Card Itself */}
                                    <div style={{
                                        background: "#fffbf7", // Warm antique white
                                        padding: "1.5rem 1.5rem 1.5rem 5rem", // Extra left padding for date
                                        minHeight: "120px",
                                        boxShadow: "1px 4px 15px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)", // Deep soft shadow
                                        position: "relative",
                                        border: "1px solid rgba(0,0,0,0.03)",
                                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Straight edges for clean feel, or varying? Keep straight for "Premium"
                                        display: "flex", alignItems: "center"
                                    }}>
                                        {/* Paper Texture Overlay */}
                                        <div style={{ position: "absolute", inset: 0, opacity: 0.6, backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", pointerEvents: "none", mixBlendMode: "multiply" }} />

                                        <WashiTape color={i % 2 === 0 ? "#d1e3dd" : "#f5c6d0"} rotate={i % 2 === 0 ? "1.5deg" : "-2deg"} />
                                        <TinyObject emoji={i % 2 === 0 ? "🌿" : "🌸"} size={14} top="15px" right="15px" rotate={i % 2 === 0 ? -10 : 15} delay={0.3} />

                                        {/* Template Badge */}
                                        {entry.isTemplate && (
                                            <div style={{
                                                position: "absolute", top: "8px", right: "8px",
                                                fontSize: "0.6rem", fontWeight: 700, color: "#aaa",
                                                border: "1px solid #ccc", padding: "1px 5px", borderRadius: "4px",
                                                opacity: 0.8, letterSpacing: "1px", pointerEvents: "none"
                                            }}>
                                                CONTOH
                                            </div>
                                        )}

                                        {/* Date Tag - Hanging/Attached style */}
                                        <div style={{
                                            position: "absolute", left: "-6px", top: "15px",
                                            width: "60px",
                                            background: MOOD_CONFIG[entry.category].color,
                                            color: "#fff",
                                            padding: "8px 0",
                                            textAlign: "center",
                                            boxShadow: "2px 2px 5px rgba(0,0,0,0.15)",
                                            zIndex: 2,
                                            borderRadius: "0 4px 4px 0"
                                        }}>
                                            <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "'Caveat', cursive", lineHeight: 0.9 }}>
                                                {new Date(entry.date).getDate()}
                                            </div>
                                            <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>
                                                {new Date(entry.date).toLocaleDateString('id-ID', { month: 'short' })}
                                            </div>
                                            {/* Fold effect */}
                                            <div style={{ position: "absolute", left: 0, bottom: -6, width: 0, height: 0, borderTop: "6px solid #888", borderLeft: "6px solid transparent", filter: "brightness(0.5)" }} />
                                        </div>

                                        {/* Content Area */}
                                        <div style={{ width: "100%", zIndex: 1, paddingLeft: "10px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px dashed #e0d0c0", paddingBottom: "6px" }}>
                                                <span style={{ fontSize: "0.9rem", color: MOOD_CONFIG[entry.category].color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                                                    {MOOD_CONFIG[entry.category].label}
                                                </span>
                                                <span style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#aaa" }}>
                                                    {new Date(entry.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: 0, fontSize: "1.1rem", color: "#4e4439",
                                                lineHeight: 1.6, fontStyle: "italic",
                                                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                            }}>
                                                "{entry.note || "Tanpa catatan..."}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                        {Object.values(entries).filter(e => e.date !== todayKey).length === 0 && (
                            <div style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>
                                <p style={{ fontStyle: "italic", color: "#a0907d" }}>Belum ada jejak masa lalu...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Narrative (Styled like Special Day) */}
                    <div style={{ marginTop: "6rem", textAlign: "center", position: "relative", paddingBottom: "4rem" }}>
                        <div style={{ width: "40px", height: "1px", background: "#b07d62", margin: "0 auto 2rem", opacity: 0.3 }} />

                        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1rem" }}>
                                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#b07d62", opacity: 0.6 }} />
                                <HandwrittenNote style={{ fontSize: "1.3rem", color: "#b07d62" }}>Ruang ini milikmu seutuhnya.</HandwrittenNote>
                                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#b07d62", opacity: 0.6 }} />
                            </div>

                            <p style={{ fontSize: "0.9rem", color: "#a0907d", lineHeight: 1.8, fontStyle: "italic", maxWidth: "480px", margin: "0 auto" }}>
                                Setiap kata yang terukir di sini tersimpan aman dalam memori perangkatmu <i>(local storage)</i>. <br />
                                Tak ada mata lain yang mengintip. Namun ingat, jika <strong>kamu</strong> membersihkan memori peramban ini, kenangan ini pun akan ikut memudar.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Input Modal (Bottom Sheet on Mobile) */}
            <AnimatePresence>
                {selectedDate && (
                    <>
                        <motion.div
                            initial={{ opacity: 1, }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDate(null)}
                            style={{ position: "fixed", inset: 0, background: "rgba(78, 68, 57, 0.4)", zIndex: 50, backdropFilter: "blur(4px)" }}
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{
                                position: "fixed",
                                bottom: 0, left: 0, right: 0,
                                background: "#fdf8f4",
                                borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
                                padding: "2rem 1.5rem",
                                zIndex: 51,
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 -10px 40px rgba(0,0,0,0.15)"
                            }}
                        >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "linear-gradient(to right, #b07d62, #d2691e)" }} />
                            <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>

                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem", marginTop: "1rem" }}>
                                    <div>
                                        <h3 style={{ fontSize: "1.8rem", fontFamily: "'Caveat', cursive", color: "#b07d62", lineHeight: 1 }}>
                                            {selectedDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </h3>
                                        <p style={{ fontSize: "0.9rem", color: "#a0907d", marginTop: "4px", fontStyle: "italic" }}>
                                            Bagaimana harimu berjalan?
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} style={{ padding: "8px", background: "#f0ece7", borderRadius: "50%", border: "none", cursor: "pointer" }}>
                                        <X size={20} color="#8a7058" />
                                    </button>
                                </div>

                                {/* Mood Selector */}
                                <div style={{ marginBottom: "2rem" }}>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#a0907d", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Warna Hari Ini
                                    </label>
                                    <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none", margin: "0 -10px", padding: "0 10px 10px" }}>
                                        {(Object.keys(MOOD_CONFIG) as MoodCategory[]).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedMood(cat)}
                                                style={{
                                                    flex: "0 0 auto",
                                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                                                    background: selectedMood === cat ? "#fff" : "rgba(255,255,255,0.5)",
                                                    border: selectedMood === cat ? `1px solid ${MOOD_CONFIG[cat].color}` : "1px solid transparent",
                                                    padding: "10px",
                                                    borderRadius: "16px",
                                                    cursor: "pointer",
                                                    minWidth: "70px",
                                                    transition: "all 0.2s",
                                                    boxShadow: selectedMood === cat ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
                                                }}
                                            >
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "50%",
                                                    background: MOOD_CONFIG[cat].color,
                                                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
                                                }} />
                                                <span style={{ fontSize: "0.7rem", color: "#666", fontWeight: 600, textAlign: "center" }}>
                                                    {MOOD_CONFIG[cat].label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Note Input */}
                                <div style={{ marginBottom: "2rem" }}>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#a0907d", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Catatan Kecil
                                    </label>
                                    <textarea
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="Tuliskan hal yang paling membekas..."
                                        rows={5}
                                        style={{
                                            width: "100%",
                                            padding: "1.2rem",
                                            borderRadius: "16px",
                                            border: "1px dashed #d2b48c",
                                            background: "#fff",
                                            fontFamily: "'Crimson Pro', serif",
                                            fontSize: "1.1rem",
                                            lineHeight: 1.6,
                                            resize: "none",
                                            outline: "none",
                                            color: "#4e4439",
                                            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.02)"
                                        }}
                                    />
                                </div>

                                {/* Save & Delete Buttons */}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {entries[selectedDate?.toISOString().split('T')[0] || ""] && (
                                        <button
                                            onClick={handleDelete}
                                            className="active:scale-95 transition-transform duration-200"
                                            style={{
                                                padding: "1.2rem",
                                                background: "#f8d7da",
                                                color: "#721c24",
                                                border: "none",
                                                borderRadius: "16px",
                                                cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={!selectedMood}
                                        className="active:scale-[0.98]"
                                        style={{
                                            flex: 1,
                                            padding: "1.2rem",
                                            background: selectedMood ? "#b07d62" : "#e0d0c0",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "16px",
                                            fontSize: "1.1rem",
                                            fontWeight: 700,
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                            cursor: selectedMood ? "pointer" : "not-allowed",
                                            transition: "background 0.3s",
                                            boxShadow: selectedMood ? "0 4px 12px rgba(176, 125, 98, 0.3)" : "none"
                                        }}
                                    >
                                        <Save size={20} />
                                        Simpan Cerita
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(176, 125, 98, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(176, 125, 98, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(176, 125, 98, 0); }
                }
            `}</style>
        </div>
    );
}
