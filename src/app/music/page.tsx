"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import {
    Music2,
    ListMusic,
    Radio as RadioIcon,
    Settings2,
    Search,
    Grid3X3,
    Power
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    { id: "songs", label: "Songs", icon: Music2, href: "/playlist/all" },
    { id: "playlists", label: "Playlists", icon: ListMusic, href: "/playlist" },
    { id: "radio", label: "Radio", icon: RadioIcon, href: "/music/radio" },
    { id: "master", label: "Master", icon: Settings2, href: "/music/master" },
];

const TOOLBAR = [
    { icon: Grid3X3, href: "/starlight" },
    { icon: Power, href: "/" },
];

export default function AudioHubPage() {
    return (
        <>
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a1a1a', zIndex: -1 }} />

            <ZenHideable>
                <main style={{
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* === DAP CHASSIS === */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        style={{
                            width: "100%",
                            maxWidth: "320px",
                            background: "linear-gradient(180deg, #2d2d2d 0%, #252525 100%)",
                            border: "2px solid #111",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 40px 70px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
                            overflow: "hidden"
                        }}
                    >
                        {/* Status Bar */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "1.25rem 1.25rem 0.25rem",
                        }}>
                            <span style={{
                                color: "#555",
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "3px",
                                textTransform: "uppercase"
                            }}>
                                Audio System
                            </span>
                        </div>

                        {/* Search */}
                        <div style={{ display: "flex", justifyContent: "center", padding: "0.5rem 0 0.5rem" }}>
                            <Link href="/playlist/all" style={{ textDecoration: "none" }}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        width: "32px", height: "32px", borderRadius: "50%",
                                        background: "#1e1e1e", border: "1.5px solid #3a3a3a",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer",
                                        boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)"
                                    }}
                                >
                                    <Search size={14} color="#777" strokeWidth={2.5} />
                                </motion.div>
                            </Link>
                        </div>

                        {/* 2x2 Icon Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            padding: "0.5rem 2rem 1.75rem",
                            gap: "0.25rem",
                        }}>
                            {MENU_ITEMS.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "1.25rem 0.5rem",
                                                cursor: "pointer",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <div style={{
                                                width: "44px", height: "44px", borderRadius: "12px",
                                                background: "#1e1e1e", border: "1.5px solid #383838",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.03)",
                                            }}>
                                                <Icon size={20} color="#aaa" strokeWidth={2} />
                                            </div>
                                            <span style={{
                                                color: "#888",
                                                fontSize: "0.6rem",
                                                fontWeight: 600,
                                                letterSpacing: "0.3px"
                                            }}>
                                                {item.label}
                                            </span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Bottom Toolbar */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "2.5rem",
                            padding: "0.75rem 1.5rem",
                            borderTop: "1px solid #1e1e1e",
                            background: "rgba(0,0,0,0.2)",
                        }}>
                            {TOOLBAR.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            whileHover={{ scale: 1.2, y: -2 }}
                                            whileTap={{ scale: 0.85 }}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", padding: "4px",
                                            }}
                                        >
                                            <Icon size={17} color="#555" strokeWidth={2} />
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                </main>
            </ZenHideable>
        </>
    );
}
