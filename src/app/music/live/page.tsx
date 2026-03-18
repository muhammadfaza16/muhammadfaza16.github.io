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
                                background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.05)",
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
                <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
                    border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)",
                    padding: "6px 14px", borderRadius: "100px",
                    boxShadow: isDark ? "0 0 20px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(239, 68, 68, 0.1)"
                }}>
                    <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{
                            width: "6px", height: "6px", borderRadius: "50%",
                            backgroundColor: "#EF4444",
                            boxShadow: "0 0 8px rgba(239, 68, 68, 0.8)"
                        }}
                    />
                    <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: isDark ? "#FFF" : "#DC2626" }}>
                        Live Radio
                    </span>
                </div>
            </div>

            {/* Live Player */}
            <LiveMusicPlayer />
        </main>
    );
}
