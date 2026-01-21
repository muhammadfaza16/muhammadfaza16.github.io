import { Container } from "@/components/Container";
import { TechBlueprint } from "@/components/engine/TechBlueprint";
import { Changelog } from "@/components/engine/Changelog";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function EnginePage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-[var(--background)] font-mono selection:bg-emerald-900 selection:text-emerald-50">
            <Container>
                <ScrollReveal>
                    <header className="mb-16">
                        <span className="text-xs text-emerald-500 tracking-widest uppercase mb-4 block">
                            System Control
                        </span>
                        <h1 className="text-4xl md:text-6xl mb-6 tracking-tighter">
                            THE ENGINE ROOM
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl border-l-2 border-emerald-500/30 pl-4">
                            Behind the curtain. The machinery, the blueprints, and the history of this digital universe.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Stack - Left Col */}
                        <div className="lg:col-span-2">
                            <TechBlueprint />
                        </div>

                        {/* Changelog - Right Col */}
                        <div>
                            <Changelog />
                        </div>
                    </div>
                </ScrollReveal>
            </Container>
        </div>
    );
}
