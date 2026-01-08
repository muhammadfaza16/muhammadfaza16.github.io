"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/blog", label: "Journal" },
        { href: "/#works", label: "Project" },
    ];

    return (
        <header
            className="glass"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                borderBottom: "1px solid var(--border)",
                transition: "background-color 0.3s ease, border-color 0.3s ease",
                height: "5rem" // Fixed height for consistency
            }}
        >
            <Container>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "5rem" }}>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <nav
                        style={{ gap: "2rem" }}
                        className="desktop-flex no-scrollbar"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                                className={`link-underline transition-colors ${isActive(link.href.replace('#', '')) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)] hover:text-[var(--foreground)]'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Logo (Visible on Mobile) */}
                    <div className="mobile-only">
                        <Link
                            href="/"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                letterSpacing: "-0.025em"
                            }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Desktop Logo (Centered Absolute, Hidden on Mobile) */}
                    <div
                        className="desktop-only"
                        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                    >
                        <Link
                            href="/"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.75rem",
                                fontWeight: 700,
                                letterSpacing: "-0.025em",
                                transition: "opacity 0.3s ease"
                            }}
                            className="hover:opacity-70"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Actions - Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <ThemeToggle />

                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            className="mobile-only"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                color: "var(--foreground)",
                                padding: "0.5rem",
                                marginRight: "-0.5rem"
                            }}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                // Close Icon
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                // Menu Icon
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div
                        className="mobile-only glass animate-fade-in"
                        style={{
                            position: "absolute",
                            top: "5rem", // Below header
                            left: 0,
                            right: 0,
                            borderBottom: "1px solid var(--border)",
                            padding: "2rem 0",
                            height: "calc(100vh - 5rem)", // Full screen minus header
                            backgroundColor: "var(--background)",
                        }}
                    >
                        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: "1.25rem",
                                        letterSpacing: "0.05em",
                                        fontFamily: "'Playfair Display', serif"
                                    }}
                                    className={`transition-colors ${isActive(link.href.replace('#', '')) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </Container>
        </header>
    );
}
