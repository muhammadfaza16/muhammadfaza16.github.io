"use client";

import { GitCommit } from "lucide-react";

const LOGS = [
    { version: "v4.0.0", date: "2026-01-21", title: "The Celestial Rebirth", desc: "Reconceptualized entire architecture into 5 Gardens. Implemented StarMap, StarGate, and Semantic Routing." },
    { version: "v3.5.0", date: "2026-01-20", title: "Narrative Engine", desc: "Added conversational capabilities and narrative flows." },
    { version: "v3.2.0", date: "2026-01-19", title: "Deep Thought Integration", desc: "Merged knowledge widgets into a cohesive library." },
    { version: "v3.0.0", date: "2026-01-15", title: "Visual Overhaul", desc: "Implemented new typography system and dark mode refinements." },
];

export function Changelog() {
    return (
        <div className="bg-emerald-950/20 p-8 rounded-xl border border-emerald-900/40 font-mono mt-8">
            <h2 className="text-emerald-500 mb-6 flex items-center gap-2">
                <GitCommit className="w-5 h-5" />
                VERSION_HISTORY
            </h2>

            <div className="space-y-6 relative border-l border-emerald-900/30 ml-3 pl-8">
                {LOGS.map((log, i) => (
                    <div key={i} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/50" />

                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <span className="text-emerald-400 font-bold">{log.version}</span>
                            <span className="text-emerald-700 text-xs uppercase">{log.date}</span>
                        </div>
                        <h3 className="text-emerald-200 text-lg mb-1">{log.title}</h3>
                        <p className="text-emerald-600/80 text-sm max-w-xl">
                            {log.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
