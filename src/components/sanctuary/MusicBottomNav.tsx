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

    const headerFont = "var(--font-display), system-ui, sans-serif";

    return (
        <div style={isInline ? {
            backgroundColor: "transparent",
            padding: "12px 16px",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            position: "relative",
            zIndex: 10
        } : {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 40px)",
            maxWidth: "360px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "24px",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 100000,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
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
                        isActive = pathname?.startsWith("/playlist");
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
                            gap: "2px",
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: isActive ? "#000" : "#999",
                            padding: "8px 0",
                            transition: "color 0.3s ease",
                            position: "relative"
                        }}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="nav-active"
                                style={{
                                    position: "absolute",
                                    top: "4px",
                                    width: "32px",
                                    height: "32px",
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                    borderRadius: "12px",
                                    zIndex: -1
                                }}
                            />
                        )}
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{
                            fontFamily: headerFont,
                            fontSize: "0.6rem",
                            fontWeight: isActive ? 800 : 600,
                            letterSpacing: "0.01em"
                        }}>
                            {item.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
