"use client";

import { Cpu, Box, Layout, Code, Server } from "lucide-react";

const STACK = [
    { name: "Next.js 14", icon: <Layout className="w-4 h-4" />, category: "Framework" },
    { name: "React", icon: <Code className="w-4 h-4" />, category: "Library" },
    { name: "TypeScript", icon: <Code className="w-4 h-4" />, category: "Language" },
    { name: "Tailwind CSS", icon: <Box className="w-4 h-4" />, category: "Styling" },
    { name: "Framer Motion", icon: <Sparkles className="w-4 h-4" />, category: "Animation" },
    { name: "Lucide Icons", icon: <Box className="w-4 h-4" />, category: "Assets" },
];

import { Sparkles } from "lucide-react";

export function TechBlueprint() {
    return (
        <div className="bg-emerald-950/20 p-8 rounded-xl border border-emerald-900/40 font-mono">
            <h2 className="text-emerald-500 mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                SYSTEM_ARCHITECTURE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {STACK.map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 border border-emerald-900/30 rounded-lg hover:bg-emerald-900/10 transition-colors group">
                        <div className="p-2 bg-emerald-900/20 rounded text-emerald-400 group-hover:text-emerald-300">
                            {tech.icon}
                        </div>
                        <div>
                            <div className="text-emerald-200 text-sm font-bold">{tech.name}</div>
                            <div className="text-emerald-700 text-xs uppercase tracking-wider">{tech.category}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-900/30 text-emerald-800 text-xs">
                Build Status: STABLE <br />
                Last Compiled: {new Date().toLocaleDateString()}
            </div>
        </div>
    );
}
