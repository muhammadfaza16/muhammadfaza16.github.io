"use client";

import { ThemeProvider } from "@/components/guest/no28/ThemeContext";

export default function SpecialDayLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}
