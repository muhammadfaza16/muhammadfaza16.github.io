"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedNumberProps {
    value: string | number;
    className?: string;
}

export function AnimatedNumber({ value, className = "" }: AnimatedNumberProps) {
    return (
        <span className={`relative inline-flex overflow-hidden ${className}`} style={{ verticalAlign: "bottom" }}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.8 }}
                    className="inline-block drop-shadow-sm"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
