import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Public endpoint: what's playing right now?
// Accepts optional ?sessionId=X to tune into a specific station.
// If no sessionId, returns the first active session (backward compatible).
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        const session = sessionId
            ? await prisma.liveSession.findFirst({
                where: { id: sessionId, isActive: true },
                include: {
                    playlist: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            coverImage: true,
                            coverColor: true,
                            songs: {
                                orderBy: { order: "asc" },
                                include: {
                                    song: {
                                        select: {
                                            id: true,
                                            title: true,
                                            audioUrl: true,
                                            duration: true,
                                            category: true
                                        }
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
                            id: true,
                            title: true,
                            slug: true,
                            coverImage: true,
                            coverColor: true,
                            songs: {
                                orderBy: { order: "asc" },
                                include: {
                                    song: {
                                        select: {
                                            id: true,
                                            title: true,
                                            audioUrl: true,
                                            duration: true,
                                            category: true
                                        }
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
            return NextResponse.json({
                isLive: true,
                error: "No songs with duration data in this playlist",
                playlistTitle: session.playlist.title
            });
        }

        const totalDuration = playableSongs.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
        const now = Date.now();
        const elapsed = (now - new Date(session.startedAt).getTime()) / 1000;
        const positionInCycle = elapsed % totalDuration;

        let accumulated = 0;
        let currentSongIndex = 0;
        let seekPosition = 0;

        for (let i = 0; i < playableSongs.length; i++) {
            const songDuration = playableSongs[i].duration || 0;
            if (accumulated + songDuration > positionInCycle) {
                currentSongIndex = i;
                seekPosition = positionInCycle - accumulated;
                break;
            }
            accumulated += songDuration;
        }

        const currentSong = playableSongs[currentSongIndex];

        // Calculate real listener count (active in last 5 minutes)
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        let listenersCount = 0;
        try {
            // Defensive: Use 'as any' and try-catch to avoid crashing if schema is out of sync
            listenersCount = await (prisma.musicAccessLog as any).count({
                where: { 
                    liveSessionId: session.id,
                    lastActive: { gte: fiveMinsAgo } 
                }
            });
        } catch (e: any) {
            console.error("Listeners count query failed (schema desync?):", e.message);
            listenersCount = 0; // Fallback to 0 instead of crashing the whole API
        }

        return NextResponse.json({
            isLive: true,
            sessionId: session.id,
            serverTime: now,
            song: {
                title: currentSong.title,
                audioUrl: currentSong.audioUrl,
                duration: currentSong.duration,
                category: currentSong.category
            },
            seekPosition,
            songIndex: currentSongIndex,
            totalSongs: playableSongs.length,
            playlistTitle: session.title || session.playlist.title,
            playlistCover: session.playlist.coverImage,
            playlistColor: session.playlist.coverColor,
            listenersCount,
            tracklist: playableSongs.map((s: any, i: number) => ({
                title: s.title,
                audioUrl: s.audioUrl,
                duration: s.duration,
                category: s.category,
                isCurrent: i === currentSongIndex
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
