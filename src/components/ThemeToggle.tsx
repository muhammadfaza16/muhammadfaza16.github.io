"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-all duration-300"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {/* Sun Icon */}
            <svg
                className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${theme === "light"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-0"
                    }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
            </svg>

            {/* Moon Icon */}
            <svg
                className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${theme === "dark"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                    }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                />
            </svg>
        </button>
    );
}
