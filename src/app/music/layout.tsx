import React from "react";
import { GlobalBottomPlayer } from "@/components/sanctuary/GlobalBottomPlayer";

export default function AudioHubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <GlobalBottomPlayer />
        </>
    );
}
