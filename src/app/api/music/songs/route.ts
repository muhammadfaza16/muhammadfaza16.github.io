import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const songs = await prisma.song.findMany({
            orderBy: [
                { category: "asc" },
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
                source: song.source,
                duration: song.duration,
                category: song.category // Add category here
            };

        });

        return NextResponse.json({ success: true, songs: formatted });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
