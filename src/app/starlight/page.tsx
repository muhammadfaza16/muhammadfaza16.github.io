"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { ZenHideable } from "@/components/ZenHideable";
import { StarlightJarvisHero } from "@/components/sanctuary/StarlightJarvisHero";
import { StarlightBentoGrid } from "@/components/sanctuary/StarlightBentoGrid";

export default function StarlightPage() {

  return (
    <>
      {/* Ambient Background */}
      <div style={{
        position: "absolute",
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
        {/* Dynamic Jarvis Hero */}
        <ScrollReveal>
          <StarlightJarvisHero />
        </ScrollReveal>

        {/* Dynamic Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "2rem 0",
          opacity: 0.2
        }}>
          <div style={{ flex: 1, maxWidth: "150px", height: "1px", background: "linear-gradient(to right, transparent, var(--border))" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <div style={{ flex: 1, maxWidth: "150px", height: "1px", background: "linear-gradient(to left, transparent, var(--border))" }} />
        </div>

        {/* Archive Bento Hub */}
        <ScrollReveal delay={0.2}>
          <StarlightBentoGrid />
        </ScrollReveal>
      </ZenHideable>

      {/* Spacer for bottom */}
      <div style={{ height: "10vh" }} />
    </>
  );
}
