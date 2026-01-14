import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
import { OnThisDay } from "@/components/OnThisDay";
import { DidYouKnow } from "@/components/DidYouKnow";
import { GradientOrb } from "@/components/GradientOrb";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
export default function HomePage() {
  const allPosts = getAllPosts(); // Pass all posts to allow "Load More"

  return (
    <>
      {/* Hero Section - Steve Jobs Aesthetic */}
      <section style={{
        paddingTop: "calc(5rem + 4vh)", // Account for fixed header (5rem) + extra spacing
        paddingBottom: "8rem", // Increased breathing room
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Gradient Orb - Visual Texture */}
        <GradientOrb />

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

      {/* Currently Strip - Living Status */}
      <section style={{ marginBottom: "4rem" }}>
        <Container>
          <div className="animate-fade-in animation-delay-300">
            <CurrentlyStrip />
          </div>
        </Container>
      </section>

      {/* Mini About - Personal Touch */}
      <section style={{ paddingBottom: "4rem" }}>
        <Container>
          <div className="animate-fade-in animation-delay-400" style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "50ch"
          }}>
            <p style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)"
            }}>
              Hi, I'm <Link href="/about" style={{
                color: "var(--foreground)",
                fontWeight: 500,
                borderBottom: "1px solid var(--border)"
              }} className="hover:border-[var(--foreground)] transition-colors">Faza</Link> — a wanderer navigating the intersection of technology, philosophy, and human experience.
            </p>
          </div>
        </Container>
      </section>

      {/* Writing Section - Clean & Editorial */}
      <section style={{ paddingBottom: "8rem" }}>
        <Container>
          <div className="animate-fade-in animation-delay-300">
            {/* Minimalist Header */}
            <div style={{
              marginBottom: "3rem",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1.5rem"
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.5rem",
                fontWeight: 400,
                color: "var(--foreground)"
              }}>
                Recent Notes
              </h2>
              <Link href="/blog" style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-secondary)"
              }} className="hover:text-[var(--foreground)] transition-colors">
                View Archive →
              </Link>
            </div>

            {/* Posts List */}
            <PostList allPosts={allPosts} hideThumbnails initialCount={3} />
          </div>
        </Container>
      </section>

      {/* Daily Fuel - Intellectual Nourishment */}
      <section style={{
        paddingTop: "6rem",
        paddingBottom: "8rem",
        backgroundColor: "var(--card-bg)",
        borderTop: "1px solid var(--border)",
        position: "relative"
      }}>
        <Container>
          {/* Section Header - Purpose-driven */}
          <div style={{
            marginBottom: "4rem",
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
            }}>Daily Fuel</span>
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
              One moment from history, one fact for the mind. The wanderer's daily dose.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 items-start">
            <OnThisDay />
            <DidYouKnow />
          </div>

          {/* Identity Quote - Footer Style */}
          <Link href="/time" className="group block" style={{ marginTop: "8rem", textAlign: "center", textDecoration: "none" }}>
            {/* Decorative Quotation Mark */}
            <span style={{
              display: "block",
              fontFamily: "'Playfair Display', serif",
              fontSize: "5rem",
              lineHeight: 0.5,
              color: "var(--foreground)",
              opacity: 0.08,
              marginBottom: "1rem",
              userSelect: "none",
              transition: "opacity 0.3s ease"
            }} className="group-hover:opacity-[0.15]">"</span>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontStyle: "italic",
              color: "var(--foreground)",
              marginBottom: "1.5rem",
              maxWidth: "32ch",
              margin: "0 auto 1.5rem auto"
            }}>
              Not all those who wander are lost.
            </p>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1rem"
            }}>
              — J.R.R. Tolkien
            </p>
            {/* Subtle CTA */}
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0,
              transform: "translateY(5px)",
              transition: "all 0.3s ease",
              display: "inline-block"
            }} className="group-hover:opacity-100 group-hover:translate-y-0">
              Explore time →
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
