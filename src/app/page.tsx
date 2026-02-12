"use client";

import { useEffect, useRef } from "react";
import { ZenHideable } from "@/components/ZenHideable";
import { JournalHero } from "@/components/lobby/JournalHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";
import { MiniPlayerWidget } from "@/components/MiniPlayerWidget";
import "./home-journal.css";

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  // Scroll Lock
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', (e) => e.preventDefault());
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
          }}>

          {/* Full-page journal content — fills entire screen */}
          <JournalHero />

          {/* ── Bottom widget area — frosted paper card ── */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.04)",
            paddingTop: "12px",
          }}>
            {/* Mini Player */}
            <div style={{ paddingBottom: "4px" }}>
              <MiniPlayerWidget style={{ marginBottom: "0" }} />
            </div>

            {/* Navigation Grid */}
            <div className="safe-area-bottom">
              <RoomBentoGrid />
            </div>
          </div>
        </main>
      </ZenHideable>
    </>
  );
}
