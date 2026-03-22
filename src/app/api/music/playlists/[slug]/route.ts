import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const playlist = await prisma.playlist.findUnique({
            where: { slug },
            include: {
                songs: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        song: true
                    }
                }
            }
        });

        if (!playlist) {
            return NextResponse.json({ success: false, error: "Playlist not found" }, { status: 404 });
        }

        // Format songs to match the existing UI expected format
        const formattedSongs = playlist.songs.map((ps) => {
            const song = ps.song;
            const parts = song.title.split(' — ');
            const artist = parts.length > 1 ? parts[0].trim() : '';
            const title = parts.length > 1 ? parts.slice(1).join(' — ').trim() : song.title;
            
            return {
                id: song.id,
                title: song.title, // Keep full
                cleanTitle: title,
                artist: artist,
                audioUrl: song.audioUrl,
                source: song.source,
                duration: song.duration,
                category: song.category,
                order: ps.order
            };
        });

        return NextResponse.json({ 
            success: true, 
            playlist: {
                ...playlist,
                songs: formattedSongs
            } 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
