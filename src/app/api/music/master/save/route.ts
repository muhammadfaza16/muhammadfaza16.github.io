import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatSongTitle } from "@/lib/music-naming";

export async function POST(req: NextRequest) {
    try {
        const { artist, title: rawTitle, audioUrl, duration } = await req.json();

        if (!rawTitle || !audioUrl) {
            return NextResponse.json({ success: false, error: "Missing title or audioUrl" }, { status: 400 });
        }

        // Standardize the final title format: Artist — Title
        // Use the shared utility to ensure no junk survives manual edits
        const fullRaw = artist ? `${artist} — ${rawTitle}` : rawTitle;
        const title = formatSongTitle(fullRaw);

        // Check for duplicates
        const existing = await prisma.song.findFirst({ where: { audioUrl } });
        if (existing) {
            return NextResponse.json({ success: true, song: existing, message: "Already exists." });
        }

        const song = await prisma.song.create({
            data: { title, audioUrl, source: "youtube", duration: duration || 0 }
        });

        return NextResponse.json({ success: true, song });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
