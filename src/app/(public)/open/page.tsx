import { Container } from "@/components/Container";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function OpenGardenPage() {
    const allPosts = getAllPosts();

    return (
        <div className="min-h-screen pt-24 pb-20">
            <Container>
                <ScrollReveal>
                    <header className="mb-16 text-center">
                        <span className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-4 block">
                            The Open Garden
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl mb-6">
                            Constellation of Works
                        </h1>
                        <p className="font-serif text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Jejak digital, karya nyata, dan celoteh yang tersisa.
                        </p>
                    </header>

                    {/* Writing Section - Clean & Editorial - Migrated from Home */}
                    <section className="border-t border-[var(--border)] pt-16">
                        <div className="animate-fade-in animation-delay-300">
                            {/* Minimalist Header - Left Aligned */}
                            <div style={{
                                marginBottom: "1.5rem",
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
                            <PostList allPosts={allPosts} hideThumbnails initialCount={5} />

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
                                    <span>View All Archives</span>
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </div>
                        </div>
                    </section >
                </ScrollReveal>
            </Container>
        </div>
    );
}
