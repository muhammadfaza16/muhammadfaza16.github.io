"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { Library, ArrowLeft, Twitter, FileText, Bookmark } from "lucide-react";
import Link from "next/link";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

// Sample Curation Data - Designed to be high-quality placeholders
const CURATION_DATA = [
    {
        id: "1",
        type: "tweet",
        title: "How to Build for the Speed of Light",
        subtitle: "Twitter / X",
        imageUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
        href: "https://twitter.com",
        colSpan: 2,
        accentColor: "#1DA1F2"
    },
    {
        id: "2",
        type: "article",
        title: "The Psychology of Minimalist UI",
        subtitle: "Article / Medium",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        href: "https://medium.com",
        colSpan: 1,
        accentColor: "#facc15"
    },
    {
        id: "3",
        type: "reference",
        title: "Apple's Human Interface Guidelines",
        subtitle: "Reference / Apple",
        imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1964&auto=format&fit=crop",
        href: "https://developer.apple.com/design/human-interface-guidelines",
        colSpan: 1,
        accentColor: "#ffffff"
    },
    {
        id: "4",
        type: "tweet",
        title: "AI & The Future of Human Agency",
        subtitle: "Twitter / X",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop",
        href: "https://twitter.com",
        colSpan: 2,
        accentColor: "#1DA1F2"
    },
    {
        id: "5",
        type: "article",
        title: "Crafting Digital Sanctuaries",
        subtitle: "Essay",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop",
        href: "#",
        colSpan: 3,
        accentColor: "#a855f7"
    }
];

export default function CurationPage() {
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
                {/* Custom Header (iOS Style) */}
                <div style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    backdropFilter: "blur(20px) saturate(180%)",
                    backgroundColor: "rgba(5, 5, 5, 0.5)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    padding: "1rem 0"
                }}>
                    <Container>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Link href="/starlight" style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500
                            }} className="hover:text-white transition-colors">
                                <ArrowLeft size={18} />
                                Back
                            </Link>
                            <div style={{ textAlign: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", display: "block", marginBottom: "2px" }}>The Starlight</span>
                                <h1 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Curation</h1>
                            </div>
                            <div style={{ width: "40px" }} /> {/* Spacer */}
                        </div>
                    </Container>
                </div>

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
                                    Knowledge, <span style={{ color: "rgba(255,255,255,0.4)" }}>distilled.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Potongan-potongan digital yang gue simpan buat dibaca ulang.
                                    Dari filosofi teknologi sampai desain yang "nyawa"-nya dapet.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Bento Grid Content */}
                    <section style={{ marginTop: "2rem" }}>
                        <Container>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                                gridAutoFlow: "dense",
                                gap: "1.5rem"
                            }}>
                                {CURATION_DATA.map((item, idx) => (
                                    <IosBentoCard
                                        key={item.id}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        imageUrl={item.imageUrl}
                                        href={item.href}
                                        colSpan={item.colSpan}
                                        delay={idx * 0.1}
                                        accentColor={item.accentColor}
                                    />
                                ))}
                            </div>
                        </Container>
                    </section>
                </ZenHideable>
            </main>
        </div>
    );
}
