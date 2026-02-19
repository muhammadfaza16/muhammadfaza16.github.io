"use client";

import React from "react";
import { Container } from "@/components/Container";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ZenHideable } from "@/components/ZenHideable";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { CurationSimpleItem } from "@/components/curation/CurationSimpleItem";

const WISHLIST_ITEMS = [
    {
        title: "MacBook Pro M4 Max",
        subtitle: "Workstation • Apple",
        href: "https://apple.com",
        status: "Planning"
    },
    {
        title: "Sony A7R V",
        subtitle: "Photography • Sony",
        href: "https://sony.com",
        status: "Wishlist"
    },
    {
        title: "Keychron Q1 Max",
        subtitle: "Peripherals • Keychron",
        href: "https://keychron.com",
        status: "Acquired"
    },
    {
        title: "Herman Miller Embody",
        subtitle: "Ergonomics • Herman Miller",
        href: "https://hermanmiller.com",
        status: "Dream"
    },
];

export default function WishlistPage() {
    return (
        <AtmosphericBackground variant="warm">
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
                                color: "var(--ink-primary)"
                            }}>
                                Wishlist.
                            </h1>
                            <p style={{
                                fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
                                color: "var(--ink-secondary)",
                                lineHeight: 1.6,
                                maxWidth: "480px",
                                fontWeight: 300
                            }}>
                                Curated objects of desire.
                                Tools for craft, comfort, and clarity.
                            </p>
                        </section>

                        {/* List Content */}
                        <section>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                borderTop: "1px solid var(--glass-border)"
                            }}>
                                {WISHLIST_ITEMS.map((item, idx) => (
                                    <CurationSimpleItem
                                        key={item.title}
                                        index={idx}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        href={item.href}
                                        year={item.status}
                                    />
                                ))}
                            </div>
                        </section>
                    </Container>
                </ZenHideable>
            </main>
        </AtmosphericBackground>
    );
}
