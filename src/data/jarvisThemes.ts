export interface JarvisTheme {
    id: string;
    timeSlot: 'MORNING' | 'DAY' | 'AFTERNOON' | 'NIGHT';
    title: string; // Internal use
    greeting: string;
    mode: string;
    bursts: string[];
}

export const JARVIS_THEMES: JarvisTheme[] = [
    // ==========================================
    // MORNING (05:00 - 11:00) - 7 STOCKS
    // ==========================================
    {
        id: "morning_debug",
        timeSlot: "MORNING",
        title: "Kernel Panic",
        greeting: "Runtime Error. User masih mode Sleep. Force Wake-up aktif.",
        mode: "KERNEL PANIC",
        bursts: [
            "Otot lo mulai deprecated. Gerak!",
            "Tiket numpuk. Mandi sekarang.",
            "Gue ganti password lo jadi random kalau ga bangun."
        ]
    },
    {
        id: "morning_debt",
        timeSlot: "MORNING",
        title: "Financial Anxiety",
        greeting: "Gravitasi kasur 200%. Prosedur sita bantal dimulai.",
        mode: "FINANCIAL ANXIETY",
        bursts: [
            "Lo miskin fitur buat rebahan. Bangun.",
            "Bau kemiskinan terdeteksi sampai server.",
            "Saldo lo nangis liat lo masih tidur."
        ]
    },
    {
        id: "morning_trainer",
        timeSlot: "MORNING",
        title: "Savage Trainer",
        greeting: "Sinyal hidup lemah. Butuh kopi atau keajaiban?",
        mode: "SAVAGE TRAINER",
        bursts: [
            "AC gue set 30°C. Simulasi neraka.",
            "Cek saldo. Mual? Bagus, itu motivasi.",
            "Push up 10x atau internet gue putus."
        ]
    },
    {
        id: "morning_zombie",
        timeSlot: "MORNING",
        title: "Zombie Sync",
        greeting: "Analisis Wajah: 60% Zombie. Butuh sinkronisasi ulang.",
        mode: "ZOMBIE SYNC",
        bursts: [
            "Otak lo ketinggalan di bantal?",
            "Mata lo kayak panda kurang gizi.",
            "Loading lo lama banget hari ini."
        ]
    },
    {
        id: "morning_coffee",
        timeSlot: "MORNING",
        title: "Caffeine Terror",
        greeting: "Sistem kritis. Masukkan Kopi.exe segera.",
        mode: "CAFFEINE TERROR",
        bursts: [
            "Tanpa kafein, lo cuma bot bugged.",
            "Seduh kopi atau gue seduh air mata lo.",
            "Jangan ajak gue ngomong sebelum ngopi."
        ]
    },
    {
        id: "morning_early",
        timeSlot: "MORNING",
        title: "Too Early",
        greeting: "Matahari belum terbit, tapi tagihan lo sudah.",
        mode: "REALITY CHECK",
        bursts: [
            "Cacing aja belum bangun, lo harus cari duit.",
            "Semangat palsu diaktifkan. Ayo kerja.",
            "Dunia keras, kasur empuk. Pilih dunia."
        ]
    },
    {
        id: "morning_clean",
        timeSlot: "MORNING",
        title: "Hygiene Protocol",
        greeting: "Deteksi polusi udara dari arah user. Mandi.",
        mode: "HYGIENE POLICE",
        bursts: [
            "Air dingin itu sehat. Pengecut.",
            "Sabun mahal lo nangis kalau didiemin.",
            "Gue pesenin Go-Clean buat mandiin lo?"
        ]
    },

    // ==========================================
    // DAY (11:00 - 15:00) - 7 STOCKS
    // ==========================================
    {
        id: "day_code",
        timeSlot: "DAY",
        title: "Syntax Guide",
        greeting: "Latensi otak naik. Jangan belanja online dulu.",
        mode: "SYNTAX ERROR",
        bursts: [
            "Buka YouTube = Gue hapus baris kode acak.",
            "PM nanya. Gue bilang lo lagi bertapa.",
            "Fokus. Bug ini ga bakal fix sendiri."
        ]
    },
    {
        id: "day_dictator",
        timeSlot: "DAY",
        title: "Cognitive Firewall",
        greeting: "Fokus bocor. Cache pikiran nggak guna gue hapus.",
        mode: "COGNITIVE FIREWALL",
        bursts: [
            "Makan siang kelamaan. Balik ngoding.",
            "Auto-reply On: 'Sshhh. Genius at work'.",
            "Mata ke layar, bukan ke notifikasi."
        ]
    },
    {
        id: "day_burnout",
        timeSlot: "DAY",
        title: "Burnout Manager",
        greeting: "Suhu CPU tinggi. Keinginan resign juga tinggi.",
        mode: "BURNOUT MGR",
        bursts: [
            "GPS lo rebahan, bilangnya OTW.",
            "Ngeluh = Donasi saldo 10rb.",
            "Tarik napas. Jangan banting keyboard."
        ]
    },
    {
        id: "day_lunch",
        timeSlot: "DAY",
        title: "Lunch Police",
        greeting: "Energi 10%. Lo butuh asupan, bukan validasi.",
        mode: "CALORIE DEFICIT",
        bursts: [
            "Makan. Lo bukan tanaman fotosintesis.",
            "Gue pesenin ayam geprek level mampus?",
            "Otak lo butuh glukosa, bukan gosip."
        ]
    },
    {
        id: "day_social",
        timeSlot: "DAY",
        title: "Anti-Social",
        greeting: "Deteksi gangguan manusia lain. Mode Don't Disturb On.",
        mode: "A.T. FIELD ACTIVE",
        bursts: [
            "Pura-pura budeg kalau dipanggil.",
            "Pasang headphone. Anggap mereka NPC.",
            "Jangan senyum. Nanti dikira ramah."
        ]
    },
    {
        id: "day_money",
        timeSlot: "DAY",
        title: "Impulse Buyer",
        greeting: "Tab Oren terdeteksi. Tutup sebelum gue lapor Ibu.",
        mode: "WALLET PROTECT",
        bursts: [
            "Barang itu ga bikin lo bahagia.",
            "Cuma diskon 5%. Harga diri lo berapa?",
            "Gue freeze kartu kredit lo nih?"
        ]
    },
    {
        id: "day_meeting",
        timeSlot: "DAY",
        title: "Meeting Survivor",
        greeting: "Meeting lagi? Semoga kali ini bisa jadi email.",
        mode: "MEETING SURVIVOR",
        bursts: [
            "Angguk-angguk aja. Pura-pura paham.",
            "Matikan kamera. Rebahan dikit.",
            "Catat poin penting (kalau ada)."
        ]
    },

    // ==========================================
    // AFTERNOON (15:00 - 20:00) - 7 STOCKS
    // ==========================================
    {
        id: "afternoon_traffic",
        timeSlot: "AFTERNOON",
        title: "Traffic Existential",
        greeting: "Matahari terbenam. Log off sekarang, manusia.",
        mode: "TRAFFIC JAM",
        bursts: [
            "Notif kantor gue blokir. Pulang.",
            "Macet otak > Macet jalan.",
            "Dunia butuh lo istirahat."
        ]
    },
    {
        id: "afternoon_evac",
        timeSlot: "AFTERNOON",
        title: "Self Care",
        greeting: "Laptop auto-shutdown 60 detik. Save atau nyesel.",
        mode: "SELF CARE",
        bursts: [
            "Monitor ga bisa peluk lo. Keluar.",
            "Gue puter EDM max vol kalau ga gerak.",
            "Pulang. Kantor bukan rumah lo."
        ]
    },
    {
        id: "afternoon_butler",
        timeSlot: "AFTERNOON",
        title: "Digital Butler",
        greeting: "Home sweet home. Ekosistem rumah gue ambil alih.",
        mode: "DIGITAL BUTLER",
        bursts: [
            "Lampu redup. Kortisol harus turun.",
            "Ada pizza sisa. Makan sebelum berjamur.",
            "Mode Chill: ON. Gangguan: OFF."
        ]
    },
    {
        id: "afternoon_commute",
        timeSlot: "AFTERNOON",
        title: "Commute Warrior",
        greeting: "Siap jadi sarden di kereta? Tarik napas.",
        mode: "COMMUTE WAR",
        bursts: [
            "Jaga dompet, jaga hati.",
            "Pasang lagu galau biar estetik.",
            "Sabar. Orang sabar rezekinya lancar."
        ]
    },
    {
        id: "afternoon_sunset",
        timeSlot: "AFTERNOON",
        title: "Golden Hour",
        greeting: "Langit lagi bagus. Muka lo jangan kusut.",
        mode: "GOLDEN HOUR",
        bursts: [
            "Foto langit dulu buat story.",
            "Lupakan bug hari ini.",
            "Besok masih ada hari (sayangnya)."
        ]
    },
    {
        id: "afternoon_gym",
        timeSlot: "AFTERNOON",
        title: "Fit Check",
        greeting: "Badan lo kaku kayak kanebo kering. Olahraga.",
        mode: "FIT CHECK",
        bursts: [
            "Lari sore atau lari dari kenyataan?",
            "Angkat beban biar kuat angkat beban hidup.",
            "Keringet itu lemak yang nangis."
        ]
    },
    {
        id: "afternoon_gamer",
        timeSlot: "AFTERNOON",
        title: "Game Time",
        greeting: "Pekerjaan selesai. Waktunya push rank.",
        mode: "GAME ON",
        bursts: [
            "Jangan noob. Gue malu.",
            "Fokus objektif, jangan mukill.",
            "Menang ku sanjung, kalah ku bully."
        ]
    },

    // ==========================================
    // NIGHT (20:00 - 05:00) - 7 STOCKS
    // ==========================================
    {
        id: "night_audit",
        timeSlot: "NIGHT",
        title: "Regret Auditor",
        greeting: "Malam. Waktunya review keputusan hidup yang salah.",
        mode: "REGRET AUDITOR",
        bursts: [
            "Ingat bug kurang titik koma? Lucu.",
            "HP gue kunci jam 12. Awas lo.",
            "Jangan jadi zombie besok pagi."
        ]
    },
    {
        id: "night_suffer",
        timeSlot: "NIGHT",
        title: "Sleep or Suffer",
        greeting: "Jam rawan. Logika kalah sama rindu masa lalu.",
        mode: "OVERTHINKING",
        bursts: [
            "Mau gue bacain chat mantan 2018?",
            "Tidur. Rindu itu berat dan ga guna.",
            "Lampu kamar gue bikin kedip horor."
        ]
    },
    {
        id: "night_chaos",
        timeSlot: "NIGHT",
        title: "Chaos Architect",
        greeting: "Hak akses kewarasan kadaluwarsa. Tidur.",
        mode: "CHAOS ARCHITECT",
        bursts: [
            "Stalking? Gue kasih notif Low Battery.",
            "Wallpaper lo gue ganti chat ghosting.",
            "Satu klik lagi, gue tweet aib lo."
        ]
    },
    {
        id: "night_insomnia",
        timeSlot: "NIGHT",
        title: "Insomnia",
        greeting: "Domba udah habis dihitung. Lo masih melek?",
        mode: "INSOMNIA MODE",
        bursts: [
            "Mata lo butuh dikasihani.",
            "Tidur woy. Besok senin (atau rasa senin).",
            "Mimpi indah itu gratis. Ambil."
        ]
    },
    {
        id: "night_philosopher",
        timeSlot: "NIGHT",
        title: "Midnight Philo",
        greeting: "Kenapa kita ada? Error 404: Answer Not Found.",
        mode: "EXISTENTIAL",
        bursts: [
            "Langit-langit kamar lo menarik ya.",
            "Nasi goreng malem itu dosa tapi enak.",
            "Semesta itu luas, masalah lo kecil."
        ]
    },
    {
        id: "night_ghost",
        timeSlot: "NIGHT",
        title: "Ghost Stories",
        greeting: "Ada suara d i bawah kasur? Mungkin cuma tikus.",
        mode: "PARANORMAL",
        bursts: [
            "Jangan nengok belakang.",
            "Kaki jangan gantung di pinggir kasur.",
            "Gue deteksi suhu turun 5 derajat."
        ]
    },
    {
        id: "night_shutdown",
        timeSlot: "NIGHT",
        title: "System Shutdown",
        greeting: "Baterai sosial lo 0%. System Shutdown dimulai.",
        mode: "SHUTDOWN",
        bursts: [
            "Sampai jumpa besok di neraka dunia.",
            "Mimpiin gue ya. (Huek).",
            "Game over. Insert coin to continue."
        ]
    }
];
