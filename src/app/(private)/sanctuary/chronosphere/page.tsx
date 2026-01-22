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
                        <header className="mb-28 mt-36 relative text-left">
                            {/* Zone Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-500/8 text-rose-400/90 mb-10 border border-rose-500/15 animate-fade-in">
                                <Clock size={11} />
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-medium">
                                    The Chronosphere
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="font-serif text-[clamp(2.75rem,8vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] mb-10 text-foreground/95 max-w-[18ch]">
                                Counting down to someone special.
                            </h1>

                            {/* Description */}
                            <p className="text-[1.1rem] md:text-[1.25rem] leading-[1.7] font-serif text-white/40 italic max-w-xl font-light tracking-wide">
                                Time moves differently when you're waiting for something beautiful.
                                This is your compass, your calendar, your gentle reminder that every
                                day brings you closer.
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
