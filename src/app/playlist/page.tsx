import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

export default async function LibraryIndexPage() {
    const songCount = await prisma.song.count();

    return (
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", fontFamily: "monospace" }}>Loading Library...</div>}>
            <LibraryClient songCount={songCount} />
        </Suspense>
    );
}
