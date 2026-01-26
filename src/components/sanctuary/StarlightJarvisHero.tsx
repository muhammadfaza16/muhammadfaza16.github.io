"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const JARVIS_REMINDERS = [
    "Minum air, Wanderer.",
    "Catat ide gilamu.",
    "Bernapaslah sejenak.",
    "Fokus pada proses.",
    "Istirahat itu strategi.",
    "Konsistensi > Kecepatan.",
];

export function StarlightJarvisHero() {
    const [reminder, setReminder] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setIndex(dayOfYear % JARVIS_REMINDERS.length);
        setReminder(JARVIS_REMINDERS[dayOfYear % JARVIS_REMINDERS.length]);
    }, []);

    return (
        <section style={{
            padding: "0 1.5rem",
            marginBottom: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "480px", // Match iPhone width
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem"
            }}>
                {/* JARVIS WIDGET - iOS Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    style={{
                        background: "rgba(255, 255, 255, 0.1)", // Light glass
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        borderRadius: "26px", // Super elliptical
                        padding: "1.5rem",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        minHeight: "160px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontFamily: "-apple-system, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}>
                        <div style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#34C759", // iOS Green
                            boxShadow: "0 0 8px #34C759"
                        }} />
                        JARVIS
                    </div>

                    {/* Content */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <h3 style={{
                            fontFamily: "-apple-system, sans-serif",
                            fontSize: "1.25rem",
                            fontWeight: 500, // Thinner, Apple-like
                            lineHeight: 1.3,
                            color: "white",
                            marginBottom: "0.5rem"
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    "{reminder}"
                                </motion.span>
                            </AnimatePresence>
                        </h3>
                        <p style={{
                            fontSize: "0.85rem",
                            color: "rgba(255,255,255,0.6)",
                            lineHeight: 1.4,
                        }}>
                            Selamat datang kembali, Wanderer.
                        </p>
                    </div>

                    {/* Glossy Reflection */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "150px",
                        height: "150px",
                        background: "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)",
                        pointerEvents: "none",
                        borderTopRightRadius: "26px"
                    }} />
                </motion.div>


            </div>
        </section>
    );
}
