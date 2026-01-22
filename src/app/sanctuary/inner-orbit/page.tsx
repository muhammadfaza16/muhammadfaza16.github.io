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
                paddingTop: "clamp(5rem, 15vh, 10rem)",
                paddingBottom: "8rem"
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

                    {/* Header: Title */}
                    <header style={{
                        textAlign: 'left',
                        marginBottom: 'clamp(5rem, 30vh, 10rem)',
                        position: 'relative'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '100px',
                            backgroundColor: 'rgba(244, 63, 94, 0.05)',
                            border: '1px solid rgba(244, 63, 94, 0.2)',
                            marginBottom: '1.5rem',
                            color: '#f43f5e'
                        }}>
                            <Activity size={12} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.625rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontWeight: 600,
                                opacity: 0.9
                            }}>
                                Protokol Harian
                            </span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                            color: 'var(--foreground)',
                            marginBottom: '2.5rem',
                            lineHeight: 0.95,
                            letterSpacing: "-0.04em",
                            fontWeight: 400
                        }}>
                            Cek Kesiapan Terbang.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: '1.35rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            maxWidth: '38rem',
                            fontWeight: 300,
                            marginBottom: '2rem'
                        }}>
                            Dunia tak akan berhenti berputar hanya karena kita lelah, namun di sini, waktu adalah milikmu sepenuhnya. Sebelum gravitasi rutinitas menarikmu kembali, mari pelankan denyut dan kalibrasi pandangan. Isi kembali tangki semangat yang mulai mengering, dan lepaskan beban-beban kecil yang tak seharusnya kamu bawa terbang lebih jauh. Karena setiap perjalanan besar berhak dimulai dengan langkah yang jauh lebih ringan.
                        </p>
                    </header>

                    {/* THE STACK (Vertical List) */}
                    <div style={{
                        maxWidth: '36rem',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>


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
                    <div style={{
                        maxWidth: '36rem',
                        margin: '8rem auto 0',
                        textAlign: 'center',
                        opacity: 0.4
                    }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-secondary)' }}>
                            Akhir dari Protokol
                        </p>
                    </div>

                </Container>

            </div>
        </SanctuaryProvider>
    );
}
