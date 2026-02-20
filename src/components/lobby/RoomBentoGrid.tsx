"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    Clock,
    Activity,
    Sparkles,
    Music
} from "lucide-react";

interface DockIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    iconColor: string;
    delay?: number;
}

const DockIcon = ({ title, href, icon, iconColor, delay = 0 }: DockIconProps) => {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.3,
                    delay,
                    type: "spring",
                    stiffness: 400,
                    damping: 24
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* iOS-style dark glass icon */}
                <div style={{
                    position: "relative",
                    width: "clamp(52px, 13.5vw, 62px)",
                    height: "clamp(52px, 13.5vw, 62px)",
                    borderRadius: "26%",
                    background: "rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(16px) saturate(150%)",
                    WebkitBackdropFilter: "blur(16px) saturate(150%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `
                        0 4px 12px rgba(0,0,0,0.1),
                        inset 0 1px 0.5px rgba(255,255,255,0.2)
                    `,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                }} className="hover:scale-105 active:scale-95">

                    {/* Icon with vivid color */}
                    <div style={{
                        color: iconColor,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    }}>
                        {React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 26, strokeWidth: 2.5 })}
                    </div>

                    {/* Specular highlight — top edge shine */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: "15%",
                        right: "15%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.45) 70%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 4,
                        filter: "blur(0.3px)",
                    }} />

                    {/* Glossy sheen */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
                        zIndex: 3,
                        pointerEvents: "none",
                        borderRadius: "26% 26% 0 0",
                    }} />
                </div>
            </motion.div>
        </Link>
    );
};

export function RoomBentoGrid() {
    const apps: DockIconProps[] = [
        {
            title: "Teman",
            href: "/guest",
            icon: <Users />,
            iconColor: "#FF9F0A" // Vivid Orange
        },
        {
            title: "Waktu",
            href: "/clock",
            icon: <Clock />,
            iconColor: "#32D74B" // Vivid Green
        },
        {
            title: "Ruang",
            href: "/starlight",
            icon: <Sparkles />,
            iconColor: "#0A84FF" // Vivid Blue
        },
        {
            title: "Lagu",
            href: "/playlist",
            icon: <Music />,
            iconColor: "#FF375F" // Vivid Pink
        },
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: "0.4rem 0",
        }}>
            <nav style={{
                padding: "0 1.5rem", // Increased padding pushes icons toward center
                width: "100%",
                maxWidth: "460px",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.2rem", // Reduced gap to bring icons closer together
                }}>
                    {apps.map((app, idx) => (
                        <DockIcon key={idx} {...app} delay={0.3 + idx * 0.06} />
                    ))}
                </div>
            </nav>
        </div>
    );
}
