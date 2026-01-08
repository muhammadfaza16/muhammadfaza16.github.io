import { Container } from "@/components/Container";
import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Container>
                <div style={{ textAlign: "center", maxWidth: "32rem", margin: "0 auto" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(3rem, 10vw, 6rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        lineHeight: 1
                    }}>
                        404
                    </h1>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        marginBottom: "1.5rem"
                    }}>
                        Page Not Found
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--secondary)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                        Looks like you're lost. The page you are looking for might have been moved or does not exist.
                    </p>
                    <Link
                        href="/"
                        className="btn-primary"
                        style={{
                            display: "inline-block",
                            padding: "0.875rem 2rem",
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            borderRadius: "100px",
                            fontWeight: 500,
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            letterSpacing: "0.05em"
                        }}
                    >
                        Back to Home
                    </Link>
                </div>
            </Container>
        </div>
    );
}
