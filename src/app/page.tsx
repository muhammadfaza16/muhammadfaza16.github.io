import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
import { OnThisDay } from "@/components/OnThisDay";
import { DidYouKnow } from "@/components/DidYouKnow";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { ZenHideable } from "@/components/ZenHideable";
import { ZenCenteredSection } from "@/components/ZenCenteredSection";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
export default function HomePage() {
  const allPosts = getAllPosts(); // Pass all posts to allow "Load More"

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

      {/* Hero Section - Steve Jobs Aesthetic */}
      <ZenHideable hideInZen>
        <section style={{
          paddingTop: "calc(5rem + 2vh)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
          position: "relative",
          // overflow: "hidden" removed to prevent clipping if any content extends
        }}>

          <Container>
            <div className="animate-fade-in-up" style={{ position: "relative", zIndex: 1 }}>
              {/* Subtle Label */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--accent)",
                marginBottom: "2rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 500
              }}>
                Personal Manifesto
              </div>

              {/* Massive Title */}
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                marginBottom: "3rem",
                color: "var(--foreground)",
                maxWidth: "18ch"
              }}>
                The Almanack of Broken Wanderer.
              </h1>

              {/* Minimalist Copy */}
              <p style={{
                fontSize: "1.35rem",
                lineHeight: 1.6,
                fontFamily: "'Source Serif 4', serif",
                maxWidth: "40rem",
                color: "var(--text-secondary)",
                marginBottom: "0"
              }} className="animate-fade-in animation-delay-200">
                Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.
              </p>
            </div>
          </Container>
        </section>
      </ZenHideable>

      {/* Section Divider - Cosmic - Hidden in Zen */}
      <ZenHideable hideInZen>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "clamp(1rem, 2vw, 2rem) 0",
          opacity: 0.4
        }}>
          <div style={{ flex: 1, maxWidth: "100px", height: "1px", background: "linear-gradient(to right, transparent, var(--border))" }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--accent)" }}>
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
          </svg>
          <div style={{ flex: 1, maxWidth: "100px", height: "1px", background: "linear-gradient(to left, transparent, var(--border))" }} />
        </div>
      </ZenHideable>

      {/* Currently Strip - STAYS VISIBLE in Zen Mode, centered when Zen */}
      <ZenCenteredSection>
        <Container>
          <div className="animate-fade-in animation-delay-300">
            <CurrentlyStrip />
          </div>
        </Container>
      </ZenCenteredSection>

      {/* All content below - hidden in Zen Mode */}
      <ZenHideable hideInZen>
        {/* Writing Section - Clean & Editorial */}
        <section style={{
          paddingTop: "clamp(3rem, 6vw, 6rem)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
          borderTop: "1px solid var(--border)"
        }}>
          <Container>
            <div className="animate-fade-in animation-delay-300">
              {/* Minimalist Header - Left Aligned */}
              <div style={{
                marginBottom: "3rem",
                textAlign: "left"
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  display: "block",
                  marginBottom: "1rem"
                }}>
                  Isi Kepala & Hati
                </span>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  color: "var(--foreground)",
                  marginBottom: "1rem",
                  lineHeight: 1.1
                }}>
                  Recent Yaps
                </h2>
                <p style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.1rem",
                  color: "var(--text-secondary)",
                  maxWidth: "45ch",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Kumpulan celoteh, kode yang mungkin error, dan hal-hal yang sayang kalau cuma disimpen sendiri.
                </p>
              </div>

              {/* Posts List */}
              <PostList allPosts={allPosts} hideThumbnails initialCount={3} />

              {/* Footer Link - Left Aligned */}
              <div style={{ marginTop: "3rem" }}>
                <Link href="/blog" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "color 0.3s ease"
                }} className="hover:text-[var(--accent)] group">
                  <span>View Archive</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section >

        {/* Section Divider - Constellation */}
        < div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "clamp(1.5rem, 3vw, 3rem) 0",
          opacity: 0.4
        }}>
          <div style={{ flex: 1, maxWidth: "120px", height: "1px", background: "linear-gradient(to right, transparent, var(--border))" }} />
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" style={{ color: "var(--foreground)" }}>
            <circle cx="5" cy="10" r="1.5" fill="currentColor" />
            <circle cx="20" cy="5" r="2" fill="var(--accent)" />
            <circle cx="35" cy="12" r="1.5" fill="currentColor" />
            <path d="M5 10 L20 5 L35 12" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          </svg>
          <div style={{ flex: 1, maxWidth: "120px", height: "1px", background: "linear-gradient(to left, transparent, var(--border))" }} />
        </div >

        {/* Daily Fuel - Intellectual Nourishment */}
        < section style={{
          paddingTop: "clamp(3rem, 6vw, 6rem)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
          backgroundColor: "var(--card-bg)",
          borderTop: "1px solid var(--border)",
          position: "relative"
        }}>
          <Container>
            {/* Section Header - Purpose-driven */}
            <div style={{
              marginBottom: "clamp(2rem, 4vw, 4rem)",
              textAlign: "center"
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                display: "block",
                marginBottom: "1rem"
              }}>Daily Spark</span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "var(--foreground)",
                marginBottom: "1rem"
              }}>
                Perspective & Curiosity
              </h2>
              <p style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "45ch",
                margin: "0 auto"
              }}>
                Koleksi fakta random biar kamu makin pinter, atau seenggaknya kita punya bahan obrolan seru.
              </p>
            </div>

            {/* Two-Column: Did You Know (Sidebar) | On This Day (Main) */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Did You Know - Sidebar */}
              <div className="lg:w-[350px] lg:flex-shrink-0">
                <DidYouKnow />
              </div>
              {/* On This Day - Main */}
              <div className="flex-1">
                <OnThisDay />
              </div>
            </div>

            {/* Wanderer's Manifesto - Full Width Impact */}
            <div style={{
              marginTop: "clamp(3rem, 6vw, 6rem)",
              marginBottom: "clamp(-4rem, -8vw, -8rem)",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
              width: "100vw",
              background: "var(--card-bg)",
              color: "var(--foreground)",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              padding: "clamp(3rem, 6vw, 6rem) 1.5rem",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Starfield Pattern */}
              <div style={{
                position: "absolute",
                inset: 0,
                opacity: 0.15,
                backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                pointerEvents: "none"
              }} />

              {/* Orbit Rings */}
              <div style={{
                position: "absolute",
                top: "50%",
                right: "5%",
                transform: "translateY(-50%)",
                width: "clamp(200px, 40vw, 400px)",
                height: "clamp(200px, 40vw, 400px)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                opacity: 0.3,
                pointerEvents: "none"
              }}>
                <div style={{
                  position: "absolute",
                  top: "15%",
                  left: "15%",
                  right: "15%",
                  bottom: "15%",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  opacity: 0.6
                }} />
                <div style={{
                  position: "absolute",
                  top: "35%",
                  left: "35%",
                  right: "35%",
                  bottom: "35%",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  opacity: 0.8
                }} />
                {/* Planet dot */}
                <div style={{
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  background: "var(--accent)",
                  borderRadius: "50%",
                  transform: "translateX(-50%)"
                }} />
              </div>

              <Link href="/time" className="group block" style={{
                textDecoration: "none",
                color: "inherit",
                maxWidth: "900px",
                margin: "0 auto",
                position: "relative",
                zIndex: 1
              }}>
                {/* Quote Mark */}
                <span style={{
                  display: "block",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(4rem, 12vw, 10rem)",
                  lineHeight: 0.5,
                  opacity: 0.15,
                  marginBottom: "1.5rem",
                  userSelect: "none",
                  transition: "opacity 0.4s ease"
                }} className="group-hover:opacity-25">
                  "
                </span>

                {/* The Quote */}
                <blockquote style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: "2rem",
                  maxWidth: "18ch"
                }}>
                  Not all those who wander are lost.
                </blockquote>

                {/* Attribution + Context */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <span style={{
                      width: "40px",
                      height: "1px",
                      background: "currentColor",
                      opacity: 0.3
                    }} />
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      opacity: 0.7
                    }}>
                      J.R.R. Tolkien
                    </span>
                  </div>

                  {/* Subtext */}
                  <p style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    opacity: 0.6,
                    maxWidth: "45ch"
                  }}>
                    Sebuah pengingat bahwa perjalanan tanpa tujuan pasti bukan berarti tersesat.
                    Kadang, kita butuh berjalan tanpa peta untuk menemukan jalan pulang.
                  </p>
                </div>

                {/* CTA */}
                <div style={{
                  marginTop: "3rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  opacity: 0.5,
                  transition: "all 0.3s ease"
                }} className="group-hover:opacity-100">
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "currentColor",
                    animation: "pulse 2s ease-in-out infinite"
                  }} />
                  <span>Explore the passage of time</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </div>
          </Container>
        </section >
      </ZenHideable>
    </>
  );
}
