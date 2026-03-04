"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ZenHideable } from "@/components/ZenHideable";
import { CleanHomeHero } from "@/components/lobby/CleanHomeHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";

import "./home-journal.css";

const CORRECT_PIN = "231298";
const PIN_LENGTH = 6;

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check sessionStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && sessionStorage.getItem("home_unlocked") === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleDigitChange = useCallback((index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    // Auto-focus next box
    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const fullPin = newPin.join("");
    if (fullPin.length === PIN_LENGTH) {
      if (fullPin === CORRECT_PIN) {
        sessionStorage.setItem("home_unlocked", "true");
        setTimeout(() => setIsUnlocked(true), 200);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin(Array(PIN_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  }, [pin]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [pin]);

  // Scroll Lock — but allow scrolling inside [data-scrollable] elements
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
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
            paddingTop: "clamp(1.5rem, 6vh, 4rem)",
          }}>
            <CleanHomeHero />
          </div>


          {/* ── Dock — Icon-only (Premium Frosted Glass) ── */}
          <div style={{
            flexShrink: 0,
            width: "calc(100% - 3rem)",
            maxWidth: "460px",
            margin: "0 auto 1rem",
            background: "rgba(255, 255, 255, 0.002)",
            backdropFilter: "blur(18px) saturate(110%) brightness(101%)",
            WebkitBackdropFilter: "blur(18px) saturate(110%) brightness(101%)",
            borderRadius: "32px",
            padding: "4px 10px",
            border: "1px solid rgba(255,255,255,0.02)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.06), inset 0 1px 0.5px rgba(255,255,255,0.03)",
            position: "relative" as const,
            overflow: "hidden",
          }}>
            {/* Specular highlight */}
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.08) 70%, transparent)",
              pointerEvents: "none" as const, zIndex: 4, filter: "blur(0.5px)",
            }} />
            {/* Glossy sheen */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)",
              borderRadius: "32px 32px 0 0", pointerEvents: "none" as const, zIndex: 2,
            }} />
            {/* Gradient border */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "32px", padding: "1px",
              background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, transparent 60%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor" as any, maskComposite: "exclude" as any,
              pointerEvents: "none" as const, zIndex: 3,
            }} />

            <div className="safe-area-bottom" style={{ position: "relative", zIndex: 1 }}>
              <AnimatePresence mode="wait">
                {mounted && !isUnlocked ? (
                  /* ── LOCKED STATE: Curation + PIN ── */
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "1rem 0 0.6rem",
                      gap: "1rem",
                    }}
                  >
                    {/* Curation icon — always accessible */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                      <Link href="/curation" prefetch={true} style={{ textDecoration: "none" }}>
                        <motion.div
                          whileTap={{ scale: 0.92 }}
                          style={{
                            width: "clamp(46px, 12vw, 56px)",
                            height: "clamp(46px, 12vw, 56px)",
                            borderRadius: "26%",
                            background: "rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(16px) saturate(150%)",
                            WebkitBackdropFilter: "blur(16px) saturate(150%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0.5px rgba(255,255,255,0.2)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <BookOpen size={22} strokeWidth={2.5} style={{ color: "#BF5AF2", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))", zIndex: 2 }} />
                          {/* Specular */}
                          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)", pointerEvents: "none", zIndex: 4 }} />
                          {/* Glossy */}
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none", borderRadius: "26% 26% 0 0" }} />
                        </motion.div>
                      </Link>

                      {/* PIN Input */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", opacity: 0.4 }}>
                          <Lock size={11} style={{ color: "rgba(255,255,255,0.9)" }} />
                          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>Enter Passcode</span>
                        </div>
                        <motion.div
                          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          style={{ display: "flex", gap: "6px" }}
                        >
                          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                            <input
                              key={i}
                              ref={(el) => { inputRefs.current[i] = el; }}
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={pin[i]}
                              onChange={(e) => handleDigitChange(i, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              autoFocus={i === 0}
                              style={{
                                width: "36px",
                                height: "40px",
                                borderRadius: "10px",
                                border: pin[i] ? "1.5px solid rgba(191,90,242,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
                                background: pin[i] ? "rgba(191,90,242,0.08)" : "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.95)",
                                fontSize: "18px",
                                fontWeight: 700,
                                textAlign: "center" as const,
                                outline: "none",
                                caretColor: "transparent",
                                transition: "all 0.15s ease",
                                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ) : mounted ? (
                  /* ── UNLOCKED STATE: Full dock ── */
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <RoomBentoGrid />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </ZenHideable >
    </>
  );
}
