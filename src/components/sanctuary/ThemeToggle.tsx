"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const headerFont = "var(--font-display), system-ui, sans-serif";

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                position: "fixed",
                top: "24px",
                right: "24px",
                width: "44px",
                height: "44px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100001, // Above bottom nav
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                backdropFilter: "blur(12px)",
                border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                transition: "background-color 0.3s ease, border-color 0.3s ease",
                padding: 0
            }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 90 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25 
                    }}
                >
                    {theme === "dark" ? (
                        <Moon size={20} color="#6366F1" />
                    ) : (
                        <Sun size={20} color="#F59E0B" />
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Subtle Label (Optional/Micro) */}
            <motion.span
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1, y: 10 }}
                style={{
                    position: "absolute",
                    bottom: "-24px",
                    fontFamily: headerFont,
                    fontSize: "0.5rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    pointerEvents: "none"
                }}
            >
                {theme}
            </motion.span>
        </motion.button>
    );
}
