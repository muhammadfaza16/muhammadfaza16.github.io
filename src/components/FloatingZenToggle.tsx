"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useZen } from "./ZenContext";
import { Eye, EyeOff } from "lucide-react";

export function FloatingZenToggle() {
    const { isZen, toggleZen } = useZen();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Only show on blog article pages (e.g. /blog/something), not on the main list (/blog)
    // Only show on blog article pages (e.g. /blog/something), not on the main list (/blog)
    const isBlogArticle = pathname?.startsWith("/blog/") && pathname !== "/blog";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide if not blog article, unmount.
    if (!isBlogArticle) return null;

    // Logic: Hide if Zen is active OR if not scrolled enough
    const shouldShow = isVisible && !isZen;

    return (
        <button
            onClick={toggleZen}
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 40, // Below Header (z-50)
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                color: "var(--foreground)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: shouldShow ? 1 : 0,
                transform: shouldShow ? "translateY(0)" : "translateY(20px)",
                pointerEvents: shouldShow ? "auto" : "none",
            }}
            className="zen-toggle-button hover:shadow-lg hover:-translate-y-1 active:scale-95 glass p-3 md:py-3 md:px-5"
            aria-label="Toggle Read Mode"
        >
            <Eye size={18} />
            <span className="desktop-only">Read Mode</span>
        </button>
    );
}
