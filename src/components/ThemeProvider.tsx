"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage first
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setTheme(stored);
        } else {
            // Default to dark for new users
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;
            if (theme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";

        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // Use View Transition API with flushSync to eliminate async React render delays
        document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });

            // Eager fallback just in case flushSync doesn't catch root early enough
            const root = document.documentElement;
            if (newTheme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
