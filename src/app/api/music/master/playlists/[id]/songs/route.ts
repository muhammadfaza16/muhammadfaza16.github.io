import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const playlistSongs = await (prisma as any).playlistSong.findMany({
            where: { playlistId: id },
            include: { song: true },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json({
            success: true,
            songs: playlistSongs.map((ps: any) => {
                const s = ps.song;
                const parts = s.title.split(' — ');
                const artist = parts.length > 1 ? parts[0].trim() : '';
                return { id: s.id, title: s.title, artist, audioUrl: s.audioUrl, duration: s.duration };
            })
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { songId } = await req.json();

        if (!songId) {
            return NextResponse.json({ success: false, error: "Song ID is required" }, { status: 400 });
        }

        const link = await (prisma as any).playlistSong.upsert({
            where: {
                playlistId_songId: {
                    playlistId: id,
                    songId
                }
            },
            update: {},
            create: {
                playlistId: id,
                songId
            }
        });

        return NextResponse.json({ success: true, link });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const songId = searchParams.get("songId");

        if (!songId) {
            return NextResponse.json({ success: false, error: "Song ID is required" }, { status: 400 });
        }

        await (prisma as any).playlistSong.delete({
            where: {
                playlistId_songId: {
                    playlistId: id,
                    songId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

