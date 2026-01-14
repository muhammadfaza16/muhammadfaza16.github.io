"use client";

import Link from "next/link";
import { Container } from "./Container";
import { useZen } from "./ZenContext";


export function Footer() {
    const { isZen } = useZen();

    return (
        <footer style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            paddingTop: "5rem",
            paddingBottom: "3rem",
            borderTop: "1px solid var(--border)",
            opacity: isZen ? 0 : 1,
            pointerEvents: isZen ? "none" : "auto",
            transition: "opacity 0.5s ease"
        }}>
            <Container>
                {/* Main Footer Content */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", marginBottom: "3rem" }} className="md:grid-cols-2">

                    {/* Left Side - Brand */}
                    <div className="animate-fade-in">
                        <Link
                            href="/"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "2rem",
                                fontWeight: 400,
                                letterSpacing: "-0.04em", // Tight tracking matching Hero
                                display: "inline-block",
                                marginBottom: "1.25rem",
                                color: "var(--foreground)",
                                transition: "opacity 0.3s ease"
                            }}
                            className="hover:opacity-70"
                        >
                            The Almanack of Broken Wanderer
                        </Link>
                        <p style={{ fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "20rem", fontWeight: 300, opacity: 0.7 }}>
                            Tempat nge-dump random thoughts. Kadang nyambung, seringnya nggak.
                        </p>
                    </div>

                    {/* Right Side - Links */}
                    <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
                        {/* Navigation */}
                        <div>
                            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.25rem", opacity: 0.5 }}>
                                Navigation
                            </h4>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <li>
                                    <Link href="/blog" style={{ opacity: 0.8, transition: "opacity 0.3s" }} className="hover:opacity-100">
                                        Writing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#works" style={{ opacity: 0.8, transition: "opacity 0.3s" }} className="hover:opacity-100">
                                        Project
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.25rem", opacity: 0.5 }}>
                                Connect
                            </h4>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <li>
                                    <a href="https://x.com/scienfilix" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.8, transition: "opacity 0.3s" }} className="hover:opacity-100">
                                        Twitter / X
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/mfazans23" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.8, transition: "opacity 0.3s" }} className="hover:opacity-100">
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.8, transition: "opacity 0.3s" }} className="hover:opacity-100">
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: "1rem" }} />



                {/* Copyright */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontSize: "0.75rem", opacity: 0.5 }}>
                    <p>&copy; {new Date().getFullYear()} Muhammad Faza NS.</p>
                    <p style={{ fontStyle: "italic" }}>Written with honesty.</p>
                </div>
            </Container>
        </footer>
    );
}
