"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Settings,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
    DatabaseZap,
    Wrench,
    Hash,
    Bell,
    Construction
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Toaster, toast } from "react-hot-toast";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem("curation_admin") === "true");
    }, []);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleClearData = () => {
        if (window.confirm("Are you sure you want to clear all your local reading history and bookmarks?")) {
            localStorage.clear();
            sessionStorage.clear();
            toast.success("All local data cleared successfully.");
            window.location.reload();
        }
    };

    const handleAdminToggle = () => {
        const newValue = !isAdmin;
        setIsAdmin(newValue);
        if (newValue) {
            localStorage.setItem("curation_admin", "true");
            toast.success("Admin mode enabled.");
        } else {
            localStorage.removeItem("curation_admin");
            toast.success("Admin mode disabled.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
            <Toaster position="top-center" />
            <header className="mb-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-[1.75rem] bg-white dark:bg-zinc-800/40 flex items-center justify-center text-zinc-900 dark:text-white mb-5 border border-zinc-200/50 dark:border-zinc-800/50">
                    <User size={32} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-medium tracking-tight mb-0.5 text-zinc-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Muhammad Faza</h1>
                <div className="flex items-center gap-2 mb-5">
                    <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-[0.2em]">Software Engineer</p>
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-blue-500 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider">Free Forever</span>
                </div>

                <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium uppercase tracking-widest active:scale-95 transition-all">
                        Sign Up
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium uppercase tracking-widest active:scale-95 transition-all">
                        Sign In
                    </button>
                </div>
            </header>

            {/* Roadmap / Under Construction */}
            <section className="mb-10">
                <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-sm">
                        <Construction size={20} />
                    </div>
                    <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Under Development</h2>
                    <p className="text-[13px] text-zinc-500 max-w-[280px] leading-relaxed">
                        Personalized feeds, topic interests, and weekly digests are currently being built. This project will remain free for everyone, forever.
                    </p>
                </div>
            </section>

            {/* Preferences Roadmap */}
            <section className="space-y-4 mb-10 opacity-60">
                <div className="flex items-center justify-between ml-0.5 mb-2">
                    <h2 className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">Roadmap</h2>
                </div>
                <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40">
                    <div className="w-full flex items-center gap-4 p-4 select-none">
                        <div className="text-zinc-400">
                            <Hash size={18} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="block text-[14px] font-medium text-zinc-700 dark:text-zinc-300">Content Interests</span>
                            <span className="block text-[11px] text-zinc-500 mt-0.5">Customize your feed based on preferred topics (Development)</span>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-4 p-4 select-none">
                        <div className="text-zinc-400">
                            <Bell size={18} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="block text-[14px] font-medium text-zinc-700 dark:text-zinc-300">Email Digest</span>
                            <span className="block text-[11px] text-zinc-500 mt-0.5">Weekly curated updates delivered to your inbox (Development)</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-[12px] font-medium text-zinc-400 mb-6 ml-0.5">
                    Account Settings
                </h2>

                <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40">
                    <button onClick={handleThemeToggle} className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group">
                        <div className={`text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors`}>
                            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                        </div>
                        <span className="flex-1 text-[14px] font-medium text-left text-zinc-700 dark:text-zinc-300">
                            Theme: {theme === 'light' ? 'Light' : 'Dark'}
                        </span>
                        <ChevronRight size={14} className="text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button onClick={handleAdminToggle} className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group">
                        <div className={`text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors`}>
                            <Wrench size={18} />
                        </div>
                        <span className="flex-1 text-[14px] font-medium text-left text-zinc-700 dark:text-zinc-300">
                            Admin Mode: {isAdmin ? "Enabled" : "Disabled"}
                        </span>
                        <ChevronRight size={14} className="text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button onClick={handleClearData} className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                        <div className={`text-red-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors`}>
                            <DatabaseZap size={18} />
                        </div>
                        <span className="flex-1 text-[14px] font-medium text-left text-red-500 dark:text-red-400">Clear Local Data</span>
                        <ChevronRight size={14} className="text-red-300 transition-transform group-hover:translate-x-0.5" />
                    </button>
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
