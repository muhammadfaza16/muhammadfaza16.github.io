"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Star, Home, Lock, Key } from "lucide-react";
import { Container } from "@/components/Container";

// --- Components ---

const Guest28Icon = (props: any) => (
    <div style={{ width: props.size || '100%', height: props.size || '100%', position: 'relative' }}>
        <Image
            src="/guest/no28.webp"
            alt="Guest 28"
            fill
            style={{ objectFit: 'cover' }}
        />
    </div>
);

const PasswordPopup = ({ onClose }: { onClose: () => void }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dummy check - always fail or just close, user said "gausa lo implement" functionality.
        // But to feel "real", let's shake or something if empty.
        // For now, just close it to simulate "trying".
        if (!password) {
            setError(true);
            return;
        }
        // Dummy: just close with no action (access denied visually) or just close
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem"
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    padding: "2rem",
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "320px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                    textAlign: "center"
                }}
            >
                <div style={{
                    width: "50px", height: "50px", background: "#f0f0f0",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem"
                }}>
                    <Key size={24} color="#555" />
                </div>
                <h3 style={{ margin: "0 0 0.5rem", color: "#333", fontFamily: "'Crimson Pro', serif", fontSize: "1.5rem" }}>Terkunci</h3>
                <p style={{ margin: "0 0 1.5rem", color: "#666", fontSize: "0.9rem" }}>Masukkan sandi untuk membuka kenangan ini.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password" // password type
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        placeholder="Sandi..."
                        autoFocus
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: error ? "1px solid red" : "1px solid #ddd",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            outline: "none",
                            textAlign: "center"
                        }}
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#333",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Buka
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const GuestIcon = ({ title, icon, gradient, href, delay = 0, fullSymbol = false, rotation = 0, locked = false, onLockClick }: any) => {
    const Content = (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20, rotate: rotation }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay,
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer"
            }}
            onClick={locked ? onLockClick : undefined}
        >
            {/* The Sketchy Icon */}
            <div style={{
                position: "relative",
                width: "clamp(64px, 18vw, 80px)",
                height: "clamp(64px, 18vw, 80px)",
                borderRadius: "18%",
                background: "#fff", // White base
                border: "2px solid #5a5a5a",
                boxShadow: "3px 3px 0px #5a5a5a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                zIndex: 1,
                transform: `rotate(${rotation}deg)`
            }} className="hover:scale-105 active:scale-95 transition-transform duration-100">

                {/* Solid Color for "Polos" look, or Gradient if provided */}
                <div style={{ position: "absolute", inset: 0, background: gradient, opacity: locked ? 1 : 0.2 }} />

                {/* Symbol */}
                <div style={{
                    color: locked ? "#fff" : "#5a5a5a", // White icon on colored bg for locked
                    zIndex: 10,
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {React.cloneElement(icon as any, { size: fullSymbol ? "100%" : "40%", strokeWidth: 1.5 })}
                </div>

                {/* Paper Texture Overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                    pointerEvents: "none"
                }} />
            </div>

            {/* App Label */}
            <span style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#444",
                textAlign: "center",
                marginTop: "4px",
                fontStyle: "italic"
            }}>
                {title}
            </span>
        </motion.div>
    );

    if (locked) {
        return Content;
    }

    return (
        <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {Content}
        </Link>
    );
};

export default function GuestPage() {
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setMounted(true);
        const preventScroll = (e: TouchEvent) => e.preventDefault();
        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener('touchmove', preventScroll);
            document.body.style.overflow = "";
        };
    }, []);

    if (!mounted) return null;

    const guestApps = [
        { title: "16", icon: <Lock />, gradient: "#95a5a6", href: "#", rotation: -2, locked: true }, // Concrete gray
        { title: "jogja 21", icon: <Lock />, gradient: "#7f8c8d", href: "#", rotation: 3, locked: true }, // Asbestos gray
        { title: "dieng 25", icon: <Lock />, gradient: "#bdc3c7", href: "#", rotation: -1, locked: true }, // Silver
        { title: "28", icon: <Guest28Icon />, gradient: "#FFD60A", href: "/guest/no28", fullSymbol: true, rotation: 2 }, // Yellow
    ];

    return (
        <div style={{
            background: "#fdf8f1",
            backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 0)",
            backgroundSize: "40px 40px",
            minHeight: "100svh",
            color: "#444",
            fontFamily: "'Crimson Pro', serif",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Texture Overlay */}
            <div style={{
                position: "fixed",
                inset: 0,
                opacity: 0.4,
                pointerEvents: "none",
                backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                zIndex: 1
            }} />

            <AnimatePresence>
                {showPassword && (
                    <PasswordPopup onClose={() => setShowPassword(false)} />
                )}
            </AnimatePresence>

            <main style={{
                position: "relative",
                zIndex: 10,
                width: "100%",
                height: "100svh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "2rem"
            }}>
                <Container>
                    {/* Home Navigation */}
                    <div style={{ marginBottom: "2rem" }}>
                        <Link href="/" style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            background: "#fff",
                            border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a",
                            borderRadius: "12px",
                            color: "#5a5a5a",
                            transition: "all 0.2s ease"
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translate(-1px, -1px)";
                                e.currentTarget.style.boxShadow = "4px 4px 0px #5a5a5a";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "2px 2px 0px #5a5a5a";
                            }}
                        >
                            <Home size={22} strokeWidth={2} />
                        </Link>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "2rem"
                    }}>
                        <h2 style={{
                            color: "#2d2d2d",
                            marginBottom: "4rem",
                            fontWeight: 700,
                            fontSize: "2.5rem",
                            textAlign: "center"
                        }}>Guest Selection</h2>

                        {/* App Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "3rem",
                            justifyItems: "center",
                            maxWidth: "320px"
                        }}>
                            {guestApps.map((app, idx) => (
                                <GuestIcon
                                    key={idx}
                                    {...app}
                                    delay={idx * 0.1}
                                    onLockClick={() => setShowPassword(true)}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </main>

            {/* Subtle Coffee Stain */}
            <div style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "400px",
                height: "400px",
                background: "rgba(139, 69, 19, 0.02)",
                borderRadius: "50%",
                filter: "blur(60px)",
                pointerEvents: "none"
            }} />
        </div>
    );
}
