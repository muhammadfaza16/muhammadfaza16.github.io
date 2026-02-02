"use client";

import React from "react";
import { Container } from "@/components/Container";
import { ZenHideable } from "@/components/ZenHideable";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { CurationSimpleItem } from "@/components/curation/CurationSimpleItem";

export function BlogClient({ posts }: { posts: any[] }) {
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
                                Writing.
                            </h1>
                            <p style={{
                                fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
                                color: "rgba(255,255,255,0.5)",
                                lineHeight: 1.6,
                                maxWidth: "480px",
                                fontWeight: 300
                            }}>
                                Segala sesuatu yang sempet diketik sebelum lupa.
                                Narasi pribadi, observasi teknologi, dan catatan perjalanan.
                            </p>
                        </section>

                        {/* Minimalist List */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {posts.map((post, idx) => (
                                <CurationSimpleItem
                                    key={post.slug}
                                    index={idx}
                                    title={post.title}
                                    subtitle={post.date}
                                    href={`/blog/${post.slug}`}
                                    year={post.readingTime}
                                />
                            ))}
                        </div>
                    </Container>
                </ZenHideable>
            </main>
        </div>
    );
}
