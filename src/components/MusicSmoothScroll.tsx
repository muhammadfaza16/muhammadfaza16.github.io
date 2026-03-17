"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function MusicSmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        // Only initialize on music and playlist routes
        const isMusicRoute = pathname?.startsWith("/music") || pathname?.startsWith("/playlist");
        
        if (!isMusicRoute) return;

        // Finely tuned Lenis for a "Premium Slow Scroll" experience
        const lenis = new Lenis({
            duration: 1.5,      // Moderately increased for smoother feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.85, // Slightly reduced for more control
            touchMultiplier: 2.0, // Snappier touch response
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [pathname]);

    return null;
}
