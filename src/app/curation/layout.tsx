"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
    Home,
    Search,
    Bookmark,
    User
} from "lucide-react";

export default function CurationPlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Archive", href: "/curation", icon: Home },
        { name: "Discover", href: "/curation/discover", icon: Search },
        { name: "Library", href: "/curation/library", icon: Bookmark },
        { name: "Profile", href: "/curation/profile", icon: User },
    ];

    const pathSegments = pathname.split('/').filter(Boolean);

    const isHome = pathSegments.length === 1 && pathSegments[0] === 'curation';
    const isExplore = pathSegments.length === 2 && pathSegments[1] === 'discover';
    const isLibrary = pathSegments.length === 2 && pathSegments[1] === 'library';
    const isProfile = pathSegments.length === 2 && pathSegments[1] === 'profile';
    const isDashboard = pathSegments.length === 2 && pathSegments[1] === 'dashboard';
    const isVerticalList = pathSegments.length === 2 && ['books', 'skills', 'frameworks', 'codex'].includes(pathSegments[1]);

    const shouldShowDock = isHome || isExplore || isLibrary || isProfile || isDashboard || isVerticalList;

    const navVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div 
            className={`h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#fafaf8] dark:bg-[#050505] text-[#1a1a1a] dark:text-[#f2f2f2] curation-app ${isDark ? 'dark' : ''}`}
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
            {/* ═══ THE SINGLE SCROLL CONTAINER FOR ALL PAGES ═══ */}
            <main id="curation-root-scroller" className="flex-1 relative overflow-y-auto overflow-x-hidden pb-32">
                {children}
            </main>

            {/* Persistent Platform Dock (Full Width, Zero Padding) */}
            {shouldShowDock && (
                <motion.nav
                    initial="hidden"
                    animate="visible"
                    variants={navVariants as any}
                    className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/10 dark:bg-black/20 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-none w-full h-[56px]"
                >
                    {navItems.map((item) => {
                        let isActive = pathname === item.href;
                        if (item.name === "My Library" && isDashboard) isActive = true;

                        const Icon = item.icon;
                        const isExploreItem = item.name === "Explore";

                        const navContent = (
                            <div className="flex flex-col items-center justify-center gap-[3px] h-full">
                                <div className={`
                                    transition-all duration-300
                                    ${isActive
                                        ? 'text-zinc-950 dark:text-white'
                                        : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}
                                `}>
                                    <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                                </div>
                                <span className={`
                                    text-[11px] leading-none font-light tracking-tight transition-colors duration-300
                                    ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-500'}
                                `}>
                                    {item.name}
                                </span>
                            </div>
                        );

                        if (isExploreItem) {
                            return (
                                <a key={item.href} href={item.href} className="flex-1 h-full outline-none relative group">
                                    {navContent}
                                </a>
                            );
                        }

                        return (
                            <Link key={item.href} href={item.href} prefetch={false} className="flex-1 h-full outline-none relative group">
                                {navContent}
                            </Link>
                        );
                    })}
                </motion.nav>
            )}
        </div>
    );
}
