"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { Compass, ArrowLeft, Target, Heart, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { motion } from "framer-motion";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

const VISION_TRACKS = [
    {
        title: "Personal",
        icon: <Heart size={18} />,
        color: "#ff2d55",
        goals: [
            { title: "Physical Mastery", subtitle: "Wellness", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", href: "#", colSpan: 2 },
            { title: "Digital Sanctuary", subtitle: "Living", imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop", href: "#", colSpan: 1 },
        ]
    },
    {
        title: "Career",
        icon: <Briefcase size={18} />,
        color: "#5856d6",
        goals: [
            { title: "AI Product Architecture", subtitle: "Expertise", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop", href: "#", colSpan: 1 },
            { title: "Autonomous Systems", subtitle: "Innovation", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop", href: "#", colSpan: 2 },
        ]
    },
    {
        title: "Education",
        icon: <GraduationCap size={18} />,
        color: "#34c759",
        goals: [
            { title: "Computational Logic", subtitle: "Deep Learning", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop", href: "#", colSpan: 3 },
        ]
    }
];

export default function LifeCompassPage() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#050505",
            color: "white",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            <main style={{ position: "relative", zIndex: 1, paddingBottom: "8rem" }}>
                {/* Standard Back Button */}
                <StandardBackButton href="/starlight" />

                <ZenHideable hideInZen>
                    {/* Hero Intro */}
                    <section style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
                        <Container>
                            <div style={{ maxWidth: "600px" }}>
                                <h2 style={{
                                    fontSize: "clamp(2rem, 5vw, 2.5rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    marginBottom: "1.5rem"
                                }}>
                                    Your North Star, <span style={{ color: "rgba(255,255,255,0.4)" }}>mapped.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Visi jangka panjang yang ngebimbing setiap keputusan harian.
                                    Bukan cuma tentang apa yang mau dicapai, tapi siapa yang mau kita jadiin.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Tracks Content */}
                    {VISION_TRACKS.map((track, trackIdx) => (
                        <section key={track.title} style={{ marginTop: "4rem" }}>
                            <Container>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    marginBottom: "1.5rem",
                                    color: track.color
                                }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "10px",
                                        backgroundColor: `${track.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {track.icon}
                                    </div>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0, color: "white" }}>{track.title}</h3>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                                    gap: "1.5rem"
                                }}>
                                    {track.goals.map((goal, goalIdx) => (
                                        <IosBentoCard
                                            key={goal.title}
                                            title={goal.title}
                                            subtitle={goal.subtitle}
                                            imageUrl={goal.imageUrl}
                                            href={goal.href}
                                            colSpan={goal.colSpan}
                                            delay={(trackIdx * 0.2) + (goalIdx * 0.1)}
                                            accentColor={track.color}
                                        />
                                    ))}
                                </div>
                            </Container>
                        </section>
                    ))}
                </ZenHideable>
            </main>
        </div>
    );
}
