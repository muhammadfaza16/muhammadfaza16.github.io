"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ZenHideable } from "@/components/ZenHideable";
import { CleanHomeHero } from "@/components/lobby/CleanHomeHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

import "./home-journal.css";

const CORRECT_PIN = "231298";
const PIN_LENGTH = 6;

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isUnlocked = useCallback(() => {
    return typeof window !== "undefined" && sessionStorage.getItem("home_unlocked") === "true";
  }, []);

  // Called by RoomBentoGrid when a guarded icon is clicked
  const handleGuardedClick = useCallback((href: string) => {
    if (isUnlocked()) {
      window.location.href = href;
      return;
    }
    setPendingHref(href);
    setPin(Array(PIN_LENGTH).fill(""));
    setShowPinModal(true);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isUnlocked]);

  const handleDigitChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullPin = newPin.join("");
    if (fullPin.length === PIN_LENGTH) {
      if (fullPin === CORRECT_PIN) {
        sessionStorage.setItem("home_unlocked", "true");
        setShowPinModal(false);
        if (pendingHref) window.location.href = pendingHref;
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin(Array(PIN_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  }, [pin, pendingHref]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [pin]);

  // Scroll Lock
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
      return () => { document.body.style.overflow = ""; };
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

          {/* Hero */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "clamp(1.5rem, 6vh, 4rem)",
          }}>
            <CleanHomeHero />
          </div>

          {/* Dock */}
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
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.08) 70%, transparent)", pointerEvents: "none" as const, zIndex: 4, filter: "blur(0.5px)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)", borderRadius: "32px 32px 0 0", pointerEvents: "none" as const, zIndex: 2 }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "32px", padding: "1px", background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, transparent 60%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor" as any, maskComposite: "exclude" as any, pointerEvents: "none" as const, zIndex: 3 }} />

            <div className="safe-area-bottom" style={{ position: "relative", zIndex: 1 }}>
              <RoomBentoGrid onGuardedClick={handleGuardedClick} />
            </div>
          </div>
        </main>
      </ZenHideable>

      {/* PIN Modal Overlay */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowPinModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(30,30,30,0.95)",
                borderRadius: "24px",
                padding: "2rem 2rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
                minWidth: "300px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Lock size={22} style={{ color: "rgba(255,255,255,0.5)" }} />
                </div>
                <span style={{
                  fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
                }}>
                  Enter Passcode
                </span>
              </div>

              <motion.div
                animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", gap: "8px" }}
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
                    style={{
                      width: "42px",
                      height: "48px",
                      borderRadius: "12px",
                      border: pin[i] ? "2px solid rgba(191,90,242,0.7)" : "2px solid rgba(255,255,255,0.12)",
                      background: pin[i] ? "rgba(191,90,242,0.1)" : "rgba(255,255,255,0.04)",
                      color: "white",
                      fontSize: "20px",
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

              <button
                onClick={() => setShowPinModal(false)}
                style={{
                  marginTop: "0.25rem",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.35)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
