"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Wind, Moon, Heart, Sun, Sparkles, Send, Plane } from "lucide-react";
import { useSanctuary } from "@/components/sanctuary/SanctuaryContext";

// --- DATA & CONTENT ---

const MOOD_CONTENT = {
    anxious: { title: "Kepala Ruwet", icon: Wind, color: "#10b981", desc: "Gravitasi lagi berat? Kita nol-kan dulu." },
    lonely: { title: "Butuh Temen", icon: Heart, color: "#ec4899", desc: "Sepi itu wajar di angkasa luas." },
    sleepless: { title: "Susah Tidur", icon: Moon, color: "#8b5cf6", desc: "Nebula di kepala masih aktif?" },
    calm: { title: "Aman Terkendali", icon: Check, color: "#3b82f6", desc: "Orbit stabil. Pertahankan." }
};

const REMINDERS = [
    "Hari ini, cukup jadi dirimu. Itu udah lebih dari cukup.",
    "Kalau capek, istirahat. Bukan menyerah, tapi sayang diri.",
    "Kamu nggak harus punya semua jawaban hari ini.",
    "Minum air. Tarik napas. Kamu lagi baik-baik aja.",
    "Progress kecil tetap progress. Jangan remehkan langkahmu."
];

const TRUTHS = [
    "Kamu itu 'stardust'. Terbuat dari material yang sama kayak bintang-bintang.",
    "Cahaya bintang butuh perjalanan panjang buat kelihatan. Usahamu juga gitu.",
    "Matahari aja tenggelam tiap hari buat recharge. Masa kamu mau on terus?",
    "Semesta nggak pernah bikin produk gagal. Kamu ada karena kamu dibutuhkan.",
    "Bumi muter pelan banget kalau dirasain. Kamu juga boleh pelan."
];

// --- SUB-COMPONENTS (Simplified for Wizard) ---

function StepRadar({ onSelect }: { onSelect: (mood: keyof typeof MOOD_CONTENT) => void }) {
    return (
        <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                <Wind size={24} />
            </div>
            <h2 className="font-serif text-2xl mb-2">Cek Radar</h2>
            <p className="font-serif text-[var(--text-secondary)] mb-8 max-w-xs">
                Gimana cuaca di dalem sana hari ini? Ada badai atau cerah?
            </p>
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                {(Object.entries(MOOD_CONTENT) as [keyof typeof MOOD_CONTENT, typeof MOOD_CONTENT.anxious][]).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--background)]" style={{ color: data.color }}>
                            <data.icon size={18} />
                        </div>
                        <div>
                            <div className="font-serif text-lg leading-tight group-hover:text-[var(--foreground)]">{data.title}</div>
                            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{data.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function StepRefuel({ onNext }: { onNext: () => void }) {
    const [reminder, setReminder] = useState("");

    useEffect(() => {
        setReminder(REMINDERS[Math.floor(Math.random() * REMINDERS.length)]);
    }, []);

    return (
        <div className="flex flex-col items-center text-center animate-fade-in justify-center h-full min-h-[50vh]">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20">
                <Sun size={24} />
            </div>
            <h2 className="font-serif text-2xl mb-6">Isi Bahan Bakar</h2>
            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] max-w-sm relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Sun size={64} /></div>
                <p className="font-serif text-xl italic leading-relaxed relative z-10">"{reminder}"</p>
            </div>
            <button onClick={onNext} className="btn-primary flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                Tangki Penuh <ArrowRight size={14} />
            </button>
        </div>
    );
}

function StepOptics({ onNext }: { onNext: () => void }) {
    const [revealed, setRevealed] = useState(false);
    const [truth, setTruth] = useState("");

    useEffect(() => {
        setTruth(TRUTHS[Math.floor(Math.random() * TRUTHS.length)]);
    }, []);

    return (
        <div className="flex flex-col items-center text-center animate-fade-in justify-center h-full min-h-[50vh]">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                <Sparkles size={24} />
            </div>
            <h2 className="font-serif text-2xl mb-2">Kalibrasi Lensa</h2>
            <p className="font-serif text-[var(--text-secondary)] mb-8 max-w-xs">
                Kadang pandangan kita burem karena terlalu banyak liat ke luar. Coba liat ke dalem.
            </p>

            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="w-48 h-48 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-500/5 transition-all cursor-pointer group"
                >
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-cyan-400">Ketuk untuk Kalibrasi</span>
                </button>
            ) : (
                <div className="animate-scale-in flex flex-col items-center">
                    <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 max-w-sm mb-8">
                        <p className="font-serif text-lg text-cyan-100/90 italic">"{truth}"</p>
                    </div>
                    <button onClick={onNext} className="btn-primary flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                        Pandangan Jelas <ArrowRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

function StepJettison({ onNext }: { onNext: () => void }) {
    const [text, setText] = useState("");
    const [isReleasing, setIsReleasing] = useState(false);

    const handleRelease = () => {
        if (!text.trim()) { onNext(); return; } // Allow skip if empty
        setIsReleasing(true);
        setTimeout(() => {
            setText("");
            setIsReleasing(false);
            onNext();
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6 border border-rose-500/20">
                <Send size={24} />
            </div>
            <h2 className="font-serif text-2xl mb-2">Buang Muatan</h2>
            <p className="font-serif text-[var(--text-secondary)] mb-6">
                Ada yang berat? Tulis di sini. Kita buang ke angkasa biar pesawat lebih ringan.
            </p>

            <div className="w-full relative mb-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tulis yang bikin berat..."
                    disabled={isReleasing}
                    className="w-full h-40 p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] font-serif resize-none focus:border-rose-400 focus:outline-none transition-all"
                    style={{
                        opacity: isReleasing ? 0 : 1,
                        transform: isReleasing ? "translateY(-50px) scale(0.9)" : "none",
                        filter: isReleasing ? "blur(10px)" : "none",
                        transition: "all 1s ease"
                    }}
                />
            </div>

            <button
                onClick={handleRelease}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${text.trim() ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)]'}`}
            >
                {text.trim() ? (isReleasing ? "Meluruhkan..." : "Lepaskan ke Angkasa") : "Nggak Ada, Lanjut"} {text.trim() && !isReleasing && <Send size={14} />}
            </button>
        </div>
    );
}

function StepLiftoff() {
    return (
        <div className="flex flex-col items-center text-center animate-fade-in justify-center h-full min-h-[50vh]">
            <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-8 border border-[var(--accent)]/20 animate-pulse">
                <Plane size={40} className="transform -rotate-45" />
            </div>
            <h2 className="font-serif text-3xl mb-4">Ready for Takeoff.</h2>
            <p className="font-serif text-lg text-[var(--text-secondary)] mb-10 max-w-xs">
                Sistem dicek. Bahan bakar diisi. Lensa dikalibrasi. Beban dibuang.<br /><br />
                Selamat terbang hari ini, Kapten.
            </p>
            <Link href="/sanctuary" className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Kembali ke Base <ArrowRight size={14} />
            </Link>
        </div>
    );
}

// --- MAIN WIZARD COMPONENT ---

export function FlightReadinessWizard() {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));

    return (
        <div className="w-full max-w-xl mx-auto px-4 py-8 min-h-screen flex flex-col">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/sanctuary" className="p-2 rounded-full hover:bg-[var(--card-bg)] text-[var(--text-secondary)] transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--border)]'}`}
                        />
                    ))}
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Step Content */}
            <div className="flex-1 flex flex-col justify-center pb-20">
                {step === 1 && <StepRadar onSelect={(mood) => nextStep()} />}
                {step === 2 && <StepRefuel onNext={nextStep} />}
                {step === 3 && <StepOptics onNext={nextStep} />}
                {step === 4 && <StepJettison onNext={nextStep} />}
                {step === 5 && <StepLiftoff />}
            </div>
        </div>
    );
}
