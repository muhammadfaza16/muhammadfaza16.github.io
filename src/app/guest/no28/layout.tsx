"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    // The GuestAudioPlayer is in RootLayout for persistence.
    // This layout manages cinematic visuals and page transitions.
    const pathname = usePathname();

    return (
        <>
            {/* Global Cinematic Vignette (Mobile friendly) */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 50, // Above content background, below interactive elements
                pointerEvents: "none",
                background: "radial-gradient(circle at center, transparent 40%, rgba(78, 68, 57, 0.15) 100%)",
                mixBlendMode: "multiply"
            }} />

            {/* Global Film Grain */}
            <div style={{
                position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 51, opacity: 0.03,
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }} />

            {/* Fast Page Transitions without blackout gaps */}
            <motion.div
                key={pathname}
                initial={{ filter: "blur(8px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ width: "100%" }}
            >
                {children}
            </motion.div>
        </>
    );
}
