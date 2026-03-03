import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import PlaylistClient from "./PlaylistClient";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
    const paths = PLAYLIST_CATEGORIES.map((playlist) => ({
        id: playlist.id,
    }));

    // Add "all" for the all songs page
    paths.push({ id: "all" });

    return paths;
}

export default async function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const songs = await prisma.song.findMany({
        orderBy: { title: 'asc' }
    });

    return <PlaylistClient playlistId={id} initialSongs={JSON.parse(JSON.stringify(songs))} />;
}
