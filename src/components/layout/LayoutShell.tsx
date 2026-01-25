"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LobbyHeader } from "@/components/lobby/LobbyHeader";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLobby = pathname === "/";

    if (isLobby) {
        return (
            <>
                <LobbyHeader />
                {children}
            </>
        );
    }

    return (
        <>
            <Header />
            <main id="main-content" className="main-content-padding" style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
