"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import "./guest-sketch.css";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {/* Canvas Grain Overlay */}
            <div className="wc-grain-overlay" />

            {/* Soft Warm Vignette — watercolor paper edge feel */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                pointerEvents: "none",
                background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(210, 195, 175, 0.12) 100%)
                `,
            }} />

            {/* Subtle Watercolor Edge Wash — top & bottom */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "120px",
                pointerEvents: "none",
                zIndex: 49,
                background: "linear-gradient(to bottom, rgba(200, 190, 175, 0.06), transparent)",
            }} />
            <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: "120px",
                pointerEvents: "none",
                zIndex: 49,
                background: "linear-gradient(to top, rgba(200, 190, 175, 0.08), transparent)",
            }} />

            {/* Smooth Page Transition */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: "100%" }}
            >
                {children}
            </motion.div>
        </>
    );
}
