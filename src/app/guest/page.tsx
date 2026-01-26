"use client";

import React, { useEffect } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Heart, Star } from "lucide-react";

// Background components
const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

const Guest28Icon = (props: any) => (
    <div style={{ width: props.size || '100%', height: props.size || '100%', position: 'relative' }}>
        <Image
            src="/guest/no28.png"
            alt="Guest 28"
            fill
            style={{ objectFit: 'contain', filter: 'grayscale(1) contrast(1.2) invert(1)', mixBlendMode: 'screen' }}
        />
    </div>
);

// Helper for Icon styling (Ported from RoomBentoGrid for inline styling requirement)
const GuestIcon = ({ title, icon, gradient, delay = 0 }: { title: string, icon: React.ReactNode, gradient: string, delay?: number }) => {
    return (
        <div style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
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
                {/* The App Icon (Premium Skeuomorphic) */}
                <div style={{
                    position: "relative",
                    width: "clamp(60px, 17vw, 72px)",
                    height: "clamp(60px, 17vw, 72px)",
                    borderRadius: "22.5%", // Superellipse
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 24px -6px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5)",
                    overflow: "hidden",
                    zIndex: 1
                }} className="hover:scale-105 active:scale-90 transition-transform duration-100">

                    {/* Symbol */}
                    <div style={{
                        color: "white",
                        zIndex: 10,
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    }}>
                        {React.cloneElement(icon as any, { size: "45%", strokeWidth: 2.5 })}
                    </div>

                    {/* Glossy Top Shine */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "55%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 90%, rgba(255,255,255,0) 100%)",
                        borderTopLeftRadius: "22.5%",
                        borderTopRightRadius: "22.5%",
                        borderBottomLeftRadius: "80% 20%",
                        borderBottomRightRadius: "80% 20%",
                        zIndex: 5,
                        pointerEvents: "none",
                    }} />

                    {/* Bottom Glow */}
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        background: "radial-gradient(ellipse at bottom, rgba(255,255,255,0.2) 0%, transparent 70%)",
                        zIndex: 4,
                        pointerEvents: "none"
                    }} />

                    {/* Noise Texture */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.08,
                        backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
                        filter: "contrast(150%) brightness(100%)",
                        zIndex: 2,
                        pointerEvents: "none",
                    }} />
                </div>

                {/* App Label */}
                <span style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "white",
                    textAlign: "center",
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    letterSpacing: "0.02em",
                    marginTop: "2px"
                }}>
                    {title}
                </span>
            </motion.div>
        </div>
    );
};

export default function GuestPage() {
    // Scroll lock logic
    useEffect(() => {
        const preventScroll = (e: TouchEvent) => {
            e.preventDefault();
        };
        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
        // Lock body scroll
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener('touchmove', preventScroll);
            document.removeEventListener('wheel', (e) => e.preventDefault());
            document.body.style.overflow = "";
        };
    }, []);

    const guestApps = [
        { title: "Profile", icon: <User />, gradient: "linear-gradient(135deg, #FF2D55, #FF375F)" },
        { title: "Like", icon: <Heart />, gradient: "linear-gradient(135deg, #FF9500, #FF5E3A)" },
        { title: "Favs", icon: <Star />, gradient: "linear-gradient(135deg, #AF52DE, #5856D6)" },
        { title: "Guest No 28", icon: <Guest28Icon />, gradient: "linear-gradient(135deg, #FFD60A, #FF9F0A)" },
    ];

    return (
        <>
            {/* Ambient Background - Spans whole screen */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "120vh", // Extended to ensure coverage
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden"
            }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            <main style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "100svh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: "4rem"
            }}>
                {/* Back Button */}
                <Link href="/" style={{
                    position: "absolute",
                    top: "2rem",
                    left: "1.5rem",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "1rem",
                    opacity: 0.8,
                    zIndex: 20
                }}>
                    ← Home
                </Link>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "4rem"
                }}>
                    <h2 style={{
                        color: "white",
                        marginBottom: "3rem",
                        fontFamily: "-apple-system, sans-serif",
                        fontWeight: 300,
                        fontSize: "2rem",
                        textShadow: "0 0 20px rgba(255,255,255,0.5)"
                    }}>Guest Area</h2>

                    {/* Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)", // 3 columns, allows wrapping
                        gap: "2rem",
                        padding: "0 1.5rem",
                        maxWidth: "420px",
                        width: "100%",
                        justifyItems: "center"
                    }}>
                        {guestApps.map((app, idx) => (
                            <GuestIcon key={idx} {...app} delay={idx * 0.1} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
