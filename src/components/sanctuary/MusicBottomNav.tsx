"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Disc, Settings } from "lucide-react";
import { useAudio } from "../AudioContext";

export function MusicBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    // Only render on music-related pages
    const isMusicApp = pathname?.startsWith("/music") || pathname?.startsWith("/playlist");
    if (!isMusicApp) return null;

    const { activePlaylistId, queue, isPlayerExpanded, setIsPlayerExpanded } = useAudio();

    // If player is expanded, hide the bottom nav entirely to prevent it bleeding through as a weird border.
    if (isPlayerExpanded) return null;

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
        <div style={{
            position: "fixed",
            bottom: "16px",
            // Center horizontally
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            border: "2px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "8px 16px",
            display: "flex",
            gap: "32px",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000, // Stay above expanded GlobalBottomPlayer (99999)
            // Ensure width is reasonable on mobile
            width: "max-content",
            maxWidth: "calc(100% - 32px)",
        }}>
            {navItems.map((item) => {
                // Exact match for /music to avoid highlighting both if /music/something existed
                // but since /playlist and /playlist/[id] both belong to explore, we can use startsWith for explore
                // Highlighting logic:
                // Explore -> matches /playlist and /playlist/* (except if playerHref matches it strictly)
                // Settings -> matches /music/master
                // Player -> matches /music or /playlist/[id] exactly if it is the active one
                let isActive = false;
                
                // Strict priority: If player is expanded, ONLY the player icon is active
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
                        whileTap={{ y: 2, x: 2 }}
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
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: isActive ? "#000" : "#888",
                            padding: "4px 8px"
                        }}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
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
