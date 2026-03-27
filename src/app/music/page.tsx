import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import AudioHubClient from "./AudioHubClient";

export const dynamic = "force-dynamic";

export default async function AudioHubPage() {
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
        <Suspense fallback={<div style={{ height: "100vh", background: "#0A0A0A" }} />}>
            <AudioHubClient 
                initialPlaylists={playlists} 
                activeSessionPlaylistIds={activeSessionPlaylistIds} 
            />
        </Suspense>
    );
}
