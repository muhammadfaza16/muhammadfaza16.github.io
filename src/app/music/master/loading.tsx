"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

export default function MasterLoading() {
    const headerFont = "var(--font-display), system-ui, sans-serif";

    return (
        <main style={{
            height: "100svh",
            backgroundColor: "#0A0A0A",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "#FFFFFF"
        }}>
            <div style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: "80px",
            }}>
                <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", display: "flex", flexDirection: "column", padding: "40px 20px" }}>
                    
                    {/* Header Skeleton */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", opacity: 0.3 }}>
                            <ChevronLeft size={16} /> <div style={{ width: "40px", height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "200px", height: "80px", background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08))", borderRadius: "16px" }} />
                    </div>

                    {/* Intelligence Card Skeleton */}
                    <div style={{
                        marginBottom: "24px",
                        height: "220px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "24px",
                        padding: "20px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "12px" }}>
                            <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "rgba(255,255,255,0.1)" }} />
                            <div style={{ width: "140px", height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ width: "80px", height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
                                    <div style={{ width: "100px", height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Tools Skeleton */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{
                                height: "76px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "20px",
                                padding: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                                    <div style={{ width: "120px", height: "14px", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }} />
                                    <div style={{ width: "180px", height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
