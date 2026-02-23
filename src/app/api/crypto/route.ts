import { NextResponse } from "next/server";

const COINS = ["bitcoin", "ethereum"];
const CG_MARKETS_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(",")}&sparkline=true&price_change_percentage=24h`;
const CG_GLOBAL_URL = `https://api.coingecko.com/api/v3/global`;
const FOREX_URL = `https://api.exchangerate-api.com/v4/latest/USD`;

const COIN_META: Record<string, { emoji: string }> = {
    bitcoin: { emoji: "₿" },
    ethereum: { emoji: "Ξ" },
};

export async function GET() {
    try {
        const [marketsRes, globalRes, forexRes] = await Promise.all([
            fetch(CG_MARKETS_URL, { next: { revalidate: 300 } }),
            fetch(CG_GLOBAL_URL, { next: { revalidate: 900 } }),
            fetch(FOREX_URL, { next: { revalidate: 3600 } })
        ]);

        const marketsData = await (marketsRes.ok ? marketsRes.json() : Promise.resolve([]));
        const globalData = await (globalRes.ok ? globalRes.json() : Promise.resolve({ data: {} }));
        const forexData = await (forexRes.ok ? forexRes.json() : Promise.resolve({ rates: {} }));

        const prices = (marketsData as any[]).map((coin: any) => {
            const meta = COIN_META[coin.id];
            // Downsample sparkline to ~24 points for a lightweight SVG
            const raw: number[] = coin.sparkline_in_7d?.price || [];
            const sparkline: number[] = [];
            if (raw.length > 0) {
                const step = Math.max(1, Math.floor(raw.length / 24));
                for (let i = 0; i < raw.length; i += step) sparkline.push(raw[i]);
                if (sparkline[sparkline.length - 1] !== raw[raw.length - 1]) sparkline.push(raw[raw.length - 1]);
            }
            return {
                id: coin.id,
                name: coin.name || coin.id,
                symbol: (coin.symbol || coin.id).toUpperCase(),
                emoji: meta?.emoji || "🪙",
                usd: coin.current_price ?? 0,
                change24h: coin.price_change_percentage_24h ?? 0,
                vol24h: coin.total_volume ?? 0,
                marketCap: coin.market_cap ?? 0,
                sparkline,
            };
        });

        return NextResponse.json({
            crypto: prices,
            global: {
                totalMarketCap: globalData.data?.total_market_cap?.usd ?? 0,
                btcDominance: globalData.data?.market_cap_percentage?.btc ?? 0,
            },
            forex: {
                IDR: forexData.rates?.IDR ?? 0,
                EUR: forexData.rates?.EUR ?? 0,
                GBP: forexData.rates?.GBP ?? 0,
            }
        });
    } catch {
        return NextResponse.json({
            crypto: [],
            global: { totalMarketCap: 0, btcDominance: 0 },
            forex: { IDR: 0, EUR: 0, GBP: 0 }
        });
    }
}

