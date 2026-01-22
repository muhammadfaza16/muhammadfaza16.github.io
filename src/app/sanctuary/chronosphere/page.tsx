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
                <div style={{
                    minHeight: "100vh",
                    paddingTop: "10rem",
                    paddingBottom: "8rem",
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
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                                transition: 'color 0.3s ease',
                                color: 'var(--text-muted)',
                                textDecoration: 'none'
                            }}
                            className="group hover:text-rose-400"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Balik ke Hub</span>
                        </Link>

                        {/* Separator */}
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: 'linear-gradient(to right, transparent, var(--foreground), transparent)',
                            opacity: 0.06,
                            marginBottom: '3rem'
                        }} />

                        {/* HERO HEADER */}
                        <header style={{
                            textAlign: 'left',
                            marginBottom: 'clamp(5rem, 30vh, 10rem)',
                            position: 'relative'
                        }}>
                            {/* Floating Label */}
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '100px',
                                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                                    border: '1px solid rgba(244, 63, 94, 0.2)',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                <Clock size={12} style={{ color: 'rgba(244, 63, 94, 0.9)' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, color: 'rgba(244, 63, 94, 0.9)' }}>
                                    Kronosphere
                                </span>
                            </div>

                            {/* Title */}
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                                color: 'var(--foreground)',
                                marginBottom: '2.5rem',
                                lineHeight: 0.95,
                                letterSpacing: "-0.04em",
                                fontWeight: 400
                            }}>
                                Menanti <span style={{ fontStyle: 'italic', opacity: 0.8 }} className="text-rose-400">momen</span> di mana segalanya berubah.
                            </h1>

                            {/* Description */}
                            <p style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: '1.35rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                maxWidth: '38rem',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                opacity: 0.6
                            }}>
                                "Waktu itu bukan sekadar lewat. Dia lagi nabung buat sesuatu yang indah nanti."
                            </p>
                        </header>



                        {/* FEATURE: ANGEL CLOCK */}
                        <section style={{ marginBottom: '4rem' }}>
                            <AngelClock />
                        </section>

                        {/* ARCHIVES SECTION */}
                        <section>
                            {/* Section Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', opacity: 0.25 }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--foreground)' }}>
                                    Arsip Rindu
                                </span>
                                <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--foreground)', opacity: 0.15 }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
