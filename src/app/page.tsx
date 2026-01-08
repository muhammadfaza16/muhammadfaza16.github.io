import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
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
              Pillow Talk.
            </h1>

            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: "38rem",
              color: "var(--text-secondary)"
            }} className="animate-fade-in animation-delay-200">
              Tempat menyimpan ide-ide yang lewat. Kadang serius, seringnya tidak. Sekadar menulis supaya tidak lupa.
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
            <p style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>Belum ada project yang dipublish.</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>Sedang dikerjakan...</p>
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section style={{ paddingTop: "8rem", paddingBottom: "8rem", backgroundColor: "#0A0A0A", color: "#FAFAF9", position: "relative" }}>
        {/* Inverse Grid */}
        <div className="bg-grid" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.1, filter: "invert(1)" }} />

        <Container>
          <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }} className="animate-fade-in">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "1.5rem", color: "white" }}>
              Tetap terhubung.
            </h2>
            <p style={{ fontSize: "1rem", opacity: 0.7, marginBottom: "2rem", fontWeight: 300, lineHeight: 1.7 }}>
              Saya jarang mengirim email, tapi kalau ada sesuatu yang menarik, mungkin akan saya bagikan di sini.
            </p>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", maxWidth: "24rem", margin: "0 auto", width: "100%" }} className="md:flex-row">
              <input
                type="email"
                placeholder="Your email"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "0.875rem 1.25rem",
                  width: "100%",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  transition: "border-color 0.3s ease, background-color 0.3s ease"
                }}
                className="focus:border-white/50 focus:bg-white/15"
              />
              <button
                className="btn-primary"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "0.875rem 1.5rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.7rem",
                  flexShrink: 0,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
