import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const songs = await prisma.song.findMany({
            orderBy: { createdAt: "desc" }
        });

        // Transform to match the PLAYLIST format: { title, audioUrl }
        const formatted = songs.map(song => ({
            title: song.title,
            audioUrl: song.audioUrl,
            source: song.source,
            duration: song.duration,
            id: song.id
        }));

        return NextResponse.json({ success: true, songs: formatted });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
