"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "./AudioContext";

interface ZenContextType {
    isZen: boolean;
    toggleZen: () => void;
    setZen: (value: boolean, returnTo?: string) => void;
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
    const router = useRouter();
    const { isPlaying } = useAudio();
    const hasManuallyExited = React.useRef(false); // Track manual exit
    const returnToPath = React.useRef<string | null>(null); // Track where to return after Zen exit

    const isBlogArticle = pathname?.startsWith("/blog/") && pathname !== "/blog";

    const handleSetZen = (value: boolean, returnTo?: string) => {
        if (value && returnTo) {
            returnToPath.current = returnTo; // Store where to return
        }
        setIsZen(value);
        if (!value) {
            hasManuallyExited.current = true; // User explicitly exited
            // Navigate back to origin if set
            if (returnToPath.current) {
                router.push(returnToPath.current);
                returnToPath.current = null; // Clear after use
            }
        }
    };

    const handleToggleZen = () => {
        setIsZen(prev => {
            const next = !prev;
            if (!next) {
                hasManuallyExited.current = true; // User explicitly exited
                // Navigate back to origin if set
                if (returnToPath.current) {
                    router.push(returnToPath.current);
                    returnToPath.current = null; // Clear after use
                }
            }
            return next;
        });
    };

    // Auto-enter Zen mode when music starts playing (CONSENT AWARE)
    useEffect(() => {
        if (isPlaying && !hasManuallyExited.current) {
            setIsZen(true);
        }
    }, [isPlaying]);

    // Reset Zen mode on route change - except for homepage, blog articles, and sanctuary
    useEffect(() => {
        const isHomepage = pathname === "/";
        const isSanctuary = pathname === "/sanctuary";
        const zenAllowedRoutes = isHomepage || isBlogArticle || isSanctuary;

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
                hasManuallyExited.current = true; // User explicitly exited
                // Navigate back to origin if set
                if (returnToPath.current) {
                    router.push(returnToPath.current);
                    returnToPath.current = null;
                }
                setIsZen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isZen, router]);

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
