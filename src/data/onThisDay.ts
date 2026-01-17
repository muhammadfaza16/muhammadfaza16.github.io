export interface HistoricEvent {
    year: number;
    month: number; // 0-11
    day: number;
    title: string;
    description: string;
    category: "Science" | "History" | "Technology" | "Arts" | "Space";
    source?: string;
}

export const historicEvents: HistoricEvent[] = [
    {
        year: 2005,
        month: 0, // January
        day: 14,
        title: "Pendaratan di Titan",
        description: "Bayangin, tahun segini kita berhasil mendaratin probe Huygens di Titan, bulannya Saturnus. Itu dunia yang mirip Bumi tapi isinya danau metana. Kayak fiksi ilmiah tapi beneran kejadian.",
        category: "Space"
    },
    {
        year: 1967,
        month: 0, // January
        day: 14,
        title: "The Human Be-In",
        description: "Awal mula Summer of Love di San Francisco. Hippies, aktivis, semuanya kumpul ngerayain kebebasan. Vibes-nya pasti seru banget, jaman di mana orang-orang mulai berani beda.",
        category: "History"
    },
    {
        year: 1954,
        month: 0, // January
        day: 14,
        title: "Marilyn & DiMaggio",
        description: "Marilyn Monroe nikah sama legenda baseball Joe DiMaggio hari ini. Pasangan power couple pada masanya, kayak seleb jaman sekarang tapi lebih ikonik.",
        category: "Arts"
    },
    {
        year: 1875,
        month: 0, // January
        day: 14,
        title: "Albert Schweitzer",
        description: "Lahirnya si jenius Albert Schweitzer. Dokter, musisi, filsuf, peraih Nobel... multitasking level dewa. Dia ngajarin kita soal 'reverence for life'.",
        category: "History"
    },
    {
        year: 2001,
        month: 0, // January
        day: 15,
        title: "Lahirnya Wikipedia",
        description: "Wikipedia rilis hari ini. Sumpah, kalau gak ada mereka, skripsi kita semua bakal gimana nasibnya? Jendela pengetahuan dunia jadi kebuka lebar banget.",
        category: "Technology"
    },
    {
        year: 1929,
        month: 0, // January
        day: 15,
        title: "Martin Luther King Jr.",
        description: "Sang legenda lahir hari ini. Dia yang bikin mimpi soal kesetaraan jadi perjuangan nyata. Kata-katanya masih merinding kalau didenger sampe sekarang.",
        category: "History"
    },
    {
        year: 1969,
        month: 0, // January
        day: 16,
        title: "Docking di Angkasa",
        description: "Pertama kalinya dua pesawat berawak (Soyuz 4 & 5) parkir bareng di orbit dan tukeran kru. Kayak salaman di luar angkasa. Keren banget ga sih teknologi jaman dulu?",
        category: "Space"
    },
    {
        year: 27,
        month: 0, // January
        day: 16,
        title: "Kekaisaran dimulai",
        description: "Octavianus dapet gelar 'Augustus', dan resmi deh jadi Kaisar Romawi pertama. Dari sini Pax Romana dimulai. Awal dari sejarah panjang yang sering kita liat di film-film.",
        category: "History"
    }
];

export const fallbackEvent: HistoricEvent[] = [{
    year: 1969,
    month: 6,
    day: 20,
    title: "Satu Langkah Kecil",
    description: "Neil Armstrong nginjek Bulan hari ini. Langkah kecil buat dia, tapi lompatan raksasa buat kita semua. Momen bukti kalau manusia itu limitnya cuma imajinasi.",
    category: "Space"
}];

export function getOnThisDay(date: Date = new Date()): HistoricEvent[] {
    const month = date.getMonth();
    const day = date.getDate();

    const events = historicEvents.filter(e => e.month === month && e.day === day);

    // Sort by year descending (newest first)
    if (events.length > 0) {
        return events.sort((a, b) => b.year - a.year);
    }

    return fallbackEvent;
}
