import React from "react";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

export default async function LibraryIndexPage() {
    const songs = await prisma.song.findMany();
    const songCount = songs.length;

    return <LibraryClient songCount={songCount} />;
}
