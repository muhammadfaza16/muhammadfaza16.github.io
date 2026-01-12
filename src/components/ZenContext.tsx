"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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

    // Reset Zen mode on route change
    useEffect(() => {
        setIsZen(false);
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
