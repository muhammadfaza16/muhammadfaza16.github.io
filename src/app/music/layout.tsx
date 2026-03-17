import React from "react";
import { ThemeToggle } from "@/components/sanctuary/ThemeToggle";

export default function AudioHubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ThemeToggle />
            {children}
        </>
    );
}
