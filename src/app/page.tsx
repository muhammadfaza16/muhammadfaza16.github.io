import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
import { RandomQuote } from "@/components/RandomQuote";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function HomePage() {
  const allPosts = getAllPosts();

  return (
    <>
      {/* Hero Section */}
      <section style={{ position: "relative", paddingTop: "6rem", paddingBottom: "4rem", overflow: "hidden" }}>
        {/* Background Grid */}
        <div className="bg-grid" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1 }} />

        <Container>
          <div style={{ maxWidth: "56rem" }} className="animate-fade-in-up">
            <h1 style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(3rem, 9vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              marginBottom: "2rem",
              color: "var(--foreground)"
            }}>
              The Almanac of Broken Wanderer.
            </h1>

            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: "38rem",
              color: "var(--text-secondary)"
            }} className="animate-fade-in animation-delay-200">
              Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.
            </p>
          </div>
        </Container>
      </section>

      {/* Divider */}
      <Container>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </Container>


      {/* Writing Section */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <Container>
          <div className="animate-fade-in animation-delay-300">
            {/* Section Header */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "2.25rem",
                fontWeight: 600
              }}>
                Writing
              </h2>
            </div>

            {/* Posts List */}
            <PostList allPosts={allPosts} />
          </div>
        </Container>
      </section>

      {/* Divider */}
      <Container>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </Container>

      {/* Wisdom Gacha */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "var(--background)", color: "var(--foreground)", position: "relative" }}>
        {/* Grid Background */}
        <div className="bg-grid" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.03 }} />

        <Container>
          <RandomQuote />
        </Container>
      </section>
    </>
  );
}
