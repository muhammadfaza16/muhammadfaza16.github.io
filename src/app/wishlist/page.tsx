"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { Gift, ArrowLeft, ShoppingBag, Gamepad2, Laptop, Camera } from "lucide-react";
import Link from "next/link";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { motion } from "framer-motion";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

const WISHLIST_ITEMS = [
    {
        title: "MacBook Pro M4 Max",
        subtitle: "The Ultimate Workstation",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2052&auto=format&fit=crop",
        href: "https://apple.com",
        colSpan: 2,
        color: "#5ac8fa"
    },
    {
        title: "Sony A7R V",
        subtitle: "Visual Distillation",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938&auto=format&fit=crop",
        href: "https://sony.com",
        colSpan: 1,
        color: "#ff3b30"
    },
    {
        title: "Keychron Q1 Max",
        subtitle: "Tactile Precision",
        imageUrl: "https://images.unsplash.com/photo-1618384881928-34887bc50efd?q=80&w=2030&auto=format&fit=crop",
        href: "https://keychron.com",
        colSpan: 1,
        color: "#ffcc00"
    },
    {
        title: "Herman Miller Embody",
        subtitle: "Ergonomic Sanctuary",
        imageUrl: "https://images.unsplash.com/photo-1616464916356-3a777b2b59b1?q=80&w=2070&auto=format&fit=crop",
        href: "https://hermanmiller.com",
        colSpan: 2,
        color: "#34c759"
    },
];

export default function WishlistPage() {
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
                                    Objects <span style={{ color: "rgba(255,255,255,0.4)" }}>of desire.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Kumpulan barang-barang yang gak cuma fungsinya yang dapet, tapi estetikanya juga bikin girang.
                                    Investasi buat produktivitas dan kebahagiaan.
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
                                {WISHLIST_ITEMS.map((item, idx) => (
                                    <IosBentoCard
                                        key={item.title}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        imageUrl={item.imageUrl}
                                        href={item.href}
                                        colSpan={item.colSpan}
                                        delay={idx * 0.1}
                                        accentColor={item.color}
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
