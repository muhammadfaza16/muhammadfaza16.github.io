"use client";

import { useState } from "react";
import { StarGate } from "@/components/auth/StarGate";
import { Container } from "@/components/Container";
import { VisualBookshelf } from "@/components/void/VisualBookshelf";
import { CinemaWall } from "@/components/void/CinemaWall";
import { TheVent } from "@/components/void/TheVent";

export default function VoidPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    // If locked, show the Gate
    if (!isUnlocked) {
        return (
            <StarGate
                gateType="void"
                onUnlock={() => setIsUnlocked(true)}
            />
        );
    }

    // If unlocked, show the Garden
    return (
        <div className="min-h-screen pt-20 pb-20 bg-black text-gray-300 animate-fade-in font-mono selection:bg-red-900 selection:text-white">
            <Container>
                <header className="mb-16">
                    <h1 className="text-4xl tracking-tighter mb-2 text-white">
                        SYSTEM: THE_VOID
                    </h1>
                    <div className="h-px w-20 bg-gray-800 mb-6" />
                    <p className="text-sm opacity-50 max-w-md">
               // Private Access Terminal.<br />
               // Unauthorized observation prohibited.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Bookshelf - Spans 2 cols on large */}
                    <div className="lg:col-span-2">
                        <VisualBookshelf />
                    </div>

                    {/* Cinema Wall */}
                    <div>
                        <CinemaWall />
                    </div>

                    {/* The Vent - Terminal */}
                    <div>
                        <TheVent />
                    </div>
                </div>
            </Container>
        </div>
    );
}
