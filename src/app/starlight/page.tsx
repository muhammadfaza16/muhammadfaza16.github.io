"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function StarlightPage() {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTop = 0;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
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
        backgroundImage: "url('/wallpapers/wp_1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -2,
      }} />
      {/* Dark overlay for readability against the wallpaper - Stronger gradient */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 100%)",
        zIndex: -1,
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
            height: "100svh",
            overflow: "hidden", // Prevent full page scrolling
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
              style={{
                width: "100%",
                maxWidth: "520px",
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.05)", // Ultra-thin frosted glass structure
                backdropFilter: "blur(48px) saturate(160%) brightness(115%)", // Max blur to obliterate busy BG details
                WebkitBackdropFilter: "blur(48px) saturate(160%) brightness(115%)",
                borderRadius: "32px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: `
                  0 32px 64px -16px rgba(0,0,0,0.3),
                  inset 0 1px 1px rgba(255,255,255,0.5)
                `,
                overflow: "hidden", // Keep children inside rounded corners
                position: "relative"
              }}
            >
              {/* Window Header (VisionOS / macOS style) */}
              <div style={{
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.25rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.02)",
              }}>
                {/* Traffic Lights Controls */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--ink-secondary)", opacity: 0.4 }} />
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--ink-secondary)", opacity: 0.4 }} />
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--ink-secondary)", opacity: 0.4 }} />
                </div>

                {/* Window Title */}
                <span style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  opacity: 0.9,
                  letterSpacing: "0.02em"
                }}>
                  Sanctuary OS
                </span>

                {/* Empty right spacer for flex balance */}
                <div style={{ width: "52px" }} />
              </div>

              {/* Window Content */}
              <div style={{ padding: "2rem 1.5rem 3rem" }}>
                {/* Simple Heading */}
                <div style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "2.5rem",
                }}>
                  <h1 style={{
                    fontSize: "clamp(2rem, 6vw, 2.5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    color: "#ffffff", // Pure white for perfect contrast
                    textShadow: "0 2px 12px rgba(0,0,0,0.15)", // Soft shadow to detach from glass
                    marginBottom: "0.4rem",
                  }}>
                    Explore.
                  </h1>
                  <p style={{
                    fontSize: "0.95rem",
                    color: "rgba(255, 255, 255, 0.8)", // Bright translucent white
                    lineHeight: 1.5,
                    fontWeight: 500,
                    margin: 0,
                  }}>
                    Curated sections of my world.
                  </p>
                </div>

                {/* Springboard App Grid */}
                <StarlightBentoGrid />
              </div>
            </motion.div>
          </main>
        </ZenHideable>
      </div>
    </>
  );
}
