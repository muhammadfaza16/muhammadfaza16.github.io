import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const radioSongs = await (prisma as any).radioSong.findMany({
            where: { radioId: id },
            include: { song: true }
        });

        // Extract the song objects and parse artist from title
        const songs = radioSongs.map((rs: any) => {
            const s = rs.song;
            const parts = s.title.split(' — ');
            const artist = parts.length > 1 ? parts[0].trim() : '';
            return { id: s.id, title: s.title, artist, audioUrl: s.audioUrl, duration: s.duration };
        });

        return NextResponse.json({ success: true, songs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { songId } = await req.json();

        if (!songId) {
            return NextResponse.json({ success: false, error: "Song ID is required" }, { status: 400 });
        }

        const radioSong = await (prisma as any).radioSong.create({
            data: {
                radioId: id,
                songId
            }
        });

        return NextResponse.json({ success: true, radioSong });
    } catch (error: any) {
        // Handle unique constraint violations
        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, error: "Song already exists in this radio" }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const songId = searchParams.get("songId");

        if (!songId) {
            return NextResponse.json({ success: false, error: "Song ID is required" }, { status: 400 });
        }

        await (prisma as any).radioSong.delete({
            where: {
                radioId_songId: {
                    radioId: id,
                    songId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
