"use client";

import { useState } from "react";
import { StarGate } from "@/components/auth/StarGate";
import { Container } from "@/components/Container";
import { ComfortStation } from "@/components/sanctuary/ComfortStation";
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
                <header style={{
                    marginBottom: "clamp(2rem, 4vw, 4rem)",
                    marginTop: "clamp(4rem, 6vw, 6rem)" // Extra space below lamp
                }}>
                    {/* Mono Label */}
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--accent)",
                        marginBottom: "1rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontWeight: 500
                    }}>
                        Ruang Sunyi
                    </div>

                    {/* Massive Title */}
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(3rem, 8vw, 6rem)",
                        fontWeight: 400,
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        marginBottom: "2rem",
                        color: "var(--foreground)",
                        maxWidth: "18ch"
                    }}>
                        Tempat Istirahat.
                    </h1>

                    {/* Description */}
                    <p style={{
                        fontSize: "1.25rem",
                        lineHeight: 1.6,
                        fontFamily: "'Source Serif 4', serif",
                        maxWidth: "40rem",
                        color: "var(--text-secondary)",
                        fontStyle: "italic"
                    }}>
                        "Aku nggak akan ganggu. Tapi kalau kamu butuh tempat buat sekadar... ada, pintunya selalu terbuka."
                    </p>
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
                        <ComfortStation />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 2. Mirror of Truth */}
                    <section>
                        <MirrorOfTruth />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 3. Letters of Light */}
                    <section>
                        <LettersOfLight />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 4. Star Glass */}
                    <section>
                        <StarGlass />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 5. Personal Letter */}
                    <section>
                        <PersonalLetter />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 6. Daily Reminder */}
                    <section>
                        <DailyReminder />
                    </section>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 auto", width: "60%" }} />

                    {/* 7. Zen Mode Teleport */}
                    <section>
                        <ZenTeleport />
                    </section>
                </div>
            </Container>
        </div>
    );
}
