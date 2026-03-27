import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import MasterClient from "./MasterClient";
import MasterLoading from "./loading";

export const revalidate = 60; // 60 seconds - less frequent updates needed for admin panel

export default function MasterPanelPage() {
    return (
        <Suspense fallback={<MasterLoading />}>
            <MasterContent />
        </Suspense>
    );
}

async function MasterContent() {
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

    return <MasterClient initialSongs={songs} initialPlaylists={playlists} />;
}
