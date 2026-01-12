import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TIL | The Almanac of Broken Wanderer",
    description: "Today I Learned - Catatan singkat hal-hal yang saya pelajari.",
};

const tilEntries = [
    {
        id: 1,
        date: "Jan 10, 2026",
        title: "Debugging with Git Bisect",
        content: "Baru tau kalau Git punya `bisect` buat nyari commit mana yang bikin error pakai binary search. Tinggal kasih test script, dia bakal jalan otomatis. Life saver buat debugging history panjang.",
        category: "git",
        color: "#f14e32", // Git Orange
        code: `git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run npm test`,
    },
    {
        id: 2,
        date: "Jan 8, 2026",
        title: "The CSS :has() Selector",
        content: "Akhirnya :has() selector udah aman dipake di modern browsers. Bisa style parent element berdasarkan children-nya. Bye-bye complicated JS logic cuma buat styling card.",
        category: "css",
        color: "#264de4", // CSS Blue
        code: `/* Style parent if it contains an active child */
.card:has(.active) {
  border-color: var(--primary);
  background-color: var(--surface-hover);
}`,
    },
    {
        id: 3,
        date: "Jan 5, 2026",
        title: "TypeScript Satisfies Operator",
        content: "Operator `satisfies` ini pinter banget. Kita bisa validate object shape sesuai interface, tapi tetap preserve literal types-nya. Jadi autocomplete tetap jalan spesifik.",
        category: "typescript",
        color: "#3178c6", // TS Blue
        code: `const config = {
  port: 3000,
  host: "localhost"
} satisfies ServerConfig;

// config.host remains "localhost" (literal), not string`,
    },
    {
        id: 4,
        date: "Jan 3, 2026",
        title: "React Concurrent Mode",
        content: "Pake `useTransition` buat nandain state update yang low priority. UI tetep responsif buat user input, sementara rendering berat jalan di background. Smooth interaction is key.",
        category: "react",
        color: "#61dafb", // React Cyan
        code: `const [isPending, startTransition] = useTransition();

startTransition(() => {
  // Low priority update
  setSearchResults(heavyFilter(input));
});`,
    },
];

export default function TilPage() {
    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "60rem", margin: "0 auto" }}>

                    <header style={{ marginBottom: "8rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 8vw, 6rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            marginBottom: "2rem",
                            color: "var(--foreground)"
                        }}>
                            TIL.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            lineHeight: 1.6,
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            margin: "0 auto",
                            fontStyle: "italic"
                        }}>
                            Catatan singkat hal-hal menarik. Bite-sized knowledge untuk future reference.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Konten di halaman ini masih berupa dummy/placeholder.
                        </Disclaimer>
                    </div>

                    {/* TIL Entries */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
                        {tilEntries.map((til) => (
                            <article key={til.id} style={{ position: "relative" }}>
                                <div style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.85rem",
                                    color: "var(--text-secondary)",
                                    marginBottom: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <span>{til.date}</span>

                                    {/* Functional Category Tag */}
                                    <span style={{
                                        color: til.color,
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    }}>
                                        <span style={{ width: "8px", height: "8px", backgroundColor: til.color, borderRadius: "2px" }} />
                                        {til.category}
                                    </span>
                                </div>

                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem",
                                    fontWeight: 400,
                                    marginBottom: "1.5rem",
                                    color: "var(--foreground)"
                                }}>
                                    {til.title}
                                </h2>

                                <p style={{
                                    fontSize: "1.1rem",
                                    lineHeight: 1.6,
                                    color: "var(--foreground)",
                                    marginBottom: "1.5rem",
                                    fontFamily: "'Source Serif 4', serif"
                                }}>
                                    {til.content}
                                </p>

                                {til.code && (
                                    <div style={{
                                        position: "relative",
                                        marginTop: "1.5rem",
                                        borderLeft: `2px solid ${til.color}` // Functional accent
                                    }}>
                                        <pre style={{
                                            padding: "1.5rem",
                                            backgroundColor: "var(--card-bg)",
                                            overflowX: "auto",
                                            fontSize: "0.9rem",
                                            lineHeight: 1.5,
                                            fontFamily: "var(--font-mono)",
                                            borderTopRightRadius: "4px",
                                            borderBottomRightRadius: "4px",
                                            whiteSpace: "pre-wrap",
                                            margin: 0
                                        }}>
                                            <code>{til.code}</code>
                                        </pre>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    <footer style={{ marginTop: "8rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                        {/* Disclaimer moved to top */}
                    </footer>

                </div>
            </Container>
        </section>
    );
}
