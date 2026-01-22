"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MirrorOfTruth } from "@/components/sanctuary/MirrorOfTruth";
import { DailyReminder } from "@/components/sanctuary/DailyReminder";
import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";

export default function ObservatoryPage() {
    return (
        <SanctuaryProvider>
            <div style={{
                minHeight: "100vh",
                paddingTop: "6rem",
                marginTop: "-6rem",
                paddingBottom: "clamp(4rem, 8vw, 8rem)",
                background: "var(--background)",
                position: "relative",
                overflow: "hidden"
            }} className="animate-fade-in">

                {/* Background Environment */}
                <GradientOrb />
                <CosmicStars />

                <Container>

                    {/* Navigation */}
                    <Link
                        href="/sanctuary"
                        className="group inline-flex items-center gap-3 mb-8 transition-colors"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs uppercase tracking-widest">Return to Hub</span>
                    </Link>

                    {/* Separator */}
                    <div style={{
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(to right, transparent, var(--foreground), transparent)",
                        opacity: 0.1,
                        marginBottom: "4rem"
                    }} />

                    {/* HERO HEADER (Matching Hub Style) */}
                    <header style={{
                        marginBottom: "6rem",
                        marginTop: "8rem",
                        position: "relative",
                        textAlign: "left"
                    }}>
                        {/* Zone Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 mb-6 border border-sky-500/20 animate-fade-in">
                            <Sparkles size={12} />
                            <span className="font-mono text-[10px] uppercase tracking-widest font-medium">
                                Sector B · The Observatory
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 8vw, 5.5rem)",
                            fontWeight: 400,
                            lineHeight: 0.9,
                            letterSpacing: "-0.04em",
                            marginBottom: "2rem",
                            color: "var(--foreground)",
                            maxWidth: "14ch",
                            position: "relative"
                        }}>
                            Langit Bening.
                        </h1>

                        {/* Description */}
                        <p style={{
                            fontSize: "1.25rem",
                            lineHeight: 1.6,
                            fontFamily: "'Source Serif 4', serif",
                            maxWidth: "36rem",
                            color: "var(--text-secondary)",
                            fontWeight: 300,
                            fontStyle: "italic"
                        }}>
                            Kadang di bawah, semuanya buram. Kita perlu naik sebentar.
                            Melihat kekhawatiranmu jadi titik kecil di kejauhan.
                        </p>
                    </header>


                    {/* COMPONENTS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8rem" }}>

                        {/* Daily Reminder */}
                        <section>
                            <DailyReminder />
                        </section>

                        {/* Divider */}
                        <div style={{
                            width: "100%",
                            height: "1px",
                            background: "linear-gradient(to right, transparent, var(--foreground), transparent)",
                            opacity: 0.05
                        }} />

                        {/* Mirror of Truth */}
                        <section>
                            <MirrorOfTruth />
                        </section>
                    </div>

                </Container>
            </div>
        </SanctuaryProvider>
    );
}
