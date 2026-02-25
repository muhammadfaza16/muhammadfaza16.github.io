"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { StarlightRadio } from "@/components/sanctuary/StarlightRadio";
import Link from "next/link";
import { ChevronLeft, Radio as RadioIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StarlightRadioPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000',
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000 100%)',
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
                    color: "#fff",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {/* Back Button */}
                    <Link href="/starlight">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                position: "fixed",
                                top: isMobile ? "1.5rem" : "2.5rem",
                                left: isMobile ? "1.5rem" : "2.5rem",
                                zIndex: 100,
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                backdropFilter: "blur(12px)",
                                borderRadius: "100px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                            }}
                            whileHover={{ scale: 1.05, background: "rgba(255, 255, 255, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft size={18} />
                            <span>Back</span>
                        </motion.div>
                    </Link>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            textAlign: "center",
                            marginBottom: "3rem",
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            marginBottom: "0.5rem"
                        }}>
                            <RadioIcon size={28} color="#FFB000" />
                            <h1 style={{
                                fontSize: isMobile ? "2.5rem" : "3.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.04em",
                                margin: 0,
                                background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                Starlight Radio
                            </h1>
                        </div>
                        <p style={{
                            fontSize: isMobile ? "0.9rem" : "1.1rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            fontWeight: 500,
                            margin: 0,
                        }}>
                            24/7 Autopilot Broadcast · Synchronized with Global Time
                        </p>
                    </motion.div>

                    {/* The Radio Widget */}
                    <div style={{
                        width: "100%",
                        maxWidth: "500px",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <StarlightRadio />
                    </div>

                    {/* Studio Ambiance Decorative Elements */}
                    {!isMobile && (
                        <div style={{
                            position: "fixed",
                            bottom: "3rem",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            gap: "4rem",
                            opacity: 0.2,
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
                                            background: "rgba(255,255,255,0.5)",
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
