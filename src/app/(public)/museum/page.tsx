import { Container } from "@/components/Container";
import { DeepThoughtLibrary } from "@/components/DeepThoughtLibrary";
import { OnThisDay } from "@/components/OnThisDay";
import { DidYouKnow } from "@/components/DidYouKnow";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function MuseumPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-[var(--background)]">
            <Container>
                <ScrollReveal>
                    <header className="mb-20 text-center">
                        <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-4 block">
                            The Archive of Existence
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl mb-6">
                            The Museum
                        </h1>
                        <p className="font-serif text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Koleksi fakta semesta, sejarah manusia, dan pemikiran filosofis.
                        </p>
                    </header>

                    {/* Deep Thought Library - Cosmic Knowledge */}
                    <div className="mb-20">
                        <DeepThoughtLibrary />
                    </div>

                    {/* Daily Fuel - Intellectual Nourishment */}
                    <section className="bg-[var(--card-bg)] rounded-3xl p-8 md:p-12 border border-[var(--border)]">
                        {/* Section Header */}
                        <div className="mb-12 text-center">
                            <span className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase block mb-4">
                                Daily Spark
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl mb-4">
                                Perspective & Curiosity
                            </h2>
                        </div>

                        {/* Two-Column Layout */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* On This Day - Sidebar */}
                            <div className="lg:w-[350px] lg:flex-shrink-0">
                                <OnThisDay />
                            </div>
                            {/* Did You Know - Main */}
                            <div className="flex-1">
                                <DidYouKnow />
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            </Container>
        </div>
    );
}
