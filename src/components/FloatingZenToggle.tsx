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
    const isBlogArticle = pathname?.startsWith("/blog/") && pathname !== "/blog";



    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // If we are already in Zen mode, let the existing ZenToggle handle it (it floats when active).
    // OR we can handle it here too.
    // The existing ZenToggle in blog posts floats when isZen is true.
    // If we have TWO floating buttons, that's bad.
    // So hiding this one when isZen is true avoids duplication.
    if (isZen || !isBlogArticle) return null;

    return (
        <button
            onClick={toggleZen}
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 90,
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
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                pointerEvents: isVisible ? "auto" : "none",
            }}
            className="hover:shadow-lg hover:-translate-y-1 active:scale-95 glass p-3 md:py-3 md:px-5"
            aria-label="Toggle Zen Mode"
        >
            <Eye size={18} />
            <span className="desktop-only">Zen Mode</span>
        </button>
    );
}
