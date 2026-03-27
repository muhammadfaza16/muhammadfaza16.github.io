import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { getEnrichedLiveSessions } from "@/utils/liveUtils";
import LiveHubClient from "./LiveHubClient";
import LiveHubLoading from "./loading";

export const revalidate = 30; // 30 seconds cache for instant background-refreshed navigation

export default function LiveHubPage() {
    return (
        <Suspense fallback={<LiveHubLoading />}>
            <LiveHubContent />
        </Suspense>
    );
}

async function LiveHubContent() {
    let sessions: any[] = [];
    let playlists: any[] = [];

    try {
        const [enrichedSessions, fetchedPlaylists] = await Promise.all([
            getEnrichedLiveSessions(),
            prisma.playlist.findMany({
                orderBy: { createdAt: "asc" },
                include: {
                    _count: {
                        select: { songs: true }
                    }
                }
            })
        ]);
        sessions = enrichedSessions;
        playlists = fetchedPlaylists;
    } catch (e) {
        console.error("Failed to fetch Live Hub data", e);
    }

    return <LiveHubClient initialSessions={sessions} initialPlaylists={playlists} />;
}
