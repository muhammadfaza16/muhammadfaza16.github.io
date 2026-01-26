"use client";

import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { ZenHideable } from "@/components/ZenHideable";
import { StarlightJarvisHero } from "@/components/sanctuary/StarlightJarvisHero";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";
import Link from "next/link";
import { LogOut } from "lucide-react";
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
        position: "fixed", // Fixed background for that wallpaper feel
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
