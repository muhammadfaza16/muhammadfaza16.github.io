import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { title, audioUrl, duration } = await req.json();

        if (!title || !audioUrl) {
            return NextResponse.json({ success: false, error: "Missing title or audioUrl" }, { status: 400 });
        }

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
