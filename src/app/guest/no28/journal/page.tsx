"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, X, Calendar, PenLine, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container"; // Adjust path if needed
import { MOOD_CONFIG, JournalEntry, MoodCategory } from "@/types/journal";

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

export default function JournalPage() {
    const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Modal State
    const [noteInput, setNoteInput] = useState("");
    const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const saved = localStorage.getItem("journal_entries_25");
        if (saved) {
            try {
                setEntries(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse journal entries", e);
            }
        }
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    // Personal Year Logic (Nov 28 to Nov 28) - Assuming current cycle
    const startOfEra = new Date("2025-11-28"); // Adjust based on user's current '25th' year context or just use Jan 1 for simplicity?
    // User context said "Lembaran Kisah Ke-25" implies current age 24 turning 25 or 25 turning 26.
    // Let's stick to the Special Day page logic: Start Nov 28, 2025.

    // Using a simpler approach: Just show 365 dots for the current "Personal Year".
    // We'll generate an array of dates from Nov 28, 2025 to Nov 27, 2026.
    const yearDays = useMemo(() => {
        const days: Date[] = [];
        const current = new Date("2025-11-28");
        const end = new Date("2026-11-28");

        while (current < end) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, []);

    const openModal = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const entry = entries[dateKey];

        setSelectedDate(date);
        setNoteInput(entry ? entry.note : "");
        setSelectedMood(entry ? entry.category : null);
    };

    if (!mounted) return null;

    // Calculate Grid Columns
    const columns = isMobile ? 7 : 14;

    return (
        <div style={{
            minHeight: "100svh",
            background: "#fdf8f1",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
            color: "#4e4439",
            fontFamily: "'Crimson Pro', serif",
            paddingBottom: "80px"
        }}>
            {/* Header */}
            <div style={{
                position: "sticky", top: 0, zIndex: 40,
                background: "rgba(253, 248, 241, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                padding: "1rem"
            }}>
                <Container>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Link href="/guest/no28/special_day" style={{ color: "#8a7058", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
                            <ArrowLeft size={20} />
                            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Kembali</span>
                        </Link>
                        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#b07d62", fontFamily: "'Caveat', cursive" }}>Palet Perasaan</h1>
                        <div style={{ width: "24px" }} /> {/* Spacer */}
                    </div>
                </Container>
            </div>

            <Container>
                {/* Hero / Intro */}
                <div style={{ textAlign: "center", padding: "2rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontStyle: "italic" }}>Jejak Harimu</h2>
                    <p style={{ fontSize: "1.1rem", color: "#8a7058", lineHeight: 1.6 }}>
                        "Setiap hari membawa warnanya sendiri. Tak ada yang salah, semua adalah bagian dari lukisanmu."
                    </p>
                </div>

                {/* The Dot Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: isMobile ? "8px" : "12px",
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "1rem 0"
                }}>
                    {yearDays.map((date, i) => {
                        const dateKey = date.toISOString().split('T')[0];
                        const entry = entries[dateKey];
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isFuture = date > new Date();

                        // Determine Color
                        let bg = "#e4dfd7"; // Default Empty
                        if (entry && MOOD_CONFIG[entry.category]) {
                            bg = MOOD_CONFIG[entry.category].color;
                        } else if (isToday) {
                            bg = "#fff"; // Highlight today if empty
                        }

                        return (
                            <motion.button
                                key={i}
                                whileTap={!isFuture ? { scale: 0.9 } : undefined}
                                onClick={() => !isFuture && openModal(date)}
                                disabled={isFuture}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    borderRadius: "4px",
                                    background: bg,
                                    border: isToday && !entry ? "2px solid #b07d62" : "none",
                                    opacity: isFuture ? 0.3 : 1,
                                    cursor: isFuture ? "default" : "pointer",
                                    position: "relative",
                                    transition: "all 0.3s ease",
                                    boxShadow: entry ? "0 2px 5px rgba(0,0,0,0.1)" : "none"
                                }}
                            >
                                {isToday && !entry && (
                                    <div style={{
                                        position: "absolute", inset: "25%", background: "#b07d62", borderRadius: "50%",
                                        animation: "pulse 2s infinite"
                                    }} />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </Container>

            {/* Input Modal (Bottom Sheet on Mobile) */}
            <AnimatePresence>
                {selectedDate && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDate(null)}
                            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50, backdropFilter: "blur(2px)" }}
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{
                                position: "fixed",
                                bottom: 0, left: 0, right: 0,
                                background: "#fff",
                                borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
                                padding: "2rem 1.5rem",
                                zIndex: 51,
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 -10px 40px rgba(0,0,0,0.1)"
                            }}
                        >
                            <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
                                <WashiTape color="#b07d62" rotate="-2deg" width="30%" />

                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem", marginTop: "1rem" }}>
                                    <div>
                                        <h3 style={{ fontSize: "1.8rem", fontFamily: "'Caveat', cursive", color: "#b07d62", lineHeight: 1 }}>
                                            {selectedDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </h3>
                                        <p style={{ fontSize: "0.9rem", color: "#aaa", marginTop: "4px" }}>
                                            Bagaimana harimu berjalan?
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} style={{ padding: "8px", background: "#f5f5f5", borderRadius: "50%", border: "none", cursor: "pointer" }}>
                                        <X size={20} color="#666" />
                                    </button>
                                </div>

                                {/* Mood Selector */}
                                <div style={{ marginBottom: "2rem" }}>
                                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#666", marginBottom: "0.8rem" }}>
                                        Warna Hari Ini
                                    </label>
                                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }}>
                                        {(Object.keys(MOOD_CONFIG) as MoodCategory[]).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedMood(cat)}
                                                style={{
                                                    flex: "0 0 auto",
                                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                                                    background: "none", border: "none", cursor: "pointer",
                                                    opacity: selectedMood && selectedMood !== cat ? 0.5 : 1,
                                                    transform: selectedMood === cat ? "scale(1.1)" : "scale(1)",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <div style={{
                                                    width: "40px", height: "40px", borderRadius: "12px",
                                                    background: MOOD_CONFIG[cat].color,
                                                    boxShadow: selectedMood === cat ? `0 0 0 3px #fff, 0 0 0 5px ${MOOD_CONFIG[cat].color}` : "none"
                                                }} />
                                                <span style={{ fontSize: "0.75rem", color: selectedMood === cat ? "#333" : "#999", fontWeight: selectedMood === cat ? 600 : 400 }}>
                                                    {MOOD_CONFIG[cat].label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Note Input */}
                                <div style={{ marginBottom: "2rem" }}>
                                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#666", marginBottom: "0.8rem" }}>
                                        Catatan Kecil
                                    </label>
                                    <textarea
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="Tuliskan hal yang paling membekas..."
                                        rows={5}
                                        style={{
                                            width: "100%",
                                            padding: "1rem",
                                            borderRadius: "12px",
                                            border: "1px solid #e8e2d9",
                                            background: "#faf8f5",
                                            fontFamily: "'Crimson Pro', serif",
                                            fontSize: "1.1rem",
                                            lineHeight: 1.6,
                                            resize: "none",
                                            outline: "none",
                                            color: "#4e4439"
                                        }}
                                    />
                                </div>

                                {/* Save Button */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={!selectedMood}
                                    style={{
                                        width: "100%",
                                        padding: "1rem",
                                        background: selectedMood ? "#b07d62" : "#e0d0c0",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                        cursor: selectedMood ? "pointer" : "not-allowed",
                                        transition: "background 0.3s"
                                    }}
                                >
                                    <Save size={18} />
                                    Simpan Cerita
                                </motion.button>
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
