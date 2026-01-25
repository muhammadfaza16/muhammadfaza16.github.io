"use client";

import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { ZenHideable } from "@/components/ZenHideable";
import { StarlightJarvisHero } from "@/components/sanctuary/StarlightJarvisHero";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function StarlightPage() {

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
      `}} />

      {/* Exit Door (Back to Home) */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 100, // Above everything
          color: "rgba(255, 255, 255, 0.6)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          padding: "8px 12px",
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.2s ease"
        }}
        className="hover:scale-105 hover:bg-white/10"
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 500, fontFamily: "-apple-system" }}>Exit</span>
        <LogOut size={16} />
      </Link>

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
          minHeight: "100vh",
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
