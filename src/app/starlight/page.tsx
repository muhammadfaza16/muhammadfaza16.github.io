"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StarlightPage() {
  const [activeDock, setActiveDock] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("starlight_active_dock");
    if (saved !== null) {
      setActiveDock(parseInt(saved, 10));
    }

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTop = 0;
      document.body.style.overflow = "hidden";
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
        html, body { overscroll-behavior: none; }
        #main-content::-webkit-scrollbar { display: none; }
      `}} />

      {/* Naruto Wallpaper Background */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/wallpapers/wp1-edited.webp')",
        backgroundSize: "cover",
        backgroundPosition: "bottom center",
        zIndex: -3,
      }} />
      {/* Dark overlay for readability (Match Home) */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)",
        zIndex: -2,
      }} />
      <div>
        {/* Back Button */}
        <div style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          zIndex: 40
        }}>
          <Link
            href="/"
            prefetch={false}
            aria-label="Go Back"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.08)", // Slightly more opaque structure
              backdropFilter: "blur(32px) saturate(160%) brightness(110%)", // Stronger blur
              WebkitBackdropFilter: "blur(32px) saturate(160%) brightness(110%)",
              borderRadius: "50%",
              color: "#ffffff", // Pure white for guaranteed contrast on dark overlays
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(255, 255, 255, 0.25)", // Crisper edge
              boxShadow: "0 8px 24px -4px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)", // Stronger shadow + spec
              textDecoration: "none"
            }}
            className="hover:scale-110 active:scale-95 group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <ZenHideable hideInZen>
          <main style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100svh", // Prevent bottom clipping
            overflowX: "hidden", // Allow vertical scrolling if the device is very short
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // Perfectly center the dock
            padding: isMobile ? "1.2rem 0.75rem" : "2rem 1rem", // Standard padding all around
          }}>
            <motion.div
              initial={{ opacity: 1, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
              style={{
                width: "100%",
                maxWidth: isMobile ? "460px" : "520px",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(200,220,255,0.15) 50%, rgba(255,255,255,0.1) 100%)", // Much more solid
                backdropFilter: "blur(28px) saturate(160%)", // Stronger blur
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                borderRadius: "32px",
                border: "1px solid rgba(255, 255, 255, 0.25)", // Thicker edge highlight
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35), inset 0 1px 0.5px rgba(255,255,255,0.2)",
                overflow: "hidden", // Keep children inside rounded corners
                position: "relative"
              }}
            >

              {/* Windows Header (Restored Traffic Lights) */}
              <div style={{
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                background: "rgba(255, 255, 255, 0.015)",
              }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {[0, 1, 2].map((i) => {
                    const colors = ["#FF5F56", "#FFBD2E", "#27C93F"];
                    return (
                      <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[i], opacity: 0.85 }} />
                    );
                  })}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.03em" }}>Muhammad Faza</span>
                <div style={{ width: "42px" }} />
              </div>

              {/* Window Content */}
              <div style={{ padding: isMobile ? "1.5rem 1rem 2rem" : "2rem 1.5rem 2.5rem", position: "relative", zIndex: 1 }}>
                {/* Simple Heading */}
                <div style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "1.5rem", // Reduced from 2.5rem
                }}>
                  <h1 style={{
                    fontSize: isMobile ? "2.2rem" : "2.8rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    color: "#ffffff",
                    textShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    marginBottom: "0.4rem",
                  }}>
                    {activeDock === 0 ? "Explore." : activeDock === 1 ? "Work." : "Life."}
                  </h1>
                  <p style={{
                    fontSize: isMobile ? "0.85rem" : "0.95rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                    margin: 0,
                  }}>
                    {activeDock === 0 ? "Curated sections of my world." : activeDock === 1 ? "Projects, insights, and career." : "Moments, media, and the present."}
                  </p>
                </div>

                {/* Springboard App Grid */}
                <StarlightBentoGrid activeDock={activeDock} setActiveDock={setActiveDock} />
              </div>
            </motion.div>
          </main>
        </ZenHideable>
      </div >
    </>
  );
}
