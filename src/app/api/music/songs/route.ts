import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as mm from "music-metadata";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const songs = await prisma.song.findMany({
            orderBy: [
                { category: "desc" },
                { title: "asc" }
            ]
        });

        // Transform to match the PLAYLIST format: { title, audioUrl }
        // Song titles are stored as "Artist — Title", parse them apart
        const formatted = songs.map(song => {
            const parts = song.title.split(' — ');
            const artist = parts.length > 1 ? parts[0].trim() : '';
            const title = parts.length > 1 ? parts.slice(1).join(' — ').trim() : song.title;
            return {
                id: song.id,
                title: song.title,  // Keep full title for display
                artist,
                audioUrl: song.audioUrl,
                coverImage: song.coverImage,
                source: song.source,
                duration: song.duration,
                category: song.category, 
                createdAt: song.createdAt
            };

        });

        return NextResponse.json({ success: true, songs: formatted });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, artist, audioUrl, coverImage, source, duration, category } = body;

        if (!title || !audioUrl) {
            return NextResponse.json({ success: false, error: "Title and Audio URL are required" }, { status: 400 });
        }

        // Combine artist and title if artist is provided for consistency with existing data
        const fullTitle = artist ? `${artist} — ${title}` : title;

        let finalDuration = duration || 0;

        // Auto-extract duration for local files if not provided manually
        if (finalDuration === 0 && audioUrl.startsWith("/audio/")) {
            try {
                // Remove query params if any
                const cleanUrl = audioUrl.split('?')[0]; 
                const filePath = path.join(process.cwd(), "public", decodeURIComponent(cleanUrl));
                const metadata = await mm.parseFile(filePath);
                finalDuration = Math.round(metadata.format.duration || 0);
            } catch (err) {
                console.warn(`[Song POST] Could not extract duration for ${audioUrl}:`, err);
            }
        }

        const song = await prisma.song.create({
            data: {
                title: fullTitle,
                audioUrl,
                // @ts-ignore
                coverImage: coverImage || null,
                source: source || "Local",
                duration: finalDuration,
                category: category || "Other"
            }
        });

        return NextResponse.json({ success: true, song });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, artist, audioUrl, coverImage, source, duration, category } = body;

        if (!id || !title || !audioUrl) {
            return NextResponse.json({ success: false, error: "ID, Title and Audio URL are required" }, { status: 400 });
        }

        const fullTitle = artist ? `${artist} — ${title}` : title;

        let finalDuration = duration || 0;

        // Auto-extract duration for local files if not provided manually
        if (finalDuration === 0 && audioUrl.startsWith("/audio/")) {
            try {
                // Remove query params if any
                const cleanUrl = audioUrl.split('?')[0];
                const filePath = path.join(process.cwd(), "public", decodeURIComponent(cleanUrl));
                const metadata = await mm.parseFile(filePath);
                finalDuration = Math.round(metadata.format.duration || 0);
            } catch (err) {
                console.warn(`[Song PUT] Could not extract duration for ${audioUrl}:`, err);
            }
        }

        const song = await prisma.song.update({
            where: { id },
            data: {
                title: fullTitle,
                audioUrl,
                // @ts-ignore
                coverImage: coverImage || null,
                source: source || "Local",
                duration: finalDuration,
                category: category || "Other"
            }
        });

        return NextResponse.json({ success: true, song });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
