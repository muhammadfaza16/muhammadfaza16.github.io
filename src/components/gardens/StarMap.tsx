"use client";

import Link from "next/link";
import { Sparkles, BookOpen, Globe, Fingerprint, Database, Cpu } from "lucide-react";
import { Container } from "../Container";

export function StarMap() {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <Container>
                <div className="relative min-h-[600px] flex items-center justify-center">

                    {/* Central Star - The Avatar / Core */}
                    <div className="absolute z-10 w-32 h-32 rounded-full bg-[var(--foreground)] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-pulse-slow">
                        <div className="text-center">
                            <span className="block text-xs font-mono tracking-widest text-[var(--background)] opacity-70">THE</span>
                            <span className="block text-xl font-serif text-[var(--background)]">CORE</span>
                        </div>
                    </div>

                    {/* Orbit System */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Ring 1 - Public */}
                        <div className="w-[300px] h-[300px] border border-[var(--border)] rounded-full opacity-30 animate-spin-slow-reverse" />
                        {/* Ring 2 - Deep */}
                        <div className="w-[500px] h-[500px] border border-[var(--border)] rounded-full opacity-20 animate-spin-slow" />
                    </div>

                    {/* The Planets (Navigation Nodes) */}

                    {/* 1. The Open Garden (Portfolio) - Top Right */}
                    <Link href="/open" className="absolute top-1/4 right-1/4 transform translate-x-12 -translate-y-12 group">
                        <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-lg group-hover:border-[var(--accent)] transition-colors">
                                <Globe className="w-6 h-6 text-[var(--accent)]" />
                            </div>
                            <span className="font-mono text-xs tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all bg-[var(--background)] px-2 py-1 rounded">
                                OPEN GARDEN
                            </span>
                        </div>
                    </Link>

                    {/* 2. The Museum (Knowledge) - Bottom Left */}
                    <Link href="/museum" className="absolute bottom-1/4 left-1/4 transform -translate-x-12 translate-y-12 group">
                        <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-14 h-14 rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-lg group-hover:border-cyan-400 transition-colors">
                                <BookOpen className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="font-mono text-xs tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-cyan-400 transition-all bg-[var(--background)] px-2 py-1 rounded">
                                THE MUSEUM
                            </span>
                        </div>
                    </Link>

                    {/* 3. The Engine Room (Meta) - Bottom Center */}
                    <Link href="/engine" className="absolute bottom-10 group">
                        <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-lg group-hover:border-green-500 transition-colors">
                                <Cpu className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="font-mono text-xs tracking-widest opacity-70 group-hover:opacity-100 group-hover:text-green-500 transition-all bg-[var(--background)] px-2 py-1 rounded">
                                ENGINE ROOM
                            </span>
                        </div>
                    </Link>

                    {/* 4. The Sanctuary (Angel) - Hidden / Shining Star - Top Left */}
                    <Link href="/sanctuary" className="absolute top-20 left-20 group">
                        <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-10 h-10 rounded-full bg-[rgba(255,200,200,0.1)] border border-transparent flex items-center justify-center group-hover:bg-[rgba(255,200,200,0.2)] transition-colors animate-pulse">
                                <Sparkles className="w-4 h-4 text-rose-300 opacity-50 group-hover:opacity-100" />
                            </div>
                            {/* Only reveals on hover */}
                            <span className="font-mono text-[0.6rem] tracking-widest opacity-0 group-hover:opacity-70 transition-opacity text-rose-300">
                                SANCTUARY
                            </span>
                        </div>
                    </Link>

                    {/* 5. The Void (Private) - Hidden / Dark - Right Edge */}
                    <Link href="/void" className="absolute top-1/2 right-10 group transform -translate-y-1/2">
                        <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-8 h-8 rounded-full bg-black border border-[var(--border)] flex items-center justify-center shadow-none group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all">
                                <Fingerprint className="w-3 h-3 text-[var(--border)] group-hover:text-white" />
                            </div>
                            <span className="font-mono text-[0.6rem] tracking-widest opacity-0 group-hover:opacity-70 transition-opacity text-[var(--border)]">
                                VOID
                            </span>
                        </div>
                    </Link>

                </div>
            </Container>

            {/* Styles for Orrery Animation */}
            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 45s linear infinite;
        }
         @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}
