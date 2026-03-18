"use client";

import React, { Suspense } from "react";
import { LiveMusicPlayer } from "@/components/live/LiveMusicPlayer";
import { LiveMusicProvider } from "@/components/live/LiveMusicContext";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LiveMusicPageInner() {
    const { theme } = useTheme();
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const isDark = theme === "dark";
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session") || undefined;

    // Strictly lock body scroll to prevent iOS Safari rubber-banding / fake scrollbars
    React.useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalOverscroll = document.body.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.overscrollBehavior = originalOverscroll;
        };
    }, []);

    return (
        <LiveMusicProvider sessionId={sessionId}>
            <main style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "transparent",
                color: isDark ? "#FFF" : "#1A1A1A",
                transition: "background-color 0.5s ease, color 0.5s ease",
                zIndex: 9999
            }}>
                {/* Header */}
                <div style={{ 
                    padding: "0 16px", paddingTop: "env(safe-area-inset-top)", 
                    display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", 
                    marginTop: "16px", marginBottom: "8px" 
                }}>
                    <div style={{ justifySelf: "start" }}>
                        <Link href="/music/live-hub" style={{ textDecoration: "none" }}>
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
                        display: "flex", alignItems: "center", gap: "8px",
                        background: isDark ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.08)",
                        border: isDark ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(239, 68, 68, 0.2)",
                        padding: "6px 16px", borderRadius: "100px",
                        boxShadow: isDark ? "0 0 24px rgba(239, 68, 68, 0.4), inset 0 0 12px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(239, 68, 68, 0.1)"
                    }}>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                backgroundColor: "#FF3333",
                                boxShadow: "0 0 10px #FF3333"
                            }}
                        />
                        <span style={{ 
                            fontFamily: headerFont, fontWeight: 900, fontSize: "0.7rem", 
                            textTransform: "uppercase", letterSpacing: "0.15em", 
                            color: isDark ? "#FFECEC" : "#DC2626",
                            textShadow: isDark ? "0 0 12px rgba(255, 68, 68, 0.8)" : "none"
                        }}>
                            Live Radio
                        </span>
                    </div>
                </div>

                {/* Live Player */}
                <LiveMusicPlayer />
            </main>
        </LiveMusicProvider>
    );
}

export default function LiveMusicPage() {
    return (
        <Suspense>
            <LiveMusicPageInner />
        </Suspense>
    );
}
