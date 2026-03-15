import React from "react";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

export default async function LibraryIndexPage() {
    const songCount = await prisma.song.count();

    return <LibraryClient songCount={songCount} />;
}
