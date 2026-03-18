"use client";

import React from "react";
import { LiveMusicPlayer } from "@/components/live/LiveMusicPlayer";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LiveMusicPage() {
    const { theme } = useTheme();
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const isDark = theme === "dark";

    return (
        <main style={{
            position: "relative",
            minHeight: "100svh",
            padding: "12px 16px 40px 16px",
            maxWidth: "500px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            backgroundColor: isDark ? "#0A0A0A" : "#f9f9f9",
            color: isDark ? "#FFF" : "#000",
            transition: "all 0.5s ease"
        }}>
            {/* Header */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px", marginBottom: "8px" }}>
                <div style={{ position: "absolute", left: 0 }}>
                    <Link href="/music" style={{ textDecoration: "none" }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
                                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0,0,0,0.05)",
                                padding: "6px 12px", cursor: "pointer",
                                fontFamily: headerFont, fontWeight: 800, color: isDark ? "#FFF" : "#000",
                                fontSize: "0.7rem", borderRadius: "100px",
                                boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.02)"
                            }}
                        >
                            <ChevronLeft size={14} /> Back
                        </motion.button>
                    </Link>
                </div>
                <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}>
                    Live Radio
                </span>
            </div>

            {/* Live Player */}
            <LiveMusicPlayer />
        </main>
    );
}
