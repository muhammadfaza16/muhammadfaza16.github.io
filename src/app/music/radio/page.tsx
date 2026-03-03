"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { RadioHub } from "@/components/sanctuary/RadioHub";
import { RadioTuner } from "@/components/sanctuary/RadioTuner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

export default function RadioPage() {
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

    return (
        <>
            <AtmosphericBackground />

            <ZenHideable>
                <main style={{
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Back to Hub - Glassmorphic */}
                    <AnimatePresence>
                        {!selectedStationId && (
                            <Link href="/music" style={{ textDecoration: "none" }}>
                                <motion.div
                                    initial={{ opacity: 0, x: -15, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -15, filter: "blur(10px)" }}
                                    style={{
                                        position: "fixed",
                                        top: "1.5rem",
                                        left: "1.5rem",
                                        zIndex: 100,
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "8px 16px",
                                        background: "rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderTop: "1px solid rgba(255,255,255,0.2)",
                                        borderLeft: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "16px",
                                        color: "rgba(255,255,255,0.8)",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "1.5px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                    }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft size={16} strokeWidth={2.5} />
                                    <span>Hub</span>
                                </motion.div>
                            </Link>
                        )}
                    </AnimatePresence>

                    {/* Glassmorphic Container (Replaces Chassis) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        style={{
                            width: "100%",
                            maxWidth: "360px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0"
                        }}
                    >
                        {/* Header Status Bar */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1rem"
                        }}>
                            <span style={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                letterSpacing: "4px",
                                textTransform: "uppercase",
                                textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                            }}>
                                Radio Frequencies
                            </span>
                        </div>

                        {/* Content Area Glass Card */}
                        <div style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                            backdropFilter: "blur(24px) saturate(140%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderTop: "1px solid rgba(255,255,255,0.2)",
                            borderLeft: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "24px",
                            padding: "1.5rem 1rem",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <AnimatePresence mode="wait">
                                {!selectedStationId ? (
                                    <motion.div
                                        key="hub"
                                        initial={{ opacity: 0, filter: "blur(8px)", scale: 0.96 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                        exit={{ opacity: 0, filter: "blur(8px)", scale: 0.96, position: "absolute", width: "100%" }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <RadioHub onSelect={(id) => setSelectedStationId(id)} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="tuner"
                                        initial={{ opacity: 0, filter: "blur(8px)", scale: 1.04 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                        exit={{ opacity: 0, filter: "blur(8px)", scale: 1.04, position: "absolute", width: "100%" }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
