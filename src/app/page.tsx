"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ZenHideable } from "@/components/ZenHideable";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });
import { JarvisHero } from "@/components/lobby/JarvisHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";
import { MiniPlayerWidget } from "@/components/MiniPlayerWidget";

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  // JS-based Scroll Lock (The "Nuclear" Option)
  // JS-based Scroll Lock (The "Nuclear" Option) - GLOBAL
  useEffect(() => {
    // Prevent touchmove (scrolling) entirely
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    // { passive: false } is required to allow preventDefault
    // Target document to catch touches on empty space/body
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Also lock wheel for desktop
    document.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', (e) => e.preventDefault());
    };
  }, []);

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
        <main
          ref={mainRef}
          style={{
            position: "relative", // Revert to relative (Fixes ZenHideable transform conflict)
            zIndex: 1,
            paddingTop: "2rem", // Match Starlight
            width: "100%", // Revert width
            height: "100svh", // RESTORED
            overflow: "hidden", // STATIC
            overflowX: "hidden",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "0"
          }}>
          {/* iOS Widgets Area (Hero) */}
          <div style={{ padding: "2rem 0 0" }}>
            <JarvisHero />
          </div>

          {/* Mini Player */}
          <MiniPlayerWidget style={{ marginBottom: "1.5rem" }} />

          {/* Springboard App Grid & Dock */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <RoomBentoGrid />
          </div>
        </main>
      </ZenHideable>
    </>
  );
}
