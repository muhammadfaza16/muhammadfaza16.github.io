"use client";

import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { ZenHideable } from "@/components/ZenHideable";
import { JarvisHero } from "@/components/lobby/JarvisHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";
import { IosStatusBar } from "@/components/sanctuary/IosStatusBar";

export default function HomePage() {

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
      `}} />

      {/* iOS Status Bar */}
      <IosStatusBar />

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

      <ZenHideable hideInZen>
        <main style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "44px", // Status bar height
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "1rem"
        }}>
          {/* iOS Widgets Area (Hero) */}
          <div style={{ padding: "1rem 0 0" }}>
            <JarvisHero />
          </div>

          {/* Springboard App Grid & Dock */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <RoomBentoGrid />
          </div>
        </main>
      </ZenHideable>
    </>
  );
}
