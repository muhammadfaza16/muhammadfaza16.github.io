import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Public endpoint: what's playing right now?
// Calculates current song + seek position based on server clock vs session startedAt
export async function GET() {
    try {
        const session = await prisma.liveSession.findFirst({
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
            }
        });

        if (!session) {
            return NextResponse.json({ isLive: false });
        }

        const songs = session.playlist.songs.map((ps: any) => ps.song);

        // Filter out songs without duration (can't calculate position without it)
        const playableSongs = songs.filter((s: any) => s.duration && s.duration > 0);

        if (playableSongs.length === 0) {
            return NextResponse.json({
                isLive: true,
                error: "No songs with duration data in this playlist",
                playlistTitle: session.playlist.title
            });
        }

        // Calculate total playlist duration in seconds
        const totalDuration = playableSongs.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);

        // How many seconds have passed since the session started (sub-second precision)
        const now = Date.now();
        const elapsed = (now - new Date(session.startedAt).getTime()) / 1000;

        // Loop the playlist: find position within the cycle
        const positionInCycle = elapsed % totalDuration;

        // Walk through songs to find which one is playing
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

        return NextResponse.json({
            isLive: true,
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
            playlistTitle: session.playlist.title,
            playlistCover: session.playlist.coverImage,
            playlistColor: session.playlist.coverColor,
            // Send full tracklist for queue preview
            tracklist: playableSongs.map((s: any, i: number) => ({
                title: s.title,
                duration: s.duration,
                isCurrent: i === currentSongIndex
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
