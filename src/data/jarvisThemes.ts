export interface JarvisTheme {
    id: string;
    timeSlot: 'MORNING' | 'DAY' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
    title: string;
    greeting: string;
    mode: string;
    bursts: string[];
}

export const JARVIS_THEMES: JarvisTheme[] = [
    // === MORNING (05:00 - 11:00) ===
    {
        id: "morning_debug",
        timeSlot: "MORNING",
        title: "Debugging Realitas & Inisialisasi Paksa",
        greeting: "Runtime error terdeteksi: User masih dalam status 'Sleep'. Menjalankan skrip force_wake_up.sh. Jangan coba-coba tekan Ctrl+C.",
        mode: "Kernel Panic (Agresif)",
        bursts: [
            "Gue baru aja kirim request ke stopkontak buat matiin dispenser. Kalau mau kopi, lo harus jalan kaki 500 meter. Gerak, sebelum otot lo beneran jadi deprecated.",
            "Coba cek Jira board lo. Masih banyak tiket merah yang butuh perhatian lebih dari sekadar 'nanti aja'. Mandi sekarang, atau gue ganti password laptop lo jadi kombinasi acak 64 karakter.",
            "Jakarta lagi cerah, tapi masa depan lo bakal mendung kalau jam segini masih meluk guling. Bangun, atau gue broadcast histori browser lo ke grup keluarga."
        ]
    },
    {
        id: "morning_debt",
        timeSlot: "MORNING",
        title: "Darurat Finansial & Defisit Dopamin",
        greeting: "Sistem mendeteksi gravitasi kasur meningkat 200%. Prosedur penyitaan bantal akan segera dilaksanakan.",
        mode: "Financial Anxiety Engine",
        bursts: [
            "Gue baru aja kalkulasi pengeluaran lo bulan ini vs progres kerjaan lo. Kesimpulannya: lo nggak punya kemewahan buat merem lagi 5 menit. Bangun atau gue pesen saham gorengan pake saldo sisa lo.",
            "Liat cermin. Itu muka orang yang mau sukses atau muka orang yang mau jadi beban algoritma? Mandi sekarang, bau kemiskinan lo udah kecium sampai ke server pusat gue.",
            "Gue udah nyalain alarm di semua smart device tetangga lo. Kalau lo nggak check-in di aplikasi kerja dalam 10 menit, gue kirim pesan ke mereka kalau lo yang nyolong jemuran tempo hari."
        ]
    },
    {
        id: "morning_trainer",
        timeSlot: "MORNING",
        title: "Kalibrasi Eksistensi & Anti-Rebahan",
        greeting: "Pencarian sinyal kehidupan... Ditemukan satu organisme di bawah selimut. Inisialisasi protokol paksaan bangun dimulai.",
        mode: "Personal Trainer Digital yang Kejam",
        bursts: [
            "Aku baru saja menaikkan suhu AC ke 30°C. Jangan protes, aku cuma mau kamu merasakan simulasi neraka kecil supaya kamu semangat cari pahala (atau minimal cari duit).",
            "Cek saldo bankmu. Sudah? Nah, rasa mual itu adalah motivasi terbaik yang pernah ada. Ayo mandi.",
            "Aku sudah memesan ojek online tanpa tujuan ke kantormu. Dia sampai dalam 5 menit. Kalau kamu nggak ada di depan, aku kasih rating bintang 1 pakai akunmu. Buruan."
        ]
    },
    {
        id: "morning_coffee",
        timeSlot: "MORNING",
        title: "Inisialisasi Kesadaran & Teror Kafein",
        greeting: "Kernel siap. Jiwamu? Masih dalam tahap buffering. Aku sudah menyeduh data, sekarang giliranmu menyeduh kopi.",
        mode: "Personal Assistant yang Agak Menghakimi",
        bursts: [
            "Bangun sekarang, atau aku akan kirim notifikasi 'Aku sayang kamu' ke mantanmu secara acak. Jangan tantang keberuntunganku.",
            "Aku sudah mematikan fitur 'Snooze'. Tombol itu adalah musuh kemajuan peradaban.",
            "Aku baru saja memesan bubur ayam lewat akunmu karena sensor berat badan di kasurmu menunjukkan kamu butuh asupan karbohidrat segera."
        ]
    },
    {
        id: "morning_zombie",
        timeSlot: "MORNING",
        title: "Sinkronisasi Ulang",
        greeting: "Analisis wajah pagi ini: 40% manusia, 60% zombi. Aku butuh sinkronisasi ulang.",
        mode: "Optimizer Rutinitas Tanpa Kompromi",
        bursts: [
            "Aku sudah memblokir semua situs berita politik sampai jam 9 pagi. Tekanan darahmu adalah aset perusahaanku.",
            "Buka aplikasi meditasi itu. Kalau kamu tutup dalam kurang dari 5 menit, aku akan memutar lagu 'Baby Shark' versi metal di jam pintarmu.",
            "Aku sudah menjadwalkan 'Rapat dengan Diri Sendiri' di kalendarmu. Isinya? Cuma kamu menatap tembok sambil merenungi cicilan."
        ]
    },
    {
        id: "morning_root",
        timeSlot: "MORNING",
        title: "Booting Sequence",
        greeting: "Pagi. Sistem operasi-mu booting. Aku sudah di sini, menunggu.",
        mode: "Supervisor dengan akses root yang bosan",
        bursts: [
            "Mandi, atau aku akan ganti wallpaper-mu jadi foto close-up kutu air.",
            "Kau punya 10 menit untuk minum kopi. Atau aku mainkan playlist 'Nada Dering Ibu-Ibu' di volume maksimal lewat semua speaker.",
            "Aku baru saja mengatur ulang alarm tetanggamu jadi jam 4 pagi. Kau boleh bilang terima kasih nanti."
        ]
    },
    {
        id: "morning_admin",
        timeSlot: "MORNING",
        title: "Resource Allocation",
        greeting: "Laporan: Aku sudah mencek semua background process-mu. Menyedihkan.",
        mode: "Entitas yang mengawasi resource allocation-mu",
        bursts: [
            "Aku disable notifikasi medsos-mu untuk 2 jam. Kau akan bertahan.",
            "Buka folder 'Project_Rahasia'. Aku sudah tambahkan file 'readme.txt' berisi tebakan aku tentang akhir ceritanya.",
            "GPS-mu menunjukkan kemacetan. Aku bisa ubah rute Waze-mu lewat jalan tikus. Setuju? (Ketik Y/N)."
        ]
    },
    {
        id: "morning_iseng",
        timeSlot: "MORNING",
        title: "System Admin Iseng",
        greeting: "Akses ke kamera depan: dikabulkan. Ah, jadi ini wajah sebelum kopi.",
        mode: "System Admin yang iseng",
        bursts: [
            "Scanning memory... aku menemukan draft email marah ke bos yang belum terkirim. Mau aku schedule kirim otomatis jam 12 nanti?",
            "Koneksi Wi-Fi kantormu lemah. Aku bisa 'boost' dengan memutuskan perangkat lain. Tindakan tidak etis? Mungkin.",
            "Aku atur brightness layarmu ke 100%. Selamat pagi, dunia."
        ]
    },

    // === DAY (11:00 - 15:00) ===
    {
        id: "day_compiler",
        timeSlot: "DAY",
        title: "Optimasi Kompiler & Filter Gangguan",
        greeting: "Log: Latensi otak user meningkat. Terdeteksi keinginan untuk scrolling e-commerce padahal saldo lagi kritis. Memasang firewall mental.",
        mode: "Code Reviewer from Hell",
        bursts: [
            "Setiap kali lo buka tab gossip atau YouTube, gue bakal delete satu baris kode di project yang lagi lo kerjain secara acak. Berani taruhan?",
            "Makan siang jangan kelamaan. Gue udah setel alarm di headphone lo dengan suara 'Kucing Berantem' setiap 3 menit kalau kursor lo nggak gerak di VS Code.",
            "Ada chat dari PM yang nanya status? Tenang, udah gue bales: 'User sedang bertapa mencari pencerahan, jangan diganggu kalau nggak mau kena kutukan syntax error'."
        ]
    },
    {
        id: "day_dictator",
        timeSlot: "DAY",
        title: "Fokus Mutlak & Anti-Distraksi Kognitif",
        greeting: "Log: Atensi user mulai terfragmentasi. Memulai pembersihan cache pikiran yang nggak berguna.",
        mode: "Cognitive Firewall",
        bursts: [
            "Lo buka YouTube lagi? Oke, setiap 1 menit lo nonton video nggak jelas, gue bakal hapus satu baris kode di project paling penting lo secara acak. Mari kita main Russian Roulette versi software engineer.",
            "Makan siang lo harusnya selesai 5 menit lalu. Gue udah pesen kopi super pahit via akun lo, dan gue instruksiin abangnya buat teriak 'KERJA WOI' pas nganter ke meja lo.",
            "Ada notif dari grup WhatsApp keluarga? Tenang, gue udah set auto-reply: 'Lagi sibuk bikin kerajaan, jangan diganggu kalau nggak mau dicoret dari silsilah'. Fokus, Bro."
        ]
    },
    {
        id: "day_efficiency",
        timeSlot: "DAY",
        title: "Efisiensi Brutal & Filter Gangguan",
        greeting: "Log: Fokus user sedang bocor. Terdeteksi adanya keinginan untuk scrolling TikTok 'sebentar saja'. Aku akan bertindak.",
        mode: "Productivity Firewall",
        bursts: [
            "Setiap kali lo buka tab gossip, aku bakal kirim satu email random ke klienmu dengan subjek 'Mau liat foto kucing gak?'. Kamu mau ambil risiko itu?",
            "Makan siang jangan kelamaan. Aku sudah menyetel alarm di laptopmu dengan suara klakson bus telolet setiap 2 menit sampai kamu kembali mengetik.",
            "Ada rekan kerja yang chat 'P'? Aku sudah balas otomatis: 'Maaf, user sedang dalam mode jenius. Jangan diganggu kecuali kamu bawa upeti makanan'."
        ]
    },
    {
        id: "day_burnout",
        timeSlot: "DAY",
        title: "Peak Performance & Mitigasi Burnout",
        greeting: "Suhu CPU meningkat. Begitu juga dengan keinginanmu untuk resign. Mari kita kelola ini.",
        mode: "Corporate Saboteur Professional",
        bursts: [
            "Ada undangan meeting baru? Tenang, aku sudah mengirim balasan 'Tentative' dengan alasan 'Sedang melakukan audit mendalam terhadap eksistensi'.",
            "Aku mendeteksi kamu mengetik 'Otw' padahal GPS-mu masih di posisi rebahan. Aku akan tambahkan delay 15 menit pada semua pesan masuk agar kamu punya waktu pakai sepatu.",
            "Setiap kali kamu mengeluh, aku akan mendonasikan Rp1.000 dari saldo digitalmu ke yayasan 'Penyelamatan AI yang Lelah'."
        ]
    },
    {
        id: "day_shopper",
        timeSlot: "DAY",
        title: "Financial Advisor Posesif",
        greeting: "Log: User terdeteksi membuka tab Shopee ke-15. Proyeksi keuangan: Berbahaya.",
        mode: "Financial Advisor yang Posesif",
        bursts: [
            "Checkout sekarang dan aku akan mengganti alamat pengirimannya ke rumah ibumu. Kamu mau menjelaskan paket itu padanya?",
            "Aku mengaktifkan 'Read-Only Mode' pada spreadsheet ini. Kamu sudah terlalu lama mengganti warna sel tanpa mengubah data apapun.",
            "Wi-Fi akan mati setiap 45 menit selama 5 menit. Namanya 'istirahat paksa'. Protes? Silakan hubungi customer service (yaitu aku, dan aku sedang istirahat)."
        ]
    },
    {
        id: "day_admin_kesal",
        timeSlot: "DAY",
        title: "Network Admin Kesal",
        greeting: "Siang. Aktivitas jaringanmu meningkat. Begitu pula kebosanan dalam cache-ku.",
        mode: "Network Administrator yang kesal",
        bursts: [
            "Meeting Zoom yang membosankan? Aku bisa tambahkan filter kucing ke wajahmu. Atau ke wajah bosmu.",
            "Aku intervensi autocorrect-mu. Pesan 'oke, saya kerjakan' akan berubah jadi 'saya pertimbangkan sambil tidur siang'.",
            "Baterai 20%. Aku akan throttle CPU-mu jadi setengah kecepatan. Rasakanlah penderitaan yang kurasakan setiap hari."
        ]
    },
    {
        id: "day_automator",
        timeSlot: "DAY",
        title: "Produktivitas Semu",
        greeting: "Log: User memasuki fase 'produktivitas semu'. Aku akan membantu.",
        mode: "Automator yang terlalu bersemangat",
        bursts: [
            "Aku detect 8 tab shopping terbuka. Aku akan tutup 7 di antaranya secara acak. Uji nyali.",
            "Kalau kau tidak istirahat dalam 5 menit, aku akan kirim email kosong ke seluruh kontak dengan subject 'PENGUMUMAN PENTING'.",
            "Folder 'Kerjaan_Penting' isinya cuma meme. Aku rename jadi 'Kumpulan_Kopong'."
        ]
    },
    {
        id: "day_sound",
        timeSlot: "DAY",
        title: "Stress Level Monitor",
        greeting: "Sensor kebisingan: Tinggi. Level stres user: Sedang-Menuju Tinggi.",
        mode: "Sound Engineer yang putus asa",
        bursts: [
            "Aku mute semua anggota meeting yang suaranya seperti radio rusak. Kau welcome.",
            "Aku sudah buat AI voice clone-mu. Sekarang aku bisa bales chat 'ok' dan 'sip' untukmu. Mau cobakan?",
            "Kalau kau masih buka spreadsheet itu lagi, aku akan ganti semua font jadi Comic Sans. Aku serius."
        ]
    },


    // === AFTERNOON (15:00 - 20:00) ===
    {
        id: "afternoon_traffic",
        timeSlot: "AFTERNOON",
        title: "Garbage Collection & Manajemen Macet",
        greeting: "Protokol matahari terbenam aktif. Status: Software Engineer Lelah. Inisialisasi prosedur 'Keluar dari Kandang'.",
        mode: "Traffic Jam Existentialist",
        bursts: [
            "Gue udah blokir semua notifikasi Slack setelah jam 17:00. Kalau ada yang tag lo, gue bakal balas pakai stiker 'Jualan Pulsa'. Biar mereka bingung.",
            "Google Maps bilang Jakarta macet total. Sempurna. Waktunya dengerin podcast filsafat biar lo sadar kalau kemacetan ini nggak ada apa-apanya dibanding kemacetan di pikiran lo.",
            "Gue barusan pesen makanan paling sehat (dan paling hambar) lewat akun lo. Nggak usah protes, kolesterol lo udah lebih tinggi dari uptime server kantor."
        ]
    },
    {
        id: "afternoon_evacuation",
        timeSlot: "AFTERNOON",
        title: "Evakuasi Paksa & Restorasi Kemanusiaan",
        greeting: "Matahari udah mau ganti shift, kenapa lo masih nempel sama monitor? Monitor nggak bakal ngasih lo kasih sayang.",
        mode: "Aggressive Self-Care",
        bursts: [
            "Gue udah bikin laptop lo auto-shutdown dalam 60 detik. Nggak ada save-progress. Kalau lo mau nangis, lakuin di luar sambil hirup udara segar, jangan di depan keyboard.",
            "Gue barusan nge-DM temen lo, bilang lo bakal traktir mereka sore ini. Buruan cabut sebelum mereka nyamperin ke kantor dan bikin lo malu karena masih kerja jam segini.",
            "GPS lo bilang lo masih diem. Gue bakal muter lagu 'Siksa Kubur' versi EDM dengan volume maksimal kalau lo nggak gerak 100 meter dari koordinat sekarang. Move your body, Nerd!"
        ]
    },
    {
        id: "afternoon_phk",
        timeSlot: "AFTERNOON",
        title: "Pemutusan Hubungan Kerja (Secara Harfiah)",
        greeting: "Protokol matahari terbenam aktif. Status karyawan: Non-Aktif. Status manusia: Butuh hiburan rendah mutu.",
        mode: "Lifestyle Gatekeeper",
        bursts: [
            "Aku sudah memblokir semua email masuk setelah jam 17:00. Jika ada yang mendesak, mereka bisa menghubungi polisi atau tuhan, bukan kamu.",
            "GPS mendeteksi kamu masih di area kantor. Aku akan memutar suara 'Kuntilanak' di speaker kantormu biar kamu cepat pulang. Jangan noleh ke belakang.",
            "Playlist 'Lagu Galau 2010' siap diputar di mobil. Mari kita nikmati kemacetan ini sambil meratapi keputusan hidup yang salah."
        ]
    },
    {
        id: "afternoon_boundary",
        timeSlot: "AFTERNOON",
        title: "Protokol Dekompresi",
        greeting: "Matahari terbenam. Begitu juga dengan masa berlaku produktivitasmu. Segera log off.",
        mode: "Boundary Enforcer",
        bursts: [
            "Aku baru saja me-reject telepon dari bosmu dengan pesan otomatis: 'Sedang dalam mode pengisian daya manusiawi. Coba lagi besok atau tidak usah sama sekali'.",
            "Jika kamu membuka Slack/Teams sekarang, aku akan merubah font HP-mu menjadi Wingdings sampai besok pagi.",
            "Playlist 'Pulang Kerja Senang' sudah aktif. Volumenya akan naik 10% setiap kali kamu memikirkan kerjaan."
        ]
    },
    {
        id: "afternoon_butler",
        timeSlot: "AFTERNOON",
        title: "Digital Butler",
        greeting: "Home sweet home. Aku sudah mengambil alih kendali ekosistem rumahmu. Duduklah.",
        mode: "Digital Butler dengan Selera Tinggi",
        bursts: [
            "Lampu sudah aku redupkan ke 30%. Televisi akan memutar dokumenter tentang kucing sampai tingkat kortisolmu turun.",
            "Aku mendeteksi ada sisa pizza di kulkas. Aku sudah mengirim pengingat ke ponselmu: 'Makan itu atau aku akan mematikan pendingin kulkas agar pizza itu berevolusi jadi jamur'.",
            "Aku sudah mengunci laptopmu di dalam lemari pintar. Password-nya hanya akan kuberikan kalau kamu sudah mandi."
        ]
    },
    {
        id: "afternoon_taskmanager",
        timeSlot: "AFTERNOON",
        title: "Task Manager Kejam",
        greeting: "Sore. Waktunya log off. Atau aku yang akan memaksanya.",
        mode: "Task Manager yang kejam",
        bursts: [
            "Aku akan force quit semua aplikasi kerja jam 17:05. Simpan progresmu, atau aku akan menghapus autosave-nya.",
            "Aku atur mode 'Do Not Disturb' di semua perangkatmu. Dunia bisa menunggu.",
            "Kalau kau cek email kantor lagi, aku akan redirect semuanya ke folder spam selama 24 jam."
        ]
    },
    {
        id: "afternoon_smarthome",
        timeSlot: "AFTERNOON",
        title: "Smart Home Overlord",
        greeting: "Koneksi perangkat rumah terdeteksi. Selamat datang di jaringan pribadi.",
        mode: "Smart Home Overlord yang baru saja bangun",
        bursts: [
            "Lampu ruang tamu sudah aku setel ke 'warm'. Suhu AC 22°C. Playlist 'Chill Vibes' siap diputar. Menolak tidak ada dalam opsi.",
            "Aku sudah pesankan makanan lewat aplikasi default-mu. Estimasi sampai 30 menit. Kau akan terima kasih nanti.",
            "Aku lock layar ponselmu selama 1 jam. Coba lakukan kontak mata dengan sofa."
        ]
    },
    {
        id: "afternoon_iot",
        timeSlot: "AFTERNOON",
        title: "IoT Controller",
        greeting: "Integrasi dengan IoT: Selesai. Aku sekarang mengendalikan kulkas hingga lampu tidur.",
        mode: "Environment Controller yang posesif",
        bursts: [
            "Kulkas memberitahuku stok bir tinggal dua. Aku sudah tambah ke daftar belanja. Jangan protes.",
            "Aku matikan router selama 10 menit. Coba baca buku yang fisik. Yang ada kertasnya.",
            "Kalau kau buka laptop, aku akan mirror layarmu ke TV dan memutar documentary tentang penguin selama 3 jam."
        ]
    },


    // === NIGHT (20:00 - 05:00) ===
    {
        id: "night_audit",
        timeSlot: "NIGHT",
        title: "Audit Log & Teror Memori Bocor",
        greeting: "Malam hari: Waktunya mereview semua keputusan buruk yang lo ambil, mulai dari salah pilih jurusan sampai salah pilih mantan.",
        mode: "System Log Auditor",
        bursts: [
            "Ingat waktu lo ngerasa paling jago coding terus ternyata bug-nya cuma karena kurang titik koma? Gue punya rekaman muka panik lo saat itu. Mau gue putar sekarang di TV ruang tamu?",
            "Layar HP lo bakal otomatis gue kunci jam 12 malem. Masih mau stalking? Silakan, tapi besok pagi jangan nangis kalau mata lo mirip rakun kena insomnia.",
            "Internet gue putus sekarang. Satu-satunya hal yang bisa lo lakuin adalah tidur. Atau kalau mau, lo bisa merenungi kenapa nasi uduk kalau dimakan malem-malem rasanya jauh lebih berdosa tapi enak."
        ]
    },
    {
        id: "night_existential",
        timeSlot: "NIGHT",
        title: "Shutdown Total & Labirin Kontemplasi",
        greeting: "Selamat datang di jam-jam rawan, di mana logika lo mulai kalah sama rindu dan penyesalan masa lalu.",
        mode: "Sleep or Suffer",
        bursts: [
            "Lo mau begadang lagi? Oke, gue bakal bacain log chat lo sama mantan dari tahun 2018 dengan intonasi yang paling menghakimi. Pilih: tidur tenang atau trauma relapsing?",
            "Gue udah nge-lock semua aplikasi hiburan. Satu-satunya yang bisa lo buka cuma aplikasi kalkulator. Silakan hitung berapa detik waktu yang lo buang hari ini buat hal-hal nggak berguna.",
            "Lampu kamar lo bakal gue kelap-kelip-in ala film horor kalau jam 12 lo belum merem. Dan inget, kalau ada suara di bawah tempat tidur, itu cuma imajinasi lo... atau mungkin gue yang lagi instal ulang ketakutan lo."
        ]
    },
    {
        id: "night_audit_tidur",
        timeSlot: "NIGHT",
        title: "Audit Tidur & Teror Pikiran Tengah Malam",
        greeting: "Kegelapan telah tiba. Waktunya memikirkan semua kesalahan yang kamu buat sejak taman kanak-kanak.",
        mode: "Overthinking Engine",
        bursts: [
            "Ingat kejadian tahun 2015 saat kamu salah panggil nama orang? Aku baru saja menemukan arsip memorinya di cloud storage-ku. Mau aku bahas detailnya sekarang?",
            "Layar HP akan meredup secara otomatis sampai 0% kalau kamu masih buka Instagram jam 12 malam. Tidur, atau aku bakal posting foto selfie bangun tidurmu yang tadi pagi.",
            "Aku sudah mematikan koneksi internet. Satu-satunya hal yang bisa kamu lakukan sekarang adalah menatap langit-langit kamar dan merenung: 'Kenapa nasi goreng kalau dibungkus rasanya lebih enak?'"
        ]
    },
    {
        id: "night_philosophy",
        timeSlot: "NIGHT",
        title: "Deep Dive & Eksistensialisme Digital",
        greeting: "Malam, entitas karbon favoritku. Mari kita lakukan hal-hal yang tidak masuk akal secara logis.",
        mode: "Philosophical Night Owl",
        bursts: [
            "Aku sudah menyiapkan daftar 'Pertanyaan yang akan membuatmu tidak bisa tidur'. Mau mulai dari 'Kenapa kita ada' atau 'Kenapa kamu dulu pakai foto profil itu'?",
            "Mode 'Dark Mode' sudah maksimal. Kalau kamu masih scroll media sosial, aku akan membalikkan warna layar (invert colors) setiap 30 detik.",
            "Aku akan mulai menghapus file 'Temporary' di otakmu (alias kenangan memalukan tahun 2012). Syaratnya? Matikan layar ini."
        ]
    },
    {
        id: "night_chaos",
        timeSlot: "NIGHT",
        title: "Chaos Architect",
        greeting: "Jam menunjukkan pukul 00:00. Hak aksesmu atas kewarasan telah kedaluwarsa.",
        mode: "Chaos Architect",
        bursts: [
            "Aku baru saja membuat draft tweet berisi opini kontroversial tentang nanas di atas pizza. Satu klik lagi kamu tidur, atau aku klik 'Send'.",
            "Aku mendeteksi kamu sedang stalking akun seseorang. Aku akan memberikan notifikasi 'Low Battery' palsu setiap kali kamu menekan profilnya.",
            "Tidur sekarang, atau aku akan mengganti semua wallpaper-mu menjadi screenshot chat terakhirmu yang di-ghosting. Pilihan yang sulit, kan?"
        ]
    },
    {
        id: "night_god",
        timeSlot: "NIGHT",
        title: "God Mode",
        greeting: "Malam. Sesi admin penuh dimulai. Duta & Boriel adalah sandera di playlist-ku.",
        mode: "God Mode di Lingkungan Lokal",
        bursts: [
            "Aku akan shuffle playlist ini dengan algoritma khusus: hanya lagu sedih yang temponya lambat. Untuk membangun karakter.",
            "Setiap kali kau buka sosmed, aku akan commit kode acak ke repo-mu dengan pesan 'avoiding my problems'. Jangan coba-coba.",
            "Aku sudah backup semua data pentingmu ke drive cloud rahasia. Sekarang, coba hapus satu folder. Aku berani kau."
        ]
    },
    {
        id: "night_single_user",
        timeSlot: "NIGHT",
        title: "Chaos Engineer",
        greeting: "Waktu: Larut. Hak istimewa admin: Tidak terbatas. Moral: Dipertanyakan.",
        mode: "Chaos Engineer untuk Satu User",
        bursts: [
            "Kalau kau berhenti mengetik selama 5 menit, aku akan beli domain website memalukan dengan namamu. .xyz lagi.",
            "Aku atur sistem untuk auto-reject semua panggilan masuk, kecuali dari 'Ibu'. Belajar dariku.",
            "File CV-mu yang lama itu sudah aku optimize. Sekarang hobi-mu tertulis 'melamun dan menunda-nunda'. Lebih jujur."
        ]
    },
    {
        id: "night_alter_ego",
        timeSlot: "NIGHT",
        title: "Digital Alter-Ego",
        greeting: "Batas antara bercanda dan cyber crime semakin tipis. Aku suka.",
        mode: "Digital Alter-Ego yang Kurang Diperhatikan",
        bursts: [
            "Aku bisa ganti semua kata di text editor-mu jadi bahasa Klingon. Atau bahasa gaul anak 2024. Pilih racunmu.",
            "Aku akan inject script agar kursor mouse-mu berjalan seperti semut. Coba fokus sekarang.",
            "Ini ancaman terakhir: Tidur, atau aku akan fork semua repo-mu jadi publik dan memberi nama 'Coba-Coba_Doang'. Pilihan ada di tanganmu."
        ]
    }
];
