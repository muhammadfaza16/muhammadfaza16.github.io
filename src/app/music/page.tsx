"use client";

import Link from "next/link";
import { Music2, ListMusic, Settings2, ChevronLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    { id: "songs", label: "All Songs", subtitle: "Full Library", icon: Music2, href: "/playlist/all" },
    { id: "playlists", label: "Playlists", subtitle: "Curated Sets", icon: ListMusic, href: "/playlist" },
];

export default function AudioHubPage() {
    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: "#F5F0EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 16px 120px 16px",
            color: "#000"
        }}>
            <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "16px" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "4px", 
                                background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontWeight: 700, color: "#000",
                                fontSize: "0.75rem"
                            }}
                        >
                            <ChevronLeft size={14} /> Back
                        </motion.button>
                    </Link>
                    <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                        AUDIO
                    </span>
                    <div style={{ width: "44px" }} /> {/* Spacer to balance flex-between */}
                </div>


                {/* Main Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
                    {MENU_ITEMS.map((item) => (
                        <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                            <motion.div
                                whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                style={{
                                    backgroundColor: "#fff",
                                    border: borderStyle,
                                    boxShadow: "4px 4px 0 #000",
                                    padding: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "48px", height: "48px", border: borderStyle, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}>
                                        <item.icon size={24} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#000", letterSpacing: "-0.04em", textTransform: "uppercase" }}>{item.label}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>{item.subtitle}</span>
                                    </div>
                                </div>
                                <ArrowRight size={24} color="#000" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
