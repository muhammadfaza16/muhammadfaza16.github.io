"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Music } from "lucide-react";
import { Container } from "@/components/Container";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { ZenTeleport } from "@/components/sanctuary/ZenTeleport";
import { DeskLamp } from "@/components/sanctuary/DeskLamp";
import { GardenChime } from "@/components/sanctuary/GardenChime";
import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

import { MemoryBoxTile } from "@/components/sanctuary/MemoryBoxTile";
import { DailyReminder } from "@/components/sanctuary/DailyReminder";

export default function SanctuaryPage() {
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

                {/* Fixed Passive Elements */}
                <DeskLamp />
                <GardenChime />

                <Container>

                    {/* 1. HERO SECTION */}
                    <header style={{
                        marginBottom: "4rem",
                        marginTop: "12rem",
                        position: "relative",
                        textAlign: "left"
                    }}>
                        {/* Dedication Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/5 text-[var(--accent)] mb-6 border border-[var(--accent)]/10 animate-fade-in">
                            <Sparkles size={12} />
                            <span className="font-mono text-[10px] uppercase tracking-widest font-medium opacity-80">
                                A Space for You
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
                            fontWeight: 400,
                            lineHeight: 0.95,
                            letterSpacing: "-0.04em",
                            marginBottom: "2.5rem",
                            color: "var(--foreground)",
                            maxWidth: "18ch",
                            position: "relative"
                        }}>
                            Sini, pulang sebentar.
                        </h1>

                        {/* Description */}
                        <p style={{
                            fontSize: "1.35rem",
                            lineHeight: 1.6,
                            fontFamily: "'Source Serif 4', serif",
                            maxWidth: "38rem",
                            color: "var(--text-secondary)",
                            fontWeight: 300,
                            marginBottom: "4rem"
                        }}>
                            Dunia di luar lagi berisik banget, ya? Gapapa.
                            Taruh dulu berat di pundakmu di depan pintu.
                            Di sini, kamu nggak perlu jadi kuat. Cukup jadi kamu.
                        </p>

                        {/* Separator */}
                        <div style={{
                            width: "100%",
                            height: "1px",
                            background: "linear-gradient(to right, transparent, var(--foreground), transparent)",
                            opacity: 0.08,
                            marginBottom: "4rem",
                            marginTop: "2rem"
                        }} />

                        {/* 2. ZEN TELEPORT */}
                        <div style={{
                            marginBottom: "6rem",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <ZenTeleport />
                        </div>
                    </header>


                    {/* 3. MOBILE-FIRST ACTION STACK */}
                    <section className="relative z-10 max-w-xl mx-auto flex flex-col gap-6 pb-12">

                        {/* 1. DAILY REMINDER (Immediate Value) */}
                        <ScrollReveal delay={0.1}>
                            <DailyReminder />
                        </ScrollReveal>

                        {/* 2. PRIORITY ACTION: FLIGHT READINESS */}
                        <ScrollReveal delay={0.2}>
                            <Link href="/sanctuary/inner-orbit" className="group relative block w-full rounded-[2rem] overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] transition-all duration-500 hover:border-[var(--accent)] hover:shadow-[0_10px_40px_-10px_rgba(var(--accent-rgb),0.2)]">
                                {/* Animated Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 p-8 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20 mb-2 group-hover:scale-110 transition-transform duration-500">
                                        <Sparkles size={28} className="animate-pulse" />
                                    </div>

                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-2 block opacity-80">
                                            System Protocol
                                        </span>
                                        <h3 className="font-serif text-3xl text-[var(--foreground)] mb-2">
                                            Pre-Flight Check
                                        </h3>
                                        <p className="font-serif text-[var(--text-secondary)] text-sm max-w-xs mx-auto leading-relaxed">
                                            Cek kondisi hati, isi bahan bakar semangat, dan kalibrasi pandangan sebelum memulai hari.
                                        </p>
                                    </div>

                                    <div className="mt-4 px-6 py-2 rounded-full border border-[var(--border)] bg-[var(--background)] text-xs font-mono uppercase tracking-widest group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-colors">
                                        Start Sequence
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>

                        {/* 3. ARCHIVE: Memory Box */}
                        <ScrollReveal delay={0.3}>
                            <MemoryBoxTile />
                        </ScrollReveal>

                    </section>

                </Container>
            </div>
        </SanctuaryProvider>
    );
}
