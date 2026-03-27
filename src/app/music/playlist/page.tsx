import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";
import LibraryLoading from "./loading";

export const dynamic = "force-dynamic";

export default async function LibraryIndexPage() {
    let songCount = 0;
    let playlists: any[] = [];
    
    try {
        const [count, fetchedPlaylists] = await Promise.all([
            prisma.song.count(),
            prisma.playlist.findMany({
                orderBy: { createdAt: "asc" },
                include: {
                    _count: {
                        select: { songs: true }
                    }
                }
            })
        ]);
        songCount = count;
        playlists = fetchedPlaylists;
    } catch (e) {
        console.error("Failed to fetch library data in LibraryIndexPage", e);
    }

    return (
        <Suspense fallback={<LibraryLoading />}>
            <LibraryClient songCount={songCount} initialPlaylists={playlists} />
        </Suspense>
    );
}
