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
    // Jan 14
    {
        year: 2005,
        month: 0,
        day: 14,
        title: "Pendaratan di Titan",
        description: "Bayangin, tahun segini kita berhasil mendaratin probe Huygens di Titan, bulannya Saturnus. Itu dunia yang mirip Bumi tapi isinya danau metana. Kayak fiksi ilmiah tapi beneran kejadian.",
        category: "Space"
    },
    {
        year: 1967,
        month: 0,
        day: 14,
        title: "The Human Be-In",
        description: "Awal mula Summer of Love di San Francisco. Hippies, aktivis, semuanya kumpul ngerayain kebebasan. Vibes-nya pasti seru banget, jaman di mana orang-orang mulai berani beda.",
        category: "History"
    },
    // Jan 15
    {
        year: 2001,
        month: 0,
        day: 15,
        title: "Lahirnya Wikipedia",
        description: "Wikipedia rilis hari ini. Sumpah, kalau gak ada mereka, skripsi kita semua bakal gimana nasibnya? Jendela pengetahuan dunia jadi kebuka lebar banget.",
        category: "Technology"
    },
    {
        year: 1929,
        month: 0,
        day: 15,
        title: "Martin Luther King Jr.",
        description: "Sang legenda lahir hari ini. Dia yang bikin mimpi soal kesetaraan jadi perjuangan nyata. Kata-katanya masih merinding kalau didenger sampe sekarang.",
        category: "History"
    },
    // Jan 16
    {
        year: 1969,
        month: 0,
        day: 16,
        title: "Docking di Angkasa",
        description: "Pertama kalinya dua pesawat berawak (Soyuz 4 & 5) parkir bareng di orbit dan tukeran kru. Kayak salaman di luar angkasa. Keren banget ga sih teknologi jaman dulu?",
        category: "Space"
    },
    // Jan 17
    {
        year: 1929,
        month: 0,
        day: 17,
        title: "Debut Popeye",
        description: "Popeye si Pelaut muncul pertama kali di komik strip. Gara-gara dia, anak-anak sedunia jadi mau makan bayam. Influencer kesehatan paling sukses pada masanya.",
        category: "Arts"
    },
    {
        year: 1773,
        month: 0,
        day: 17,
        title: "Captain Cook di Antartika",
        description: "Captain Cook jadi orang pertama yang nembus Lingkar Antartika. Bayangin dinginnya kayak apa, padahal belum ada teknologi thermal heat.",
        category: "History"
    },
    // Jan 18
    {
        year: 2012,
        month: 0,
        day: 18,
        title: "Wikipedia Blackout",
        description: "Wikipedia English mati suri 24 jam buat protes SOPA/PIPA. Hari di mana mahasiswa sedunia panik massal. Bukti kalau internet bersatu itu powerful banget.",
        category: "Technology"
    },
    {
        year: 1912,
        month: 0,
        day: 18,
        title: "Nyesek di Kutub Selatan",
        description: "Robert Falcon Scott akhirnya nyampe di Kutub Selatan, cuma buat nemuin kalau Roald Amundsen udah nyampe duluan sebulan lalu. Definition of 'sakit tapi tidak berdarah'.",
        category: "History"
    },
    {
        year: 1896,
        month: 0,
        day: 18,
        title: "Mesin X-Ray Dipamerin",
        description: "Mesin X-Ray pertama kali didemoin. Dulu orang takut dikira sihir atau ngerusak privasi, sekarang kalau jatoh dikit nyarinya ginian.",
        category: "Science"
    },
    // Jan 19
    {
        year: 2006,
        month: 0,
        day: 19,
        title: "New Horizons ke Pluto",
        description: "NASA ngeluncurin New Horizons. Perjalanan 9 tahun cuma buat say hi dan kirim foto hati di permukaan Pluto. LDR (Long Distance Rocket) paling worth it.",
        category: "Space"
    },
    {
        year: 1983,
        month: 0,
        day: 19,
        title: "Apple Lisa",
        description: "Apple ngerilis 'Lisa', komputer komersial pertama pake GUI & mouse. Harganya selangit dan gak laku, tapi dia nenek moyangnya Mac yang lo pake sekarang.",
        category: "Technology"
    },
    {
        year: 2008,
        month: 0,
        day: 19,
        title: "Breaking Bad Tayang",
        description: "Episode pertama Breaking Bad tayang. Walter White belum botak. Siapa sangka guru kimia awkward bisa jadi kingpin paling badass di TV series history?",
        category: "Arts"
    },
    // Jan 20
    {
        year: 1993,
        month: 0,
        day: 20,
        title: "RIP Audrey Hepburn",
        description: "Dunia kehilangan Audrey Hepburn. Bukan cuma icon fashion, tapi juga manusia berhati emas. Bukti kalau cantik itu soal attitude dan kebaikan, bukan cuma visual.",
        category: "Arts"
    },
    {
        year: 1892,
        month: 0,
        day: 20,
        title: "Basket Pertama",
        description: "Game basket resmi pertama dimainin di YMCA. Skor akhirnya? 1-0. Bayangin nonton basket tapi skornya kayak sepak bola tarkam, bosen gak tuh?",
        category: "History"
    },
    // Jan 21
    {
        year: 1976,
        month: 0,
        day: 21,
        title: "Concorde Terbang",
        description: "Concorde mulai penerbangan komersial. Pesawat supersonik yang bisa bikin London-New York cuma 3 jam. Sayang udah pensiun, padahal estetik banget bentuknya.",
        category: "Technology"
    },
    // Jan 22
    {
        year: 1984,
        month: 0,
        day: 22,
        title: "Iklan '1984' Apple",
        description: "Iklan legendaris Apple tayang pas Super Bowl. Ridley Scott yang bikin. Macintosh diperkenalkan sebagai pemberontak lawan tirani IBM. Marketing level dewa.",
        category: "Technology"
    },
    {
        year: 2008,
        month: 0,
        day: 22,
        title: "RIP Heath Ledger",
        description: "Kita kehilangan Heath Ledger. Joker terbaik sepanjang masa. Why so serious? Because we miss actual talent like him.",
        category: "Arts"
    },
    // Jan 23
    {
        year: 1957,
        month: 0,
        day: 23,
        title: "Frisbee Lahir",
        description: "Wham-O mulai produksi 'Pluto Platters' a.k.a Frisbee. Awalnya dari mainan piring kue, sekarang jadi olahraga. Kadang ide iseng emang bisa jadi duit.",
        category: "History"
    },
    // Jan 24
    {
        year: 1984,
        month: 0,
        day: 24,
        title: "Macintosh Rilis",
        description: "Steve Jobs ngenalin Macintosh 128K. 'Hello'. Komputer yang senyum pas dinyalain. Titik balik di mana komputer mulai jadi 'personal'.",
        category: "Technology"
    },
    // Jan 19 (Additional)
    {
        year: 2012,
        month: 0,
        day: 19,
        title: "Penutupan Megaupload",
        description: "FBI menutup Megaupload. Hari berkabung nasional buat kita yang suka download gratisan. Kim Dotcom drama banget waktu itu, tapi internet gak pernah sama lagi abis ini.",
        category: "Technology"
    },
    {
        year: 1809,
        month: 0,
        day: 19,
        title: "Edgar Allan Poe Lahir",
        description: "Master of horror & mystery lahir hari ini. Tanpa dia, mungkin gak ada Sherlock Holmes atau vibes gothic yang estetik. The OG emo king.",
        category: "Arts"
    },
    // Jan 20 (Additional)
    {
        year: 1982,
        month: 0,
        day: 20,
        title: "Ozzy vs Kelelawar",
        description: "Ozzy Osbourne ngegigit kepala kelelawar di panggung. Dikira mainan karet, taunya beneran. Moment paling absurd di sejarah rock n roll. Hygiene level: -100, Aura level: +1000.",
        category: "Arts"
    },
    // Jan 21
    {
        year: 1950,
        month: 0,
        day: 21,
        title: "RIP George Orwell",
        description: "Penulis '1984' meninggal. Dia yang ngingetin kita waspada sama 'Big Brother'. Ironisnya, sekarang kita sukarela ngasih data ke Big Tech. He warned us, bestie.",
        category: "Arts"
    },
    // Jan 22 (Additional)
    {
        year: 2006,
        month: 0,
        day: 22,
        title: "Kobe Cetak 81 Poin",
        description: "Kobe Bryant nyetak 81 poin lawan Raptors. Second highest in NBA history. Black Mamba mode on fire. Definisi 'carry the team' yang sebenernya.",
        category: "History"
    },
    // Jan 23 (Additional)
    {
        year: 1986,
        month: 0,
        day: 23,
        title: "Rock Hall of Fame Pertama",
        description: "Induksi pertama Rock & Roll Hall of Fame. Elvis, Chuck Berry, James Brown. Avengers-nya musik ngumpul. Kalo ada mesin waktu, pengen banget nonton ini.",
        category: "Arts"
    },
    // Jan 24 (Additional)
    {
        year: 1935,
        month: 0,
        day: 24,
        title: "Bir Kaleng Pertama",
        description: "Bir kaleng pertama kali dijual. Game changer buat pesta dan nongkrong. Bayangin kalo kita masih harus bawa gentong kayu kemana-mana. Repot.",
        category: "History"
    },
    // Jan 25 (Additional)
    {
        year: 1980,
        month: 0,
        day: 25,
        title: "Paul McCartney Deportasi",
        description: "Paul McCartney dideportasi dari Jepang gara-gara bawa 'oleh-oleh' ganja. 9 hari di penjara Tokyo. Bahkan Beatle pun gak kebal hukum. A wild start to the 80s.",
        category: "Arts"
    },
    {
        year: 2004,
        month: 0,
        day: 25,
        title: "Opportunity di Mars",
        description: "Rover Opportunity mendarat di Mars. Targetnya cuma 90 hari, eh dia survive 14 tahun. Robot paling tangguh dan setia di tata surya.",
        category: "Space"
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
