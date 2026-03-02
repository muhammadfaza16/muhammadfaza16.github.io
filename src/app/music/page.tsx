"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import { ChevronLeft, Music2, ListMusic, Radio as RadioIcon, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    {
        id: "songs",
        label: "Songs",
        icon: Music2,
        href: "/playlist/all",
        delay: 0.1
    },
    {
        id: "playlists",
        label: "Playlists",
        icon: ListMusic,
        href: "/playlist",
        delay: 0.2
    },
    {
        id: "radio",
        label: "Radio",
        icon: RadioIcon,
        href: "/music/radio",
        delay: 0.3
    },
    {
        id: "master",
        label: "Master",
        icon: Settings2,
        href: "/music/master",
        delay: 0.4
    }
];

export default function AudioHubPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            {/* Matte Gray Background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#282828',
                zIndex: -1
            }} />

            <ZenHideable>
                <main style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? "1rem" : "2.5rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Global Back Button */}
                    <Link href="/starlight">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                position: "fixed",
                                top: isMobile ? "1.5rem" : "2.5rem",
                                left: isMobile ? "1.5rem" : "2.5rem",
                                zIndex: 100,
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                background: "#3f3f46",
                                border: "1px solid #18181b",
                                borderBottom: "3px solid #18181b",
                                borderRadius: "6px",
                                color: "#d4d4d8",
                                textDecoration: "none",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ChevronLeft size={16} strokeWidth={3} />
                            <span>System</span>
                        </motion.div>
                    </Link>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            textAlign: "center",
                            marginBottom: "3rem",
                        }}
                    >
                        <h1 style={{
                            fontSize: isMobile ? "2rem" : "2.5rem",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            margin: 0,
                            color: "#d4d4d8",
                            textTransform: "uppercase"
                        }}>
                            Audio Hub
                        </h1>
                        <p style={{
                            fontSize: "0.75rem",
                            color: "#a1a1aa",
                            fontWeight: 700,
                            margin: "0.5rem 0 0 0",
                            textTransform: "uppercase",
                            letterSpacing: "2px"
                        }}>
                            Unified Control System
                        </p>
                    </motion.div>

                    {/* The 4-Grid Menu */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1.25rem",
                        width: "100%",
                        maxWidth: "340px", // Smaller, tighter layout
                        paddingBottom: "80px" // Space for bottom player
                    }}>
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: item.delay, type: "spring", stiffness: 300, damping: 20 }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: "#282828",
                                            border: "1px solid #18181b",
                                            borderBottom: "4px solid #18181b", // Crisper physical edge
                                            borderRadius: "10px",
                                            padding: "1.5rem 1rem", // Tighter internal margins
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.75rem",
                                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Icon size={32} color="#d4d4d8" strokeWidth={2.5} /> {/* Smaller tighter icon */}
                                        <span style={{
                                            color: "#a1a1aa",
                                            fontSize: "0.7rem", // Smaller font
                                            fontWeight: 800,
                                            letterSpacing: "1.5px", // Spaced out for legibility
                                            textTransform: "uppercase"
                                        }}>
                                            {item.label}
                                        </span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>
                </main>
            </ZenHideable>
        </>
    );
}
