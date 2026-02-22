"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, Lock, Send, Loader2, Link2, FileText, Book, ShoppingBag, Edit3, Grid } from "lucide-react";
import Link from "next/link";
import React from "react";

type Tab = "curation" | "writing" | "bookshelf" | "wishlist";

const AnimatedMeshBackground = React.memo(({ activeTab }: { activeTab: string }) => {
    // Zero-GPU Static Radial Gradients for buttery smooth typing
    const color1 = activeTab === 'home' || activeTab === 'curation' ? '#a2d2ff' : activeTab === 'writing' ? '#ffdfb8' : activeTab === 'bookshelf' ? '#e2c5ff' : '#ffc4c4';
    const color2 = activeTab === 'home' || activeTab === 'bookshelf' ? '#cda4ff' : activeTab === 'writing' ? '#ffd0a1' : activeTab === 'curation' ? '#8bc4ff' : '#ff9494';

    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-in-out"
            style={{
                background: `radial-gradient(circle at 10% 10%, ${color1} 0%, transparent 60%), radial-gradient(circle at 90% 90%, ${color2} 0%, transparent 60%)`,
                opacity: 0.65
            }}
        />
    );
});

export default function GlobalMasterConsole() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (localStorage.getItem("master_auth") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    // Active Tab Logic ('home' means showing the bento grid dashboard)
    const [activeTab, setActiveTab] = useState<Tab | "home">("home");

    const tabs: { id: Tab; label: string; icon: React.ReactNode; desc: string; color: string; gradient: string; iconBg: string; shadowColor: string }[] = [
        { id: "curation", label: "Curation", icon: <FileText size={22} strokeWidth={2.5} />, desc: "Markdown read-later queue.", color: "#43A6FF", gradient: "from-[#43A6FF]/30 to-[#43A6FF]/5", iconBg: "linear-gradient(135deg, #60B6FF, #208AFF)", shadowColor: "rgba(67, 166, 255, 0.4)" },
        { id: "writing", label: "Writing", icon: <Edit3 size={22} strokeWidth={2.5} />, desc: "Draft long-form essays.", color: "#F7A754", gradient: "from-[#F7A754]/30 to-[#F7A754]/5", iconBg: "linear-gradient(135deg, #FFB46B, #F08E22)", shadowColor: "rgba(247, 167, 84, 0.4)" },
        { id: "bookshelf", label: "Bookshelf", icon: <Book size={22} strokeWidth={2.5} />, desc: "Log reading journeys.", color: "#B983FF", gradient: "from-[#B983FF]/30 to-[#B983FF]/5", iconBg: "linear-gradient(135deg, #C598FF, #9D5AFF)", shadowColor: "rgba(185, 131, 255, 0.4)" },
        { id: "wishlist", label: "Wishlist", icon: <ShoppingBag size={22} strokeWidth={2.5} />, desc: "Track future acquisitions.", color: "#FF6B6B", gradient: "from-[#FF6B6B]/30 to-[#FF6B6B]/5", iconBg: "linear-gradient(135deg, #FF8282, #EB4848)", shadowColor: "rgba(255, 107, 107, 0.4)" },
    ];

    // Generic Form State
    const [formData, setFormData] = useState<Record<string, any>>({
        title: "",
        content: "",
        coverImage: "",
        author: "",
        rating: 1,
        price: "",
        priority: "Low",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (password === "161616") {
            setIsAuthenticated(true);
            localStorage.setItem("master_auth", "true");
        } else {
            alert("Incorrect PIN");
            setPassword("");
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusText("Saving to database...");

        try {
            const res = await fetch(`/api/${activeTab}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatusText(`Persisted in ${activeTab}.`);
                setFormData({
                    title: "",
                    content: "",
                    coverImage: "",
                    author: "",
                    rating: 1,
                    price: "",
                    priority: "Low",
                });
                setTimeout(() => setStatusText(""), 3000);
            } else {
                setStatusText("Sync failed.");
            }
        } catch (error) {
            setStatusText("Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Premium iOS Visual Tokens
    const bgBase = "#F2F4F8";
    const textDark = "#1c1c1e";
    const textMuted = "#8E8E93";

    // Reusable styles
    const glassPanel = {
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(40px) saturate(150%)",
        WebkitBackdropFilter: "blur(40px) saturate(150%)",
        borderTop: "1.5px solid rgba(255, 255, 255, 0.8)",
        borderLeft: "1.5px solid rgba(255, 255, 255, 0.5)",
        borderRight: "1px solid rgba(255, 255, 255, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.3)",
        borderRadius: "32px",
    };

    const glassInput = {
        background: "rgba(0, 0, 0, 0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "inset 0 4px 10px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.8)",
        borderRadius: "18px",
    };

    if (!mounted) return null;

    return (
        <div
            className="fixed inset-0 w-full font-sans antialiased flex flex-col items-center z-[50] overflow-hidden"
            style={{
                backgroundColor: bgBase,
                color: textDark,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            {/* Animated Memoized Background to stop keystroke render lag */}
            <AnimatedMeshBackground activeTab={activeTab} />

            <div className="w-full max-w-[500px] h-full flex flex-col relative overflow-hidden z-10 border-x border-black/5 bg-white/10 backdrop-blur-[2px]">
                {/* TOP NAVIGATION */}
                <div className="w-full flex items-center justify-between p-5 pt-12 z-20 flex-shrink-0">
                    {!isAuthenticated || activeTab === "home" ? (
                        <Link href="/" className="outline-none block">
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                className="flex px-1.5 py-1.5 items-center justify-center gap-2 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer outline-none"
                            >
                                <div className="w-9 h-9 rounded-full flex items-center justify-center relative transition-transform bg-[#1c1c1e] text-white shadow-md">
                                    <ChevronLeft size={18} className="mr-0.5" />
                                </div>
                                <div className="flex items-center justify-center px-4 font-bold text-[11px] tracking-[0.2em] uppercase pr-5 opacity-80 text-[#1c1c1e]">
                                    HOME
                                </div>
                            </motion.div>
                        </Link>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("home")}
                            className="flex px-1.5 py-1.5 items-center justify-center gap-2 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer outline-none"
                        >
                            <div className="w-9 h-9 rounded-full flex items-center justify-center relative transition-transform bg-[#1c1c1e] text-white shadow-md">
                                <ChevronLeft size={18} className="mr-0.5" />
                            </div>
                            <div className="flex items-center justify-center px-4 font-bold text-[11px] tracking-[0.2em] uppercase pr-5 opacity-80 text-[#1c1c1e]">
                                CONSOLE
                            </div>
                        </motion.button>
                    )}
                </div>

                {!isAuthenticated ? (
                    <motion.div
                        initial={{ opacity: 1, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex flex-col flex-grow items-center justify-center px-6 pb-32 w-full"
                    >
                        {/* 3D Glass Artwork */}
                        <div className="relative w-full h-[220px] flex items-center justify-center mb-10">
                            <motion.div
                                animate={{ y: [-5, 5, -5], rotate: -15 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-32 h-44 rounded-[30px] bg-[#B983FF]/40 backdrop-blur-2xl shadow-xl border border-white/50"
                                style={{ left: "10%" }}
                            />
                            <motion.div
                                animate={{ y: [5, -5, 5], rotate: 10 }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute w-32 h-44 rounded-[30px] bg-[#43A6FF]/40 backdrop-blur-2xl shadow-xl border border-white/50"
                                style={{ right: "10%" }}
                            />
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="absolute w-40 h-40 rounded-[40px] shadow-2xl flex items-center justify-center"
                                style={{
                                    zIndex: 5,
                                    background: "rgba(255, 255, 255, 0.4)",
                                    backdropFilter: "blur(40px) saturate(200%)",
                                    borderTop: "2px solid rgba(255, 255, 255, 0.9)",
                                    borderLeft: "2px solid rgba(255, 255, 255, 0.7)",
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                                }}
                            >
                                <Lock size={44} className="text-[#1c1c1e] drop-shadow-sm opacity-80" />
                            </motion.div>
                        </div>

                        <div className="w-full" style={glassPanel}>
                            <form onSubmit={handleLogin} className="flex flex-col p-6 gap-6">
                                <div className="text-center mb-2">
                                    <h2 className="text-[28px] font-bold tracking-tight mb-1" style={{ color: textDark }}>
                                        Private Access
                                    </h2>
                                    <p className="text-[13px] font-medium" style={{ color: textMuted }}>
                                        Biometric or Passphrase Required
                                    </p>
                                </div>
                                <div style={glassInput}>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Enter PIN"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                        className="w-full h-[52px] bg-transparent outline-none font-semibold text-center placeholder:text-[#8E8E93]/70 text-[16px]"
                                        style={{ color: textDark }}
                                        autoFocus
                                    />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    className="w-full h-[54px] font-bold text-[15px] rounded-[20px] flex items-center justify-center text-white shadow-lg"
                                    style={{
                                        background: "#1c1c1e",
                                    }}
                                >
                                    Unlock
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                ) : activeTab === "home" ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 1, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col flex-grow px-5 overflow-y-auto no-scrollbar pb-32 pt-2"
                    >
                        <div className="mb-8 text-left px-2">
                            <h1 className="text-[34px] font-bold tracking-tight mb-1 leading-tight" style={{ color: textDark }}>
                                Overview
                            </h1>
                            <p className="text-[15px] font-medium" style={{ color: textMuted }}>
                                Select a destination to append.
                            </p>
                        </div>

                        {/* Bento Grid layout for modules */}
                        <div className="grid grid-cols-2 gap-4">
                            {tabs.map((tab, idx) => (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex flex-col items-start text-left p-5 overflow-hidden relative"
                                    style={{
                                        ...glassPanel,
                                        borderRadius: "28px",
                                        gridColumn: idx === 0 || idx === 3 ? "span 2" : "span 1",
                                    }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} opacity-40 pointer-events-none`} />

                                    <div
                                        className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-5 relative z-10 shadow-sm"
                                        style={{
                                            background: tab.iconBg,
                                            boxShadow: `0 8px 20px ${tab.shadowColor}, inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.1)`,
                                            border: "1px solid rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        <div style={{ color: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
                                            {tab.icon}
                                        </div>
                                    </div>
                                    <h2 className="text-[19px] font-bold tracking-tight mb-1 relative z-10" style={{ color: textDark }}>
                                        {tab.label}
                                    </h2>
                                    <p className="text-[13px] font-medium leading-snug relative z-10 opacity-80" style={{ color: textMuted }}>
                                        {tab.desc}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 1, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="flex flex-col flex-grow px-5 overflow-y-auto no-scrollbar pb-32 pt-2"
                    >
                        {/* Contextual Header */}
                        <div className="flex flex-col items-center justify-center text-center mb-6 px-4">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-[72px] h-[72px] rounded-[24px] flex items-center justify-center mb-4 relative z-10"
                                style={{
                                    background: tabs.find((t) => t.id === activeTab)?.iconBg,
                                    boxShadow: `0 12px 30px ${tabs.find((t) => t.id === activeTab)?.shadowColor}, inset 0 2px 5px rgba(255, 255, 255, 0.5), inset 0 -4px 10px rgba(0, 0, 0, 0.15)`,
                                    border: "1px solid rgba(255,255,255,0.4)",
                                }}
                            >
                                <div style={{ color: "#ffffff", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>
                                    {tabs.find((t) => t.id === activeTab)?.icon}
                                </div>
                            </motion.div>
                            <h1 className="text-[26px] font-bold tracking-tight mb-1" style={{ color: textDark }}>
                                {tabs.find((t) => t.id === activeTab)?.label}
                            </h1>
                            <p className="text-[14px] font-medium" style={{ color: textMuted }}>
                                {tabs.find((t) => t.id === activeTab)?.desc}
                            </p>
                        </div>

                        {/* Floating Neo-Glass Tab Dock (Bottom) */}
                        <div
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center p-2 rounded-full"
                            style={{
                                background: "rgba(255, 255, 255, 0.7)",
                                backdropFilter: "blur(30px) saturate(200%)",
                                WebkitBackdropFilter: "blur(30px) saturate(200%)",
                                border: "1px solid rgba(255, 255, 255, 0.8)",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                            }}
                        >
                            <div className="flex gap-1.5 items-center">
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    type="button"
                                    onClick={() => setActiveTab("home")}
                                    className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent transition-colors hover:bg-black/5"
                                    style={{ color: "#8E8E93" }}
                                >
                                    <Grid size={22} strokeWidth={2.5} />
                                </motion.button>

                                <div className="w-[1px] h-6 bg-black/10 mx-1" /> {/* Divider */}

                                {tabs.map((tab) => (
                                    <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all relative"
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                    background: tab.iconBg,
                                                    color: "#fff",
                                                    boxShadow: `0 4px 15px ${tab.shadowColor}`,
                                                }
                                                : {
                                                    background: "transparent",
                                                    color: "#8E8E93",
                                                }
                                        }
                                    >
                                        <div className={activeTab === tab.id ? "scale-90" : "scale-100 hover:text-[#1c1c1e] transition-colors"}>
                                            {tab.icon}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Form Editor */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                            <div className="w-full p-5 flex flex-col gap-5" style={glassPanel}>
                                {/* COMMON FIELD: TITLE / ITEM NAME */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] pl-1 opacity-70" style={{ color: textDark }}>
                                        {activeTab === "wishlist" ? "Item Name" : activeTab === "bookshelf" ? "Book Title" : "Title"}
                                    </label>
                                    <div style={glassInput}>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter title..."
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                            className="w-full h-12 px-4 bg-transparent border-none outline-none font-semibold text-[16px] placeholder:text-[#8E8E93]/60"
                                        />
                                    </div>
                                </div>

                                {/* CONDITIONAL FIELD: AUTHOR (Bookshelf) */}
                                {activeTab === "bookshelf" && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-[0.1em] pl-1 opacity-70" style={{ color: textDark }}>Author</label>
                                        <div style={glassInput}>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Author Name"
                                                value={formData.author}
                                                onChange={(e) => handleInputChange("author", e.target.value)}
                                                onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                                className="w-full h-12 px-4 bg-transparent border-none outline-none font-semibold text-[16px] placeholder:text-[#8E8E93]/60"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* CONDITIONAL FIELD: PRICE (Wishlist) */}
                                {activeTab === "wishlist" && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-[0.1em] pl-1 opacity-70" style={{ color: textDark }}>Estimated Price</label>
                                        <div style={glassInput}>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Rp 500.000"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange("price", e.target.value)}
                                                onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                                className="w-full h-12 px-4 bg-transparent border-none outline-none font-semibold text-[16px] placeholder:text-[#8E8E93]/60"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* COMMON FIELD: URL / IMAGE */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] pl-1 opacity-70" style={{ color: textDark }}>
                                        {activeTab === "wishlist" ? "Product URL" : "Cover Image URL"} <span className="text-[#8E8E93] font-medium lowercase tracking-normal">(optional)</span>
                                    </label>
                                    <div className="w-full h-12 flex items-center px-4" style={glassInput}>
                                        <Link2 size={16} className="text-[#8E8E93] mr-2 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={formData.coverImage}
                                            onChange={(e) => handleInputChange("coverImage", e.target.value)}
                                            onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                            className="w-full bg-transparent border-none outline-none font-medium text-[16px] placeholder:text-[#8E8E93]/60"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* COMMON FIELD: PAYLOAD (Content / Review) */}
                            {activeTab !== "wishlist" && (
                                <div className="w-full p-5 flex flex-col gap-2" style={glassPanel}>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] pl-1 opacity-70" style={{ color: textDark }}>
                                        {activeTab === "bookshelf" ? "Short Review" : "Markdown Payload"}
                                    </label>
                                    <div style={{ ...glassInput, minHeight: "220px", padding: "12px" }}>
                                        <textarea
                                            required
                                            placeholder={activeTab === "bookshelf" ? "What did you think of the book?" : "Paste your markdown content here..."}
                                            value={formData.content}
                                            onChange={(e) => handleInputChange("content", e.target.value)}
                                            onBlur={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                            className="w-full h-full min-h-[200px] bg-transparent border-none outline-none resize-none font-medium text-[16px] leading-relaxed placeholder:text-[#8E8E93]/60"
                                            style={{ color: textDark }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Bar */}
                            <div className="w-full flex items-center justify-between py-2 px-1 mb-8">
                                <span
                                    className="text-[13px] font-semibold"
                                    style={{ color: statusText.includes("Failed") ? "#FF3B30" : "#34C759" }}
                                >
                                    {statusText}
                                </span>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 h-[46px] font-bold text-[14px] rounded-full flex items-center justify-center gap-2 text-white shadow-lg shadow-black/20"
                                    style={{
                                        background: isSubmitting ? "#8E8E93" : "#1c1c1e",
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> Publish
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
