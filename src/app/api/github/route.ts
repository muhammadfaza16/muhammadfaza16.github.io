import { NextResponse } from "next/server";

const USERNAME = "muhammadfaza16";

export async function GET() {
    try {
        // Get user profile
        const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, {
            next: { revalidate: 3600 },
            headers: { "Accept": "application/vnd.github.v3+json" },
        });
        if (!userRes.ok) throw new Error("GitHub API failed");
        const user = await userRes.json();

        // Get recent events for streak calculation
        const eventsRes = await fetch(`https://api.github.com/users/${USERNAME}/events?per_page=100`, {
            next: { revalidate: 1800 },
            headers: { "Accept": "application/vnd.github.v3+json" },
        });
        const events = eventsRes.ok ? await eventsRes.json() : [];

        // Calculate streak from push events
        const pushDates = new Set<string>();
        for (const event of events) {
            if (event.type === "PushEvent") {
                const date = event.created_at.split("T")[0];
                pushDates.add(date);
            }
        }

        // Count consecutive days from today backwards
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            if (pushDates.has(dateStr)) {
                streak++;
            } else if (i > 0) {
                break; // Allow today to not have a push yet
            }
        }

        return NextResponse.json({
            username: USERNAME,
            repos: user.public_repos,
            followers: user.followers,
            streak,
            avatar: user.avatar_url,
            todayActive: pushDates.has(today.toISOString().split("T")[0]),
            pushDates: Array.from(pushDates),
        });
    } catch {
        return NextResponse.json({
            username: USERNAME,
            repos: 0,
            followers: 0,
            streak: 0,
            avatar: "",
            todayActive: false,
            pushDates: [],
        });
    }
}
