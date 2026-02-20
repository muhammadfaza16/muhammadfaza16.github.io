"use client";

import { ZenHideable } from "@/components/ZenHideable";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
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

      {/* Sage Background (Reference Match) */}
      <AtmosphericBackground variant="sage">
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
              backgroundColor: "rgba(255, 255, 255, 0.04)", // Ultra-thin light glass
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
              borderRadius: "50%",
              color: "var(--ink-primary)", // Adapt to light/dark themes cleanly
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 24px -4px rgba(0,0,0,0.1), inset 0 1px 0.5px rgba(255,255,255,0.4)", // Specular highlight
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
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "1rem"
          }}>
            {/* Simple Heading */}
            <section style={{
              padding: "5rem 1.5rem 1rem",
              width: "100%",
              maxWidth: "480px",
              margin: "0 auto",
            }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 style={{
                  fontSize: "clamp(2.2rem, 7vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  color: "var(--ink-primary)",
                  marginBottom: "0.5rem",
                }}>
                  Explore.
                </h1>
                <p style={{
                  fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                  color: "var(--ink-secondary)",
                  lineHeight: 1.5,
                  fontWeight: 500,
                  margin: 0,
                }}>
                  Curated sections of my world.
                </p>
              </motion.div>
            </section>

            {/* Springboard App Grid */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <StarlightBentoGrid />
            </div>
          </main>
        </ZenHideable>
      </AtmosphericBackground>
    </>
  );
}
