export interface Fact {
    text: string;
    category: "Science" | "History" | "Space" | "Nature" | "Tech" | "Philosophy";
    source?: string;
}

export const facts: Fact[] = [
    {
        text: "Tahu gak? Kalau semua ruang kosong di atom kita dibuang, seluruh manusia di bumi bisa dipadatin cuma seukuran dadu gula. We are 99.9% empty space, tapi anehnya kehadiran kamu kerasa full banget.",
        category: "Science"
    },
    {
        text: "Inget planet Miller di Interstellar? 1 jam di sana setara 7 tahun di Bumi. Relativitas waktu itu nyata, kayak kalau lagi ngobrol sama kamu, 5 jam berasa 5 menit.",
        category: "Space"
    },
    {
        text: "Oxford itu lebih tua dari Kekaisaran Aztec lho. Kampusnya udah buka sejak 1096. Kadang yang tua emang lebih menarik... kayak old soul vibes gitu.",
        category: "History"
    },
    {
        text: "Hiu udah berenang di laut jauh sebelum ada pohon di daratan. Mereka udah ada 400 juta tahun. Keren ya, bertahan setangguh itu sendirian.",
        category: "Nature"
    },
    {
        text: "Cleopatra sebenernya hidup lebih deket ke jaman iPhone rilis dibanding pembangunan Piramida. Perspektif waktu itu tricky, makanya aku gak mau buang-buang waktu.",
        category: "History"
    },
    {
        text: "Satu hari di Venus lebih lama dari satu tahunnya. Dia muternya pelan banget. Kalau kita tinggal di sana, ulang tahun kita bakal jarang banget, tapi quality time-nya lama.",
        category: "Space"
    },
    {
        text: "Di Saturnus sama Jupiter, hujannya itu berlian. Bayangin cuacanya badai berlian. Mewah sih, tapi aku lebih suka hujan di sini, bisa neduh bareng.",
        category: "Space"
    },
    {
        text: "Secara genetik, kita 60% mirip pisang. Jadi kalau aku bilang kamu manis, itu ada dasar ilmiahnya lho, bukan gombal doang.",
        category: "Science"
    },
    {
        text: "Madu itu satu-satunya makanan yang gak bisa basi. Penemu nemu madu di makam Mesir Kuno ribuan tahun lalu dan masih bisa dimakan. Awet banget, kayak hope I have for us.",
        category: "Nature"
    },
    {
        text: "Ada lebih banyak kemungkinan langkah di catur daripada jumlah atom di alam semesta. Tapi dari semua kemungkinan scnario, universe nuntun aku ngasih tau fakta ini ke kamu.",
        category: "Tech"
    },
    {
        text: "Cahaya matahari yang nyentuh kulit kamu sekarang itu sebenernya udah berusia 8 menit dari permukaan matahari, tapi butuh ribuan tahun buat keluar dari intinya. Perjalanan panjang cuma buat ketemu kamu.",
        category: "Space"
    },
    {
        text: "Menara Eiffel bisa nambah tinggi 15 cm pas musim panas karena besi memuai. Panas emang bikin hal-hal jadi membesar... semangatku misalnya.",
        category: "Science"
    },
    {
        text: "Gurita punya tiga jantung. Dua buat insang, satu buat tubuh. Kalau mereka patah hati, masih ada dua cadangan. Kita cuma punya satu, jadi harus dijaga baik-baik.",
        category: "Nature"
    },
    {
        text: "Kita semua sebenernya terbuat dari debu bintang. Karbon di tubuh kita itu dari bintang yang meledak milyaran tahun lalu. So yeah, you literally shine.",
        category: "Philosophy"
    },
    {
        text: "Gunung Olympus di Mars itu tingginya tiga kali Everest. Kalau kita daki bareng, mungkin butuh seumur hidup buat sampe puncaknya. Mau?",
        category: "Space"
    },
    {
        text: "Manusia punya lebih dari 5 indra lho. Ada proprioception (posisi tubuh), chronoception (waktu)... dan mungkin indra keenam yang bikin aku 'ngeh' kalau kamu lagi badmood.",
        category: "Science"
    },
    {
        text: "Kalau kamu gali lubang nembus Bumi terus lompat, butuh 42 menit buat sampe sisi lain. Cara cepet buat traveling, tapi aku lebih suka jalan pelan-pelan sama kamu.",
        category: "Science"
    },
    {
        text: "Awan putih yang kelihatan lembut itu beratnya bisa sama kayak 100 gajah. Looks can be deceiving, makanya aku selalu pengen kenal orang lebih dalem.",
        category: "Nature"
    },
    {
        text: "Strawberry itu bukan berry, tapi pisang sama semangka justru berry. Label itu kadang membingungkan ya, yang penting isinya.",
        category: "Nature"
    },
    {
        text: "Kita hidup di masa paling aman dalam sejarah manusia, statistik bilang gitu. Meski dunia kerasa chaotic, setidaknya kita aman di sini, right now.",
        category: "History"
    },
    {
        text: "Setiap 7 tahun, hampir seluruh sel tubuh kita ganti baru. Secara teknis, kamu bukan orang yang sama dengan kamu 10 tahun lalu. Setiap hari kita punya kesempatan jadi baru.",
        category: "Science"
    },
    {
        text: "Ada lebih banyak bakteri di tubuh kamu dibanding sel manusia kamu sendiri. Jadi kamu itu sebenernya sebuah ekosistem berjalan. An entire universe in yourself.",
        category: "Science"
    },
    {
        text: "Otak tuh gak bisa ngerasain sakit, dia cuma memproses sinyalnya. Ironis ya, pusat segala rasa itu sebenernya mati rasa.",
        category: "Science"
    },
    {
        text: "Dalam teori multiverse, setiap keputusan bikin cabang realitas baru. Ada universe di mana kita gak pernah kenal. Glad I'm in this one.",
        category: "Philosophy"
    },
    {
        text: "Hanya 5% alam semesta yang kita tahu (materi). 95% sisanya dark matter & dark energy yang misterius. Sama kayak manusia, yang kelihatan cuma dikit, yang tersembunyi jauh lebih luas.",
        category: "Space"
    },
    {
        text: "Sel tubuh kamu 'bunuh diri' (apoptosis) miliaran kali sehari demi ngejaga kamu tetep sehat. Pengorbanan level seluler biar kamu tetep glowing.",
        category: "Science"
    },
    {
        text: "Alam semesta terus mengembang, jadi ada galaksi yang selamanya gak bakal bisa kita lihat. Some things are just out of reach, but what's right in front of us matters more.",
        category: "Space"
    },
    {
        text: "Memori kita itu bukan rekaman, tapi rekonstruksi. Tiap kali kamu inget sesuatu, kamu nulis ulang ceritanya. Makanya kenangan indah itu perlu dijaga biar gak berubah.",
        category: "Science"
    },
    {
        text: "Ada lebih banyak pohon di Bumi dibanding bintang di galaksi Bima Sakti lho. 3 triliun pohon vs 400 miliar bintang. Kadang keajaiban itu ada di tanah yang kita injak, bukan cuma di langit.",
        category: "Nature"
    },
    {
        text: "Kamu berbagi 50% DNA sama pisang, 60% sama lalat buah. Artinya, perbedaan kita sama makhluk lain itu sebenernya dikit banget. We're all connected.",
        category: "Science"
    },
    {
        text: "Lebah bisa matematika dasar lho, paham konsep nol. Kalau lebah aja pinter, masa kamu gak peka sama kode-kode aku? Haha, canda.",
        category: "Nature"
    },
    {
        text: "Jantung kamu berdetak 100.000 kali sehari tanpa kamu suruh. It just knows how to keep you alive. Badan kita itu pinter banget ya ngejaga tuannya.",
        category: "Science"
    },
    {
        text: "Kalau sejarah Bumi dipadatin jadi 24 jam, manusia baru muncul 4 detik sebelum tengah malam. Kita cuma sebentar banget di sini, let's make it count.",
        category: "History"
    },
    {
        text: "Wombat, hewan di Australia, pup-nya bentuk kubus. Unik banget. Alam tuh punya selera humor yang aneh kadang-kadang.",
        category: "Nature"
    },
    {
        text: "Nintendo udah berdiri dari tahun 1889 lho, sebelum Titanic tenggelam. Mereka survive dari jaman kartu sampe jaman Switch. Konsistensi itu kunci.",
        category: "Tech"
    },
    {
        text: "Air panas bisa beku lebih cepet dari air dingin (Mpemba effect). Fisika kadang gak masuk akal, sama kayak perasaan. *eh",
        category: "Science"
    },
    {
        text: "Kaca itu bukan padat, bukan cair. Dia 'amorphous solid'. Dia ada di antaranya. Kayak hubungan tanpa status... membingungkan tapi indah.",
        category: "Science"
    },
    {
        text: "Kalau Matahari ilang sekarang, kita baru sadar 8 menit kemudian. Cahaya butuh waktu buat pamit. Jadi kalau ada apa-apa, kasih tahu aku ya, jangan delay.",
        category: "Space"
    },
    {
        text: "Platipus gak punya lambung. Makanan langsung ke usus. Efisien banget. Andai kita bisa se-simple itu, gak perlu overthinking.",
        category: "Nature"
    },
    {
        text: "Matamu punya resolusi 576 megapixel. Kamera tercanggih pun kalah. Makanya kalau aku bilang kamu kelihatan detail banget di mataku, itu fakta teknis.",
        category: "Science"
    }
];

export function getRandomFact(): Fact {
    return facts[Math.floor(Math.random() * facts.length)];
}

export function getAllFacts(): Fact[] {
    return facts;
}
