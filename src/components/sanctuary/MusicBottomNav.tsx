"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Disc, Settings } from "lucide-react";
import { useAudio } from "../AudioContext";

export function MusicBottomNav({ isInline = false }: { isInline?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();

    // Only render on music-related pages
    const isMusicApp = pathname?.startsWith("/music") || pathname?.startsWith("/playlist");
    if (!isMusicApp) return null;

    const { activePlaylistId, queue, isPlayerExpanded, setIsPlayerExpanded } = useAudio();

    // If player is expanded, hide the fixed bottom nav entirely to prevent bleeding.
    // However, if we are rendering it INLINE inside the player itself, let it bypass this check.
    if (isPlayerExpanded && !isInline) return null;

    // If there is an active playlist ID, "Explore" logic can still use this info if needed.
    // "Player" action is now handled via state, so playerHref is redundant.
    const playerHref = "#player";

    const navItems = [
        { label: "Home", href: "/music", icon: Home },
        { label: "Explore", href: "/playlist", icon: Compass, matchPrefix: true },
        { label: "Player", href: playerHref, icon: Disc },
        { label: "Settings", href: "/music/master", icon: Settings },
    ];

    return (
        <div style={isInline ? {
            backgroundColor: "#fff",
            borderTop: "2px solid #000",
            padding: "10px 16px 0 16px",
            paddingBottom: "max(10px, env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            position: "relative",
            zIndex: 10
        } : {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTop: "2px solid #000",
            padding: "10px 16px 0 16px",
            paddingBottom: "max(10px, env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 100000,
            width: "100%",
        }}>
            {navItems.map((item) => {
                let isActive = false;
                
                if (isPlayerExpanded) {
                    isActive = item.label === "Player";
                } else {
                    if (item.label === "Home") {
                        isActive = pathname === "/music";
                    } else if (item.label === "Settings") {
                        isActive = pathname === "/music/master";
                    } else if (item.label === "Explore") {
                        isActive = pathname?.startsWith("/playlist") && pathname !== playerHref;
                    }
                }
                    
                const Icon = item.icon;

                return (
                    <motion.button
                        key={item.label}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (item.label === "Player") {
                                setIsPlayerExpanded(true);
                            } else {
                                setIsPlayerExpanded(false);
                                router.push(item.href);
                            }
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: isActive ? "#000" : "#888",
                            padding: "4px 12px",
                            transition: "all 0.1s ease-in-out"
                        }}
                    >
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.55rem",
                            fontWeight: isActive ? 800 : 500,
                            textTransform: "uppercase",
                            letterSpacing: "-0.02em"
                        }}>
                            {item.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
