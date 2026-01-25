import { ScrollReveal } from "@/components/ScrollReveal";
import { Container } from "@/components/Container";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { ZenHideable } from "@/components/ZenHideable";
import { JarvisHero } from "@/components/lobby/JarvisHero";
import { RoomBentoGrid } from "@/components/lobby/RoomBentoGrid";

export default function HomePage() {

  return (
    <>
      {/* Hero Section - Steve Jobs Aesthetic */}
      {/* Ambient Background - Spans behind Header */}
      <div style={{
        position: "absolute",
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
        <ScrollReveal>
          <JarvisHero />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <RoomBentoGrid />
        </ScrollReveal>
      </ZenHideable>
    </>
  );
}
