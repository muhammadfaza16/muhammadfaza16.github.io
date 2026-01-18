export type ThreadCategory = 'INTRO' | 'DEEP' | 'COMFORT';

export interface NarrativeThread {
    id: string;
    category: ThreadCategory;
    lines: string[];
}

export const BRIDGE_LINES = [
    "Eh, balik lagi.",
    "Tadi sampe mana ya...",
    "Kirain aku ditinggal.",
    "Lanjut yang tadi ya...",
    "Oh, hai lagi.",
    "Masih di sini kan?",
    "Yuk, sambung lagi.",
    "Jangan ilang-ilang dong.",
    "Sip, kita lanjut.",
    "Welcome back."
];

export const NARRATIVE_THREADS: NarrativeThread[] = [
    // === INTRO (Welcome / Check-in) ===
    {
        id: 'intro-1',
        category: 'INTRO',
        lines: [
            "Hai, baru sampe ya?",
            "Aku pilihin lagu buat nemenin kamu hari ini.",
            "Rileks dulu, nggak usah buru-buru.",
            "Anggap aja ini ruang tamu kita."
        ]
    },
    {
        id: 'intro-2',
        category: 'INTRO',
        lines: [
            "Halo.",
            "Semoga hari ini baik sama kamu.",
            "Kalau nggak pun, di sini aman kok.",
            "Cuma ada musik sama kit... eh, sama aku."
        ]
    },
    {
        id: 'intro-3',
        category: 'INTRO',
        lines: [
            "Selamat datang.",
            "Tarik napas panjang dulu.",
            "Buang pelan-pelan.",
            "Udah siap dengerin musik?"
        ]
    },
    {
        id: 'intro-4',
        category: 'INTRO',
        lines: [
            "Nyari tempat buat sembunyi bentar?",
            "Pas banget.",
            "Di sini dilarang bawa beban pikiran berat-berat.",
            "Santai aja."
        ]
    },
    {
        id: 'intro-5',
        category: 'INTRO',
        lines: [
            "Assalamualaikum dunia tipu-tipu... bercanda.",
            "Hai kamu yang real.",
            "Seneng liat kamu mampir.",
            "Enjoy the vibes."
        ]
    },

    // === DEEP (The Core Content - Universal & Timeless) ===
    // Theme: Self-Worth
    {
        id: 'deep-worth-1',
        category: 'DEEP',
        lines: [
            "Seringkali kita terlalu keras sama diri sendiri tanpa sadar.",
            "Padahal kalau liat ke belakang, kamu udah jalan jauh banget loh.",
            "Setiap luka, setiap capek, itu bukti kamu berjuang.",
            "Saya bangga. Serius."
        ]
    },
    {
        id: 'deep-worth-2',
        category: 'DEEP',
        lines: [
            "Kamu tau nggak?",
            "Kehadiran kamu itu ngaruh banget buat orang di sekitar.",
            "Mungkin kamu nggak sadar.",
            "Tapi ada orang yang senyum cuma karena liat kamu hari ini."
        ]
    },
    // Theme: Existence / Universe
    {
        id: 'deep-universe-1',
        category: 'DEEP',
        lines: [
            "Lucu ya kalau dipikir.",
            "Kita cuma kumpulan atom yang entah kenapa bisa ngerasain rindu.",
            "Dari miliaran kemungkinan, saat ini kita ada di frekuensi lagu yang sama.",
            "Semesta luas banget, tapi 'sekarang' ini rasanya cukup."
        ]
    },
    {
        id: 'deep-universe-2',
        category: 'DEEP',
        lines: [
            "Langit itu saksi bisu.",
            "Dia liat semua sejarah, semua cerita.",
            "Termasuk cerita kamu.",
            "Dan menurutku, cerita kamu salah satu yang menarik buat dia."
        ]
    },
    // Theme: Time & Pace
    {
        id: 'deep-time-1',
        category: 'DEEP',
        lines: [
            "Kadang bingung ya, dunia geraknya cepet banget.",
            "Orang-orang lari ngejar sesuatu.",
            "Tapi kamu pilih buat diem di sini sebentar.",
            "Dan itu keputusan yang bener.",
            "Napas itu perlu bukan cuma buat hidup, tapi buat ngerasa hidup."
        ]
    },
    {
        id: 'deep-time-2',
        category: 'DEEP',
        lines: [
            "Nggak ada yang ngejar kamu kok.",
            "Timeline hidup orang beda-beda.",
            "Kamu nggak telat.",
            "Kamu nggak kecepetan.",
            "Kamu tepat di waktu kamu sendiri."
        ]
    },
    // Theme: Emotions & Vulnerability
    {
        id: 'deep-emotion-1',
        category: 'DEEP',
        lines: [
            "Nangis itu bukan tanda lemah.",
            "Itu cara hati lagi hujan-hujanan biar nggak gersang.",
            "Jadi kalau mau sedih, sedih aja.",
            "Abis hujan biasanya langit lebih bersih."
        ]
    },
    {
        id: 'deep-emotion-2',
        category: 'DEEP',
        lines: [
            "Topeng kamu kuat banget ya?",
            "Seharian senyum, padahal capek.",
            "Di sini boleh dilepas kok.",
            "Aku nggak bakal judge.",
            "Janji."
        ]
    },
    // Theme: Connection
    {
        id: 'deep-connect-1',
        category: 'DEEP',
        lines: [
            "Musik itu bahasa yang aneh.",
            "Dia bisa ngomong apa yang mulut nggak bisa ucapin.",
            "Lirik lagu ini...",
            "Mewakili perasaan siapa hayo?"
        ]
    },
    // Theme: Resilience
    {
        id: 'deep-resilience-1',
        category: 'DEEP',
        lines: [
            "Inget hari itu? Yang kamu pikir kamu nggak bakal kuat?",
            "Liat sekarang.",
            "Kamu masih di sini.",
            "Masih dengerin lagu.",
            "Kamu jauh lebih kuat dari yang kamu kira."
        ]
    },
    {
        id: 'deep-resilience-2',
        category: 'DEEP',
        lines: [
            "Capek itu wajar.",
            "Berhenti sebentar itu strategi, bukan nyerah.",
            "Isi bensin dulu.",
            "Jalanan masih panjang, pemandangannya masih banyak yang bagus."
        ]
    },
    // Theme: Silence
    {
        id: 'deep-silence-1',
        category: 'DEEP',
        lines: [
            "Hening itu mahal.",
            "Di tengah kepala yang ribut, hening itu mewah.",
            "Nikmatin jeda ini.",
            "Biarin suaranya ngeresap."
        ]
    },
    // Theme: Dreams
    {
        id: 'deep-dream-1',
        category: 'DEEP',
        lines: [
            "Mimpi kamu apa?",
            "Jangan diketawain ya kalau orang bilang ketinggian.",
            "Langit aja nggak punya atap.",
            "Terbang aja terus."
        ]
    },
    {
        id: 'deep-future-1',
        category: 'DEEP',
        lines: [
            "Masa depan emang serem karena gelap.",
            "Tapi gelap bukan berarti ada monster.",
            "Bisa jadi ada bintang.",
            "Tungguin aja tanggal mainnya."
        ]
    },
    // Theme: Validation
    {
        id: 'deep-valid-1',
        category: 'DEEP',
        lines: [
            "Kamu cukup.",
            "Tanpa harus jadi 'lebih' ini atau 'lebih' itu.",
            "Versi kamu yang sekarang ini udah layak dicintai.",
            "Valid. No debat."
        ]
    },
    {
        id: 'deep-valid-2',
        category: 'DEEP',
        lines: [
            "Jangan bandingin 'behind the scene' kamu sama 'highlight reel' orang lain.",
            "Hidup mereka juga ada berantakannya.",
            "Fokus sama skrip kamu sendiri aja."
        ]
    },
    // Theme: Nostalgia
    {
        id: 'deep-nostalgia-1',
        category: 'DEEP',
        lines: [
            "Pernah nggak sih kangen masa kecil?",
            "Luka cuma di lutut, bukan di hati.",
            "Tapi luka hati bikin kita dewasa.",
            "Walau perih dikit (atau banyak)."
        ]
    },
    // Theme: Simple Joys
    {
        id: 'deep-joy-1',
        category: 'DEEP',
        lines: [
            "Bahagia itu kadang sederhana.",
            "Kopi enak, lagu pas, internet kenceng.",
            "Sama kamu yang lagi senyum tipis baca ini.",
            "Udah, itu aja."
        ]
    },
    // Theme: Letting Go
    {
        id: 'deep-letting-1',
        category: 'DEEP',
        lines: [
            "Lepasin.",
            "Kalau digenggam terus nanti tangan kamu luka.",
            "Ada hal-hal yang emang ditakdirkan cuma buat lewat.",
            "Bukan buat menetap."
        ]
    },
    // Theme: Courage
    {
        id: 'deep-courage-1',
        category: 'DEEP',
        lines: [
            "Berani itu bukan nggak takut.",
            "Berani itu gemeteran tapi tetep maju.",
            "Kayak kamu sekarang.",
            "Jalan terus walau nggak tau ujungnya di mana."
        ]
    },

    // === COMFORT (Low energy support) ===
    {
        id: 'comfort-1',
        category: 'COMFORT',
        lines: [
            "Aku di sini.",
            "Nggak kemana-mana.",
            "Lanjutin aja kerjanya (atau ngelamunnya)."
        ]
    },
    {
        id: 'comfort-2',
        category: 'COMFORT',
        lines: [
            "Enak ya lagunya.",
            "Bikin adem.",
            "Semoga hati kamu juga adem."
        ]
    },
    {
        id: 'comfort-3',
        category: 'COMFORT',
        lines: [
            "Fokus aja.",
            "Aku jagain mood-nya dari sini.",
            "Semangat."
        ]
    },
    {
        id: 'comfort-4',
        category: 'COMFORT',
        lines: [
            "Kalau capek, bilang (dalam hati).",
            "Nanti aku kirim sinyal istirahat.",
            "Lewat lagu berikutnya."
        ]
    },
    {
        id: 'comfort-5',
        category: 'COMFORT',
        lines: [
            "Dunia lagi berisik di luar sana.",
            "Di sini kita punya bubble sendiri.",
            "Bubble anti ribet."
        ]
    },
    {
        id: 'comfort-6',
        category: 'COMFORT',
        lines: [
            "Sst.",
            "Dengerin deh instrumennya.",
            "Detail banget ya?",
            "Kayak perhatian aku ke kamu... (eh)."
        ]
    },
    {
        id: 'comfort-7',
        category: 'COMFORT',
        lines: [
            "Udah minum air belum?",
            "Sepele tapi penting.",
            "Jangan sampe dehidrasi.",
            "Biar tetap glowing."
        ]
    },
    {
        id: 'comfort-8',
        category: 'COMFORT',
        lines: [
            "Gapapa, pelan-pelan.",
            "Progress kecil tetep progress.",
            "Siput aja nyampe garis finish kok."
        ]
    },
    {
        id: 'comfort-9',
        category: 'COMFORT',
        lines: [
            "Matanya lelah?",
            "Kedip-kedip dulu.",
            "Liat yang ijo-ijo.",
            "Atau liat lirik ini juga boleh."
        ]
    },
    {
        id: 'comfort-10',
        category: 'COMFORT',
        lines: [
            "You are doing great.",
            "Just wanted to say that.",
            "Keep going."
        ]
    }
];
