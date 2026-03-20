"use client";

import React from "react";
import { ThemeToggle } from "@/components/sanctuary/ThemeToggle";
import { usePathname } from "next/navigation";

export default function AudioHubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLivePage = pathname?.startsWith("/music/live");

    return (
        <div className="curation-app w-full min-h-screen flex flex-col bg-[#F8F5F2] dark:bg-[#0A0A0A] transition-colors duration-500" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            {!isLivePage && (
                <div className="fixed top-4 right-4 z-[200]">
                    <ThemeToggle />
                </div>
            )}
            
            {children}
        </div>
    );
}
