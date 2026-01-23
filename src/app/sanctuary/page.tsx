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
import { SanctuaryHero } from "@/components/sanctuary/SanctuaryHero";
import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

import { MemoryBoxTile } from "@/components/sanctuary/MemoryBoxTile";
import { DailyReminder } from "@/components/sanctuary/DailyReminder";
import { ConcertEntryTile } from "@/components/sanctuary/ConcertEntryTile";

export default function SanctuaryPage() {
    return (
        <>
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

                    {/* 1. HERO SECTION (Dynamic) */}
                    <SanctuaryHero />


                    {/* 3. MOBILE-FIRST ACTION STACK */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '36rem',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        paddingBottom: '3rem'
                    }}>

                        {/* 1. DAILY REMINDER (Immediate Value) */}
                        <ScrollReveal delay={0.1}>
                            <DailyReminder />
                        </ScrollReveal>

                        {/* 2. PRIORITY ACTION: FLIGHT READINESS */}
                        <ScrollReveal delay={0.2}>
                            <Link
                                href="/sanctuary/inner-orbit"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    borderRadius: '1.5rem',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border)',
                                    transition: 'all 0.5s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Animated Gradient Background */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to bottom right, rgba(var(--accent-rgb), 0.1), transparent, transparent)',
                                    opacity: 0.5
                                }} />

                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                                    gap: '1.5rem',
                                    zIndex: 10
                                }}>
                                    {/* Header Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "100px",
                                            border: "1px solid var(--accent)",
                                            background: "rgba(var(--background-rgb), 0.5)"
                                        }}>
                                            <Sparkles style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                                            <span style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.65rem",
                                                color: "var(--accent)",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.1em",
                                                fontWeight: 600
                                            }}>
                                                Protokol Sistem
                                            </span>
                                        </span>

                                        <div style={{ opacity: 0.5, color: "var(--text-secondary)" }}>
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: 'clamp(1.5rem, 3.5vw, 1.8rem)',
                                                color: 'var(--foreground)',
                                                marginBottom: '0.4rem',
                                                fontWeight: 500
                                            }}>
                                                Cek Kesiapan Terbang
                                            </h3>
                                            <p style={{
                                                fontFamily: "'Source Serif 4', serif",
                                                fontSize: '1rem',
                                                color: 'var(--text-secondary)',
                                                maxWidth: '40ch',
                                                lineHeight: 1.5
                                            }}>
                                                Sebelum semesta menarikmu kembali, mari pelankan denyut dan lepaskan beban yang tak perlu dibawa terbang hari ini.
                                            </p>
                                        </div>

                                        <div style={{
                                            display: 'inline-flex',
                                            padding: '0.375rem 1rem',
                                            borderRadius: '100px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            fontSize: '0.625rem',
                                            fontFamily: 'var(--font-mono)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: 'var(--foreground)',
                                            alignSelf: 'flex-start'
                                        }}>
                                            Mulai Urutan
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>

                        {/* 3. ARCHIVE: Memory Box */}
                        <ScrollReveal delay={0.3}>
                            <MemoryBoxTile />
                        </ScrollReveal>

                        {/* 4. EVENT: Concert Entry */}
                        <ScrollReveal delay={0.4}>
                            <ConcertEntryTile />
                        </ScrollReveal>
                    </section>

                </Container>
            </div>
        </>
    );
}
