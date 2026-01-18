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

    // Auto-enter Zen mode when music starts playing
    useEffect(() => {
        if (isPlaying) {
            setIsZen(true);
        }
    }, [isPlaying]);

    // Reset Zen mode on route change - except for homepage and blog articles
    useEffect(() => {
        const isHomepage = pathname === "/";
        const isBlogArticle = pathname?.startsWith("/blog/") && pathname !== "/blog";
        const zenAllowedRoutes = isHomepage || isBlogArticle;

        if (!zenAllowedRoutes && isZen) {
            setIsZen(false);
        }
    }, [pathname, isZen]);

    // Force scroll to top when navigating while Zen is active
    useEffect(() => {
        if (isZen) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    // Escape key to exit Zen mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isZen) {
                setIsZen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isZen]);

    // Lock body scroll when Zen is active
    useEffect(() => {
        if (isZen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isZen]);

    return (
        <ZenContext.Provider value={{ isZen, toggleZen: () => setIsZen(prev => !prev), setZen: setIsZen }}>
            <div
                data-zen={isZen}
                className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh"
                }}
            >
                {children}
            </div>
        </ZenContext.Provider>
    );
}
