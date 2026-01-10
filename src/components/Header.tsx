"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/blog", label: "Writing" },
        { href: "/project", label: "Project" },
        { href: "/about", label: "About" },
    ];

    const moreLinks = [
        { href: "/now", label: "Now", emoji: "⚡" },
        { href: "/time", label: "Time", emoji: "🕐" },
        { href: "/bookshelf", label: "Bookshelf", emoji: "📚" },
        { href: "/ideas", label: "Ideas", emoji: "💡" },
        { href: "/til", label: "TIL", emoji: "🎓" },
        { href: "/links", label: "Links", emoji: "🔗" },
        { href: "/changelog", label: "Changelog", emoji: "📝" },
        { href: "/uses", label: "Uses", emoji: "🛠️" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsMoreOpen(false);
    }, [pathname]);

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
                        style={{ gap: "2rem", alignItems: "center" }}
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

                        {/* More Dropdown */}
                        <div ref={moreRef} style={{ position: "relative" }}>
                            <button
                                onClick={() => setIsMoreOpen(!isMoreOpen)}
                                style={{
                                    fontSize: "0.8rem",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    padding: 0,
                                    color: isMoreOpen ? "var(--foreground)" : "var(--secondary)",
                                    transition: "color 0.2s ease"
                                }}
                                className="hover:text-[var(--foreground)]"
                            >
                                More
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        transform: isMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease"
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMoreOpen && (
                                <div
                                    className="animate-fade-in"
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 1rem)",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        minWidth: "180px",
                                        backgroundColor: "var(--background)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                        overflow: "hidden",
                                        zIndex: 100
                                    }}
                                >
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                padding: "0.75rem 1rem",
                                                fontSize: "0.9rem",
                                                color: isActive(link.href) ? "var(--foreground)" : "var(--text-secondary)",
                                                backgroundColor: isActive(link.href) ? "var(--hover-bg)" : "transparent",
                                                transition: "all 0.15s ease",
                                                textDecoration: "none"
                                            }}
                                            className="dropdown-item-hover"
                                        >
                                            <span>{link.emoji}</span>
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Logo (Visible on Mobile) */}
                    <div className="mobile-only" style={{ display: "flex", alignItems: "center" }}>
                        <Link
                            href="/"
                            style={{
                                opacity: pathname === "/" ? 1 : 0.5,
                                transition: "opacity 0.3s ease"
                            }}
                            onClick={() => setIsMenuOpen(false)}
                            className="hover:opacity-100"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Desktop Logo (Centered Absolute, Hidden on Mobile) */}
                    <div
                        className="desktop-flex"
                        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", alignItems: "center" }}
                    >
                        <Link
                            href="/"
                            style={{
                                opacity: pathname === "/" ? 1 : 0.5,
                                transition: "opacity 0.3s ease"
                            }}
                            className="hover:opacity-100"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Actions - Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {/* Time Icon */}
                        <Link
                            href="/time"
                            style={{
                                opacity: pathname === "/time" ? 1 : 0.5,
                                transition: "opacity 0.3s ease"
                            }}
                            onClick={() => setIsMenuOpen(false)}
                            className="hover:opacity-100"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </Link>
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
                            overflowY: "auto"
                        }}
                    >
                        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                            {/* Main Links */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: "1.25rem",
                                        letterSpacing: "0.05em"
                                    }}
                                    className={`transition-colors ${isActive(link.href.replace('#', '')) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Divider */}
                            <div style={{ width: "60px", height: "1px", backgroundColor: "var(--border)", margin: "0.5rem 0" }} />

                            {/* More Links */}
                            {moreLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: "1.1rem",
                                        letterSpacing: "0.05em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    }}
                                    className={`transition-colors ${isActive(link.href) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}
                                >
                                    <span>{link.emoji}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </Container>
        </header>
    );
}
