"use client";

import React from "react";
import { ChevronLeft, Radio } from "lucide-react";

export default function LiveHubLoading() {
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
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}>
                    
                    {/* Header Skeleton */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "0 20px" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", opacity: 0.3 }}>
                            <ChevronLeft size={16} /> <div style={{ width: "40px", height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "120px", height: "40px", background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))", borderRadius: "12px" }} />
                        <div style={{ width: "180px", height: "40px", background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))", borderRadius: "12px", marginTop: "4px" }} />
                    </div>

                    {/* Hero Skeleton */}
                    <div style={{ padding: "0 20px" }}>
                        <div style={{
                            width: "100%", aspectRatio: "1/1", borderRadius: "32px",
                            background: "rgba(255,255,255,0.03)",
                            position: "relative", overflow: "hidden"
                        }}>
                             <div style={{
                                position: "absolute", bottom: "28px", left: "24px", right: "24px",
                                display: "flex", flexDirection: "column", gap: "12px"
                             }}>
                                <div style={{ width: "80%", height: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
                                <div style={{ width: "100%", height: "48px", background: "rgba(255,255,255,0.04)", borderRadius: "16px" }} />
                             </div>
                        </div>
                    </div>

                    {/* Active Stations Skeleton */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "24px" }}>
                            <Radio size={16} style={{ opacity: 0.3 }} />
                            <div style={{ width: "100px", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ display: "flex", gap: "16px", padding: "0 24px" }}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} style={{ flexShrink: 0, width: "135px", opacity: 0.4 }}>
                                    <div style={{ width: "135px", aspectRatio: "1/1", borderRadius: "24px", background: "rgba(255,255,255,0.03)", marginBottom: "12px" }} />
                                    <div style={{ width: "80%", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", marginBottom: "6px" }} />
                                    <div style={{ width: "50%", height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }} />
                                </div>
                            ))}
                        </div>
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
