"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, User, Mail, BookOpen } from "lucide-react";

export function GlobalBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    // Hide on the lock screen lobby (assuming it's exactly "/")
    if (pathname === "/") return null;

    const navItems = [
        { label: "Home", href: "/portfolio", icon: Home },
        { label: "Explore", href: "/journey", icon: Compass },
        { label: "Notes", href: "/blog", icon: BookOpen },
        { label: "About", href: "/about", icon: User },
    ];

    return (
        <div style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            border: "2px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "8px 16px",
            display: "flex",
            gap: "24px",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100, // Stay above player and content
        }}>
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <motion.button
                        key={item.label}
                        whileTap={{ y: 2, x: 2 }}
                        onClick={() => router.push(item.href)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: isActive ? "#000" : "#999",
                            padding: "4px"
                        }}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
                            fontWeight: isActive ? 700 : 400,
                            textTransform: "uppercase"
                        }}>
                            {item.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
