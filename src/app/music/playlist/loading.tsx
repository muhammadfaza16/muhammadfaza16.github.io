"use client";

import React from "react";
import { ChevronLeft, Search } from "lucide-react";

export default function LibraryLoading() {
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const isDark = true; // Defaulting to dark for skeleton

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
                padding: "40px 20px 140px 20px",
            }}>
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Header Skeleton */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", opacity: 0.3 }}>
                            <ChevronLeft size={16} /> <div style={{ width: "40px", height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "200px", height: "40px", background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))", borderRadius: "12px" }} />
                        <div style={{ width: "150px", height: "40px", background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))", borderRadius: "12px", marginTop: "4px" }} />
                    </div>

                    {/* Search Skeleton */}
                    <div style={{
                        height: "52px", borderRadius: "18px", 
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        display: "flex", alignItems: "center", padding: "0 18px", gap: "12px"
                    }}>
                        <Search size={20} style={{ opacity: 0.2 }} />
                        <div style={{ width: "100px", height: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
                    </div>

                    {/* Bento Grid Skeleton */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ gridColumn: "span 2", height: "120px", borderRadius: "24px", background: "rgba(255,255,255,0.03)" }} />
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ aspectRatio: "1/1", borderRadius: "24px", background: "rgba(255,255,255,0.03)", animation: `pulse ${1.5 + i * 0.1}s infinite ease-in-out` }} />
                        ))}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                    100% { opacity: 0.3; }
                }
            `}</style>
        </main>
    );
}
