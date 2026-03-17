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
                top: "30px",
                right: "16px",
                width: "40px",
                height: "40px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100001, // Above bottom nav
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(12px)",
                border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(0, 0, 0, 0.02)",
                boxShadow: theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.01)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                        <Moon size={18} color="#6366F1" />
                    ) : (
                        <Sun size={18} color="#F59E0B" />
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
