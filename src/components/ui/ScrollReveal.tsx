"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    className?: string;
}

export function ScrollReveal({ children, width = "100%", delay = 0, className = "" }: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" }); // Triggers when element is 100px into viewport

    return (
        <div ref={ref} style={{ width }} className={className}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                    duration: 1.2, // Slow, alus
                    delay: delay,
                    ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth "settling"
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
