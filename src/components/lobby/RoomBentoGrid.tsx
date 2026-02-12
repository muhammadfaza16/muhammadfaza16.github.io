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

interface NavIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    bgColor: string;
    inkColor: string;
    delay?: number;
}

const NavIcon = ({ title, href, icon, bgColor, inkColor, delay = 0 }: NavIconProps) => {
    return (
        <Link href={href} style={{ textDecoration: 'none' }} className="group">
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.5,
                    delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                {/* The Icon Circle */}
                <div
                    className="journal-icon-circle"
                    style={{
                        background: bgColor,
                        color: inkColor,
                    }}
                >
                    {icon}
                </div>

                {/* Label */}
                <span className="font-journal-hand" style={{
                    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                    fontWeight: 500,
                    color: "var(--ink-secondary, #5d534a)",
                    textAlign: "center",
                    letterSpacing: "0.01em",
                    transition: "color 0.2s ease"
                }}>
                    {title}
                </span>
            </motion.div>
        </Link>
    );
};

export function RoomBentoGrid() {
    const apps: NavIconProps[] = [
        {
            title: "Teman",
            href: "/guest",
            icon: <Users />,
            bgColor: "rgba(255, 173, 173, 0.25)",
            inkColor: "#c45b5b"
        },
        {
            title: "Waktu",
            href: "/time",
            icon: <Clock />,
            bgColor: "rgba(160, 196, 255, 0.25)",
            inkColor: "#5b7daa"
        },
        {
            title: "Hidup",
            href: "/clock",
            icon: <Activity />,
            bgColor: "rgba(181, 214, 167, 0.25)",
            inkColor: "#4a7c59"
        },
        {
            title: "Ruang",
            href: "/starlight",
            icon: <Sparkles />,
            bgColor: "rgba(212, 181, 230, 0.25)",
            inkColor: "#7a5b99"
        },
        {
            title: "Lagu",
            href: "/playlist",
            icon: <Music />,
            bgColor: "rgba(255, 214, 165, 0.25)",
            inkColor: "#b07d42"
        },
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            paddingBottom: "clamp(1.25rem, 3vh, 2.5rem)"
        }}>
            <nav style={{
                padding: "0 1.5rem",
                width: "100%",
                maxWidth: "380px",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                }}>
                    {apps.map((app, idx) => (
                        <NavIcon key={idx} {...app} delay={0.6 + idx * 0.08} />
                    ))}
                </div>
            </nav>
        </div>
    );
}
