export interface Fact {
    text: string;
    category: "Science" | "History" | "Space" | "Nature" | "Tech" | "Philosophy";
    source?: string;
}

export const facts: Fact[] = [
    {
        text: "Jika kita menghilangkan semua ruang kosong dalam atom yang menyusun seluruh tubuh manusia di Bumi, populasi dunia bisa dipadatkan ke dalam seukuran dadu gula. Kita sebenarnya 99.9999999% ruang kosong.",
        category: "Science"
    },
    {
        text: "Di planet Miller dalam film Interstellar, 1 jam setara dengan 7 tahun di Bumi. Ini bukan fiksi semata, melainkan efek dilatasi waktu akibat gravitasi super masif dari lubang hitam Gargantua.",
        category: "Space"
    },
    {
        text: "Universitas Oxford sudah mulai mengajar mahasiswa sejak tahun 1096, ratusan tahun sebelum Kekaisaran Aztec didirikan (1325). Pendidikan lama bertahan lebih lama dari imperium.",
        category: "History"
    },
    {
        text: "Hiu sudah berenang di lautan Bumi lebih lama daripada keberadaan pohon. Hiu muncul sekitar 400 juta tahun lalu, pohon baru mulai tumbuh 50 juta tahun kemudian.",
        category: "Nature"
    },
    {
        text: "Cleopatra hidup lebih dekat dengan masa peluncuran iPhone pertama daripada masa pembangunan Piramida Giza. Piramida dibangun ~2560 SM, Cleopatra lahir 69 SM, iPhone rilis 2007.",
        category: "History"
    },
    {
        text: "Tyrannosaurus Rex hidup lebih dekat dengan masa sekarang (era manusia dan iPad) daripada masa hidup Stegosaurus. Ada celah waktu sekitar 80 juta tahun antara kedua dinosaurus itu.",
        category: "History"
    },
    {
        text: "Satu hari di Venus lebih lama daripada satu tahun di Venus. Planet ini berotasi sangat lambat pada porosnya, sehingga butuh waktu lebih lama untuk berputar sekali (hari) daripada mengelilingi Matahari (tahun).",
        category: "Space"
    },
    {
        text: "Hujan di Saturnus dan Jupiter terbuat dari berlian. Tekanan atmosfer yang ekstrem mengubah karbon menjadi kristal berlian yang jatuh seperti hujan badai.",
        category: "Space"
    },
    {
        text: "Manusia berbagi sekitar 60% DNA yang sama dengan pisang. Ini menunjukkan betapa dasarnya blok bangunan kehidupan di Bumi, semuanya berasal dari leluhur sel tunggal yang sama.",
        category: "Science"
    },
    {
        text: "Jika kamu bisa melipat selembar kertas standar sebanyak 42 kali, ketebalannya akan mencapai Bulan. Eksponensial adalah konsep yang sering gagal dipahami intuisi manusia.",
        category: "Science"
    },
    {
        text: "Australia sebenarnya lebih lebar daripada Bulan. Diameter Bulan sekitar 3.400 km, sementara lebar benua Australia dari timur ke barat hampir 4.000 km.",
        category: "Nature"
    },
    {
        text: "Madu adalah satu-satunya makanan yang tidak pernah basi. Arkeolog menemukan madu di makam Mesir Kuno yang berusia ribuan tahun dan masih aman untuk dimakan.",
        category: "Nature"
    },
    {
        text: "Wombat, hewan marsupial Australia, mengeluarkan kotoran berbentuk kubus. Bentuk unik ini mencegah kotoran mereka menggelinding pergi saat digunakan untuk menandai wilayah.",
        category: "Nature"
    },
    {
        text: "Ada lebih banyak kemungkinan langkah dalam permainan catur (Angka Shannon ~10^120) daripada jumlah total atom di alam semesta yang dapat diamati (~10^80).",
        category: "Tech"
    },
    {
        text: "Otak manusia memiliki kapasitas penyimpanan memori setara dengan 2.5 petabyte (2.5 juta gigabyte). Itu cukup untuk menyimpan rekaman video kualitas TV selama 3 juta jam.",
        category: "Science"
    },
    {
        text: "Cahaya matahari yang kita lihat sekarang sebenarnya sudah berusia sekitar 8 menit. Tapi cahaya dari pusat Matahari butuh ribuan tahun untuk bisa mencapai permukaannya.",
        category: "Space"
    },
    {
        text: "Menara Eiffel bisa bertambah tinggi hingga 15 cm di musim panas. Panas menyebabkan besi memuai (ekspansi termal), membuat struktur ikonik ini meregang.",
        category: "Science"
    },
    {
        text: "Gurita memiliki tiga jantung dan darah berwarna biru. Dua jantung memompa darah ke insang, satu lagi ke seluruh tubuh. Darahnya biru karena berbasis tembaga, bukan besi.",
        category: "Nature"
    },
    {
        text: "Nintendo didirikan pada tahun 1889, sebelum Perang Rusia-Jepang, Titanic tenggelam, atau Perang Dunia I. Awalnya mereka memproduksi kartu permainan tangan (Hanafuda).",
        category: "Tech"
    },
    {
        text: "Jika kamu mengocok satu set kartu remi dengan benar, kemungkinan besar urutan kartu yang dihasilkan belum pernah ada sebelumnya sepanjang sejarah alam semesta.",
        category: "Science"
    },
    {
        text: "Kita semua terbuat dari debu bintang. Karbon, nitrogen, dan oksigen dalam tubuh kita diciptakan miliaran tahun lalu di dalam inti bintang yang meledak.",
        category: "Philosophy"
    },
    {
        text: "Air panas bisa membeku lebih cepat daripada air dingin dalam kondisi tertentu. Fenomena kontraintuitif ini dikenal sebagai Efek Mpemba.",
        category: "Science"
    },
    {
        text: "Gunung Olympus di Mars adalah gunung berapi tertinggi di Tata Surya, tiga kali lebih tinggi dari Everest. Dasarnya seukuran negara bagian Arizona atau Perancis.",
        category: "Space"
    },
    {
        text: "Kaca sebenarnya bukan benda padat sejati, tapi juga bukan cairan. Ia adalah 'amorphous solid', benda padat yang struktur atomnya acak seperti cairan.",
        category: "Science"
    },
    {
        text: "Manusia punya lebih dari 5 indra. Selain penglihatan, pendengaran, dll, kita punya proprioception (kesadaran posisi tubuh) dan chronoception (persepsi waktu).",
        category: "Science"
    },
    {
        text: "Jika kamu menggali lubang lurus menembus Bumi dan melompat masuk, kamu butuh waktu sekitar 42 menit untuk sampai ke sisi lain (mengabaikan gesekan udara).",
        category: "Science"
    },
    {
        text: "Awan cumulus yang terlihat ringan dan lembut itu sebenarnya sangat berat. Satu awan cumulus rata-rata bisa memiliki berat setara dengan 100 ekor gajah.",
        category: "Nature"
    },
    {
        text: "Strawberry bukan berry sejati, tapi pisang, semangka, dan labu justru termasuk berry secara botani.",
        category: "Nature"
    },
    {
        text: "Perancis masih menggunakan guillotine untuk eksekusi mati ketika film Star Wars pertama (A New Hope) dirilis di bioskop tahun 1977.",
        category: "History"
    },
    {
        text: "Kita hidup di masa yang paling damai dalam sejarah manusia. Meski berita berkata lain, statistik menunjukkan tingkat kekerasan dan perang berada di titik terendah global.",
        category: "History"
    },
    {
        text: "Foton cahaya bisa butuh 40.000 tahun untuk keluar dari inti Matahari ke permukaannya, tapi cuma butuh 8 menit untuk sampai ke matamu.",
        category: "Space"
    },
    {
        text: "Neutron star (bintang neutron) sangat padat sehingga satu sendok teh materinya akan memiliki berat setara dengan Gunung Everest (sekitar 6 miliar ton).",
        category: "Space"
    },
    {
        text: "Setiap 7-10 tahun, hampir seluruh sel di tubuhmu telah diganti dengan yang baru. Kamu secara harfiah bukan orang yang sama dengan dirimu satu dekade lalu.",
        category: "Science"
    },
    {
        text: "Ada virus raksasa (Pithovirus) yang 'hidup kembali' setelah beku 30.000 tahun di permafrost Siberia. Pemanasan global bisa membangunkan lebih banyak patogen purba.",
        category: "Nature"
    },
    {
        text: "Voyager 1 adalah benda buatan manusia terjauh dari Bumi. Ia membawa 'Golden Record', piringan emas berisi suara dan gambar Bumi untuk alien yang mungkin menemukannya.",
        category: "Space"
    },
    {
        text: "Komputer pertama yang digunakan untuk misi Apollo 11 memiliki memori (RAM) hanya sekitar 4KB, ribuan kali lebih kecil dari satu file foto di HP kamu.",
        category: "Tech"
    },
    {
        text: "Nama 'Google' berasal dari salah ketik kata 'Googol', istilah matematika untuk angka 1 diikuti oleh 100 nol. Nama aslinya seharusnya 'BackRub'.",
        category: "Tech"
    },
    {
        text: "Samudera di Bumi sebagian besar belum dipetakan. Kita punya peta permukaan Mars yang lebih detail daripada peta dasar laut kita sendiri.",
        category: "Nature"
    },
    {
        text: "Tardigrade (beruang air) bisa bertahan hidup di ruang hampa udara, radiasi ekstrem, dan tekanan dasar laut terdalam. Mereka mungkin makhluk terkuat di Bumi.",
        category: "Nature"
    },
    {
        text: "Darah kita mengandung emas. Tubuh manusia rata-rata memiliki sekitar 0.2 miligram emas, sebagian besar larut dalam darah.",
        category: "Science"
    },
    {
        text: "Heroin awalnya dipasarkan oleh Bayer sebagai obat batuk untuk anak-anak pada akhir abad ke-19, sebelum sifat adiktifnya diketahui.",
        category: "History"
    },
    {
        text: "Bahasa pemrograman pertama di dunia ditulis oleh seorang wanita, Ada Lovelace, pada tahun 1843 untuk mesin Analytical Engine milik Charles Babbage.",
        category: "Tech"
    },
    {
        text: "Secara statistik, kamu lebih mungkin mati karena kejatuhan kelapa daripada diserang hiu.",
        category: "Nature"
    },
    {
        text: "Pluto tidak sempat menyelesaikan satu kali orbit mengelilingi Matahari sejak ditemukan (1930) sampai statusnya dicabut sebagai planet (2006). Tahun Pluto = 248 tahun Bumi.",
        category: "Space"
    },
    {
        text: "Mata manusia bisa membedakan sekitar 10 juta warna, tapi kita tidak punya nama untuk sebagian besar warna itu.",
        category: "Science"
    },
    {
        text: "Vatikan memiliki teleskop canggih di Arizona bernama 'VATT'. Salah satu instrumen lamanya dijuluki L.U.C.I.F.E.R (infrarred instrument), memicu banyak teori konspirasi.",
        category: "History"
    },
    {
        text: "Jika alam semesta benar-benar tak terbatas, maka di luar sana ada versi dirimu yang identik sedang membaca kalimat ini juga, dan versi lain yang sudah berhenti membaca satu kata lalu.",
        category: "Philosophy"
    },
    {
        text: "Paradoks Fermi: Dengan 200 miliar galaksi dan triliunan bintang, di mana semua alien? Kemungkinan kita sendirian di alam semesta hampir sama menakutkannya dengan kemungkinan kita tidak.",
        category: "Space"
    },
    {
        text: "Dalam mekanika kuantum, partikel bisa berada di dua tempat sekaligus (superposisi). Elektron di tubuhmu secara teknis 'ada di mana-mana' sampai diamati.",
        category: "Science"
    },
    {
        text: "Lubang hitam sebenarnya tidak 'hitam'. Mereka memancarkan radiasi Hawking dan pelan-pelan menguap. Lubang hitam bermassa Bumi butuh waktu lebih lama dari umur alam semesta untuk menguap penuh.",
        category: "Space"
    },
    {
        text: "Kamu secara harfiah melihat masa lalu sekarang. Cahaya dari layarmu butuh waktu (meskipun sangat kecil) untuk sampai ke matamu. Bintang yang kamu lihat mungkin sudah mati jutaan tahun lalu.",
        category: "Science"
    },
    {
        text: "Ada lebih banyak bakteri di tubuhmu daripada sel manusia yang kamu miliki. Secara teknis, tubuhmu lebih merupakan 'ekosistem' daripada 'individu'.",
        category: "Science"
    },
    {
        text: "Otak tidak bisa merasakan sakit. Organ yang memproses rasa sakit dari seluruh tubuhmu sama sekali tidak memiliki reseptor rasa sakit untuk dirinya sendiri.",
        category: "Science"
    },
    {
        text: "Dalam teori multiverse, setiap keputusan yang kamu buat menciptakan cabang realitas baru. Ada alam semesta di mana kamu tidak pernah lahir, dan yang lain di mana kamu sudah menjadi astronot.",
        category: "Philosophy"
    },
    {
        text: "Hipotesis Simulasi: Secara statistik, jika kita bisa menciptakan simulasi reality seperti universe, kemungkinan besar kita sudah ada di dalam simulasi.",
        category: "Philosophy"
    },
    {
        text: "Hanya 5% alam semesta yang terdiri dari materi biasa (bintang, planet, kamu). 27% adalah dark matter, 68% adalah dark energy. Kita tidak tahu apa 95% alam semesta.",
        category: "Space"
    },
    {
        text: "Waktu berjalan lebih lambat di permukaan Bumi daripada di orbit. GPS satelit harus memperhitungkan ini atau akan meleset sekitar 10 km per hari.",
        category: "Science"
    },
    {
        text: "Sel-sel di tubuhmu bunuh diri sekitar 50-70 miliar kali sehari (apoptosis). Ini adalah proses normal dan penting untuk menjaga kesehatanmu.",
        category: "Science"
    },
    {
        text: "Bintang neutron berputar sangat cepat—beberapa berputar 716 kali per detik. Permukaannya bergerak dengan kecepatan hampir seperempat kecepatan cahaya.",
        category: "Space"
    },
    {
        text: "Alam semesta yang kita amati (observable universe) hanyalah sebagian kecil dari keseluruhan. Cahaya dari bagian lain alam semesta belum sempat sampai ke kita karena alam semesta berkembang.",
        category: "Space"
    },
    {
        text: "Setiap atom di tubuhmu melewati setidaknya beberapa bintang dan merupakan bagian dari jutaan organisme selama miliaran tahun terakhir.",
        category: "Philosophy"
    },
    {
        text: "Memorimu bukan rekaman. Setiap kali kamu mengingat sesuatu, otakmu 'menulis ulang' memori itu. Ingatanmu tentang masa kecil mungkin lebih banyak fiksi daripada fakta.",
        category: "Science"
    },
    {
        text: "Terdapat sekitar 7,000,000,000,000,000,000,000,000,000 (7 octillion) atom di tubuh manusia rata-rata. Sebagian besar adalah hidrogen dari Big Bang.",
        category: "Science"
    },
    {
        text: "Pohon-pohon di Bumi lebih banyak daripada bintang di Bima Sakti. Ada sekitar 3 triliun pohon di Bumi vs 100-400 miliar bintang di galaksi kita.",
        category: "Nature"
    },
    {
        text: "Kematian termal alam semesta (heat death) adalah nasib paling mungkin: semua bintang padam, lubang hitam menguap, entropi maksimal, kegelapan abadi.",
        category: "Space"
    },
    {
        text: "Jika kamu berdiri di dekat lubang hitam supermasif, kamu bisa menyaksikan seluruh masa depan alam semesta dalam hitungan detik (dari perspektifmu).",
        category: "Space"
    },
    {
        text: "Anehnya, yang kita sebut 'melihat warna' sebenarnya adalah interpretasi otak. Warna tidak ada di luar sana, hanya gelombang elektromagnetik dengan panjang berbeda.",
        category: "Science"
    },
    {
        text: "DNA manusia jika direntangkan akan membentang 600 kali jarak Bumi-Matahari. Sekitar 93 miliar mil dari sel-sel di satu tubuh.",
        category: "Science"
    },
    {
        text: "Kamu berbagi 50% DNA dengan pisang, 60% dengan lalat buah, dan 85% dengan tikus. Perbedaan antara semua makhluk hidup hanyalah sedikit variasi dalam kode yang sama.",
        category: "Science"
    },
    {
        text: "Matematikawan tidak bisa membuktikan 1+1=2 sampai 1910. Bertrand Russell dan Alfred North Whitehead butuh 362 halaman dalam Principia Mathematica.",
        category: "Tech"
    },
    {
        text: "Lebah bisa belajar matematika dasar. Mereka bisa memahami konsep nol dan melakukan penambahan serta pengurangan sederhana.",
        category: "Nature"
    },
    {
        text: "Kesadaran adalah misteri terbesar sains. Kita tidak tahu bagaimana materi (neuron) bisa menghasilkan pengalaman subjektif. Ini disebut 'the hard problem of consciousness'.",
        category: "Philosophy"
    },
    {
        text: "Proton memiliki waktu peluruhan sekitar 10^34 tahun. Dalam skala waktu yang hampir tak terbayangkan itu, semua materi pada akhirnya akan luruh.",
        category: "Science"
    },
    {
        text: "Ada galaksi yang tidak terlihat oleh kita selamanya karena alam semesta mengembang lebih cepat dari kecepatan cahaya. Mereka sudah 'jatuh' di balik horizon kosmik.",
        category: "Space"
    },
    {
        text: "Quantum tunneling memungkinkan partikel 'menembus' penghalang yang seharusnya tidak bisa dilewati. Ini adalah alasan Matahari bisa berfusi dan USB flashdisk bisa menyimpan data.",
        category: "Science"
    },
    {
        text: "Tubuhmu memproduksi 25 juta sel baru setiap detik. Saat kamu membaca kalimat ini, kamu sudah lebih banyak sel daripada satu detik yang lalu.",
        category: "Science"
    },
    {
        text: "Jika Matahari tiba-tiba menghilang, kita tidak akan tahu selama 8 menit. Gravitasi juga merambat dengan kecepatan cahaya.",
        category: "Space"
    },
    {
        text: "Platipus tidak punya perut. Makanan langsung dari kerongkongan ke usus. Mereka juga bisa mendeteksi medan listrik mangsa dengan paruhnya.",
        category: "Nature"
    },
    {
        text: "Ada jamur Ophiocordyceps yang menginfeksi semut, mengambil alih otaknya, dan memaksa semut memanjat ke tempat tinggi sebelum membunuhnya untuk menyebarkan spora. Zombie nyata.",
        category: "Nature"
    },
    {
        text: "Paradoks Bootstrap: jika kamu kembali ke masa lalu dan memberikan rumus relativitas ke Einstein muda, dari mana rumus itu berasal? Tidak ada yang menciptakannya.",
        category: "Philosophy"
    },
    {
        text: "Matamu memiliki resolusi sekitar 576 megapixel. Kamera terbaik buatan manusia masih kalah dari sistem penglihatan yang dihasilkan oleh evolusi selama jutaan tahun.",
        category: "Science"
    },
    {
        text: "Jantungmu berdetak sekitar 100.000 kali sehari dan sekitar 2.5 miliar kali dalam seumur hidup rata-rata, tanpa kamu perlu memikirkannya.",
        category: "Science"
    },
    {
        text: "Jika sejarah Bumi (4.5 miliar tahun) dipadatkan jadi 24 jam, manusia baru muncul di 4 detik terakhir sebelum tengah malam.",
        category: "History"
    },
    {
        text: "Blue whale jantungnya sebesar mobil dan detak jantungnya bisa didengar dari jarak 2 mil. Lidahnya seberat gajah dewasa.",
        category: "Nature"
    },
    {
        text: "Roman Concrete (beton Romawi) menjadi lebih kuat seiring waktu, berbeda dengan beton modern yang melemah. Rahasianya baru ditemukan pada 2017: reaksi air laut dengan abu vulkanik.",
        category: "History"
    }
];

export function getRandomFact(): Fact {
    return facts[Math.floor(Math.random() * facts.length)];
}

export function getAllFacts(): Fact[] {
    return facts;
}
