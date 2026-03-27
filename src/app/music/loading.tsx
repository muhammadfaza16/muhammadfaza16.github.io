"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function Loading() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const shimmerBase = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const shimmerHighlight = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

    const SkeletonCard = ({ height, width = "100%", borderRadius = "24px", padding = "16px" }: any) => (
        <div style={{
            height,
            width,
            borderRadius,
            padding,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.3)",
            position: "relative",
            overflow: "hidden"
        }}>
            <div className="skeleton-shimmer" />
        </div>
    );

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
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .skeleton-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, ${shimmerHighlight}, transparent);
                    animation: shimmer 1.5s infinite;
                }
            `}</style>

            <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "40px" }}>
                {/* Hero Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ width: "80px", height: "20px", borderRadius: "8px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}>
                        <div className="skeleton-shimmer" />
                    </div>
                    <div style={{ width: "220px", height: "80px", borderRadius: "12px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}>
                        <div className="skeleton-shimmer" />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {/* Continue Listening Skeleton */}
                    <div style={{
                        height: "120px",
                        borderRadius: "24px",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.45)",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.5)",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ height: "30px", borderBottom: "1px solid rgba(0,0,0,0.02)", width: "100%", backgroundColor: shimmerBase }} />
                        <div style={{ flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "52px", height: "52px", borderRadius: "14px", backgroundColor: shimmerBase }} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ width: "60%", height: "16px", borderRadius: "4px", backgroundColor: shimmerBase }} />
                                <div style={{ width: "40%", height: "12px", borderRadius: "4px", backgroundColor: shimmerBase }} />
                            </div>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: shimmerBase }} />
                        </div>
                        <div className="skeleton-shimmer" />
                    </div>

                    {/* Library Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ width: "120px", height: "14px", borderRadius: "4px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}>
                            <div className="skeleton-shimmer" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {/* Live Hub Large Card */}
                            <div style={{
                                gridColumn: "span 2",
                                height: "200px",
                                borderRadius: "24px",
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
                                border: isDark ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(0, 0, 0, 0.08)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div className="skeleton-shimmer" />
                            </div>
                            {/* Small Cards */}
                            <div style={{ height: "70px", borderRadius: "24px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}><div className="skeleton-shimmer" /></div>
                            <div style={{ height: "70px", borderRadius: "24px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}><div className="skeleton-shimmer" /></div>
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ width: "140px", height: "14px", borderRadius: "4px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}><div className="skeleton-shimmer" /></div>
                            <div style={{ width: "50px", height: "14px", borderRadius: "4px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}><div className="skeleton-shimmer" /></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ aspectRatio: "1/1", borderRadius: "20px", backgroundColor: shimmerBase, position: "relative", overflow: "hidden" }}>
                                    <div className="skeleton-shimmer" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
