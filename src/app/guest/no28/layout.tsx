"use client";

import { usePathname } from "next/navigation";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    // The GuestAudioPlayer is now in the RootLayout to ensure persistence.
    // This layout just serves as a shell properly.

    return (
        <>
            {children}
        </>
    );
}
