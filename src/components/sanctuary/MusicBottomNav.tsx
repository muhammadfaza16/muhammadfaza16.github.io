"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, Disc, Settings, Radio } from "lucide-react";
import { useAudio } from "../AudioContext";
import { useTheme } from "../ThemeProvider";

export function MusicBottomNav({ isInline = false }: { isInline?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();

    // Only render on music-related pages
    const isMusicApp = pathname?.startsWith("/music");
    if (!isMusicApp) return null;

    const { activePlaylistId, queue, isPlayerExpanded, setIsPlayerExpanded } = useAudio();
    const { theme } = useTheme();

    const isLivePage = pathname === "/music/live";
    if ((isPlayerExpanded || isLivePage) && !isInline) return null;

    // If there is an active playlist ID, "Explore" logic can still use this info if needed.
    // "Player" action is now handled via state, so playerHref is redundant.
    const playerHref = "#player";

    const navItems = [
        { label: "Home", href: "/music", icon: Home },
        { label: "Explore", href: "/music/playlist", icon: Compass, matchPrefix: true },
        { label: "Live", href: "/music/live-hub", icon: Radio },
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
            bottom: "calc(20px + env(safe-area-inset-bottom))",
            left: "50%",
            transform: "translateX(-50%) translateZ(0)",
            width: "calc(100% - 40px)",
            maxWidth: "360px",
            backgroundColor: theme === "dark" ? "rgba(20, 20, 20, 0.55)" : "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(40px) saturate(180%)",
            border: theme === "dark" 
                ? "1px solid rgba(255, 255, 255, 0.08)" 
                : "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 100000,
            overflow: "hidden",
            boxShadow: theme === "dark" 
                ? "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)" 
                : "0 10px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
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
                        isActive = pathname?.startsWith("/music/playlist");
                    } else if (item.label === "Live") {
                        isActive = pathname === "/music/live-hub" || pathname === "/music/live";
                    }
                }
                    
                const Icon = item.icon;

                const content = (
                    <>
                        {isActive && (
                            <motion.div 
                                layoutId="nav-active"
                                style={{
                                    position: "absolute",
                                    top: "4px",
                                    width: "32px",
                                    height: "32px",
                                    background: theme === "dark" 
                                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.25))" 
                                        : "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15))",
                                    borderRadius: "12px",
                                    zIndex: -1,
                                    boxShadow: "0 4px 8px rgba(99, 102, 241, 0.1)"
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
                    </>
                );

                if (item.label === "Player") {
                    return (
                        <motion.button
                            key={item.label}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPlayerExpanded(true)}
                            style={navItemStyle(isActive, theme, headerFont)}
                        >
                            {content}
                        </motion.button>
                    );
                }

                return (
                    <Link 
                        key={item.label} 
                        href={item.href} 
                        prefetch={true}
                        style={{ textDecoration: "none", flex: 1, display: "flex" }}
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            style={navItemStyle(isActive, theme, headerFont)}
                        >
                            {content}
                        </motion.button>
                    </Link>
                );
            })}
        </div>
    );
}

function navItemStyle(isActive: boolean, theme: string, headerFont: string): React.CSSProperties {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        flex: 1,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: isActive 
            ? (theme === "dark" ? "#FFF" : "#000") 
            : (theme === "dark" ? "rgba(255,255,255,0.4)" : "#999"),
        padding: "8px 0",
        transition: "color 0.3s ease",
        position: "relative",
        width: "100%"
    };
}
