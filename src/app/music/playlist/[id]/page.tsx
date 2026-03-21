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

    // Use empty array for initialSongs so it doesn't block SSR.
    // The client component already fetches the actual song list asynchronously on mount.
    return <PlaylistClient playlistId={id} initialSongs={[]} />;
}
