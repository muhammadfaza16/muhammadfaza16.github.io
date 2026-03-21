"use client";

import React, { Suspense } from "react";
import { LiveMusicPlayer } from "@/components/live/LiveMusicPlayer";
import { useLiveMusic } from "@/components/live/LiveMusicContext";
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
    const { switchSession } = useLiveMusic();

    // Switch session on mount, don't switch back on unmount (keep playing)
    React.useEffect(() => {
        switchSession(sessionId);
    }, [sessionId, switchSession]);

    // Strictly lock body scroll to prevent iOS Safari rubber-banding
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
            <header style={{ 
                width: "100%", 
                paddingTop: "calc(env(safe-area-inset-top) + 8px)", 
                zIndex: 10,
                transition: "all 0.5s ease"
            }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link href="/music/live-hub" style={{ textDecoration: "none" }}>
                            <motion.button 
                                whileHover={{ scale: 1.05, x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ 
                                    display: "flex", alignItems: "center", justifyContent: "center", 
                                    background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.05)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                                    padding: "8px", cursor: "pointer", 
                                    color: isDark ? "#FFF" : "#000",
                                    borderRadius: "100px",
                                    backdropFilter: "blur(8px)"
                                }}
                            >
                                <ChevronLeft size={24} />
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
                            fontFamily: headerFont, 
                            fontWeight: 900, 
                            fontSize: "0.85rem", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.1em", 
                            color: isDark ? "#FFECEC" : "#DC2626",
                            textShadow: isDark ? "0 0 12px rgba(255, 68, 68, 0.8)" : "none"
                        }}>
                            Live Radio
                        </span>
                    </div>

                    <div style={{ width: "40px" }} />
                </div>
            </header>
            {/* Live Player */}
            <LiveMusicPlayer />
        </main>
    );
}

export default function LiveMusicPage() {
    return (
        <Suspense>
            <LiveMusicPageInner />
        </Suspense>
    );
}
