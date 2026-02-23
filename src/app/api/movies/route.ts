import { NextResponse } from "next/server";

// TMDB API — free, requires API key in env
const TMDB_KEY = process.env.TMDB_API_KEY || "";
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}&language=en-US`;

interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    overview: string;
    original_language: string;
    genre_ids: number[];
}

export async function GET() {
    if (!TMDB_KEY) {
        const mockMovies = [
            {
                id: 1,
                title: "Dune: Part Two",
                poster: "https://image.tmdb.org/t/p/w92/1pdfLvkbY9ohJlCjQH2JGjjc9CW.jpg",
                rating: 8.3,
                year: "2024",
                overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
                language: "EN",
                genres: [878, 12]
            },
            {
                id: 2,
                title: "Oppenheimer",
                poster: "https://image.tmdb.org/t/p/w92/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                rating: 8.1,
                year: "2023",
                overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
                language: "EN",
                genres: [18, 36]
            },
            {
                id: 3,
                title: "Spider-Man: Across the Spider-Verse",
                poster: "https://image.tmdb.org/t/p/w92/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                rating: 8.4,
                year: "2023",
                overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
                language: "EN",
                genres: [16, 28, 12]
            },
            {
                id: 4,
                title: "Poor Things",
                poster: "https://image.tmdb.org/t/p/w92/kCGlIMHnOm8PhlsOXvx5cZ79R1j.jpg",
                rating: 7.8,
                year: "2023",
                overview: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents.",
                language: "EN",
                genres: [878, 10749, 35]
            }
        ];
        return NextResponse.json({ movies: mockMovies, error: "TMDB_API_KEY not configured" });
    }

    try {
        const res = await fetch(API_URL, { next: { revalidate: 3600 } }); // cache 1 hour
        if (!res.ok) throw new Error("TMDB fetch failed");

        const data = await res.json();
        const results = (data.results || []) as TMDBMovie[];

        const movies = results.slice(0, 8).map((m) => ({
            id: m.id,
            title: m.title,
            poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                : null,
            rating: Math.round(m.vote_average * 10) / 10,
            year: m.release_date ? m.release_date.slice(0, 4) : "—",
            overview: m.overview || "No synopsis available.",
            language: m.original_language ? m.original_language.toUpperCase() : "EN",
            genres: m.genre_ids || [],
        }));

        return NextResponse.json({ movies });
    } catch {
        return NextResponse.json({ movies: [] });
    }
}
