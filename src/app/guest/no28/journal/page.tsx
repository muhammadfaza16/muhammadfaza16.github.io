"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, X, Calendar, PenLine, Sparkles, Quote, Trash2, Palette, Heart } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { MOOD_CONFIG, JournalEntry, MoodCategory } from "@/types/journal";
import { useTheme } from "@/components/guest/no28/ThemeContext";

// --- Watercolor Components ---

const HandwrittenText = ({ children, style = {}, className = "" }: { children: React.ReactNode, style?: React.CSSProperties, className?: string }) => (
    <span className={`font-handwriting ${className}`} style={{ fontSize: "1.25rem", display: "inline-block", lineHeight: 1.2, ...style }}>
        {children}
    </span>
);

const WashStripe = ({ type = "blue" as "blue" | "sage" | "rose" | "ochre" | "lavender" }) => (
    <div className={`wc-wash-stripe wc-wash-stripe--${type}`} />
);

const AmbientPaintDrops = () => {
    const drops = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 20 + Math.random() * 10,
        size: 8 + Math.random() * 12,
        color: ["var(--wc-wash-blue-light)", "var(--wc-wash-sage-light)", "var(--wc-wash-rose-light)", "var(--wc-wash-ochre-light)"][Math.floor(Math.random() * 4)],
        blur: 2 + Math.random() * 4
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: "absolute", left: drop.left, top: "-20px", width: drop.size, height: drop.size,
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`, opacity: 0.35,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export default function JournalPage() {
    const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [usePaletteColors, setUsePaletteColors] = useState(false);
    const { tokens: T, mode } = useTheme();

    // Modal State
    const [noteInput, setNoteInput] = useState("");
    const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const saved = localStorage.getItem("journal_entries_25");
        let parsed = {};
        if (saved) {
            try { parsed = JSON.parse(saved); } catch (e) { console.error("Failed to parse journal entries", e); }
        }

        const isInitialized = localStorage.getItem("journal_initialized_25");
        if (!isInitialized) {
            seedSimulationData(parsed);
        } else {
            setEntries(parsed);
        }

        const savedPalettePref = localStorage.getItem("journal_use_palette");
        if (savedPalettePref === "true") setUsePaletteColors(true);

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
            "Mencoba rute pulang yang beda, ternyata nemu spot sunset yang bagus banget.",
            "Hari yang lumayan berat. Banyak deadline numpuk. But I survived.",
            "Hujan seharian. Cuma menghabiskan waktu di kasur. Suasananya tenang banget.",
            "Video call sama keluarga. Selalu seneng denger kabar mereka sehat semua."
        ];

        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            if (!demoEntries[dateKey]) {
                demoEntries[dateKey] = {
                    date: dateKey,
                    note: notes[i],
                    category: moods[i],
                    timestamp: Date.now() - i * 86400000,
                    isTemplate: true
                };
            }
        }
        setEntries(demoEntries);
        localStorage.setItem("journal_entries_25", JSON.stringify(demoEntries));
        localStorage.setItem("journal_initialized_25", "true");
    };

    const handleSave = () => {
        if (!selectedDate || !selectedMood) return;
        const dateKey = selectedDate.toISOString().split('T')[0];
        const newEntry: JournalEntry = { date: dateKey, note: noteInput, category: selectedMood, timestamp: Date.now() };
        const updatedEntries = { ...entries, [dateKey]: newEntry };
        setEntries(updatedEntries);
        localStorage.setItem("journal_entries_25", JSON.stringify(updatedEntries));
        setSelectedDate(null);
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

    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    const todayEntry = entries[todayKey];

    const openModal = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const entry = entries[dateKey];
        setSelectedDate(date);
        setNoteInput(entry ? entry.note : "");
        setSelectedMood(entry ? entry.category : null);
    };

    if (!mounted) return null;

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden", paddingBottom: "10rem",
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, transition: "background-color 0.5s ease"
        }}>
            <AmbientPaintDrops />

            {/* Sticky Header */}
            <div style={{
                position: "sticky", top: 0, zIndex: 100,
                background: mode === "default" ? "rgba(253, 248, 244, 0.85)" : "rgba(18, 22, 32, 0.85)",
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${T.cardBorder}`,
                padding: "1.5rem 0"
            }}>
                <Container>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                            <Link href="/guest/no28/special_day" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "42px", height: "42px", backgroundColor: T.cardBg,
                                borderRadius: "12px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={22} />
                            </Link>
                            <div style={{ textAlign: "left" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, opacity: 0.8 }}>Daily Narrative</div>
                                <HandwrittenText style={{ fontSize: "1rem", color: T.textAccent }}>Palet Perasaan & Cerita</HandwrittenText>
                            </div>
                        </div>

                        <button onClick={togglePalette} className="wc-card hover-ink-bleed" style={{
                            padding: "8px 16px", background: usePaletteColors ? "var(--wc-wash-ochre-light)" : T.cardBg,
                            border: `1px solid ${T.cardBorder}`, borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px"
                        }}>
                            <Palette size={16} color={usePaletteColors ? "var(--wc-accent)" : T.textMuted} />
                            <span className="font-serif-display" style={{ fontSize: "0.75rem", fontWeight: 700, color: usePaletteColors ? "var(--wc-accent)" : T.textSecondary, letterSpacing: "1px" }}>
                                {usePaletteColors ? "PALET" : "DEFAULT"}
                            </span>
                        </button>
                    </div>
                </Container>
            </div>

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>

                    {/* TODAY'S FOCUS */}
                    <div style={{ maxWidth: "560px", margin: "0 auto 6rem" }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={() => openModal(today)}
                            className="wc-card hover-ink-bleed"
                            style={{ padding: isMobile ? "3rem 2rem" : "4.5rem 3.5rem", border: `1px solid ${T.cardBorder}`, textAlign: "center", cursor: "pointer" }}
                        >
                            <WashStripe type="sage" />
                            <div className="font-serif-display" style={{ fontSize: "1rem", color: T.textAccent, marginBottom: "1.5rem", opacity: 0.8, fontStyle: "italic" }}>
                                {today.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>

                            <h2 className="font-handwriting" style={{ fontSize: isMobile ? "2.2rem" : "3rem", color: T.textPrimary, marginBottom: "1rem" }}>Cerita Hari Ini</h2>
                            <p className="font-serif" style={{ fontSize: "1.1rem", color: T.textSecondary, fontStyle: "italic", marginBottom: "3.5rem", opacity: 0.8 }}>
                                "Apapun warna harimu ini, ia adalah bagian dari lukisan utuh perjalananmu."
                            </p>

                            {todayEntry ? (
                                <div style={{ width: "100%" }}>
                                    <div style={{
                                        display: "inline-block", background: `var(--wc-wash-${MOOD_CONFIG[todayEntry.category].color === "#b07d62" ? "ochre" : "rose"}-light)`,
                                        padding: "6px 20px", borderRadius: "20px", marginBottom: "2.5rem",
                                        border: `1px solid ${T.cardBorder}`
                                    }}>
                                        <span className="font-serif-display" style={{ fontSize: "0.8rem", fontWeight: 700, color: T.textPrimary, letterSpacing: "2px" }}>
                                            {MOOD_CONFIG[todayEntry.category].label.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ position: "relative", padding: "0 20px" }}>
                                        <div style={{ position: "absolute", top: "-20px", left: "-10px", opacity: 0.15 }}><Quote size={32} color={T.accent} /></div>
                                        <p className="font-serif" style={{ fontStyle: "italic", color: T.textPrimary, fontSize: "1.4rem", lineHeight: 1.6 }}>
                                            {todayEntry.note || "Halaman kosong..."}
                                        </p>
                                        <div style={{ position: "absolute", bottom: "-20px", right: "-10px", opacity: 0.15, transform: "scaleX(-1)" }}><Quote size={32} color={T.accent} /></div>
                                    </div>
                                    <div style={{ marginTop: "4rem" }}>
                                        <HandwrittenText style={{ fontSize: "1rem", color: T.textMuted }}>Ketuk untuk menyunting...</HandwrittenText>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: "100%" }}>
                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ marginBottom: "2.5rem" }}>
                                        <PenLine size={48} color={T.accent} strokeWidth={1} style={{ opacity: 0.4 }} />
                                    </motion.div>
                                    <p className="font-serif" style={{ fontSize: "1.2rem", color: T.textSecondary, fontStyle: "italic", marginBottom: "3rem" }}>"Apa warna langitmu hari ini?"</p>
                                    <div className="wc-card" style={{ display: "inline-block", padding: "12px 36px", background: T.accent, color: "#fff", borderRadius: "14px", border: "none", opacity: 0.9 }}>
                                        <span className="font-serif-display" style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "2px" }}>MULAI MENULIS</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* HISTORY SECTION */}
                    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                            <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "4px", marginBottom: "1rem", opacity: 0.6 }}>Lembaran Lalu</div>
                            <div style={{ width: "40px", height: "1px", background: T.dividerColor, margin: "0 auto", opacity: 0.5 }} />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                            {Object.values(entries)
                                .filter(e => e.date !== todayKey)
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((entry, i) => (
                                    <motion.div key={entry.date} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} onClick={() => openModal(new Date(entry.date))} viewport={{ once: true }}>
                                        <div className="wc-card hover-ink-bleed" style={{ padding: "1.5rem 1.5rem 1.5rem 5rem", minHeight: "120px", border: `1px solid ${T.cardBorder}`, display: "flex", alignItems: "center", position: "relative", cursor: "pointer" }}>
                                            <WashStripe type={MOOD_CONFIG[entry.category].color === "#b07d62" ? "ochre" : "rose"} />

                                            {/* Date Tag */}
                                            <div className="wc-card" style={{
                                                position: "absolute", left: "-10px", top: "20px", width: "64px",
                                                background: usePaletteColors ? (MOOD_CONFIG[entry.category].color || "var(--wc-accent)") : "var(--wc-accent)",
                                                border: "none", color: "#fff", textAlign: "center", padding: "12px 0", borderRadius: "0 12px 12px 0", boxShadow: "var(--wc-shadow-sm)", zIndex: 10
                                            }}>
                                                <div className="font-handwriting" style={{ fontSize: "1.8rem", lineHeight: 0.8 }}>{new Date(entry.date).getDate()}</div>
                                                <div className="font-serif-display" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>{new Date(entry.date).toLocaleDateString('id-ID', { month: 'short' })}</div>
                                                <div style={{ position: "absolute", left: 0, bottom: -6, width: 0, height: 0, borderTop: "6px solid rgba(0,0,0,0.3)", borderLeft: "6px solid transparent" }} />
                                            </div>

                                            <div style={{ width: "100%", paddingLeft: "1.5rem" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: `1px dashed ${T.dividerColor}`, paddingBottom: "8px" }}>
                                                    <span className="font-serif-display" style={{ fontSize: "0.8rem", fontWeight: 700, color: T.textAccent, letterSpacing: "1.5px" }}>{MOOD_CONFIG[entry.category].label.toUpperCase()}</span>
                                                    <span className="font-serif" style={{ fontSize: "0.8rem", fontStyle: "italic", color: T.textMuted }}>{new Date(entry.date).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                                                </div>
                                                <p className="font-serif" style={{ fontSize: "1.1rem", color: T.textPrimary, fontStyle: "italic", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    "{entry.note || "Tanpa catatan..."}"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>

                        {/* EMPTY STATE */}
                        {Object.values(entries).filter(e => e.date !== todayKey).length === 0 && (
                            <div style={{ textAlign: "center", padding: "6rem 2rem", opacity: 0.4 }}>
                                <HandwrittenText style={{ fontSize: "1.2rem" }}>Belum ada jejak masa lalu...</HandwrittenText>
                            </div>
                        )}
                    </div>

                    {/* Footer Warning/Info */}
                    <div style={{ marginTop: "10rem", textAlign: "center" }}>
                        <HandwrittenText style={{ fontSize: "1.4rem", color: T.textAccent, marginBottom: "1.5rem", opacity: 0.8 }}>Ruang ini milikmu seutuhnya.</HandwrittenText>
                        <p className="font-serif" style={{ fontSize: "0.9rem", color: T.textSecondary, lineHeight: 1.8, fontStyle: "italic", maxWidth: "480px", margin: "0 auto", opacity: 0.8 }}>
                            Setiap kata tersimpan aman dalam local storage perangkatmu. <br />
                            Kenangan ini akan memudar jika kamu membersihkan memori peramban Anda.
                        </p>
                    </div>

                </Container>
            </main>

            {/* INPUT MODAL */}
            <AnimatePresence>
                {selectedDate && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDate(null)} style={{ position: "fixed", inset: 0, background: T.overlayBg, backdropFilter: "blur(6px)", zIndex: 1000 }} />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.cardBg, borderTopLeftRadius: "32px", borderTopRightRadius: "32px", zIndex: 1001, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -20px 60px rgba(0,0,0,0.15)", padding: "2.5rem 1.5rem" }}>

                            <WashStripe type="blue" />
                            <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "3rem" }}>
                                    <div>
                                        <h3 className="font-handwriting" style={{ fontSize: "2.4rem", color: T.textPrimary, lineHeight: 1 }}>{selectedDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                                        <p className="font-serif" style={{ fontSize: "1rem", color: T.textSecondary, fontStyle: "italic", marginTop: "8px" }}>Bagaimana harimu berjalan?</p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} className="wc-card" style={{ padding: "10px", background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: "50%" }}>
                                        <X size={20} color={T.textSecondary} />
                                    </button>
                                </div>

                                {/* Mood Selection */}
                                <div style={{ marginBottom: "3rem" }}>
                                    <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "1.5rem", fontWeight: 700 }}>Warna Hari Ini</div>
                                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "15px", margin: "0 -1rem", padding: "0 1rem 1rem" }}>
                                        {(Object.keys(MOOD_CONFIG) as MoodCategory[]).map((cat) => (
                                            <button key={cat} onClick={() => setSelectedMood(cat)}
                                                style={{
                                                    flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "18px",
                                                    background: selectedMood === cat ? "var(--wc-wash-ochre-light)" : "transparent",
                                                    border: `1px solid ${selectedMood === cat ? T.accent : "transparent"}`, cursor: "pointer", minWidth: "80px", transition: "all 0.3s"
                                                }}>
                                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: MOOD_CONFIG[cat].color, boxShadow: "var(--wc-shadow-sm)" }} />
                                                <span className="font-serif-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textPrimary }}>{MOOD_CONFIG[cat].label.toUpperCase()}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Editor */}
                                <div style={{ marginBottom: "3rem" }}>
                                    <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "1.5rem", fontWeight: 700 }}>Catatan Kecil</div>
                                    <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Tuliskan hal yang paling membekas..." rows={6}
                                        style={{ width: "100%", padding: "1.5rem", borderRadius: "20px", border: `1px dashed ${T.cardBorder}`, background: T.pageBg, fontFamily: "'Lora', serif", fontSize: "1.1rem", lineHeight: 1.7, color: T.textPrimary, outline: "none", resize: "none" }} />
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: "15px" }}>
                                    {entries[selectedDate.toISOString().split('T')[0]] && (
                                        <button onClick={handleDelete} className="wc-card" style={{ padding: "1.2rem", background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: "18px", color: T.textMuted }}>
                                            <Trash2 size={24} />
                                        </button>
                                    )}
                                    <button onClick={handleSave} disabled={!selectedMood} className="wc-card" style={{ flex: 1, padding: "1.2rem", background: selectedMood ? T.accent : T.cardBorder, color: "#fff", border: "none", borderRadius: "18px", cursor: selectedMood ? "pointer" : "not-allowed", transition: "all 0.3s" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                                            <Save size={20} />
                                            <span className="font-serif-display" style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "2px" }}>SIMPAN CERITA</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
