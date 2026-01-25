"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";

const JARVIS_REMINDERS = [
    "Jangan lupa minum air, Wanderer. Tubuhmu butuh hidrasi untuk berpikir jernih.",
    "Sudahkah kamu mencatat ide gilamu hari ini? Jangan biarkan dia menguap.",
    "Bernapaslah. Satu tarikan napas panjang bisa mengubah perspektifmu.",
    "Dunia di luar sana luas, tapi dunia di dalam kepalamu juga tak kalah menarik.",
    "Pelan-pelan saja. Konsistensi lebih berharga daripada kecepatan yang meledak-ledak.",
    "Istirahat bukan tanda kelemahan, itu adalah strategi untuk bertahan lebih lama.",
    "Setiap baris kode adalah langkah kecil menuju mahakarya. Teruskan.",
];

export function StarlightJarvisHero() {
    const [reminder, setReminder] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Pick a reminder based on the day or just rotate
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setIndex(dayOfYear % JARVIS_REMINDERS.length);
        setReminder(JARVIS_REMINDERS[dayOfYear % JARVIS_REMINDERS.length]);
    }, []);

    return (
        <section style={{
            paddingTop: "calc(5rem + 5vh)",
            paddingBottom: "4rem",
            position: "relative",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
        }}>
            <Container>
                <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

                    {/* Jarvis Message Card */}
                    <div style={{ maxWidth: "42rem" }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "1.5rem",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "var(--accent)",
                            }}>
                                <span style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "var(--accent)",
                                    boxShadow: "0 0 10px var(--accent)",
                                    animation: "pulse 2s infinite"
                                }} />
                                Jarvis Reporting
                            </div>

                            <h1 style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                                fontWeight: 500,
                                lineHeight: 1.1,
                                letterSpacing: "-0.03em",
                                marginBottom: "2rem",
                                color: "var(--foreground)",
                            }}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        "{reminder}"
                                    </motion.span>
                                </AnimatePresence>
                            </h1>

                            <p style={{
                                fontSize: "1.15rem",
                                fontFamily: "var(--font-sans)",
                                color: "var(--text-secondary)",
                                maxWidth: "35rem",
                                lineHeight: 1.7,
                            }}>
                                Selamat datang kembali di Starlight, Wanderer. Semua arsip dan memorimu sudah siap untuk dijelajahi. Apa yang ingin kamu ingat hari ini?
                            </p>
                        </motion.div>
                    </div>

                    {/* Integrated Music Player Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{
                            width: "100%",
                            maxWidth: "800px", // Give more space for CurrentlyStrip
                        }}
                    >
                        <CurrentlyStrip />
                    </motion.div>

                </div>
            </Container>
        </section>
    );
}
