import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// ESPN public API — free, no key required
const LEAGUES = [
    { id: "eng.1", name: "Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: "esp.1", name: "La Liga", emoji: "🇪🇸" },
    { id: "ita.1", name: "Serie A", emoji: "🇮🇹" },
    { id: "ger.1", name: "Bundesliga", emoji: "🇩🇪" },
    { id: "fra.1", name: "Ligue 1", emoji: "🇫🇷" },
    { id: "uefa.champions", name: "Champions League", emoji: "🇪🇺" },
];

// Big teams only
const BIG_TEAMS = [
    // EPL
    "Manchester City", "Man City", "Manchester United", "Man United", "Chelsea", "Liverpool", "Arsenal", "Tottenham", "Aston Villa",
    // La Liga
    "Real Madrid", "Barcelona", "Atletico Madrid", "Atlético Madrid", "Girona",
    // Serie A
    "Juventus", "Inter Milan", "Inter", "AC Milan", "Milan", "Napoli", "AS Roma", "Roma",
    // Bundesliga
    "Bayern Munich", "Bayern", "Borussia Dortmund", "Dortmund", "Bayer Leverkusen", "Leverkusen",
    // Ligue 1
    "Paris Saint-Germain", "PSG",
];

function isBigTeam(teamName: string): boolean {
    const normalized = teamName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return BIG_TEAMS.some(bt => {
        const btNorm = bt.toLowerCase().replace(/[^a-z0-9]/g, "");
        return normalized.includes(btNorm) || btNorm.includes(normalized);
    });
}

interface ESPNEvent {
    name: string;
    date: string;
    status: { type: { description: string; state: string; shortDetail?: string } };
    competitions: {
        competitors: {
            team: { id: string; shortDisplayName: string; abbreviation: string; logo: string };
            homeAway: string;
            score?: string;
        }[];
        details?: {
            type: { text: string };
            clock: { displayValue: string };
            team: { id: string };
            athletesInvolved?: { shortName: string }[];
        }[];
    }[];
}

export async function GET() {
    try {
        const allMatches: {
            home: string;
            homeAbbr: string;
            homeLogo: string;
            away: string;
            awayAbbr: string;
            awayLogo: string;
            date: string;
            time: string;
            timestamp: number;
            league: string;
            leagueEmoji: string;
            status: string;
            state: string;
            liveMinute?: string;
            homeScore?: string;
            awayScore?: string;
            homeScorers: { name: string; time: string }[];
            awayScorers: { name: string; time: string }[];
            isBigMatch: boolean;
        }[] = [];

        await Promise.all(
            LEAGUES.map(async (league) => {
                try {
                    // Optimized: Fetch only past 1 day up to next 2 days
                    const now = new Date();
                    const start = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
                    const end = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
                    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
                    const dateRange = `${fmt(start)}-${fmt(end)}`;

                    const res = await fetch(
                        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.id}/scoreboard?dates=${dateRange}`,
                        { cache: 'no-store' } // Ensure real-time data on every poll
                    );
                    if (!res.ok) return;
                    const data = await res.json();

                    for (const event of (data.events || []) as ESPNEvent[]) {
                        const comp = event.competitions[0];
                        const home = comp.competitors.find((c) => c.homeAway === "home");
                        const away = comp.competitors.find((c) => c.homeAway === "away");
                        if (!home || !away) continue;

                        const isBig = isBigTeam(home.team.shortDisplayName) || isBigTeam(away.team.shortDisplayName);

                        const d = new Date(event.date);

                        const homeScorers: { name: string; time: string }[] = [];
                        const awayScorers: { name: string; time: string }[] = [];

                        if (comp.details) {
                            for (const detail of comp.details) {
                                if (detail.type.text.includes("Goal") && detail.athletesInvolved && detail.athletesInvolved.length > 0) {
                                    const scorer = {
                                        name: detail.athletesInvolved[0].shortName,
                                        time: detail.clock.displayValue
                                    };
                                    if (detail.team.id === home.team.id) {
                                        homeScorers.push(scorer);
                                    } else if (detail.team.id === away.team.id) {
                                        awayScorers.push(scorer);
                                    }
                                }
                            }
                        }

                        allMatches.push({
                            home: home.team.shortDisplayName,
                            homeAbbr: home.team.abbreviation,
                            homeLogo: home.team.logo,
                            away: away.team.shortDisplayName,
                            awayAbbr: away.team.abbreviation,
                            awayLogo: away.team.logo,
                            date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Jakarta" }),
                            time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }),
                            timestamp: d.getTime(),
                            league: league.name,
                            leagueEmoji: league.emoji,
                            status: event.status.type.description,
                            state: event.status.type.state,
                            liveMinute: event.status.type.state === "in" ? event.status.type.shortDetail : undefined,
                            homeScore: home.score,
                            awayScore: away.score,
                            homeScorers,
                            awayScorers,
                            isBigMatch: isBig,
                        });
                    }
                } catch {
                    // skip failed league
                }
            })
        );

        // Sort by timestamp, big matches first within same day
        allMatches.sort((a, b) => {
            if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            if (a.isBigMatch && !b.isBigMatch) return -1;
            if (!a.isBigMatch && b.isBigMatch) return 1;
            return 0;
        });

        return NextResponse.json({ matches: allMatches });
    } catch {
        return NextResponse.json({ matches: [] });
    }
}

