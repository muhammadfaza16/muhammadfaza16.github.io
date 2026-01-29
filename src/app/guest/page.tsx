"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Heart, Star, Home } from "lucide-react";
import { Container } from "@/components/Container";

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

const GuestIcon = ({ title, icon, gradient, href, delay = 0, fullSymbol = false, rotation = 0 }: { title: string, icon: React.ReactNode, gradient: string, href: string, delay?: number, fullSymbol?: boolean, rotation?: number }) => {
    return (
        <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
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
            >
                {/* The Sketchy Icon */}
                <div style={{
                    position: "relative",
                    width: "clamp(64px, 18vw, 80px)",
                    height: "clamp(64px, 18vw, 80px)",
                    borderRadius: "18%",
                    background: "#fff",
                    border: "2px solid #5a5a5a",
                    boxShadow: "3px 3px 0px #5a5a5a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    zIndex: 1,
                    transform: `rotate(${rotation}deg)`
                }} className="hover:scale-105 active:scale-95 transition-transform duration-100">

                    {/* Background Color/Gradient (Subtle) */}
                    <div style={{ position: "absolute", inset: 0, background: gradient, opacity: 0.1 }} />

                    {/* Symbol */}
                    <div style={{
                        color: "#5a5a5a",
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
                        opacity: 0.2,
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
        </Link>
    );
};

export default function GuestPage() {
    const [mounted, setMounted] = useState(false);

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
        { title: "Profile", icon: <User />, gradient: "#FF2D55", href: "/guest/profile", rotation: -2 },
        { title: "Like", icon: <Heart />, gradient: "#FF9500", href: "/guest/like", rotation: 3 },
        { title: "Favs", icon: <Star />, gradient: "#AF52DE", href: "/guest/favs", rotation: -1 },
        { title: "Us", icon: <Guest28Icon />, gradient: "#FFD60A", href: "/guest/no28", fullSymbol: true, rotation: 2 },
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
                                <GuestIcon key={idx} {...app} delay={idx * 0.1} />
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
