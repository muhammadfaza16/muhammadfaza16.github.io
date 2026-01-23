"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONCERT_SCHEDULE } from "@/data/concert-schedule";
import { ConcertStage } from "@/components/sanctuary/concert/ConcertStage";

export default function StagePage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const router = useRouter();
    const concert = CONCERT_SCHEDULE.find(c => c.id === resolvedParams.id);

    // Validation Logic
    useEffect(() => {
        if (!concert) {
            router.replace("/sanctuary/concerts");
            return;
        }

        // Strict Time Check
        const now = new Date();
        const start = new Date(`${concert.date}T${concert.window.start}:00`);
        const end = new Date(`${concert.date}T${concert.window.end}:59`);

        // UNCOMMENT FOR PRODUCTION:
        if (now < start || now > end) {
            // alert("This concert is currently closed.");
            // router.replace("/sanctuary/concerts");
        }
    }, [concert, router]);

    if (!concert) return null;

    return <ConcertStage concert={concert} />;
}
