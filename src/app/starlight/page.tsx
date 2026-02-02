"use client";

import dynamic from "next/dynamic";
import { ZenHideable } from "@/components/ZenHideable";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });
import { StarlightJarvisHero } from "@/components/sanctuary/StarlightJarvisHero";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";
import Link from "next/link";
import { LogOut, ChevronLeft } from "lucide-react";
import { useEffect } from "react";

export default function StarlightPage() {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      // Reset scroll to top on mount
      mainContent.scrollTop = 0;

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Unlock body scroll on unmount
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
        /* Height locked, but overflow managed by JS to allow scroll reset */
        html, body { overscroll-behavior: none; }
        #main-content::-webkit-scrollbar { display: none; }
      `}} />



      {/* Ambient Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "120vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}>
        <MilkyWay />
        <GradientOrb />
        <CosmicStars />
      </div>

      {/* Manual Back Button for Starlight */}
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
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(4px)",
            borderRadius: "50%",
            color: "white",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "none",
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
          paddingTop: "2rem", // Standard padding
          height: "100svh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // align to top like a phone
          gap: "1rem"
        }}>
          {/* iOS Widgets Area */}
          <div style={{ padding: "1rem 0 0" }}>
            <StarlightJarvisHero />
          </div>

          {/* Springboard App Grid & Dock */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <StarlightBentoGrid />
          </div>
        </main>
      </ZenHideable>
    </>
  );
}
