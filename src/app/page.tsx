import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
import { RandomQuote } from "@/components/RandomQuote";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function HomePage() {
  const allPosts = getAllPosts();

  return (
    <>
      {/* Hero Section - Steve Jobs Aesthetic */}
      <section style={{
        paddingTop: "12vh",
        paddingBottom: "8rem",
      }}>
        <Container>
          <div className="animate-fade-in-up">
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
              fontWeight: 400, // Thin luxe feel
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              marginBottom: "3rem",
              color: "var(--foreground)",
              maxWidth: "18ch"
            }}>
              The Almanac of Broken Wanderer.
            </h1>

            {/* Minimalist Copy */}
            <p style={{
              fontSize: "1.35rem",
              lineHeight: 1.6,
              fontFamily: "'Source Serif 4', serif",
              maxWidth: "40rem",
              color: "var(--text-secondary)",
              marginBottom: "4rem"
            }} className="animate-fade-in animation-delay-200">
              Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.
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
              marginBottom: "4rem",
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
            <PostList allPosts={allPosts} />
          </div>
        </Container>
      </section>

      {/* Wisdom Gacha - The "One More Thing" */}
      <section style={{
        paddingTop: "6rem",
        paddingBottom: "8rem",
        backgroundColor: "var(--card-bg)",
        borderTop: "1px solid var(--border)",
        position: "relative"
      }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3rem",
              fontWeight: 400,
              marginBottom: "1rem"
            }}>
              Wisdom Gacha
            </h2>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              opacity: 0.7
            }}>
              Spin for a new perspective.
            </p>
          </div>

          <RandomQuote />
        </Container>
      </section>
    </>
  );
}
