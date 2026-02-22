"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { Github, Twitter, Mail, ChevronLeft, Instagram } from "lucide-react";
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
                            width: "44px", // Standard iOS touch target minimum
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "transparent", // Remove glass background
                            borderRadius: "50%",
                            color: "var(--ink-secondary)", // Slightly muted
                            transition: "all 0.2s ease",
                            border: "none", // Remove border
                            textDecoration: "none",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "var(--ink-primary)";
                            e.currentTarget.style.transform = "translateX(-4px)"; // iOS style slide back intent
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "var(--ink-secondary)";
                            e.currentTarget.style.transform = "translateX(0)";
                        }}
                    >
                        <ChevronLeft size={32} strokeWidth={1} /> {/* Extra thin & slightly larger line */}
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 1, y: 20 }}
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
                    <div style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        width: "max-content",
                        maxWidth: "100%",
                        margin: "0 auto",
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "SF Pro Display", Helvetica, Arial, sans-serif',
                    }}>
                        {/* Name - Apple Style Header */}
                        <h1 style={{
                            fontSize: "clamp(2.8rem, 10vw, 4.5rem)", // Bigger size helps ultra-thin fonts
                            fontWeight: 100, // Ultra-thin
                            letterSpacing: "-0.01em", // Less tight than bold versions, thin needs air
                            color: "var(--ink-primary)",
                            lineHeight: 1.1,
                            marginBottom: "0.2rem",
                            margin: 0,
                            textAlign: "center",
                        }}>
                            Muhammad Faza
                        </h1>

                        {/* Subtitle - Apple Style Body/Secondary */}
                        <p style={{
                            fontSize: "clamp(0.9rem, 3vw, 1.1rem)", // Made slightly smaller for that minimalist understatement
                            color: "var(--ink-secondary)",
                            fontWeight: 300, // Light weight
                            letterSpacing: "0.03em", // Slightly increased tracking to balance smaller size
                            opacity: 0.5, // Even more subtle and less distracting
                            paddingBottom: "3.5rem",
                            paddingTop: "0.2rem", // Tighter to header
                            margin: 0,
                            textAlign: "center",
                        }}>
                            Software & Machine Learning Engineer
                        </p>

                        <nav style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0",
                            marginBottom: "3rem",
                            width: "100%",
                            padding: "0",
                        }}>
                            {[
                                { name: "about", href: "/about" },
                                { name: "blog", href: "/blog" },
                                { name: "projects", href: "/projects" },
                                { name: "experience", href: "/experience" }
                            ].map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 1, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                >
                                    <Link
                                        href={item.href}
                                        style={{
                                            fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
                                            fontWeight: 300, // Light weight for a delicate touch
                                            letterSpacing: "0.01em",
                                            color: "var(--ink-primary)",
                                            textDecoration: "none",
                                            padding: "0.5rem 0",
                                            borderRadius: "0",
                                            border: "none",
                                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            display: "inline-block",
                                            backgroundColor: "transparent",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = "var(--ink-secondary)";
                                            e.currentTarget.style.opacity = "0.5";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = "var(--ink-primary)";
                                            e.currentTarget.style.opacity = "1";
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </div>

                    {/* Social Icons */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        {[
                            { icon: Github, href: "https://github.com/mfazans23" },
                            { icon: Twitter, href: "https://twitter.com/scienfilix" },
                            { icon: Instagram, href: "https://instagram.com/scnflx23" },
                            { icon: Mail, href: "mailto:mfaza16717@mail.ugm.ac.id" }
                        ].map((Item, i) => (
                            <motion.a
                                key={i}
                                href={Item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 1, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                style={{
                                    padding: "0.5rem", // Minimal padding simply for touch target area
                                    color: "var(--ink-secondary)", // Start slightly muted
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "color 0.2s ease, transform 0.15s ease",
                                    textDecoration: "none",
                                    borderRadius: "8px", // small radius for the invisible touch target
                                    backgroundColor: "transparent", // No visible background
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = "var(--ink-primary)";
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = "var(--ink-secondary)";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <Item.icon size={28} strokeWidth={1.25} /> {/* Ultrathin icons */}
                            </motion.a>
                        ))}
                    </div>

                </motion.div>
            </main>
        </AtmosphericBackground>
    );
}
