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
        paddingBottom: "6rem",
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

      {/* On This Day & Did You Know - Nerd Culture & History */}
      <section style={{
        paddingTop: "6rem",
        paddingBottom: "8rem",
        backgroundColor: "var(--card-bg)",
        borderTop: "1px solid var(--border)",
        position: "relative"
      }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
            <OnThisDay />
            <DidYouKnow />
          </div>

          {/* Identity Quote - Footer Style */}
          <div style={{ marginTop: "6rem", textAlign: "center" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontStyle: "italic",
              color: "var(--foreground)",
              marginBottom: "1rem"
            }}>
              "Not all those who wander are lost."
            </p>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}>
              J.R.R. Tolkien
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
