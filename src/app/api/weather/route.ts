import { NextResponse } from "next/server";

// Jakarta Selatan coordinates
const LAT = -6.2615;
const LON = 106.8106;

export async function GET() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia/Jakarta`;
        const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
        if (!res.ok) throw new Error("Weather API failed");
        const data = await res.json();

        const current = data.current;
        const weatherCode = current.weather_code;

        // Map WMO weather codes to readable descriptions
        const weatherMap: Record<number, { label: string; icon: string }> = {
            0: { label: "Clear", icon: "☀️" },
            1: { label: "Mostly Clear", icon: "🌤️" },
            2: { label: "Partly Cloudy", icon: "⛅" },
            3: { label: "Overcast", icon: "☁️" },
            45: { label: "Foggy", icon: "🌫️" },
            48: { label: "Icy Fog", icon: "🌫️" },
            51: { label: "Light Drizzle", icon: "🌦️" },
            53: { label: "Drizzle", icon: "🌦️" },
            55: { label: "Heavy Drizzle", icon: "🌧️" },
            61: { label: "Light Rain", icon: "🌧️" },
            63: { label: "Rain", icon: "🌧️" },
            65: { label: "Heavy Rain", icon: "🌧️" },
            71: { label: "Light Snow", icon: "🌨️" },
            73: { label: "Snow", icon: "❄️" },
            75: { label: "Heavy Snow", icon: "❄️" },
            80: { label: "Showers", icon: "🌦️" },
            81: { label: "Moderate Showers", icon: "🌧️" },
            82: { label: "Heavy Showers", icon: "⛈️" },
            95: { label: "Thunderstorm", icon: "⛈️" },
            96: { label: "Thunderstorm + Hail", icon: "⛈️" },
            99: { label: "Severe Thunderstorm", icon: "⛈️" },
        };

        const weather = weatherMap[weatherCode] || { label: "Unknown", icon: "🌡️" };

        return NextResponse.json({
            temp: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            wind: Math.round(current.wind_speed_10m),
            label: weather.label,
            icon: weather.icon,
            location: "Jakarta Selatan",
        });
    } catch {
        return NextResponse.json(
            { temp: 28, humidity: 75, wind: 10, label: "Cloudy", icon: "☁️", location: "Jakarta Selatan" },
            { status: 200 }
        );
    }
}
