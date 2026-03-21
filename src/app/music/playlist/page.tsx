import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

export const dynamic = "force-dynamic";

export default async function LibraryIndexPage() {
    let songCount = 0;
    try {
        songCount = await prisma.song.count();
    } catch (e) {
        console.error("Failed to fetch song count in LibraryIndexPage", e);
    }

    return (
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", fontFamily: "monospace" }}>Loading Library...</div>}>
            <LibraryClient songCount={songCount} />
        </Suspense>
    );
}
