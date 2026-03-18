import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Returns the next song in the playlist for preloading
// Accepts ?currentIndex=N&sessionId=X
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const currentIndex = parseInt(searchParams.get("currentIndex") || "0", 10);
        const sessionId = searchParams.get("sessionId");

        const session = sessionId
            ? await prisma.liveSession.findFirst({
                where: { id: sessionId, isActive: true },
                include: {
                    playlist: {
                        select: {
                            songs: {
                                orderBy: { order: "asc" },
                                include: {
                                    song: {
                                        select: { id: true, title: true, audioUrl: true, duration: true, category: true }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            : await prisma.liveSession.findFirst({
                where: { isActive: true },
                include: {
                    playlist: {
                        select: {
                            songs: {
                                orderBy: { order: "asc" },
                                include: {
                                    song: {
                                        select: { id: true, title: true, audioUrl: true, duration: true, category: true }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { startedAt: "desc" }
            });

        if (!session) {
            return NextResponse.json({ isLive: false });
        }

        const songs = session.playlist.songs.map((ps: any) => ps.song);
        const playableSongs = songs.filter((s: any) => s.duration && s.duration > 0);

        if (playableSongs.length === 0) {
            return NextResponse.json({ error: "No playable songs" }, { status: 404 });
        }

        const nextIndex = (currentIndex + 1) % playableSongs.length;
        const nextSong = playableSongs[nextIndex];

        return NextResponse.json({
            song: {
                title: nextSong.title,
                audioUrl: nextSong.audioUrl,
                duration: nextSong.duration,
                category: nextSong.category
            },
            songIndex: nextIndex,
            totalSongs: playableSongs.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
