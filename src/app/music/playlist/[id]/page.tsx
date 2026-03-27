import PlaylistClient from "./PlaylistClient";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import PlaylistLoading from "./loading";

export async function generateStaticParams() {
    try {
        const playlists = await prisma.playlist.findMany({ select: { slug: true } });
        const paths = playlists.map((playlist) => ({
            id: playlist.slug,
        }));
        paths.push({ id: "all" });
        return paths;
    } catch (e) {
        return [{ id: "all" }];
    }
}

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<PlaylistLoading />}>
            <PlaylistContent params={params} />
        </Suspense>
    );
}

async function PlaylistContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let playlist = null;
    let finalSongs: any[] = [];

    try {
        if (id === "all") {
            finalSongs = await prisma.song.findMany({
                orderBy: { createdAt: "asc" }
            });
        } else {
            playlist = await prisma.playlist.findUnique({
                where: { slug: id },
                include: {
                    songs: {
                        include: {
                            song: true
                        },
                        orderBy: { order: "asc" }
                    }
                }
            });
            if (playlist && playlist.songs) {
                finalSongs = playlist.songs.map((ps: any) => ps.song);
            }
        }
    } catch (e) {
        console.error("Failed to fetch playlist detail data", e);
    }

    return <PlaylistClient playlistId={id} initialSongs={finalSongs} initialPlaylist={playlist} />;
}
