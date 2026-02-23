import { NextResponse } from "next/server";

// Jakarta Selatan coordinates
const LAT = -6.2615;
const LON = 106.8106;

export async function GET() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability,uv_index&timezone=Asia/Jakarta`;
        const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
        if (!res.ok) throw new Error("Weather API failed");
        const data = await res.json();

        const current = data.current;
        const weatherCode = current.weather_code;

        // Map WMO weather codes to readable descriptions
        const weatherMap: Record<number, { label: string; icon: string }> = {
            0: { label: "Clear Sky", icon: "☀️" },
            1: { label: "Mostly Clear", icon: "🌤️" },
            2: { label: "Partly Cloudy", icon: "⛅" },
            3: { label: "Gloomy", icon: "☁️" },
            45: { label: "Misty", icon: "🌫️" },
            48: { label: "Frosty Fog", icon: "🌫️" },
            51: { label: "Misty Rain", icon: "🌦️" },
            53: { label: "Gentle Rain", icon: "🌦️" },
            55: { label: "Heavy Drizzle", icon: "🌧️" },
            61: { label: "Light Rain", icon: "🌧️" },
            63: { label: "Pouring", icon: "🌧️" },
            65: { label: "Heavy Rain", icon: "🌧️" },
            71: { label: "Light Snow", icon: "🌨️" },
            73: { label: "Snowing", icon: "❄️" },
            75: { label: "Heavy Snow", icon: "❄️" },
            80: { label: "Passing Showers", icon: "🌦️" },
            81: { label: "Rain Showers", icon: "🌧️" },
            82: { label: "Heavy Showers", icon: "⛈️" },
            95: { label: "Thunderstorm", icon: "⛈️" },
            96: { label: "Thunder & Hail", icon: "⛈️" },
            99: { label: "Severe Storm", icon: "⛈️" },
        };

        const weather = weatherMap[weatherCode] || { label: "Unknown", icon: "🌡️" };

        return NextResponse.json({
            temp: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.apparent_temperature),
            humidity: current.relative_humidity_2m,
            wind: Math.round(current.wind_speed_10m),
            precip: current.precipitation_probability || 0,
            uv: current.uv_index || 0,
            label: weather.label,
            icon: weather.icon,
            location: "Jakarta Selatan, ID", // Updated location precision per request
        });
    } catch {
        return NextResponse.json(
            { temp: 28, feelsLike: 30, humidity: 75, wind: 10, precip: 0, uv: 5, label: "Gloomy", icon: "☁️", location: "Jakarta Selatan, ID" },
            { status: 200 }
        );
    }
}
