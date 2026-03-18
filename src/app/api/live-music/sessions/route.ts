import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Public endpoint: list all active live sessions for the Live Hub
export async function GET() {
    try {
        const sessions = await prisma.liveSession.findMany({
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

        // For each session, compute what's currently playing
        const now = Date.now();

        const enrichedSessions = sessions.map(session => {
            const songs = session.playlist.songs
                .map((ps: any) => ps.song)
                .filter((s: any) => s.duration && s.duration > 0);

            if (songs.length === 0) {
                return {
                    id: session.id,
                    title: session.title || session.playlist.title,
                    description: session.description,
                    playlistTitle: session.playlist.title,
                    coverImage: session.playlist.coverImage,
                    coverColor: session.playlist.coverColor,
                    currentSong: null,
                    totalSongs: 0,
                    songIndex: 0,
                    startedAt: session.startedAt,
                };
            }

            const totalDuration = songs.reduce((sum: number, s: any) => sum + s.duration, 0);
            const elapsed = (now - new Date(session.startedAt).getTime()) / 1000;
            const positionInCycle = elapsed % totalDuration;

            let accumulated = 0;
            let currentSongIndex = 0;
            for (let i = 0; i < songs.length; i++) {
                if (accumulated + songs[i].duration > positionInCycle) {
                    currentSongIndex = i;
                    break;
                }
                accumulated += songs[i].duration;
            }

            return {
                id: session.id,
                title: session.title || session.playlist.title,
                description: session.description,
                playlistTitle: session.playlist.title,
                coverImage: session.playlist.coverImage,
                coverColor: session.playlist.coverColor,
                currentSong: {
                    title: songs[currentSongIndex].title,
                    category: songs[currentSongIndex].category,
                },
                totalSongs: songs.length,
                songIndex: currentSongIndex,
                startedAt: session.startedAt,
            };
        });

        return NextResponse.json({ sessions: enrichedSessions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
