import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import AudioHubClient from "./AudioHubClient";

export const revalidate = 30; // 30 seconds for instant home navigation

import Loading from "./loading";

export default function AudioHubPage() {
    return (
        <Suspense fallback={<Loading />}>
            <AudioHubContent />
        </Suspense>
    );
}

async function AudioHubContent() {
    let playlists: any[] = [];
    let activeSessionPlaylistIds: string[] = [];

    try {
        const [fetchedPlaylists, activeSessions] = await Promise.all([
            prisma.playlist.findMany({
                orderBy: { createdAt: "asc" },
                include: {
                    _count: {
                        select: { songs: true }
                    }
                }
            }),
            prisma.liveSession.findMany({
                where: { isActive: true },
                select: { playlistId: true }
            })
        ]);
        
        playlists = fetchedPlaylists;
        activeSessionPlaylistIds = activeSessions.map(s => s.playlistId);
    } catch (e) {
        console.error("Failed to fetch playlists for Hub", e);
    }

    return (
        <AudioHubClient 
            initialPlaylists={playlists} 
            activeSessionPlaylistIds={activeSessionPlaylistIds} 
        />
    );
}
