import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TIL | The Almanac of Broken Wanderer",
    description: "Today I Learned - Catatan singkat hal-hal yang saya pelajari.",
};

const DISCLAIMER = <span style={{ opacity: 0.7 }}>📝 Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan TILs asli.</span>;

const tilEntries = [
    {
        id: 1,
        date: "Jan 10, 2026",
        title: "Git bisect untuk debugging",
        content: "Ternyata `git bisect` bisa otomatis mencari commit yang menyebabkan bug dengan binary search. Tinggal kasih script test, Git akan otomatis cari commit problematiknya.",
        category: "git",
        code: `git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run npm test`,
    },
    {
        id: 2,
        date: "Jan 8, 2026",
        title: "CSS :has() selector",
        content: "CSS :has() selector sekarang sudah supported di semua browser modern. Ini memungkinkan kita select parent berdasarkan child-nya, something yang selama ini hanya bisa dilakukan dengan JS.",
        category: "css",
        code: `/* Style parent yang punya child dengan class .active */
.card:has(.active) {
  border-color: blue;
}`,
    },
    {
        id: 3,
        date: "Jan 5, 2026",
        title: "TypeScript satisfies keyword",
        content: "Keyword `satisfies` di TypeScript memungkinkan kita validate type tanpa kehilangan inference. Berguna untuk config objects yang ingin kita pastikan sesuai schema tapi tetap preserve literal types.",
        category: "typescript",
        code: `const config = {
  port: 3000,
  host: "localhost"
} satisfies ServerConfig;`,
    },
    {
        id: 4,
        date: "Jan 3, 2026",
        title: "PostgreSQL EXPLAIN ANALYZE",
        content: "EXPLAIN ANALYZE tidak hanya menunjukkan query plan, tapi juga actual execution time. Sangat berguna untuk optimasi query yang lambat. Tambahkan BUFFERS untuk melihat I/O statistics.",
        category: "database",
        code: `EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM users 
WHERE created_at > '2025-01-01';`,
    },
    {
        id: 5,
        date: "Dec 28, 2025",
        title: "React useTransition hook",
        content: "useTransition memungkinkan kita mark state updates sebagai non-urgent, sehingga UI tetap responsive saat heavy computations terjadi di background.",
        category: "react",
        code: `const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSearchResults(heavyComputation(query));
});`,
    },
    {
        id: 6,
        date: "Dec 20, 2025",
        title: "Bash parameter expansion",
        content: "Bash punya built-in string manipulation yang powerful. Tidak perlu external tools seperti sed/awk untuk operasi string sederhana.",
        category: "bash",
        code: `filename="photo.jpg"
echo \${filename%.jpg}    # "photo" - remove suffix
echo \${filename#*.}       # "jpg" - remove prefix
echo \${filename^^}        # "PHOTO.JPG" - uppercase`,
    },
];

const categoryColors: Record<string, string> = {
    git: "#f14e32",
    css: "#264de4",
    typescript: "#3178c6",
    database: "#336791",
    react: "#61dafb",
    bash: "#4eaa25",
};

export default function TilPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "50rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "3rem" }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "0.5rem"
                    }}>
                        Continuous Learning
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Today I Learned
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Catatan singkat hal-hal menarik yang saya pelajari setiap hari. Bite-sized knowledge untuk future reference.
                    </p>
                </header>

                {/* Disclaimer */}
                <div style={{
                    padding: "1rem 1.5rem",
                    backgroundColor: "var(--hover-bg)",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    marginBottom: "3rem",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)"
                }}>
                    {DISCLAIMER}
                </div>

                {/* Stats */}
                <div style={{
                    display: "flex",
                    gap: "2rem",
                    marginBottom: "3rem",
                    flexWrap: "wrap"
                }}>
                    <div>
                        <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--foreground)" }}>{tilEntries.length}</span>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>entries</span>
                    </div>
                    <div>
                        <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--foreground)" }}>{new Set(tilEntries.map(t => t.category)).size}</span>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>categories</span>
                    </div>
                </div>

                {/* TIL Entries */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {tilEntries.map((til) => (
                        <article key={til.id} style={{
                            padding: "1.5rem",
                            borderRadius: "8px",
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <span style={{
                                        fontSize: "0.75rem",
                                        fontFamily: "var(--font-mono)",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "4px",
                                        backgroundColor: categoryColors[til.category] + "20",
                                        color: categoryColors[til.category],
                                        textTransform: "uppercase",
                                        fontWeight: 600
                                    }}>
                                        {til.category}
                                    </span>
                                    <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>
                                        {til.title}
                                    </h2>
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                                    {til.date}
                                </span>
                            </div>

                            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                                {til.content}
                            </p>

                            {til.code && (
                                <pre style={{
                                    padding: "1rem",
                                    borderRadius: "6px",
                                    backgroundColor: "var(--hover-bg)",
                                    overflow: "auto",
                                    fontSize: "0.85rem",
                                    fontFamily: "var(--font-mono)",
                                    lineHeight: 1.5,
                                    border: "1px solid var(--border)"
                                }}>
                                    <code>{til.code}</code>
                                </pre>
                            )}
                        </article>
                    ))}
                </div>

            </div>
        </Container>
    );
}
