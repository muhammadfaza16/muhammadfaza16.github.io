"use client";

import React from "react";
import { Disc, ChevronLeft } from "lucide-react";

export default function PlaylistLoading() {
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";
    const theme = "dark"; // Defaulting to dark for skeleton consistency
    const isDark = theme === "dark";

    return (
        <main style={{
            height: "100svh",
            backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: isDark ? "#FFF" : "#000",
        }}>
            <div style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 16px 120px 16px",
            }}>
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Back Button Skeleton */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.3 }}>
                        <ChevronLeft size={16} /> 
                        <div style={{ width: "40px", height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                    </div>

                    {/* Hero Skeleton - Preparing Library */}
                    <div style={{
                        height: "240px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "24px",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "24px",
                            animation: "pulse 2s infinite"
                        }}>
                             <Disc size={32} color="rgba(255,255,255,0.3)" />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ width: "180px", height: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", margin: "0 auto" }} />
                            <div style={{ width: "120px", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", margin: "8px auto 0" }} />
                        </div>
                    </div>

                    {/* Controls Skeleton */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 4, height: "46px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }} />
                        <div style={{ flex: 1, height: "46px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }} />
                    </div>

                    {/* Search Skeleton */}
                    <div style={{ height: "46px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }} />

                    {/* Tracklist Skeleton */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", overflow: "hidden" }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                <div style={{ width: "20px", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ width: "140px", height: "14px", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }} />
                                    <div style={{ width: "100px", height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.98); }
                }
            `}</style>
        </main>
    );
}
