"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    User,
    Settings,
    ShieldCheck,
    CreditCard,
    LogOut,
    Mail,
    Bell,
    Fingerprint,
    ChevronRight
} from "lucide-react";
import { DevPlaceholder } from "@/components/curation/DevPlaceholder";

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
            <header className="mb-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-[1.75rem] bg-white dark:bg-zinc-800/40 flex items-center justify-center text-zinc-900 dark:text-white mb-5 border border-zinc-200/50 dark:border-zinc-800/50">
                    <User size={32} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-medium tracking-tight mb-0.5 text-zinc-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>M. Faza</h1>
                <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-[0.2em] mb-5">Master Curator</p>

                <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium uppercase tracking-widest active:scale-95 transition-all">
                        Sign Up
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium uppercase tracking-widest active:scale-95 transition-all">
                        Sign In
                    </button>
                </div>
            </header>

            <div className="mb-10">
                <DevPlaceholder />
            </div>

            <section className="space-y-4">
                <h2 className="text-[12px] font-medium text-zinc-400 mb-6 ml-0.5">
                    Account Settings
                </h2>

                <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40">
                    {[
                        { label: "Security & Privacy", icon: ShieldCheck },
                        { label: "Notifications", icon: Bell },
                        { label: "Subscription", icon: CreditCard },
                        { label: "Reader Identity", icon: Fingerprint },
                    ].map((item, i) => (
                        <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group">
                            <div className={`text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors`}>
                                <item.icon size={18} />
                            </div>
                            <span className="flex-1 text-[14px] font-medium text-left text-zinc-700 dark:text-zinc-300">{item.label}</span>
                            <ChevronRight size={14} className="text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    ))}
                </div>
            </section>

            <div className="mt-10 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 hover:text-red-500 hover:border-red-200/50 dark:hover:border-red-900/20 transition-all text-[11px] font-medium uppercase tracking-widest">
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </div>
    );
}
