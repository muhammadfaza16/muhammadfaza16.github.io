"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StandardBackButton } from "@/components/ui/StandardBackButton";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

export function BlogClient({ posts }: { posts: any[] }) {
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
                <StandardBackButton href="/starlight" className="!z-[101]" />
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
                            <div style={{ textAlign: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFCC00", display: "block", marginBottom: "2px" }}>The Starlight</span>
                                <h1 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Writing</h1>
                            </div>
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
                                    Half-baked <span style={{ color: "rgba(255,255,255,0.4)" }}>essays.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Segala sesuatu yang sempet diketik sebelum lupa.
                                    Narasi pribadi, observasi teknologi, dan catatan perjalanan.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Bento Grid Content */}
                    <section style={{ marginTop: "2rem" }}>
                        <Container>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                                gridAutoFlow: "dense",
                                gap: "1.5rem"
                            }}>
                                {posts.map((post, idx) => (
                                    <IosBentoCard
                                        key={post.slug}
                                        title={post.title}
                                        subtitle={`${post.date} • ${post.readingTime}`}
                                        imageUrl={post.thumbnail}
                                        href={`/blog/${post.slug}`}
                                        colSpan={idx === 0 ? 2 : 1}
                                        delay={idx * 0.1}
                                        accentColor="#FFCC00"
                                    >
                                        <p style={{
                                            fontSize: "0.85rem",
                                            color: "rgba(255,255,255,0.5)",
                                            lineHeight: 1.5,
                                            margin: 0,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden"
                                        }}>
                                            {post.excerpt}
                                        </p>
                                    </IosBentoCard>
                                ))}
                            </div>
                        </Container>
                    </section>
                </ZenHideable>
            </main>
        </div>
    );
}
