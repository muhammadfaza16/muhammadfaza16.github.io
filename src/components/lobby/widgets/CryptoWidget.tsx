"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CryptoWidgetProps {
    cryptoData: any;
    swipeDirection: number;
}

export function CryptoWidget({ cryptoData, swipeDirection }: CryptoWidgetProps) {
    const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);

    return (
        <motion.div
            key="crypto"
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
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                📊 Markets
            </div>
            {cryptoData && cryptoData.crypto && cryptoData.crypto.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    
                    {/* Macro Dashboard */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderRadius: "14px", background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "4px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.15)" }}>
                        
                        {/* Fear & Greed Gauge */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
                            <div style={{ position: "relative", width: "60px", height: "30px", overflow: "hidden" }}>
                                {/* Gauge Background */}
                                <svg width="60" height="60" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="40%" stopColor="#f59e0b" />
                                            <stop offset="60%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Needle */}
                                {(() => {
                                    const fng = cryptoData.global.fng || 50;
                                    // Map 0-100 to angle -90 to 90
                                    const angle = (fng / 100) * 180 - 90;
                                    return (
                                        <motion.div
                                            style={{ position: "absolute", bottom: 0, left: "27px", width: "6px", height: "26px", transformOrigin: "bottom center", zIndex: 10 }}
                                            initial={{ rotate: -90 }}
                                            animate={{ rotate: angle }}
                                            transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.2 }}
                                        >
                                            <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "3px 3px 0 0", boxShadow: "0 0 4px rgba(0,0,0,0.5)" }} />
                                            <div style={{ position: "absolute", bottom: "-3px", left: "0", width: "6px", height: "6px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 4px rgba(0,0,0,0.5)" }} />
                                        </motion.div>
                                    );
                                })()}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "60px", marginTop: "2px" }}>
                                <span style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>FEAR</span>
                                <span style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>GREED</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2px" }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{cryptoData.global.fng || 50}</div>
                                <div style={{ fontSize: "0.45rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sentiment</div>
                            </div>
                        </div>

                        <div style={{ width: "1px", height: "40px", background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)", margin: "0 8px" }} />

                        {/* Market Stats */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Global Cap</span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", fontVariantNumeric: "tabular-nums" }}>${((cryptoData.global.totalMarketCap || 0) / 1e12).toFixed(2)}T</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>BTC Dom</span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", fontVariantNumeric: "tabular-nums" }}>{(cryptoData.global.btcDominance || 0).toFixed(1)}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>USD/IDR</span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", fontVariantNumeric: "tabular-nums" }}>Rp {(cryptoData.forex.IDR || 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Assets */}
                    {cryptoData.crypto.map((c: any) => {
                        // Generate sparkline SVG path
                        const spark = c.sparkline || [];
                        let sparkPath = "";
                        if (spark.length > 1) {
                            const min = Math.min(...spark);
                            const max = Math.max(...spark);
                            const range = max - min || 1;
                            sparkPath = spark.map((v: number, idx: number) => {
                                const x = (idx / (spark.length - 1)) * 100;
                                const y = 100 - ((v - min) / range) * 100;
                                return `${idx === 0 ? "M" : "L"}${x},${y}`;
                            }).join(" ");
                        }
                        return (
                            <div
                                key={c.id}
                                onMouseEnter={() => setHoveredCoin(c.id)}
                                onMouseLeave={() => setHoveredCoin(null)}
                                onClick={() => setHoveredCoin(hoveredCoin === c.id ? null : c.id)}
                                style={{ display: "flex", flexDirection: "column", padding: "6px 8px", borderRadius: "10px", background: hoveredCoin === c.id ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.12)", cursor: "pointer", transition: "background 0.2s ease", position: "relative", overflow: "hidden" }}
                            >
                                {/* Sparkline Background */}
                                {sparkPath && (
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
                                        <path d={sparkPath} fill="none" stroke={c.change24h >= 0 ? "#4ade80" : "#f87171"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                )}
                                <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontSize: "1.1rem" }}>{c.emoji}</span>
                                        <div>
                                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>{c.symbol}</div>
                                            <div style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.45)" }}>{c.name}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", fontVariantNumeric: "tabular-nums" }}>
                                            ${c.usd >= 1000 ? c.usd.toLocaleString('en-US', { maximumFractionDigits: 0 }) : c.usd.toFixed(2)}
                                        </div>
                                        <div style={{ fontSize: "0.55rem", fontWeight: 600, color: c.change24h >= 0 ? "#4ade80" : "#f87171" }}>
                                            {c.change24h >= 0 ? "▲" : "▼"} {Math.abs(c.change24h).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {hoveredCoin === c.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: "4px" }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ overflow: "hidden", display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "rgba(255,255,255,0.65)", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "4px" }}
                                        >
                                            <span>Vol: ${(c.vol24h / 1e9).toFixed(1)}B</span>
                                            <span>Cap: ${(c.marketCap / 1e9).toFixed(1)}B</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading markets···</div>
            )}
        </motion.div>
    );
}
