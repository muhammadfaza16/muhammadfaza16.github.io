"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function Loading() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const baseColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    return (
        <main style={{
            height: "100svh",
            backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
            color: isDark ? "#FFFFFF" : "#1A1A1A",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden"
        }}>
            <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "40px", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
                {/* Hero Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ width: "80px", height: "20px", borderRadius: "8px", backgroundColor: baseColor }} />
                    <div style={{ width: "220px", height: "80px", borderRadius: "12px", backgroundColor: baseColor }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {/* Continue Listening Skeleton */}
                    <div style={{
                        height: "120px",
                        borderRadius: "24px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ height: "30px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)", width: "100%", backgroundColor: baseColor }} />
                        <div style={{ flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "52px", height: "52px", borderRadius: "14px", backgroundColor: baseColor }} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ width: "60%", height: "16px", borderRadius: "4px", backgroundColor: baseColor }} />
                                <div style={{ width: "40%", height: "12px", borderRadius: "4px", backgroundColor: baseColor }} />
                            </div>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: baseColor }} />
                        </div>
                    </div>

                    {/* Library Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ width: "120px", height: "14px", borderRadius: "4px", backgroundColor: baseColor }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {/* Live Hub Large Card */}
                            <div style={{
                                gridColumn: "span 2",
                                height: "200px",
                                borderRadius: "24px",
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                                border: isDark ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(0, 0, 0, 0.05)",
                            }} />
                            {/* Small Cards */}
                            <div style={{ height: "70px", borderRadius: "24px", backgroundColor: baseColor }} />
                            <div style={{ height: "70px", borderRadius: "24px", backgroundColor: baseColor }} />
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ width: "140px", height: "14px", borderRadius: "4px", backgroundColor: baseColor }} />
                            <div style={{ width: "50px", height: "14px", borderRadius: "4px", backgroundColor: baseColor }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ aspectRatio: "1/1", borderRadius: "20px", backgroundColor: baseColor }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </main>
    );
}

