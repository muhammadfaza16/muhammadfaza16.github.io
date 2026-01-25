"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LobbyHeader } from "@/components/lobby/LobbyHeader";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

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
            {/* Global Back Button */}
            <div style={{
                position: "fixed",
                top: "24px",
                left: "24px",
                zIndex: 40
            }}>
                <button
                    onClick={() => router.back()}
                    aria-label="Go Back"
                    style={{
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(120, 120, 120, 0.1)", // Subtle Glass
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "50%",
                        color: "var(--foreground)",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer"
                    }}
                    className="hover:scale-105 hover:bg-white/20 active:scale-95 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </div>
            <main id="main-content" style={{ flex: 1 }}>
                {children}
            </main>
        </>
    );
}
