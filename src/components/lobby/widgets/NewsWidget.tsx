"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsWidgetProps {
    news: any;
    swipeDirection: number;
    newsPage: number;
    visibleNews: any[];
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function NewsWidget({
    news,
    swipeDirection,
    newsPage,
    visibleNews,
    onMouseEnter,
    onMouseLeave
}: NewsWidgetProps) {
    return (
        <motion.div
            key="news"
            custom={swipeDirection}
            variants={{
                initial: (d: number) => ({ opacity: 0, x: d * 15 }),
                animate: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -15 })
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: "relative", zIndex: 1 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={onMouseEnter}
            onTouchEnd={onMouseLeave}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                📰 Today&apos;s Articles
            </div>
            {news && news.articles && news.articles.length > 0 ? (
                <div style={{ position: "relative", minHeight: "220px" }}>
                    {/* Auto-roll progress bar */}
                    {news.articles.length > 3 && (
                        <div style={{ width: "100%", height: "2px", borderRadius: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "12px", overflow: "hidden" }}>
                            <motion.div
                                key={`progress-${newsPage}`}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 15, ease: "linear" }}
                                style={{ height: "100%", transformOrigin: "left", borderRadius: "1px", background: "linear-gradient(90deg, rgba(147,197,253,0.6), rgba(167,139,250,0.6))", willChange: "transform" }}
                            />
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`newspage-${newsPage}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {/* Feature Article (Index 0) */}
                            {visibleNews.length > 0 && (
                                <a
                                    href={visibleNews[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        padding: "10px",
                                        borderRadius: "14px",
                                        background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.15)",
                                        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                        position: "relative"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)"; }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                                        <span style={{ fontSize: "0.45rem", fontWeight: 800, color: "#93c5fd", background: "rgba(147,197,253,0.15)", padding: "2px 5px", borderRadius: "4px", border: "1px solid rgba(147,197,253,0.2)", letterSpacing: "0.05em" }}>HEADLINE</span>
                                        <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase" }}>{visibleNews[0].source}</span>
                                    </div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1.25, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {visibleNews[0].title}
                                    </div>
                                    {visibleNews[0].excerpt && (
                                        <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.6)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4, marginTop: "2px" }}>
                                            {visibleNews[0].excerpt}
                                        </div>
                                    )}
                                </a>
                            )}

                            {/* Secondary Articles Grid (Index 1 & 2) */}
                            {visibleNews.length > 1 && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    {visibleNews.slice(1, 3).map((a: any, i: number) => (
                                        <a
                                            key={`news-sub-${i}`}
                                            href={a.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                textDecoration: "none",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                padding: "8px",
                                                borderRadius: "12px",
                                                background: "rgba(0,0,0,0.12)",
                                                border: "1px solid rgba(0,0,0,0.05)",
                                                transition: "all 0.2s ease",
                                                minHeight: "75px"
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; }}
                                        >
                                            <div style={{ fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {a.title}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", marginTop: "6px" }}>
                                                <span>{a.source}</span>
                                                <span style={{
                                                    width: "4px", height: "4px", borderRadius: "50%",
                                                    background: a.timeAgo?.includes("Startup") ? "#a78bfa" : a.timeAgo?.includes("Deep Dive") ? "#fb923c" : "#60a5fa"
                                                }} />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) : (
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading news···</div>
            )}
        </motion.div>
    );
}

