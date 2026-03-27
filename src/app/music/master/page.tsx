import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import MasterClient from "./MasterClient";
import MasterLoading from "./loading";

export const dynamic = "force-dynamic";

export default async function MasterPanelPage() {
    let songs: any[] = [];
    let playlists: any[] = [];

    try {
        const [fetchedSongs, fetchedPlaylists] = await Promise.all([
            prisma.song.findMany({
                orderBy: { title: "asc" }
            }),
            prisma.playlist.findMany({
                orderBy: { createdAt: "asc" },
                include: {
                    _count: {
                        select: { songs: true }
                    }
                }
            })
        ]);
        songs = fetchedSongs;
        playlists = fetchedPlaylists;
    } catch (e) {
        console.error("Failed to fetch Master Panel data", e);
    }

    return (
        <Suspense fallback={<MasterLoading />}>
            <MasterClient initialSongs={songs} initialPlaylists={playlists} />
        </Suspense>
    );
}
