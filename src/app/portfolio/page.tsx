"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { Github, Linkedin, Twitter, ArrowUpRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PortfolioPage() {
    return (
        <AtmosphericBackground variant="sage">
            <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

                {/* Back Button (Floating Top Left) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-6 left-6"
                >
                    <Link href="/starlight" className="text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors no-underline">
                        ← back
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center text-center max-w-2xl w-full"
                >
                    {/* Name */}
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 8vw, 4rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "var(--ink-primary)",
                        lineHeight: 1.1,
                        marginBottom: "0.5rem"
                    }}>
                        Muhammad Faza
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: "clamp(1.1rem, 4vw, 1.25rem)",
                        color: "var(--ink-secondary)",
                        fontFamily: "var(--font-nothing), cursive", // Use handwritten font for "builder" feel? or just serif
                        // Reference used a clean serif/sans mix. 
                        // Let's stick to standard sans but italic for "a builder."
                        fontStyle: "italic",
                        opacity: 0.8,
                        marginBottom: "3rem"
                    }}>
                        a builder.
                    </p>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
                        {[
                            { name: "blog", href: "/blog" },
                            { name: "projects", href: "/projects" },
                            { name: "experience", href: "/experience" },
                            { name: "contact", href: "mailto:hello@example.com" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                            >
                                <Link
                                    href={item.href}
                                    className="text-lg font-medium text-ink-primary hover:text-ink-secondary transition-all no-underline relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink-primary transition-all group-hover:w-full opacity-50"></span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div className="flex gap-6 mt-4">
                        {[
                            { icon: Github, href: "https://github.com/muhammadfaza16" },
                            { icon: Linkedin, href: "https://linkedin.com" },
                            { icon: Twitter, href: "https://twitter.com" }, // Using Twitter icon for X
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
                                className="p-3 rounded-full bg-black/5 hover:bg-black/10 text-ink-primary transition-all border border-black/5 backdrop-blur-sm"
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
