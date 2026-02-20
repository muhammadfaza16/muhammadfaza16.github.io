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
                        fontSize: "clamp(2.8rem, 9vw, 4.5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        color: "var(--ink-primary)",
                        lineHeight: 1.1,
                        marginBottom: "0.5rem",
                        fontFamily: "var(--font-serif), serif",
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
                    <nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-12 w-full max-w-[280px] sm:max-w-none mx-auto">
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
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    href={item.href}
                                    className="flex w-full items-center justify-center rounded-full border border-transparent px-6 py-3 text-[1.05rem] font-medium text-[var(--ink-primary)] no-underline transition-all duration-400 ease-out hover:-translate-y-1 hover:border-black/10 hover:bg-black/5 active:scale-95"
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
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
                                className="flex items-center justify-center p-[0.65rem] rounded-full bg-black/5 border border-black/5 text-[var(--ink-primary)] no-underline transition-all duration-300 hover:scale-110 hover:bg-black/10 active:scale-95 backdrop-blur-sm"
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
