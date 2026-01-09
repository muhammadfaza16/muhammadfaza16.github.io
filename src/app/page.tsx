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
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 9vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              marginBottom: "2rem",
              color: "var(--foreground)"
            }}>
              Yapping 101.
            </h1>

            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: "38rem",
              color: "var(--text-secondary)"
            }} className="animate-fade-in animation-delay-200">
              Tempat nge-dump random thoughts. Kadang nyambung, seringnya nggak. Yang penting keluar aja dulu.
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
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.25rem",
                fontWeight: 600
              }}>
                Journal
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

      {/* Works Section */}
      <section id="works" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <Container>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.25rem",
            fontWeight: 600,
            marginBottom: "3rem"
          }}>
            Project
          </h2>
          <div style={{
            padding: "4rem 2rem",
            border: "1px dashed var(--border)",
            borderRadius: "12px",
            textAlign: "center",
            color: "var(--text-secondary)",
            backgroundColor: "rgba(0,0,0,0.02)"
          }}>
            <p style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>🚧</p>
            <p style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>Masih kosong, belum ada yang bisa di-pamer-in.</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>Lagi ngulik sesuatu... stay tuned! ✨</p>
          </div>
        </Container>
      </section>

      {/* Wisdom Gacha */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "#0A0A0A", color: "#FAFAF9", position: "relative" }}>
        {/* Inverse Grid */}
        <div className="bg-grid" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.1, filter: "invert(1)" }} />

        <Container>
          <RandomQuote />
        </Container>
      </section>
    </>
  );
}
