"use client";

import { useEffect, useRef } from "react";
import { ZenHideable } from "@/components/ZenHideable";
import { CleanHomeHero } from "@/components/lobby/CleanHomeHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";

import "./home-journal.css";

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  // Scroll Lock — but allow scrolling inside [data-scrollable] elements
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      // Allow scroll inside elements marked as scrollable
      let target = e.target as HTMLElement | null;
      while (target) {
        if (target.getAttribute?.('data-scrollable') === 'true') return;
        target = target.parentElement;
      }
      e.preventDefault();
    };

    const preventWheel = (e: WheelEvent) => {
      let target = e.target as HTMLElement | null;
      while (target) {
        if (target.getAttribute?.('data-scrollable') === 'true') return;
        target = target.parentElement;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventWheel);
    };
  }, []);

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
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        }
      `}} />

      <ZenHideable hideInZen>
        <main
          ref={mainRef}
          className="bg-journal-paper"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100svh",
            overflow: "hidden",
            overflowX: "hidden",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
          }}>

          {/* Hero area — positioned upper-third like iOS homescreen */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "clamp(2.5rem, 8vh, 5rem)",
          }}>
            <CleanHomeHero />
          </div>


          {/* ── Dock — Icon-only (Premium Frosted Glass) ── */}
          <div style={{
            flexShrink: 0,
            width: "calc(100% - 3rem)", // Matches the widget padding (1.5rem * 2)
            maxWidth: "460px", // Match the widget max-width
            margin: "0 auto 1.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(6px) saturate(210%) brightness(105%)",
            WebkitBackdropFilter: "blur(6px) saturate(210%) brightness(105%)",
            borderRadius: "32px",
            padding: "4px 12px", // Slimmer vertical padding, wider horizontal inner space
            border: "0.5px solid rgba(255,255,255,0.15)",
            position: "relative" as const,
            overflow: "hidden",
          }}>
            {/* Specular highlight */}
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.45) 70%, transparent)",
              pointerEvents: "none" as const, zIndex: 4, filter: "blur(0.5px)",
            }} />
            {/* Glossy sheen */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)",
              borderRadius: "32px 32px 0 0", pointerEvents: "none" as const, zIndex: 2,
            }} />
            {/* Gradient border — Ultra-Thin Crystal Rim */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "32px", padding: "0.2px",
              background: "linear-gradient(160deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.12) 100%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor" as any, maskComposite: "exclude" as any,
              pointerEvents: "none" as const, zIndex: 3,
            }} />

            <div className="safe-area-bottom" style={{ position: "relative", zIndex: 1 }}>
              <RoomBentoGrid />
            </div>
          </div>
        </main>
      </ZenHideable>
    </>
  );
}
