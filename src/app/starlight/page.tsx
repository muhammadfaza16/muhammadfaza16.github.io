"use client";

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
