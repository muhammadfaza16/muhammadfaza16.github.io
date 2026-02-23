import { NextResponse } from "next/server";

const COINS = ["bitcoin", "ethereum"];
const CG_PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
const CG_GLOBAL_URL = `https://api.coingecko.com/api/v3/global`;
const FOREX_URL = `https://api.exchangerate-api.com/v4/latest/USD`;

const COIN_META: Record<string, { name: string; symbol: string; emoji: string }> = {
    bitcoin: { name: "Bitcoin", symbol: "BTC", emoji: "₿" },
    ethereum: { name: "Ethereum", symbol: "ETH", emoji: "Ξ" },
};

export async function GET() {
    try {
        const [priceRes, globalRes, forexRes] = await Promise.all([
            fetch(CG_PRICE_URL, { next: { revalidate: 300 } }),
            fetch(CG_GLOBAL_URL, { next: { revalidate: 900 } }),
            fetch(FOREX_URL, { next: { revalidate: 3600 } })
        ]);

        const priceData = await (priceRes.ok ? priceRes.json() : Promise.resolve({}));
        const globalData = await (globalRes.ok ? globalRes.json() : Promise.resolve({ data: {} }));
        const forexData = await (forexRes.ok ? forexRes.json() : Promise.resolve({ rates: {} }));

        const prices = COINS.map((id) => {
            const coin = priceData[id];
            const meta = COIN_META[id];
            return {
                id,
                name: meta?.name || id,
                symbol: meta?.symbol || id.toUpperCase(),
                emoji: meta?.emoji || "🪙",
                usd: coin?.usd ?? 0,
                change24h: coin?.usd_24h_change ?? 0,
                vol24h: coin?.usd_24h_vol ?? 0,
                marketCap: coin?.usd_market_cap ?? 0,
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
