"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setTheme(stored);
        } else {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            const isThemable = pathname?.startsWith('/curation') || pathname?.startsWith('/music') || pathname?.startsWith('/playlist');
            const root = document.documentElement;

            if (!isThemable) {
                // Non-themable pages (Home, etc.) always force dark mode
                root.classList.add("dark");
            } else {
                // Themable sections follow the set theme
                if (theme === "dark") {
                    root.classList.add("dark");
                } else {
                    root.classList.remove("dark");
                }
            }
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted, pathname]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";

        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // Blur the currently active element (the toggle button) to prevent its active/focus state
        // from being captured and permanently frozen in the view transition snapshot.
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // We wrap the transition trigger inside a setTimeout to allow the current click event
        // to finish propagating and bubbling completely. Without this, the synchronous DOM
        // freezing of startViewTransition can swallow the browser's subsequent pointer events,
        // causing the "unresponsive button requiring a second click to wake up" bug.
        setTimeout(() => {
            document.startViewTransition(() => {
                flushSync(() => {
                    setTheme(newTheme);
                });

                // Immediate DOM update for the transition snapshot
                const isThemable = pathname?.startsWith('/curation') || pathname?.startsWith('/music') || pathname?.startsWith('/playlist');
                const root = document.documentElement;
                if (!isThemable || newTheme === "dark") {
                    root.classList.add("dark");
                } else {
                    root.classList.remove("dark");
                }
            });
        }, 0);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
