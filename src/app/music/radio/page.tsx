"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { RadioHub } from "@/components/sanctuary/RadioHub";
import { RadioTuner } from "@/components/sanctuary/RadioTuner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RadioPage() {
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a1a1a', zIndex: -1 }} />

            <ZenHideable>
                <main style={{
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Back to Hub */}
                    <AnimatePresence>
                        {!selectedStationId && (
                            <Link href="/music" style={{ textDecoration: "none" }}>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    style={{
                                        position: "fixed",
                                        top: "1.25rem",
                                        left: "1.25rem",
                                        zIndex: 100,
                                        display: "flex", alignItems: "center", gap: "6px",
                                        padding: "6px 12px",
                                        background: "#2a2a2a",
                                        border: "1.5px solid #333",
                                        borderRadius: "8px",
                                        color: "#777",
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft size={14} strokeWidth={2.5} />
                                    <span>Hub</span>
                                </motion.div>
                            </Link>
                        )}
                    </AnimatePresence>

                    {/* DAP Chassis */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        style={{
                            width: "100%",
                            maxWidth: "380px",
                            background: "linear-gradient(180deg, #2d2d2d 0%, #252525 100%)",
                            border: "2px solid #111",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 40px 70px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "1.25rem 1.25rem 0.75rem",
                        }}>
                            <span style={{
                                color: "#555",
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "3px",
                                textTransform: "uppercase"
                            }}>
                                Radio Frequencies
                            </span>
                        </div>

                        {/* Content Area */}
                        <div style={{ padding: "0 1rem 1.5rem", minHeight: "280px" }}>
                            <AnimatePresence mode="wait">
                                {!selectedStationId ? (
                                    <motion.div
                                        key="hub"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <RadioHub onSelect={(id) => setSelectedStationId(id)} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="tuner"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <RadioTuner stationId={selectedStationId} onBack={() => setSelectedStationId(null)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </main>
            </ZenHideable>
        </>
    );
}
