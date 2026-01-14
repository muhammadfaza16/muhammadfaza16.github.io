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
        title: "Pendaratan Huygens di Titan",
        description: "Probe Huygens milik ESA berhasil mendarat di bulan Saturnus, Titan, menjadi wahana antariksa pertama yang mendarat di dunia luar tata surya. Misi ini mengungkap dunia yang mirip Bumi namun asing, dengan danau metana dan medan es.",
        category: "Space"
    },
    {
        year: 1967,
        month: 0, // January
        day: 14,
        title: "The Human Be-In",
        description: "'Human Be-In' digelar di Golden Gate Park, San Francisco, menjadi awal dari Summer of Love. Ini adalah momen kunci bagi gerakan kontra-kultur, menyatukan hippie, aktivis, dan intelektual untuk merayakan kebebasan pribadi.",
        category: "History"
    },
    {
        year: 1954,
        month: 0, // January
        day: 14,
        title: "Pernikahan Marilyn Monroe",
        description: "Marilyn Monroe menikah dengan legenda baseball Joe DiMaggio di Balai Kota San Francisco. Pernikahan dua ikon budaya pop Amerika ini menjadi berita utama di seluruh dunia, menyatukan dunia hiburan dan olahraga.",
        category: "Arts"
    },
    {
        year: 1875,
        month: 0, // January
        day: 14,
        title: "Albert Schweitzer Lahir",
        description: "Albert Schweitzer, teolog, musisi, filsuf, dan dokter peraih Nobel Perdamaian, lahir. Ia dikenal karena konsep 'Penghormatan terhadap Kehidupan' dan pengabdian kemanusiaannya di Afrika.",
        category: "History"
    },
    {
        year: 2001,
        month: 0, // January
        day: 15,
        title: "Peluncuran Wikipedia",
        description: "Jimmy Wales dan Larry Sanger meluncurkan Wikipedia, ensiklopedia bebas dengan konten terbuka. Ini secara radikal mendemokratisasi akses dan produksi pengetahuan.",
        category: "Technology"
    },
    {
        year: 1929,
        month: 0, // January
        day: 15,
        title: "Kelahiran Martin Luther King Jr.",
        description: "Martin Luther King Jr. lahir di Atlanta. Aktivisme damai dan kepemimpinannya yang visioner dalam Gerakan Hak Sipil mengubah wajah Amerika, menantang ketidakadilan rasial dengan kekuatan kata-kata dan aksi tanpa kekerasan.",
        category: "History"
    },
    {
        year: 1969,
        month: 0, // January
        day: 16,
        title: "Dokking Soyuz 4 dan 5",
        description: "Wahana antariksa Soviet Soyuz 4 dan Soyuz 5 melakukan penyambungan (docking) pertama antara dua pesawat berawak di orbit, serta transfer kru antar kendaraan.",
        category: "Space"
    },
    {
        year: 27,
        month: 0, // January
        day: 16,
        title: "Gelar 'Augustus'",
        description: "Senat Romawi memberikan gelar 'Augustus' (Yang Mulia) kepada Octavianus, menandai dimulainya Kekaisaran Romawi. Transisi dari Republik ke Kekaisaran ini mengakhiri satu abad perang saudara dan memulai era Pax Romana.",
        category: "History"
    }
];

export const fallbackEvent: HistoricEvent[] = [{
    year: 1969,
    month: 6,
    day: 20,
    title: "Satu Langkah Kecil",
    description: "Apollo 11 mendarat di Bulan. Neil Armstrong dan Buzz Aldrin menjadi manusia pertama yang menjejakkan kaki di permukaan bulan, sebuah pencapaian monumental dalam rekayasa dan eksplorasi manusia yang mendefinisikan ulang batas kemungkinan.",
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
