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
            width: "auto",
            margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(50px) saturate(160%) brightness(105%)",
            WebkitBackdropFilter: "blur(50px) saturate(160%) brightness(105%)",
            borderRadius: "36px",
            padding: "8px 16px",
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.12) inset,
              0 -1px 0 rgba(0,0,0,0.03) inset,
              0 16px 44px -10px rgba(0,0,0,0.12),
              0 3px 14px rgba(0,0,0,0.04)
            `,
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
              borderRadius: "36px 36px 0 0", pointerEvents: "none" as const, zIndex: 2,
            }} />
            {/* Gradient border */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "36px", padding: "1px",
              background: "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)",
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
