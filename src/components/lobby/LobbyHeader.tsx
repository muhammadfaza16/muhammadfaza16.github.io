"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/Container";

export function LobbyHeader() {
    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: "1.5rem 0",
                pointerEvents: "none", // Let clicks pass through, only items are clickable
            }}
        >
            <Container>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Minimal Home Icon / Brand */}
                    <div style={{ pointerEvents: "auto" }}>
                        <Link
                            href="/"
                            onClick={(e) => {
                                // Just a refresh/reset feel if already on home
                                if (window.location.pathname === "/") {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                            className="group flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                                <span className="text-[0.6rem] font-bold tracking-widest text-white/90">AF</span>
                            </div>
                        </Link>
                    </div>

                    {/* Theme Toggle Area */}
                    <div style={{ pointerEvents: "auto" }} className="flex items-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
}
