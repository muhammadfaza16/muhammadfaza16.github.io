"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAudio } from "./AudioContext";

interface ZenContextType {
    isZen: boolean;
    toggleZen: () => void;
    setZen: (value: boolean) => void;
}

const ZenContext = createContext<ZenContextType | undefined>(undefined);

export function useZen() {
    const context = useContext(ZenContext);
    if (!context) {
        throw new Error("useZen must be used within a ZenProvider");
    }
    return context;
}

export function ZenProvider({ children }: { children: React.ReactNode }) {
    const [isZen, setIsZen] = useState(false);
    const pathname = usePathname();
    const { isPlaying } = useAudio();
    const hasManuallyExited = React.useRef(false); // Track manual exit

    const isBlogArticle = pathname?.startsWith("/blog/") && pathname !== "/blog";

    const handleSetZen = (value: boolean) => {
        setIsZen(value);
        if (!value) hasManuallyExited.current = true; // User explicitly exited
    };

    const handleToggleZen = () => {
        setIsZen(prev => {
            const next = !prev;
            if (!next) hasManuallyExited.current = true; // User explicitly exited
            return next;
        });
    };



    // Reset Zen mode on route change - except for homepage and blog articles
    useEffect(() => {
        const isHomepage = pathname === "/";
        const isPlaylist = pathname === "/playlist";
        const isPlaylistSubpage = pathname?.startsWith("/playlist/");
        const zenAllowedRoutes = isHomepage || isBlogArticle || isPlaylist || isPlaylistSubpage;

        if (!zenAllowedRoutes && isZen) {
            setIsZen(false);
        }
    }, [pathname, isZen, isBlogArticle]);

    // Force scroll to top when navigating while Zen is active
    useEffect(() => {
        if (isZen) {
            window.scrollTo(0, 0);
        }
    }, [pathname, isZen]);

    // Escape key to exit Zen mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isZen) {
                setIsZen(false);
                hasManuallyExited.current = true; // User explicitly exited
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isZen]);

    // Lock body scroll when Zen is active (ONLY if not reading an article)
    useEffect(() => {
        if (isZen && !isBlogArticle) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isZen, isBlogArticle]);

    return (
        <ZenContext.Provider value={{ isZen, toggleZen: handleToggleZen, setZen: handleSetZen }}>
            <div
                data-zen={isZen}
                className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    // Only lock height/overflow if Zen is active AND we are NOT reading
                    height: (isZen && !isBlogArticle) ? "100vh" : "auto",
                    overflow: (isZen && !isBlogArticle) ? "hidden" : "visible"
                }}
            >
                {children}
            </div>
        </ZenContext.Provider>
    );
}
