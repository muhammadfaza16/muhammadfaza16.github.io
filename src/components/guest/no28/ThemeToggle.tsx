"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, THEME_META, ThemeMode } from "./ThemeContext";

export function ThemeToggle() {
    const { mode, cycleTheme } = useTheme();
    const meta = THEME_META[mode];
    const order: ThemeMode[] = ["default", "night", "golden"];
    const nextMode = order[(order.indexOf(mode) + 1) % order.length];
    const nextMeta = THEME_META[nextMode];

    return (
        <motion.button
            onClick={cycleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title={`Ganti ke "${nextMeta.label}"`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                background: "rgba(128,128,128,0.08)",
                border: "1px solid rgba(128,128,128,0.15)",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontFamily: "'Caveat', cursive",
                color: "inherit",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
            }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={mode}
                    initial={{ y: 8, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -8, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: "1.1rem", lineHeight: 1 }}
                >
                    {meta.emoji}
                </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
                <motion.span
                    key={mode}
                    initial={{ x: 5, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.7 }}
                    exit={{ x: -5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ letterSpacing: "1px", fontSize: "0.85rem" }}
                >
                    {meta.label}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}
