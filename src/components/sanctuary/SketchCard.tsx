"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface SketchCardProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function SketchCard({ children, title, className = "" }: SketchCardProps) {
    return (
        <div style={{
            position: "relative",
            background: "#f9fafb", // Very light gray (paper like)
            border: "2px solid #000",
            padding: "1.5rem",
            boxShadow: "4px 4px 0px 0px #000",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }} className={className}>

            {title && (
                <div style={{
                    borderBottom: "2px solid #000",
                    paddingBottom: "0.75rem",
                    marginBottom: "1.25rem",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>{title}</span>
                    <span style={{ fontSize: "1.2rem", lineHeight: 0 }}>///</span>
                </div>
            )}

            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}
