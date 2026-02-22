"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Determine if we should skip transition (e.g. for pure state changes?)
    // But usually we want it for all route changes.

    return (
        <motion.div
            key={pathname} // Ensure re-trigger on route change
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            // We usually don't want exit animation on Template because it delays the next page's load visually
            // or causes layout overlap in standard flow. Better just Enter animation.
            transition={{
                duration: 0.35,
                ease: "easeOut"
            }}
            style={{ width: "100%", height: "100%" }}
        >
            {children}
        </motion.div>
    );
}
