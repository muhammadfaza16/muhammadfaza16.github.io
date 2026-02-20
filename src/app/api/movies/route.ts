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
}

export async function GET() {
    if (!TMDB_KEY) {
        return NextResponse.json({ movies: [], error: "TMDB_API_KEY not configured" });
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
        }));

        return NextResponse.json({ movies });
    } catch {
        return NextResponse.json({ movies: [] });
    }
}
