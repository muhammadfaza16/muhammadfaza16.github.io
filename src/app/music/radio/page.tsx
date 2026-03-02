"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { RadioHub } from "@/components/sanctuary/RadioHub";
import { RadioTuner } from "@/components/sanctuary/RadioTuner";
import Link from "next/link";
import { ChevronLeft, Radio as RadioIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StarlightRadioPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            {/* Matte Gray Background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#282828',
                zIndex: -1
            }} />

            <ZenHideable>
                <main style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? "1rem" : "2.5rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Global Back Button (Only visible in Hub) */}
                    <AnimatePresence>
                        {!selectedStationId && (
                            <Link href="/music">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    style={{
                                        position: "fixed",
                                        top: isMobile ? "1.5rem" : "2.5rem",
                                        left: isMobile ? "1.5rem" : "2.5rem",
                                        zIndex: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 16px",
                                        background: "#3f3f46",
                                        border: "1px solid #18181b",
                                        borderBottom: "3px solid #18181b",
                                        borderRadius: "6px",
                                        color: "#d4d4d8",
                                        textDecoration: "none",
                                        fontSize: "0.75rem",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ChevronLeft size={16} strokeWidth={3} />
                                    <span>Back</span>
                                </motion.div>
                            </Link>
                        )}
                    </AnimatePresence>

                    {/* Heading (Only visible in Hub) */}
                    <AnimatePresence>
                        {!selectedStationId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                style={{
                                    textAlign: "center",
                                    marginBottom: "3rem",
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    marginBottom: "0.5rem"
                                }}>
                                    <RadioIcon size={22} color="#d4d4d8" />
                                    <h1 style={{
                                        fontSize: isMobile ? "1.5rem" : "2rem",
                                        fontWeight: 800,
                                        letterSpacing: "-0.02em",
                                        margin: 0,
                                        color: "#d4d4d8",
                                        textTransform: "uppercase"
                                    }}>
                                        Starlight Freqs
                                    </h1>
                                </div>
                                <p style={{
                                    fontSize: "0.7rem",
                                    color: "#a1a1aa",
                                    fontWeight: 700,
                                    margin: 0,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px"
                                }}>
                                    Tactile Audio Hardware
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Two-Stage Router */}
                    <AnimatePresence mode="wait">
                        {!selectedStationId ? (
                            <motion.div
                                key="hub"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.3 }}
                                style={{ width: "100%", display: "flex", justifyContent: "center" }}
                            >
                                <RadioHub onSelect={(id) => setSelectedStationId(id)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tuner"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.3 }}
                                style={{ width: "100%", display: "flex", justifyContent: "center" }}
                            >
                                <RadioTuner stationId={selectedStationId} onBack={() => setSelectedStationId(null)} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Studio Ambiance Decorative Elements */}
                    {!isMobile && (
                        <div style={{
                            position: "fixed",
                            bottom: "3rem",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            gap: "4rem",
                            pointerEvents: "none"
                        }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px"
                                }}>
                                    {[1, 2, 3, 4, 5, 6].map(j => (
                                        <div key={j} style={{
                                            width: "60px",
                                            height: "2px",
                                            background: "#3f3f46",
                                            opacity: 1 - (j * 0.15)
                                        }} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </ZenHideable>
        </>
    );
}
