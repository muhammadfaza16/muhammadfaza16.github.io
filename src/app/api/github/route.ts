import { NextResponse } from "next/server";

const USERNAME = "muhammadfaza16";

export async function GET() {
    try {
        // Get user profile
        const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, {
            next: { revalidate: 60 },
            headers: { "Accept": "application/vnd.github.v3+json" },
        });
        if (!userRes.ok) throw new Error("GitHub API failed");
        const user = await userRes.json();

        // Fetch multiple pages of events for better coverage
        const allEvents: any[] = [];
        for (let page = 1; page <= 3; page++) {
            const eventsRes = await fetch(
                `https://api.github.com/users/${USERNAME}/events?per_page=100&page=${page}`,
                {
                    next: { revalidate: 60 },
                    headers: { "Accept": "application/vnd.github.v3+json" },
                }
            );
            if (!eventsRes.ok) break;
            const pageEvents = await eventsRes.json();
            if (pageEvents.length === 0) break;
            allEvents.push(...pageEvents);
        }

        // Monthly Benchmark Metrics
        const now = new Date();
        // Get today's date in WIB to match pushDates
        const getWIBDate = (d: string | Date) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
        const todayStr = getWIBDate(now);
        
        // Extract current month/year exactly in WIB (prevent timezone boundary slip)
        const [currYearStr, currMonthStr, currDayStr] = todayStr.split('-');
        const currentMonth = parseInt(currMonthStr, 10) - 1; // 0-indexed
        const currentYear = parseInt(currYearStr, 10);
        const currentMonthTotalDays = parseInt(currDayStr, 10);

        let currentMonthPushCount = 0;
        const currentMonthActiveDates = new Set<string>();
        let recentRepo: string | null = null;

        const pushDates = new Set<string>();

        // Track more event types for accurate activity data
        const ACTIVE_EVENTS = [
            "PushEvent",
            "CreateEvent",
            "PullRequestEvent",
            "IssueCommentEvent",
            "IssuesEvent",
            "CommitCommentEvent",
            "DeleteEvent",
            "ForkEvent",
            "ReleaseEvent",
            "PullRequestReviewEvent",
        ];

        for (const event of allEvents) {
            if (ACTIVE_EVENTS.includes(event.type)) {
                if (!recentRepo && event.repo?.name) {
                    recentRepo = event.repo.name.replace(`${USERNAME}/`, "");
                }
                const eventDate = new Date(event.created_at);
                const wibDateStr = getWIBDate(eventDate);
                pushDates.add(wibDateStr);

                // Track current month activity (parsing YYYY-MM-DD manually to avoid UTC midnight slip)
                const [eventYearStr, eventMonthStr] = wibDateStr.split('-');
                const eventMonth = parseInt(eventMonthStr, 10) - 1;
                const eventYear = parseInt(eventYearStr, 10);
                
                if (eventMonth === currentMonth && eventYear === currentYear) {
                    if (event.type === "PushEvent") {
                        currentMonthPushCount += event.payload?.size || 1;
                    }
                    currentMonthActiveDates.add(wibDateStr);
                }
            }
        }

        return NextResponse.json({
            username: USERNAME,
            repos: user.public_repos,
            followers: user.followers,
            avatar: user.avatar_url,
            todayActive: pushDates.has(todayStr),
            pushDates: Array.from(pushDates),
            currentMonthActiveDays: currentMonthActiveDates.size,
            currentMonthTotalDays,
            currentMonthPushCount,
            recentRepo,
        });
    } catch {
        return NextResponse.json({
            username: USERNAME,
            repos: 0,
            followers: 0,
            avatar: "",
            todayActive: false,
            pushDates: [],
            currentMonthActiveDays: 0,
            currentMonthTotalDays: 30,
            currentMonthPushCount: 0,
        });
    }
}
