"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/components/Container";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { AngelClock } from "@/components/sanctuary/AngelClock";
import { LettersOfLight } from "@/components/sanctuary/LettersOfLight";
import { PersonalLetter } from "@/components/sanctuary/PersonalLetter";
import { ToastProvider } from "@/components/ui/Toast";
import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";

export default function ChronospherePage() {
    return (
        <ToastProvider>
            <SanctuaryProvider>
                <div className="min-h-screen pt-24 -mt-24 pb-[clamp(4rem,8vw,8rem)] bg-background relative overflow-hidden animate-fade-in">

                    {/* Background Environment */}
                    <GradientOrb />
                    <CosmicStars />

                    <Container>

                        {/* Navigation */}
                        <Link
                            href="/sanctuary"
                            className="group inline-flex items-center gap-3 mb-8 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-widest">Return to Hub</span>
                        </Link>

                        {/* Separator */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-[0.06] mb-20" />

                        {/* HERO HEADER */}
                        <header className="mb-24 mt-24 relative text-center">
                            {/* Floating Label */}
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-12"
                                style={{
                                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                                    border: '1px solid rgba(244, 63, 94, 0.1)'
                                }}
                            >
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-medium text-rose-400/90">
                                    Chronosphere
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light leading-tight tracking-tight mb-8 text-foreground/90 mx-auto max-w-[20ch]"
                            >
                                Waiting for the <span className="italic text-rose-400/80">moment</span> everything changes.
                            </h1>

                            {/* Description */}
                            <p className="text-[1.1rem] leading-relaxed font-serif text-white/40 italic max-w-lg mx-auto font-light tracking-wide">
                                "Time isn't just passing. It's accumulating towards something beautiful."
                            </p>
                        </header>



                        {/* FEATURE: ANGEL CLOCK */}
                        <section className="mb-56 md:mb-72">
                            <AngelClock />
                        </section>

                        {/* ARCHIVES SECTION */}
                        <section>
                            {/* Section Header */}
                            <div className="flex items-center gap-5 mb-20 opacity-25">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">
                                    Archives
                                </span>
                                <div className="h-px flex-1 bg-foreground opacity-15" />
                            </div>

                            <div className="flex flex-col gap-28">
                                <PersonalLetter />
                                <LettersOfLight />
                            </div>
                        </section>

                    </Container>
                </div>
            </SanctuaryProvider>
        </ToastProvider>
    );
}
