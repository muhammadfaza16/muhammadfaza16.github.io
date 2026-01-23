"use client";

import { SanctuaryProvider } from "@/components/sanctuary/SanctuaryContext";

export default function SanctuaryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SanctuaryProvider>
            {children}
        </SanctuaryProvider>
    );
}
