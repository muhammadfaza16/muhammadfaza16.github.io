"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { StarGate } from "@/components/auth/StarGate";
import { Container } from "@/components/Container";
import { ComfortStationV2 as ComfortStation } from "@/components/sanctuary/ComfortStationV2";
import { LettersOfLight } from "@/components/sanctuary/LettersOfLight";
import { StarGlass } from "@/components/sanctuary/StarGlass";
import { MirrorOfTruth } from "@/components/sanctuary/MirrorOfTruth";
import { PersonalLetter } from "@/components/sanctuary/PersonalLetter";
import { DailyReminder } from "@/components/sanctuary/DailyReminder";
import { ZenTeleport } from "@/components/sanctuary/ZenTeleport";
import { GardenChime } from "@/components/sanctuary/GardenChime";
import { DeskLamp } from "@/components/sanctuary/DeskLamp";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";

import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function SanctuaryPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    if (!isUnlocked) {
        return (
            <StarGate
                gateType="angel"
                onUnlock={() => setIsUnlocked(true)}
            />
        );
    }

    return (
        <SanctuaryProvider>
            <div style={{
                minHeight: "100vh",
                paddingTop: "6rem", // Space for fixed navbar + a bit extra
                marginTop: "-6rem", // Cancel out main-content-padding
                paddingBottom: "clamp(4rem, 8vw, 8rem)",
                background: "var(--background)",
                position: "relative",
                overflow: "hidden" // Prevent orbs from causing horizontal shift
            }} className="animate-fade-in">


                {/* Passive Features */}
                <DeskLamp />
                <GardenChime />

                {/* Background Effects */}
                <GradientOrb />
                <CosmicStars />

                <Container>
                    {/* Header - Matches Homepage Hero Pattern */}
                    {/* Header - Minimalist 'Steve Jobs' Refinement */}
                    <header style={{
                        marginBottom: "8rem",
                        marginTop: "12rem",
                        position: "relative",
                        textAlign: "left" // Should be left aligned or centered? User usually likes left for personal stuff, but center for 'Apple' vibes. Let's stick to the existing alignment but refine it.
                        // Actually, Apple hero sections are often centered text. Let's stick to the current left/center hybrid or purely left.
                        // Looking at previous code, it seems centered. Let's ensure it.
                        // Wait, previous code didn't specify textAlign, so it was left by default.
                    }}>

                        {/* Mono Label - Refined */}
                        <div style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--accent)", // Could use a softer gray for pure minimalism, but accent is fine.
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.25em",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            opacity: 0.8
                        }}>
                            <span className="w-12 h-[1px] bg-[var(--accent)]"></span>
                            Orbit Rahasia
                        </div>

                        {/* Title - Tighter & Cleaner */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 9vw, 6.5rem)", // Slightly larger scale
                            fontWeight: 400, // Keep it thin/regular for elegance
                            lineHeight: 0.9,
                            letterSpacing: "-0.05em",
                            marginBottom: "2.5rem",
                            color: "var(--foreground)",
                            maxWidth: "16ch", // Tighter wrap
                            position: "relative"
                        }}>
                            Dunia lagi berisik, ya?
                        </h1>

                        {/* Description - Elevated Typography */}
                        <p style={{
                            fontSize: "1.35rem",
                            lineHeight: 1.5,
                            fontFamily: "'Source Serif 4', serif",
                            maxWidth: "38rem", // Optimal measure
                            color: "var(--text-secondary)",
                            fontWeight: 300, // Light weight
                            marginBottom: "4rem"
                        }}>
                            Sini sembunyi dulu. Lepas topeng superheromu di pintu. Di sini kamu boleh diem, boleh 'pause', dan nggak perlu jadi apa-apa. Aman.
                        </p>

                        {/* Scroll Hint - Minimalist */}
                        <div className="flex flex-col items-start gap-3 opacity-40 animate-pulse" style={{ animationDuration: "3s" }}>
                            <span className="text-[0.6rem] font-mono uppercase tracking-[0.3em] text-[var(--text-secondary)]">Scroll to exhale</span>
                        </div>
                    </header>

                    {/* Section Divider - Cosmic */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        padding: "clamp(1rem, 2vw, 2rem) 0",
                        opacity: 0.4,
                        marginBottom: "clamp(2rem, 4vw, 4rem)"
                    }}>
                        <div style={{ flex: 1, maxWidth: "100px", height: "1px", background: "linear-gradient(to right, transparent, var(--border))" }} />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--accent)" }}>
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
                        </svg>
                        <div style={{ flex: 1, maxWidth: "100px", height: "1px", background: "linear-gradient(to left, transparent, var(--border))" }} />
                    </div>

                    {/* Main Content */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(3rem, 6vw, 6rem)",
                        maxWidth: "48rem",
                        margin: "0 auto"
                    }}>
                        {/* 1. Comfort Station */}
                        <section>
                            <ScrollReveal>
                                <ComfortStation />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 2. Mirror of Truth */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <MirrorOfTruth />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 3. Letters of Light */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <LettersOfLight />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 4. Star Glass */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <StarGlass />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 5. Personal Letter */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <PersonalLetter />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 6. Daily Reminder */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <DailyReminder />
                            </ScrollReveal>
                        </section>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                        {/* 7. Zen Mode Teleport */}
                        <section>
                            <ScrollReveal delay={0.1}>
                                <ZenTeleport />
                            </ScrollReveal>
                        </section>
                    </div>
                </Container>
            </div>
        </SanctuaryProvider>
    );
}
