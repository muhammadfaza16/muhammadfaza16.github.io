import { NextResponse } from "next/server";

// CoinGecko free public endpoint — no API key required
const COINS = ["bitcoin", "ethereum", "solana"];
const API_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(",")}&vs_currencies=usd&include_24hr_change=true`;

const COIN_META: Record<string, { name: string; symbol: string; emoji: string }> = {
    bitcoin: { name: "Bitcoin", symbol: "BTC", emoji: "₿" },
    ethereum: { name: "Ethereum", symbol: "ETH", emoji: "Ξ" },
    solana: { name: "Solana", symbol: "SOL", emoji: "◎" },
};

export async function GET() {
    try {
        const res = await fetch(API_URL, { next: { revalidate: 300 } }); // cache 5 min
        if (!res.ok) throw new Error("CoinGecko fetch failed");

        const data = await res.json();

        const prices = COINS.map((id) => {
            const coin = data[id];
            const meta = COIN_META[id];
            return {
                id,
                name: meta.name,
                symbol: meta.symbol,
                emoji: meta.emoji,
                usd: coin?.usd ?? 0,
                change24h: coin?.usd_24h_change ?? 0,
            };
        });

        return NextResponse.json({ prices });
    } catch {
        return NextResponse.json({ prices: [] });
    }
}
