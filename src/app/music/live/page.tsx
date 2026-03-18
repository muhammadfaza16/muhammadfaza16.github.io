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
            height: "100svh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
            color: isDark ? "#FFF" : "#1A1A1A",
            transition: "background-color 0.5s ease, color 0.5s ease"
        }}>
            {/* Header */}
            <div style={{ 
                padding: "0 16px", paddingTop: "env(safe-area-inset-top)", 
                display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", 
                marginTop: "16px", marginBottom: "8px" 
            }}>
                <div style={{ justifySelf: "start" }}>
                    <Link href="/music" style={{ textDecoration: "none" }}>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)",
                                border: "none",
                                padding: "8px", cursor: "pointer",
                                color: isDark ? "#FFF" : "#000",
                                borderRadius: "100px",
                            }}
                        >
                            <ChevronLeft size={24} color="currentColor" />
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
