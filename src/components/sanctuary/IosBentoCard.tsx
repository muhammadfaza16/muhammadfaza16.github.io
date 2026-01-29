"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface IosBentoCardProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    href: string;
    className?: string;
    colSpan?: number;
    delay?: number;
    accentColor?: string;
    children?: React.ReactNode;
}

export function IosBentoCard({
    title,
    subtitle,
    imageUrl,
    href,
    className = "",
    colSpan = 1,
    delay = 0,
    accentColor = "var(--accent)",
    children
}: IosBentoCardProps) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                duration: 0.5,
                delay,
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            style={{
                position: "relative",
                gridColumn: `span ${colSpan}`,
                borderRadius: "24px",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                minHeight: "180px",
                cursor: "pointer"
            }}
            className={`group ${className}`}
        >
            {/* Background Image */}
            {imageUrl && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0
                }}>
                    <img
                        src={imageUrl}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.6,
                            transition: "transform 0.5s ease"
                        }}
                        className="group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)",
                    }} />
                </div>
            )}

            {/* Content Container */}
            <div style={{
                position: "relative",
                zIndex: 1,
                padding: "1.25rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backdropFilter: imageUrl ? "none" : "blur(20px) saturate(180%)",
                backgroundColor: imageUrl ? "transparent" : "rgba(255, 255, 255, 0.02)"
            }}>
                {/* Header / Icon if needed could go here */}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                        {subtitle && (
                            <span style={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: accentColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: "0.25rem",
                                display: "block"
                            }}>
                                {subtitle}
                            </span>
                        )}
                        <h3 style={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "white",
                            lineHeight: 1.2,
                            margin: 0,
                            letterSpacing: "-0.01em"
                        }}>
                            {title}
                        </h3>
                    </div>
                    <ExternalLink size={14} color="white" style={{ opacity: 0.4 }} className="group-hover:opacity-100 transition-opacity" />
                </div>

                {children && (
                    <div style={{ marginTop: "0.75rem" }}>
                        {children}
                    </div>
                )}
            </div>

            {/* Glossy Reflection (Standard iOS detail) */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none"
            }} />
        </motion.a>
    );
}
