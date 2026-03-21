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
    const isMusicHome = pathname === "/music";
    const isLivePage = pathname?.startsWith("/music/live");

    return (
        <>
            {children}
        </>
    );
}
