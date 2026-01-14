import { Container } from "@/components/Container";
import { Metadata } from "next";
import { Monitor, Code, Laptop, Mouse, Keyboard } from "lucide-react";

export const metadata: Metadata = {
    title: "Uses | The Almanack of Broken Wanderer",
    description: "Alat, software, dan hardware yang saya gunakan sehari-hari.",
};

const gear = [
    {
        category: "Hardware",
        icon: Laptop,
        items: [
            { name: "MacBook Pro 14\"", description: "M3 Pro, Space Black. The perfect balance of power and portability.", icon: Laptop },
            { name: "HHKB Professional Hybrid", description: "Topre switches. Once you go clack, you never go back.", icon: Keyboard },
            { name: "MX Master 3S", description: "Standard issue for productivity.", icon: Mouse },
        ]
    },
    {
        category: "Software",
        icon: Code,
        items: [
            { name: "VS Code", description: "With GitHub Copilot and VIM bindings. The ultimate combo.", icon: Code },
            { name: "Arc Browser", description: "The operating system of the web. Spaces changed my life.", icon: Monitor },
            { name: "Obsidian", description: "Second brain. Local markdown files forever.", icon: Monitor },
        ]
    }
];

function GearItem({ item }: { item: { name: string; description: string; icon: React.ComponentType<{ className?: string }> } }) {
    const Icon = item.icon;
    return (
        <div style={{
            display: "flex",
            gap: "clamp(1rem, 3vw, 1.25rem)",
            padding: "clamp(1rem, 3vw, 1.5rem)",
            backgroundColor: "var(--card-bg)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease"
        }} className="hover:border-[var(--border-strong)]">
            <div style={{
                width: "clamp(40px, 10vw, 48px)",
                height: "clamp(40px, 10vw, 48px)",
                borderRadius: "12px",
                backgroundColor: "var(--hover-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--accent)"
            }}>
                <Icon className="w-5 h-5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                    fontWeight: 500,
                    marginBottom: "0.35rem",
                    lineHeight: 1.3
                }}>
                    {item.name}
                </h3>
                <p style={{
                    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    margin: 0
                }}>
                    {item.description}
                </p>
            </div>
        </div>
    );
}

export default function UsesPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "99px",
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            <Monitor className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Studio</span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                            color: "var(--foreground)",
                            maxWidth: "16ch"
                        }}>
                            Tools for the craft.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Gear dan software yang gue pake tiap hari. Hasil kurasi
                            bertahun-tahun trial, error, dan banyak duit yang kebuang.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "42rem" }}>

                    {/* Disclaimer */}
                    <div style={{
                        padding: "clamp(0.875rem, 2vw, 1rem)",
                        marginBottom: "clamp(2rem, 4vh, 3rem)",
                        background: "rgba(var(--foreground-rgb), 0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.75rem, 2vw, 1rem)"
                    }}>
                        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                        <div>
                            <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>Notice</strong>
                            The data below is currently placeholder content for demonstration purposes.
                        </div>
                    </div>

                    {/* Gear Categories */}
                    {gear.map((section, i) => (
                        <section key={i} style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                            }}>
                                <section.icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                    fontWeight: 500,
                                    margin: 0
                                }}>
                                    {section.category}
                                </h2>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "clamp(0.75rem, 2vh, 1rem)"
                            }}>
                                {section.items.map((item, j) => (
                                    <GearItem key={j} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </Container>
        </div>
    );
}
