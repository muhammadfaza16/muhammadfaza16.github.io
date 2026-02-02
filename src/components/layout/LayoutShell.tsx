"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LobbyHeader } from "@/components/lobby/LobbyHeader";
import { useZen } from "@/components/ZenContext";
import { MiniPlayerWidget } from "@/components/MiniPlayerWidget";
import { MusicRecall } from "@/components/MusicRecall";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isZen, setZen } = useZen();

    // Scroll Reset Implementation
    useEffect(() => {
        // Disable native restoration to prevents "racing"
        if (typeof window !== 'undefined' && window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        const resetScroll = () => {
            window.scrollTo(0, 0);
            const mainContent = document.getElementById("main-content");
            if (mainContent) mainContent.scrollTop = 0;
        };

        resetScroll();
        // Double tap for safety (Next.js async race)
        const timer = setTimeout(resetScroll, 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Lobby might still need its special header, or maybe not? 
    // User said "header dan footer lama". LobbyHeader sounds specific/new. 
    // I'll keep LobbyHeader for now as it handles the "OS" look top bar potentially?
    // Actually, if Bento Grid is the lobby, it might need a status bar.
    // Let's keep LobbyHeader logic but remove generic Header/Footer.

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
            {/* Global Music Recall for non-lobby pages */}
            {!isLobby && (
                <div style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    zIndex: 40
                }}>
                    <MusicRecall />
                </div>
            )}

            <main id="main-content" style={{ flex: 1 }}>
                {children}
            </main>
            <MiniPlayerWidget />
        </>
    );
}
