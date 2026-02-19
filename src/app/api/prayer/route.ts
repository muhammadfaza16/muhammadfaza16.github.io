import { NextResponse } from "next/server";

// Jakarta Selatan coordinates
const LAT = -6.2615;
const LON = 106.8106;

interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export async function GET() {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        const res = await fetch(
            `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${LAT}&longitude=${LON}&method=20`,
            { next: { revalidate: 3600 } } // cache 1 hour
        );
        if (!res.ok) throw new Error("Aladhan API failed");
        const data = await res.json();

        const timings: PrayerTimings = data.data.timings;

        // Extract the 5 main prayers + sunrise
        const prayers = [
            { name: "Subuh", nameAr: "الفجر", time: timings.Fajr },
            { name: "Sunrise", nameAr: "الشروق", time: timings.Sunrise },
            { name: "Dzuhur", nameAr: "الظهر", time: timings.Dhuhr },
            { name: "Ashar", nameAr: "العصر", time: timings.Asr },
            { name: "Maghrib", nameAr: "المغرب", time: timings.Maghrib },
            { name: "Isya", nameAr: "العشاء", time: timings.Isha },
        ].map(p => ({
            ...p,
            // Strip timezone info like " (WIB)" from time strings
            time: p.time.replace(/\s*\(.*\)/, ""),
        }));

        // Find next prayer
        const nowMinutes = today.getHours() * 60 + today.getMinutes();
        let nextPrayer = prayers[0]; // default to Fajr (next day)
        for (const p of prayers) {
            const [h, m] = p.time.split(":").map(Number);
            const prayerMinutes = h * 60 + m;
            if (prayerMinutes > nowMinutes) {
                nextPrayer = p;
                break;
            }
        }

        return NextResponse.json({
            prayers,
            next: nextPrayer,
            hijriDate: data.data.date?.hijri
                ? `${data.data.date.hijri.day} ${data.data.date.hijri.month?.en} ${data.data.date.hijri.year}`
                : null,
        });
    } catch {
        return NextResponse.json({
            prayers: [],
            next: null,
            hijriDate: null,
        });
    }
}
