"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { Github, Linkedin, Twitter, Mail, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PortfolioPage() {
    return (
        <AtmosphericBackground variant="sage">
            <main style={{
                minHeight: "100svh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                position: "relative",
            }}>

                {/* Back Button */}
                <div style={{
                    position: "fixed",
                    top: "24px",
                    left: "24px",
                    zIndex: 40,
                }}>
                    <Link
                        href="/starlight"
                        prefetch={false}
                        aria-label="Go Back"
                        style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(30, 30, 30, 0.4)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: "50%",
                            color: "white",
                            transition: "all 0.2s ease",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            textDecoration: "none",
                        }}
                    >
                        <ChevronLeft size={24} />
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        maxWidth: "640px",
                        width: "100%",
                    }}
                >
                    {/* Name */}
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 8vw, 4rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "var(--ink-primary)",
                        lineHeight: 1.1,
                        marginBottom: "0.5rem",
                        margin: 0,
                    }}>
                        Muhammad Faza
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: "clamp(1.1rem, 4vw, 1.25rem)",
                        color: "var(--ink-secondary)",
                        fontStyle: "italic",
                        opacity: 0.8,
                        marginBottom: "3rem",
                        marginTop: "0.5rem",
                    }}>
                        a builder.
                    </p>

                    {/* Navigation Links */}
                    <nav style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "1.5rem",
                        marginBottom: "3rem",
                    }}>
                        {[
                            { name: "blog", href: "/blog" },
                            { name: "projects", href: "/projects" },
                            { name: "experience", href: "/experience" },
                            { name: "contact", href: "mailto:hello@muhammadfaza.com" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                            >
                                <Link
                                    href={item.href}
                                    style={{
                                        fontSize: "1.05rem",
                                        fontWeight: 500,
                                        color: "var(--ink-primary)",
                                        textDecoration: "none",
                                        padding: "0.3rem 0",
                                        borderBottom: "1.5px solid transparent",
                                        transition: "border-color 0.2s ease",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ink-primary)")}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        {[
                            { icon: Github, href: "https://github.com/muhammadfaza16" },
                            { icon: Linkedin, href: "https://linkedin.com" },
                            { icon: Twitter, href: "https://twitter.com" },
                            { icon: Mail, href: "mailto:hello@muhammadfaza.com" }
                        ].map((Item, i) => (
                            <motion.a
                                key={i}
                                href={Item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                style={{
                                    padding: "0.65rem",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    backdropFilter: "blur(8px)",
                                    color: "var(--ink-primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.2s ease, transform 0.15s ease",
                                    textDecoration: "none",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "scale(1)"; }}
                            >
                                <Item.icon size={20} strokeWidth={2} />
                            </motion.a>
                        ))}
                    </div>

                </motion.div>
            </main>
        </AtmosphericBackground>
    );
}
