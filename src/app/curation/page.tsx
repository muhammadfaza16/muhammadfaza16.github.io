"use client";

import React from "react";
import { Container } from "@/components/Container";
import { ZenHideable } from "@/components/ZenHideable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CurationSimpleItem } from "@/components/curation/CurationSimpleItem";
import { StandardBackButton } from "@/components/ui/StandardBackButton";

// Sample Curation Data - Minimalist
const CURATION_DATA = [
    {
        id: "1",
        title: "How to Build for the Speed of Light",
        subtitle: "Twitter / X • Paul Graham",
        href: "https://twitter.com",
        year: "2024"
    },
    {
        id: "2",
        title: "The Psychology of Minimalist UI",
        subtitle: "Essay • Medium",
        href: "https://medium.com",
        year: "2023"
    },
    {
        id: "3",
        title: "Apple's Human Interface Guidelines",
        subtitle: "Reference • Apple",
        href: "https://developer.apple.com/design/human-interface-guidelines",
        year: "Manual"
    },
    {
        id: "4",
        title: "AI & The Future of Human Agency",
        subtitle: "Thread • Twitter",
        href: "https://twitter.com",
        year: "2024"
    },
    {
        id: "5",
        title: "Crafting Digital Sanctuaries",
        subtitle: "Manifesto • Personal",
        href: "#",
        year: "2024"
    }
];

export default function CurationPage() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#080808", // Slightly softer dark
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
                                Curation.
                            </h1>
                            <p style={{
                                fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
                                color: "rgba(255,255,255,0.5)",
                                lineHeight: 1.6,
                                maxWidth: "480px",
                                fontWeight: 300
                            }}>
                                A collection of signals in the noise.
                                Things I read, watched, and thought were worth keeping.
                            </p>
                        </section>

                        {/* List Content */}
                        <section>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                                {CURATION_DATA.map((item, idx) => (
                                    <CurationSimpleItem
                                        key={item.id}
                                        index={idx}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        href={item.href}
                                        year={item.year}
                                    />
                                ))}
                            </div>
                        </section>
                    </Container>
                </ZenHideable>
            </main>
        </div>
    );
}
