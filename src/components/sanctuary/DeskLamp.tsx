"use client";

import { LampCeiling } from "lucide-react";

// Mocking "Active Status". 
// In future, could check a JSON file on repo "status.json" updated by a script when you code.
const IS_ONLINE = true; // Hardcoded for "Always here for you" vibe

export function DeskLamp() {
    return (
        <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20 group">
            <div className="relative">
                {/* Lamp Body */}
                <div className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-700
                    ${IS_ONLINE
                        ? 'bg-orange-100/10 dark:bg-orange-900/10 text-orange-400 shadow-[0_20px_40px_rgba(251,146,60,0.3)]'
                        : 'bg-transparent text-gray-400 opacity-20'}
                `}>
                    <LampCeiling className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                {/* The "Light" Cone */}
                {IS_ONLINE && (
                    <div className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 w-20 md:w-24 h-24 md:h-32 bg-gradient-to-b from-orange-400/20 to-transparent blur-xl pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity" />
                )}
            </div>

            {/* Tooltip */}
            <div className="absolute top-2 left-12 md:left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap pointer-events-none">
                <span className="bg-black/50 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-sm">
                    {IS_ONLINE ? "I am currently here." : "Off duty."}
                </span>
            </div>
        </div>
    );
}
