"use client";

import React from "react";
import { Container } from "@/components/Container";
import { ZenHideable } from "@/components/ZenHideable";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { CurationSimpleItem } from "@/components/curation/CurationSimpleItem";
import { motion } from "framer-motion";

const VISION_TRACKS = [
    {
        title: "Personal",
        color: "#ff2d55",
        goals: [
            { title: "Physical Mastery", subtitle: "Wellness • Optimization", href: "#", year: "Ongoing" },
            { title: "Digital Sanctuary", subtitle: "Living • Environment", href: "#", year: "2026" },
        ]
    },
    {
        title: "Career",
        color: "#5856d6",
        goals: [
            { title: "AI Product Architecture", subtitle: "Expertise • Engineering", href: "#", year: "Focus" },
            { title: "Autonomous Systems", subtitle: "Innovation • R&D", href: "#", year: "Future" },
        ]
    },
    {
        title: "Education",
        color: "#34c759",
        goals: [
            { title: "Computational Logic", subtitle: "Deep Learning • Theory", href: "#", year: "Q3 2026" },
        ]
    }
];

export default function LifeCompassPage() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#080808",
            color: "#e5e5e5",
            fontFamily: "var(--font-sans)",
            position: "relative"
        }}>
            {/* Standard Back Button */}
            <StandardBackButton href="/starlight" />

            <main style={{ paddingBottom: "6rem" }}>
                <ZenHideable hideInZen>
                    <Container>
                        {/* Minimal Hero */}
                        <section style={{ paddingTop: "4rem", paddingBottom: "4rem", maxWidth: "600px" }}>
                            <h1 style={{
                                fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                                fontWeight: 300,
                                letterSpacing: "-0.04em",
                                lineHeight: 1.1,
                                marginBottom: "1.5rem",
                                color: "#fff"
                            }}>
                                Life Compass.
                            </h1>
                            <p style={{
                                fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
                                color: "rgba(255,255,255,0.5)",
                                lineHeight: 1.6,
                                maxWidth: "480px",
                                fontWeight: 300
                            }}>
                                North Star metrics for a life well-lived.
                                Guiding principles and long-term targets.
                            </p>
                        </section>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3rem"
                        }}>
                            {VISION_TRACKS.map((track, trackIdx) => (
                                <div key={track.title} style={{ marginBottom: "1rem" }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        marginBottom: "1.5rem",
                                        paddingBottom: "0.5rem",
                                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                                    }}>
                                        <h2 style={{
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.1em",
                                            color: track.color,
                                            margin: 0,
                                            fontFamily: "var(--font-mono)"
                                        }}>
                                            {track.title}
                                        </h2>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {track.goals.map((goal, goalIdx) => (
                                            <CurationSimpleItem
                                                key={goal.title}
                                                index={goalIdx}
                                                title={goal.title}
                                                subtitle={goal.subtitle}
                                                href={goal.href}
                                                year={goal.year}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </ZenHideable>
            </main>
        </div>
    );
}
