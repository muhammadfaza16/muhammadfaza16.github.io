import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import PlaylistClient from "./PlaylistClient";

export const dynamic = "force-static";
export const dynamicParams = false;

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
    return <PlaylistClient playlistId={id} />;
}
