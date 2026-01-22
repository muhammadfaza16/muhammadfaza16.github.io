"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Activity } from "lucide-react";
import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

import { ComfortStationV2 } from "@/components/sanctuary/ComfortStationV2";

import { MirrorOfTruth } from "@/components/sanctuary/MirrorOfTruth";
import { StarGlass } from "@/components/sanctuary/StarGlass";

export default function InnerOrbitPage() {
    return (
        <SanctuaryProvider>
            <div style={{
                minHeight: "100vh",
                background: "var(--background)",
                position: "relative",
                overflow: "hidden",
                paddingTop: "6rem",
                paddingBottom: "8rem"
            }} className="animate-fade-in">

                {/* Background Environment */}
                <GradientOrb />
                <CosmicStars />

                <Container>
                    {/* Header: Nav + Title */}
                    <div className="max-w-xl mx-auto mb-8">
                        <Link
                            href="/sanctuary"
                            className="group inline-flex items-center gap-3 mb-8 transition-colors text-[var(--text-muted)] hover:text-[var(--foreground)]"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-widest">Return to Hub</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <Activity size={18} />
                            </div>
                            <span className="font-mono text-xs uppercase tracking-widest text-rose-400">
                                Daily Check-up
                            </span>
                        </div>

                        <h1 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] mb-2">
                            Pre-Flight Check.
                        </h1>
                        <p className="font-serif text-[var(--text-secondary)]">
                            Satu per satu. Cek kondisi, isi energi, buang muatan.
                        </p>
                    </div>

                    {/* THE STACK (Vertical List) */}
                    <div className="max-w-xl mx-auto flex flex-col gap-8">


                        {/* 2. Main Comfort Tool (Heavy) */}
                        <ScrollReveal delay={0.2}>
                            <ComfortStationV2 />
                        </ScrollReveal>

                        {/* 3. Validation (Medium) */}
                        <ScrollReveal delay={0.3}>
                            <MirrorOfTruth />
                        </ScrollReveal>

                        {/* 4. Release (Interactive) */}
                        <ScrollReveal delay={0.4}>
                            <StarGlass />
                        </ScrollReveal>
                    </div>

                    {/* Footer / Done */}
                    <div className="max-w-xl mx-auto mt-12 text-center opacity-50">
                        <p className="font-mono text-[10px] uppercase tracking-widest">
                            End of Protocol
                        </p>
                    </div>

                </Container>

            </div>
        </SanctuaryProvider>
    );
}
