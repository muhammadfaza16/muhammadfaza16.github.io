"use client";

import { useState, useEffect, useCallback } from "react";

interface Quote {
    text: string;
    textId?: string;
    author: string;
    weight: number;
    category: string;
    source?: string;
    context?: string;
}

interface AuthorInfo {
    name: string;
    bio: string;
    era: string;
}

const authorBios: Record<string, AuthorInfo> = {
    "Seneca": { name: "Seneca", bio: "Filsuf Stoik Romawi, penasihat Kaisar Nero", era: "4 SM - 65 M" },
    "Marcus Aurelius": { name: "Marcus Aurelius", bio: "Kaisar Romawi & filsuf Stoik, penulis Meditations", era: "121 - 180 M" },
    "Epictetus": { name: "Epictetus", bio: "Filsuf Stoik Yunani, mantan budak yang menjadi guru", era: "50 - 135 M" },
    "Jean-Paul Sartre": { name: "Jean-Paul Sartre", bio: "Filsuf eksistensialis Prancis, penulis & dramawan", era: "1905 - 1980" },
    "Albert Camus": { name: "Albert Camus", bio: "Penulis & filsuf Prancis, peraih Nobel Sastra", era: "1913 - 1960" },
    "Friedrich Nietzsche": { name: "Friedrich Nietzsche", bio: "Filsuf Jerman, kritikus budaya & agama", era: "1844 - 1900" },
    "Buddha": { name: "Buddha", bio: "Pendiri agama Buddha, Siddharta Gautama", era: "~563 - 483 SM" },
    "Lao Tzu": { name: "Lao Tzu", bio: "Filsuf Tiongkok kuno, pendiri Taoisme", era: "~6 SM" },
    "Pramoedya Ananta Toer": { name: "Pramoedya Ananta Toer", bio: "Sastrawan Indonesia, penulis Tetralogi Buru", era: "1925 - 2006" },
    "Sapardi Djoko Damono": { name: "Sapardi Djoko Damono", bio: "Penyair Indonesia, maestro puisi liris", era: "1940 - 2020" },
    "Chairil Anwar": { name: "Chairil Anwar", bio: "Penyair legendaris Indonesia, pelopor Angkatan '45", era: "1922 - 1949" },
    "Soekarno": { name: "Soekarno", bio: "Proklamator & Presiden pertama Indonesia", era: "1901 - 1970" },
    "Tan Malaka": { name: "Tan Malaka", bio: "Pahlawan nasional, pemikir & revolusioner", era: "1897 - 1949" },
    "Sutan Sjahrir": { name: "Sutan Sjahrir", bio: "Perdana Menteri pertama Indonesia, intelektual", era: "1909 - 1966" },
    "Viktor Frankl": { name: "Viktor Frankl", bio: "Psikiater Austria, penyintas Holocaust", era: "1905 - 1997" },
    "Carl Jung": { name: "Carl Jung", bio: "Psikiater Swiss, pendiri psikologi analitis", era: "1875 - 1961" },
    "Naval Ravikant": { name: "Naval Ravikant", bio: "Entrepreneur & investor, pendiri AngelList", era: "1974 - sekarang" },
    "Paul Graham": { name: "Paul Graham", bio: "Pendiri Y Combinator, essayist teknologi", era: "1964 - sekarang" },
    "Steve Jobs": { name: "Steve Jobs", bio: "Pendiri Apple, visioner teknologi", era: "1955 - 2011" },
    "Haruki Murakami": { name: "Haruki Murakami", bio: "Novelis Jepang kontemporer terkenal", era: "1949 - sekarang" },
    "WS Rendra": { name: "WS Rendra", bio: "Penyair & dramawan Indonesia, 'Si Burung Merak'", era: "1935 - 2009" },
    "Goenawan Mohamad": { name: "Goenawan Mohamad", bio: "Penyair, esais, pendiri majalah Tempo", era: "1941 - sekarang" },
    "Richard Feynman": { name: "Richard Feynman", bio: "Fisikawan Amerika, peraih Nobel", era: "1918 - 1988" },
    "Carl Sagan": { name: "Carl Sagan", bio: "Astronom & penulis sains populer Amerika", era: "1934 - 1996" },
    "Socrates": { name: "Socrates", bio: "Filsuf Yunani kuno, guru Plato", era: "470 - 399 SM" },
    "Plato": { name: "Plato", bio: "Filsuf Yunani kuno, murid Socrates", era: "428 - 348 SM" },
    "Aristotle": { name: "Aristotle", bio: "Filsuf Yunani, bapak logika", era: "384 - 322 SM" },
    "Ernest Hemingway": { name: "Ernest Hemingway", bio: "Novelis Amerika, peraih Nobel Sastra", era: "1899 - 1961" },
    "Nelson Mandela": { name: "Nelson Mandela", bio: "Presiden Afrika Selatan, ikon anti-apartheid", era: "1918 - 2013" },
    "Dalai Lama": { name: "Dalai Lama", bio: "Pemimpin spiritual Tibet", era: "1935 - sekarang" },
    "Mahatma Gandhi": { name: "Mahatma Gandhi", bio: "Pemimpin kemerdekaan India", era: "1869 - 1948" },
    "Amir Hamzah": { name: "Amir Hamzah", bio: "Penyair Pujangga Baru, 'Raja Penyair'", era: "1911 - 1946" },
    "Achdiat K. Mihardja": { name: "Achdiat K. Mihardja", bio: "Sastrawan Indonesia, penulis Atheis", era: "1911 - 2010" },
    "Sitor Situmorang": { name: "Sitor Situmorang", bio: "Penyair liris Indonesia, Angkatan '45", era: "1923 - 2014" },
    "Khalil Gibran": { name: "Khalil Gibran", bio: "Penyair & filsuf Lebanon-Amerika", era: "1883 - 1931" },
    "Shikamaru Nara": { name: "Shikamaru Nara", bio: "Ninja jenius dari Konoha, ahli strategi", era: "Naruto" },
};

const quotes: Quote[] = [
    // Stoic Philosophy
    { text: "We suffer more often in imagination than in reality.", textId: "Kita lebih sering menderita dalam imajinasi daripada dalam kenyataan.", author: "Seneca", weight: 3, category: "Stoic", context: "Seneca mengingatkan bahwa kecemasan kita sering kali lebih besar dari masalah sebenarnya. Pikiran kita menciptakan skenario terburuk yang jarang terjadi." },
    { text: "The obstacle is the way.", textId: "Rintangan adalah jalannya.", author: "Marcus Aurelius", weight: 3, category: "Stoic", context: "Prinsip inti Stoikisme: rintangan bukan penghalang, tapi kesempatan untuk bertumbuh. Setiap kesulitan adalah guru." },
    { text: "No man is free who is not master of himself.", textId: "Tidak ada orang bebas yang bukan tuan atas dirinya sendiri.", author: "Epictetus", weight: 3, category: "Stoic", context: "Kebebasan sejati bukan tentang situasi eksternal, tapi kemampuan menguasai pikiran dan impuls sendiri." },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", textId: "Bukan karena kita punya waktu hidup yang singkat, tapi karena kita menyia-nyiakan banyak waktu.", author: "Seneca", weight: 3, category: "Stoic", context: "Dari 'On the Shortness of Life'. Seneca mengkritik bagaimana kita menghabiskan waktu untuk hal-hal yang tidak bermakna." },
    { text: "You have power over your mind—not outside events. Realize this, and you will find strength.", textId: "Kamu punya kuasa atas pikiranmu—bukan kejadian di luar. Sadari ini, dan kamu akan menemukan kekuatan.", author: "Marcus Aurelius", weight: 3, category: "Stoic", context: "Inti dari Meditations: fokus pada apa yang bisa kita kontrol, lepaskan yang tidak bisa." },
    { text: "Waste no more time arguing about what a good man should be. Be one.", textId: "Jangan buang waktu lagi berdebat tentang seperti apa orang baik seharusnya. Jadilah.", author: "Marcus Aurelius", weight: 3, category: "Stoic", context: "Ajakan untuk berhenti berteori dan mulai bertindak. Karakter dibangun lewat tindakan, bukan diskusi." },

    // Existentialism
    { text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", textId: "Manusia dikutuk untuk bebas; karena begitu dilempar ke dunia, ia bertanggung jawab atas segala yang ia lakukan.", author: "Jean-Paul Sartre", weight: 3, category: "Existentialism", context: "Kebebasan adalah beban. Tidak ada alasan, tidak ada takdir—semua pilihan adalah tanggung jawab kita sendiri." },
    { text: "One must imagine Sisyphus happy.", textId: "Kita harus membayangkan Sisyphus bahagia.", author: "Albert Camus", weight: 3, category: "Existentialism", context: "Dari 'The Myth of Sisyphus'. Meski hidup absurd dan tanpa makna inheren, kita bisa menemukan kebahagiaan dalam perjuangan itu sendiri.", source: "The Myth of Sisyphus" },
    { text: "He who has a why to live can bear almost any how.", textId: "Dia yang punya alasan untuk hidup dapat menanggung hampir segala cara.", author: "Friedrich Nietzsche", weight: 3, category: "Existentialism", context: "Tujuan hidup memberi kekuatan untuk menanggung penderitaan. Viktor Frankl kemudian mengembangkan ini menjadi terapi logotherapy." },
    { text: "In the midst of winter, I found there was, within me, an invincible summer.", textId: "Di tengah musim dingin, aku menemukan ada, di dalam diriku, musim panas yang tak terkalahkan.", author: "Albert Camus", weight: 3, category: "Existentialism", context: "Metafora tentang ketahanan batin. Di saat tergelap, kita menemukan kekuatan yang tidak kita sadari sebelumnya." },
    { text: "Freedom is what we do with what is done to us.", textId: "Kebebasan adalah apa yang kita lakukan dengan apa yang dilakukan kepada kita.", author: "Jean-Paul Sartre", weight: 3, category: "Existentialism", context: "Kita tidak bisa memilih apa yang terjadi pada kita, tapi kita selalu bisa memilih respons kita." },
    { text: "There are no facts, only interpretations.", textId: "Tidak ada fakta, hanya interpretasi.", author: "Friedrich Nietzsche", weight: 3, category: "Existentialism", context: "Perspektivisme Nietzsche: kebenaran selalu dilihat dari sudut pandang tertentu. Tidak ada kebenaran absolut." },

    // Eastern Philosophy
    { text: "The mind is everything. What you think, you become.", textId: "Pikiran adalah segalanya. Apa yang kamu pikirkan, itulah dirimu.", author: "Buddha", weight: 3, category: "Eastern", context: "Pikiran membentuk realitas. Pikiran negatif berulang menjadi kebiasaan, kebiasaan menjadi karakter." },
    { text: "Knowing others is intelligence; knowing yourself is true wisdom.", textId: "Mengenal orang lain adalah kecerdasan; mengenal diri sendiri adalah kebijaksanaan sejati.", author: "Lao Tzu", weight: 3, category: "Eastern", context: "Dari Tao Te Ching. Kebijaksanaan dimulai dari introspeksi, bukan akumulasi pengetahuan eksternal.", source: "Tao Te Ching" },
    { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", textId: "Sebelum pencerahan, potong kayu, angkut air. Setelah pencerahan, potong kayu, angkut air.", author: "Zen Proverb", weight: 3, category: "Eastern", context: "Pencerahan tidak mengubah aktivitas, tapi cara kita mengalaminya. Kesadaran penuh dalam keseharian adalah praktik spiritual." },
    { text: "When you realize nothing is lacking, the whole world belongs to you.", textId: "Ketika kamu menyadari tidak ada yang kurang, seluruh dunia menjadi milikmu.", author: "Lao Tzu", weight: 3, category: "Eastern", context: "Kekayaan sejati adalah kepuasan. Ketika tidak ada yang 'kurang', tidak ada yang perlu dikejar." },
    { text: "Nature does not hurry, yet everything is accomplished.", textId: "Alam tidak terburu-buru, namun semuanya terselesaikan.", author: "Lao Tzu", weight: 3, category: "Eastern", context: "Wu wei—tindakan tanpa paksaan. Mengalir seperti air, mencapai tujuan tanpa kekerasan." },
    { text: "Fall seven times, stand up eight.", textId: "Jatuh tujuh kali, bangkit delapan kali.", author: "Japanese Proverb", weight: 3, category: "Eastern", context: "Nana korobi ya oki. Kegagalan adalah bagian dari perjalanan. Yang penting adalah terus bangkit." },

    // Indonesian Literature & Thinkers
    { text: "Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah.", author: "Pramoedya Ananta Toer", weight: 5, category: "Indonesian", source: "Rumah Kaca", context: "Pram menekankan pentingnya dokumentasi dan menulis. Ide yang tidak ditulis akan mati bersama pemiliknya." },
    { text: "Menulis adalah bekerja untuk keabadian.", author: "Pramoedya Ananta Toer", weight: 5, category: "Indonesian", context: "Kata-kata yang tertulis melampaui batas waktu dan ruang. Menulis adalah bentuk imortalitas." },
    { text: "Manusia tak selamanya benar dan tak selamanya salah, kecuali ia yang selalu mengoreksi diri.", author: "Pramoedya Ananta Toer", weight: 5, category: "Indonesian", source: "Bumi Manusia", context: "Dari karakter Minke. Kebenaran bukan status permanen, tapi proses koreksi terus-menerus." },
    { text: "Hidup ini sederhana, yang rumit itu keinginan.", author: "Sapardi Djoko Damono", weight: 5, category: "Indonesian", context: "Kesederhanaan adalah kebijaksanaan. Keinginan yang berlebihan menciptakan kompleksitas dan penderitaan." },
    { text: "Yang fana adalah waktu. Kita abadi.", author: "Sapardi Djoko Damono", weight: 5, category: "Indonesian", context: "Paradoks indah: waktu yang kita anggap abadi justru fana, sementara esensi kita—cinta, karya—yang abadi." },
    { text: "Aku ini binatang jalang, dari kumpulannya terbuang.", author: "Chairil Anwar", weight: 5, category: "Indonesian", source: "Aku", context: "Deklarasi kebebasan individual. Chairil menolak konformitas dan merayakan keunikan diri." },
    { text: "Sekali berarti, sudah itu mati.", author: "Chairil Anwar", weight: 5, category: "Indonesian", source: "Diponegoro", context: "Hidup yang bermakna lebih berharga dari umur panjang tanpa arti. Intensitas lebih penting dari durasi." },
    { text: "Jangan sekali-kali meninggalkan sejarah.", author: "Soekarno", weight: 5, category: "Indonesian", context: "JAS MERAH. Sejarah adalah guru bangsa. Melupakan sejarah berarti mengulang kesalahan." },
    { text: "Perjuanganku lebih mudah karena mengusir penjajah. Perjuanganmu lebih sulit karena melawan bangsamu sendiri.", author: "Soekarno", weight: 5, category: "Indonesian", context: "Peringatan tentang tantangan pasca-kemerdekaan: korupsi, perpecahan, dan ego adalah musuh dalam selimut." },
    { text: "Beri aku sepuluh pemuda, niscaya akan kuguncangkan dunia.", author: "Soekarno", weight: 5, category: "Indonesian", context: "Keyakinan pada kekuatan pemuda. Semangat dan idealisme muda bisa mengubah dunia." },
    { text: "Kebenaran akan tetap ada, sekalipun ia ditekan oleh kekuasaan.", author: "Tan Malaka", weight: 5, category: "Indonesian", context: "Kebenaran tidak bisa dihancurkan. Mungkin ditunda, dipenjarakan, tapi akan selalu muncul kembali." },
    { text: "Idealisme adalah kemewahan terakhir yang hanya dimiliki oleh pemuda.", author: "Tan Malaka", weight: 5, category: "Indonesian", context: "Sindiran sekaligus tantangan: jangan biarkan idealisme mati seiring bertambahnya usia." },
    { text: "Hidup yang tidak dipertaruhkan tidak akan pernah dimenangkan.", author: "Sutan Sjahrir", weight: 5, category: "Indonesian", context: "Hidup bermakna membutuhkan risiko. Keamanan total adalah ilusi yang membunuh potensi." },
    { text: "Pada suatu hari nanti, jasadku tak akan ada lagi. Tapi di sini, di hatimu, aku telah menanam pohon.", author: "WS Rendra", weight: 5, category: "Indonesian", context: "Legacy bukan tentang fisik, tapi dampak yang kita tinggalkan di hati orang lain." },

    // Writers & Literature
    { text: "Pain is inevitable. Suffering is optional.", textId: "Rasa sakit tidak terelakkan. Penderitaan adalah pilihan.", author: "Haruki Murakami", weight: 3, category: "Literature", source: "What I Talk About When I Talk About Running", context: "Dari pengalaman lari maraton. Rasa sakit fisik pasti datang, tapi penderitaan mental adalah interpretasi kita." },
    { text: "And once the storm is over, you won't remember how you made it through. But one thing is certain: when you come out of the storm, you won't be the same person who walked in.", textId: "Dan setelah badai berlalu, kamu tidak akan ingat bagaimana kamu melewatinya. Tapi satu hal pasti: saat keluar dari badai, kamu bukan lagi orang yang sama yang masuk.", author: "Haruki Murakami", weight: 3, category: "Literature", source: "Kafka on the Shore", context: "Krisis mengubah kita. Kita mungkin tidak ingat detailnya, tapi transformasi itu nyata." },
    { text: "The world breaks everyone, and afterward, some are strong at the broken places.", textId: "Dunia menghancurkan semua orang, dan setelahnya, beberapa menjadi kuat di tempat yang patah.", author: "Ernest Hemingway", weight: 3, category: "Literature", source: "A Farewell to Arms", context: "Seperti tulang yang patah menjadi lebih kuat setelah sembuh. Trauma bisa menjadi sumber kekuatan." },
    { text: "We read to know we are not alone.", textId: "Kita membaca untuk tahu bahwa kita tidak sendirian.", author: "C.S. Lewis", weight: 3, category: "Literature", context: "Literatur menghubungkan pengalaman manusia lintas waktu dan ruang. Kita menemukan diri kita dalam cerita orang lain." },

    // Tech & Business
    { text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", textId: "Keinginan adalah kontrak yang kamu buat dengan dirimu sendiri untuk tidak bahagia sampai kamu mendapat yang kamu mau.", author: "Naval Ravikant", weight: 3, category: "Tech", context: "Paradoks keinginan: menginginkan sesuatu berarti menyatakan ketidakbahagiaan saat ini." },
    { text: "Play stupid games, win stupid prizes.", textId: "Mainkan permainan bodoh, menangkan hadiah bodoh.", author: "Naval Ravikant", weight: 3, category: "Tech", context: "Pilih permainan hidupmu dengan bijak. Kompetisi status, validasi sosial—hadiahnya tidak sebanding dengan biayanya." },
    { text: "Escape competition through authenticity.", textId: "Lepas dari kompetisi melalui keaslian.", author: "Naval Ravikant", weight: 3, category: "Tech", context: "Tidak ada kompetisi ketika kamu menjadi diri sendiri. Tidak ada yang bisa bersaing denganmu dalam menjadi kamu." },
    { text: "Your time is limited. Don't waste it living someone else's life.", textId: "Waktumu terbatas. Jangan sia-siakan untuk menjalani hidup orang lain.", author: "Steve Jobs", weight: 3, category: "Tech", source: "Stanford Commencement Speech", context: "Dari pidato terakhirnya di Stanford. Jangan biarkan dogma orang lain menenggelamkan suara hatimu." },

    // Psychology & Mind
    { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", textId: "Antara stimulus dan respons ada ruang. Di ruang itu ada kekuatan kita untuk memilih respons.", author: "Viktor Frankl", weight: 3, category: "Psychology", context: "Dari pengalaman di kamp konsentrasi. Bahkan dalam situasi paling ekstrem, kita punya kebebasan memilih sikap." },
    { text: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude.", textId: "Segalanya bisa diambil dari manusia kecuali satu hal: kebebasan manusia terakhir—memilih sikapnya.", author: "Viktor Frankl", weight: 3, category: "Psychology", source: "Man's Search for Meaning", context: "Inti dari logotherapy. Makna bisa ditemukan bahkan dalam penderitaan." },
    { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", textId: "Sampai kamu membuat yang tak sadar menjadi sadar, ia akan mengarahkan hidupmu dan kamu akan menyebutnya takdir.", author: "Carl Jung", weight: 3, category: "Psychology", context: "Shadow work. Pola bawah sadar mengendalikan kita sampai kita menyadari dan mengintegrasikannya." },
    { text: "The privilege of a lifetime is to become who you truly are.", textId: "Hak istimewa seumur hidup adalah menjadi siapa dirimu sebenarnya.", author: "Carl Jung", weight: 3, category: "Psychology", context: "Individuasi—proses menjadi diri yang utuh dan autentik. Ini adalah perjalanan seumur hidup." },

    // Science
    { text: "The first principle is that you must not fool yourself—and you are the easiest person to fool.", textId: "Prinsip pertama adalah kamu tidak boleh menipu dirimu sendiri—dan kamu adalah orang yang paling mudah dibohongi.", author: "Richard Feynman", weight: 3, category: "Science", context: "Integritas ilmiah dimulai dari kejujuran pada diri sendiri. Bias konfirmasi adalah musuh utama." },
    { text: "Somewhere, something incredible is waiting to be known.", textId: "Di suatu tempat, sesuatu yang luar biasa menunggu untuk diketahui.", author: "Carl Sagan", weight: 2, category: "Science", context: "Rasa takjub sebagai motor sains. Alam semesta penuh misteri yang menunggu untuk diungkap." },

    // Ancient Wisdom
    { text: "Know thyself.", textId: "Kenali dirimu.", author: "Delphic Maxim", weight: 3, category: "Ancient", context: "Terukir di kuil Apollo di Delphi. Dasar semua kebijaksanaan adalah pemahaman diri." },
    { text: "I know that I know nothing.", textId: "Saya tahu bahwa saya tidak tahu apa-apa.", author: "Socrates", weight: 3, category: "Ancient", context: "Socratic ignorance. Kebijaksanaan dimulai dari mengakui keterbatasan pengetahuan kita." },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", textId: "Kita adalah apa yang kita lakukan berulang kali. Keunggulan, maka, bukan tindakan, tapi kebiasaan.", author: "Aristotle", weight: 3, category: "Ancient", context: "Karakter dibentuk oleh kebiasaan, bukan niat sesaat. Disiplin harian lebih penting dari motivasi sesaat." },

    // Mindfulness
    { text: "Happiness is not something ready made. It comes from your own actions.", textId: "Kebahagiaan bukanlah sesuatu yang sudah jadi. Ia datang dari tindakanmu sendiri.", author: "Dalai Lama", weight: 3, category: "Mindfulness", context: "Kebahagiaan adalah hasil, bukan hadiah. Ia dibangun lewat tindakan yang disengaja." },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", textId: "Hiduplah seolah kamu akan mati besok. Belajarlah seolah kamu akan hidup selamanya.", author: "Mahatma Gandhi", weight: 3, category: "Mindfulness", context: "Keseimbangan antara urgensi dan kesabaran. Hidup penuh intensitas, tapi dengan perspektif jangka panjang." },

    // Life
    { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", textId: "Mengingat bahwa kamu akan mati adalah cara terbaik yang kutahu untuk menghindari jebakan berpikir kamu punya sesuatu untuk kehilangan.", author: "Steve Jobs", weight: 3, category: "Life", source: "Stanford Commencement Speech", context: "Memento mori. Kesadaran kematian membebaskan kita dari rasa takut dan ego." },

    // Love & Romance (Indonesian)
    { text: "Aku ingin mencintaimu dengan sederhana, dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu.", author: "Sapardi Djoko Damono", weight: 8, category: "Love", source: "Aku Ingin", context: "Puisi cinta paling terkenal di Indonesia. Cinta yang murni, tanpa syarat, tanpa perlu diucapkan—cukup dirasakan." },
    { text: "Hujan bulan Juni. Tak ada yang lebih tabah dari hujan bulan Juni. Dihujamnya terus berbagai kerinduan.", author: "Sapardi Djoko Damono", weight: 8, category: "Love", source: "Hujan Bulan Juni", context: "Ketabahan dalam cinta. Seperti hujan yang terus turun meski tak disambut, begitulah kerinduan yang tak pernah padam." },
    { text: "Jangan datang jika kau tak mampu menemaniku selamanya. Atau datanglah, tapi jangan membuatku jatuh cinta.", author: "Sitor Situmorang", weight: 8, category: "Love", context: "Dilema cinta yang menyakitkan. Lebih baik tidak mengenal daripada kehilangan setelah mencintai." },
    { text: "Cinta adalah sungai yang tak pernah lelah mengalir ke laut, meski laut tak pernah bertanya.", author: "Amir Hamzah", weight: 8, category: "Love", context: "Cinta yang ikhlas seperti sungai—terus memberi tanpa mengharap balasan." },
    { text: "Dalam cinta, yang terpenting bukan menemukan orang yang tepat, tapi menjadi orang yang tepat.", author: "Achdiat K. Mihardja", weight: 8, category: "Love", context: "Cinta dimulai dari diri sendiri. Sebelum dicintai, jadilah layak untuk dicintai." },
    { text: "Your soul and my soul are forever tangled.", textId: "Jiwamu dan jiwaku selamanya terjalin.", author: "Khalil Gibran", weight: 8, category: "Love", context: "Cinta melampaui fisik—ia adalah ikatan jiwa yang tak terpisahkan oleh waktu dan jarak." },
    { text: "Let there be spaces in your togetherness.", textId: "Biarlah ada ruang dalam kebersamaanmu.", author: "Khalil Gibran", weight: 8, category: "Love", source: "The Prophet", context: "Cinta yang sehat memberi ruang untuk bertumbuh. Bersama, namun tetap menjadi diri sendiri." },
    { text: "Cintaku jauh di pulau, gadis manis sekarang iseng sendiri.", author: "Chairil Anwar", weight: 8, category: "Love", source: "Cintaku Jauh di Pulau", context: "Kerinduan yang intens dalam jarak. Chairil mengekspresikan kesepian dan kerinduan dengan khas." },

    // Anime Wisdom
    { text: "Suatu hari, aku hanya ingin menikahi seorang gadis biasa yang tidak terlalu jelek dan tidak terlalu cantik. Punya dua anak, pertama seorang gadis, lalu seorang laki-laki. Pensiun setelah putriku menikah dan anakku menjadi ninja yang sukses, dan menghabiskan sisa hidupku bermain shōgi atau Go. Lalu meninggal karena usia tua sebelum istriku.", author: "Shikamaru Nara", weight: 5, category: "Life", source: "Naruto", context: "Quote legendaris Shikamaru tentang impian hidupnya yang sederhana. Ironis karena hidupnya jauh dari 'biasa', tapi filosofinya tentang kesederhanaan tetap relevan." },

    // Easter Egg 🥚
    { text: "HIDUP JOKOWIIII!!!! 🇮🇩🔥", author: "Rakyat Indonesia", weight: 4, category: "Indonesian", context: "🎉 SELAMAT! Kamu menemukan easter egg! Hari ini keberuntunganmu lagi bagus banget! 🍀✨" },
];

const categories = ["All", "Stoic", "Existentialism", "Eastern", "Indonesian", "Literature", "Tech", "Psychology", "Science", "Ancient", "Mindfulness", "Life", "Love"];

const getDailyQuoteIndex = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed % quotes.length;
};

export function RandomQuote() {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shownIndices, setShownIndices] = useState<Set<number>>(new Set());
    const [showTranslation, setShowTranslation] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [streak, setStreak] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDailyQuote, setIsDailyQuote] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        const savedFavorites = localStorage.getItem("quoteFavorites");
        const savedShown = localStorage.getItem("quoteShown");
        const savedStreak = localStorage.getItem("quoteStreak");
        const lastVisit = localStorage.getItem("quoteLastVisit");

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedShown) setShownIndices(new Set(JSON.parse(savedShown)));
        if (savedStreak) setStreak(parseInt(savedStreak));

        const today = new Date().toDateString();
        if (lastVisit) {
            const lastDate = new Date(lastVisit);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastVisit !== today) {
                if (lastDate.toDateString() === yesterday.toDateString()) {
                    const newStreak = (parseInt(savedStreak || "0")) + 1;
                    setStreak(newStreak);
                    localStorage.setItem("quoteStreak", newStreak.toString());
                } else {
                    setStreak(1);
                    localStorage.setItem("quoteStreak", "1");
                }
            }
        } else {
            setStreak(1);
            localStorage.setItem("quoteStreak", "1");
        }
        localStorage.setItem("quoteLastVisit", today);
    }, []);

    useEffect(() => {
        localStorage.setItem("quoteFavorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem("quoteShown", JSON.stringify([...shownIndices]));
    }, [shownIndices]);

    useEffect(() => {
        if (!quote || isAnimating) return;

        // Typing effect disabled - show full text immediately
        const text = showTranslation && quote.textId ? quote.textId : quote.text;
        setDisplayedText(text);
        setIsTyping(false);
    }, [quote, showTranslation, isAnimating]);

    const weightedRandomPick = useCallback((indices: number[]) => {
        const weights = indices.map(i => quotes[i].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < indices.length; i++) {
            random -= weights[i];
            if (random <= 0) return indices[i];
        }
        return indices[indices.length - 1];
    }, []);

    const getRandomQuote = useCallback(() => {
        setIsAnimating(true);
        setShowTranslation(false);
        setShowContext(false);
        setIsDailyQuote(false);

        const filteredIndices = quotes
            .map((q, i) => ({ q, i }))
            .filter(({ q }) => selectedCategory === "All" || q.category === selectedCategory)
            .map(({ i }) => i);

        let availableIndices = filteredIndices.filter(i => !shownIndices.has(i));

        if (availableIndices.length === 0) {
            availableIndices = filteredIndices;
            setShownIndices(new Set());
        }

        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            const randomIndex = filteredIndices[Math.floor(Math.random() * filteredIndices.length)];
            setQuote(quotes[randomIndex]);
            shuffleCount++;

            if (shuffleCount >= 8) {
                clearInterval(shuffleInterval);
                const finalIndex = weightedRandomPick(availableIndices);
                setQuote(quotes[finalIndex]);
                setShownIndices(prev => new Set([...prev, finalIndex]));
                setIsAnimating(false);
            }
        }, 80);
    }, [selectedCategory, shownIndices, weightedRandomPick]);

    const getDailyQuote = () => {
        setShowTranslation(false);
        setShowContext(false);
        setIsDailyQuote(true);
        const dailyIndex = getDailyQuoteIndex();
        setQuote(quotes[dailyIndex]);
        setShownIndices(prev => new Set([...prev, dailyIndex]));
    };

    const toggleFavorite = () => {
        if (!quote) return;
        const index = quotes.indexOf(quote);
        if (favorites.includes(index)) {
            setFavorites(favorites.filter(i => i !== index));
        } else {
            setFavorites([...favorites, index]);
        }
    };

    const isFavorite = quote ? favorites.includes(quotes.indexOf(quote)) : false;
    const isEasterEgg = quote?.text.includes("JOKOWI");

    return (
        <div className="animate-fade-in" style={{
            maxWidth: "42rem",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            padding: "0 1rem"
        }}>
            {/* Removed internal Header to let page handle it */}

            {/* Stats - Minimalist */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginBottom: "2rem",
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
            }}>
                <span>🔥 {streak} Day Streak</span>
                <span>📚 {shownIndices.size} / {quotes.length} Collected</span>
            </div>

            {/* Category Filter - Horizontal Scroll for Mobile */}
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                {/* Scroll hint gradient - right side */}
                <div
                    className="category-scroll-hint"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "48px",
                        background: "linear-gradient(90deg, transparent 0%, var(--background) 70%)",
                        pointerEvents: "none",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: "8px"
                    }}
                >
                    <span style={{
                        fontSize: "0.65rem",
                        opacity: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: "2px"
                    }}>
                        <span style={{ fontSize: "0.8rem" }}>›</span>
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "0.4rem",
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        paddingBottom: "0.5rem",
                        paddingRight: "2rem"
                    }}
                >
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: "0.4rem 0.75rem",
                                fontSize: "0.7rem",
                                borderRadius: "4px",
                                border: selectedCategory === cat ? "1px solid var(--foreground)" : "1px solid var(--border)",
                                backgroundColor: selectedCategory === cat ? "var(--hover-bg)" : "transparent",
                                color: selectedCategory === cat ? "var(--foreground)" : "var(--text-secondary)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                whiteSpace: "nowrap",
                                flexShrink: 0
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quote Display - Premium Card */}
            <div style={{
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
                padding: "3rem 2rem",
                borderRadius: "2px", // Sharp, premium corners
                background: "var(--background)",
                border: "1px solid var(--border)",
                position: "relative",
                transition: "all 0.3s ease"
            }}>
                {/* Decorative Quote Mark */}
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    opacity: 0.1,
                    fontSize: "4rem",
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1
                }}>
                    "
                </div>

                {quote ? (
                    <div style={{
                        opacity: isAnimating ? 0.4 : 1,
                        transition: "opacity 0.2s ease",
                        width: "100%",
                        maxWidth: "32rem"
                    }}>
                        {/* Category Label */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <span style={{
                                fontSize: "0.65rem",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "100px",
                                border: "1px solid var(--border)",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontWeight: 500,
                                color: "var(--text-secondary)"
                            }}>
                                {quote.category}
                            </span>
                        </div>

                        {/* Quote Text - Massive & Elegant */}
                        <p style={{
                            fontSize: "clamp(1.5rem, 4vw, 2rem)",
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            lineHeight: 1.4,
                            marginBottom: "2rem",
                            color: "var(--foreground)",
                            fontWeight: 400
                        }}>
                            {isAnimating ? quote.text : displayedText}
                        </p>

                        {/* Author */}
                        <div>
                            <p style={{
                                fontSize: "0.9rem",
                                fontFamily: "'Source Serif 4', serif",
                                color: "var(--foreground)",
                                fontWeight: 500
                            }}>
                                {quote.author}
                            </p>
                            {quote.source && (
                                <p style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-secondary)",
                                    marginTop: "0.25rem",
                                    fontStyle: "italic"
                                }}>
                                    {quote.source}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {!isAnimating && (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.5rem",
                                marginTop: "1.25rem",
                                flexWrap: "wrap"
                            }}>
                                {/* Favorite */}
                                <button
                                    onClick={toggleFavorite}
                                    aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid var(--border)",
                                        borderRadius: "4px",
                                        padding: "0.5rem 0.75rem",
                                        fontSize: "0.7rem",
                                        color: isFavorite ? "var(--foreground)" : "var(--text-secondary)",
                                        cursor: "pointer",
                                        minHeight: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.35rem"
                                    }}
                                >
                                    <span>{isFavorite ? "❤️" : "🤍"}</span> Simpan
                                </button>

                                {/* Translation */}
                                {quote.textId && (
                                    <button
                                        onClick={() => setShowTranslation(!showTranslation)}
                                        aria-label={showTranslation ? "Lihat versi asli" : "Lihat terjemahan"}
                                        style={{
                                            background: "transparent",
                                            border: "1px solid var(--border)",
                                            borderRadius: "4px",
                                            padding: "0.5rem 0.75rem",
                                            fontSize: "0.7rem",
                                            color: "var(--text-secondary)",
                                            cursor: "pointer",
                                            minHeight: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.35rem"
                                        }}
                                    >
                                        🌐 {showTranslation ? "Original" : "Terjemah"}
                                    </button>
                                )}

                                {/* Context */}
                                {quote.context && (
                                    <button
                                        onClick={() => setShowContext(!showContext)}
                                        aria-label={showContext ? "Sembunyikan konteks" : "Lihat konteks"}
                                        style={{
                                            background: "transparent",
                                            border: "1px solid var(--border)",
                                            borderRadius: "4px",
                                            padding: "0.5rem 0.75rem",
                                            fontSize: "0.7rem",
                                            color: showContext ? "var(--foreground)" : "var(--text-secondary)",
                                            cursor: "pointer",
                                            minHeight: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.35rem"
                                        }}
                                    >
                                        <span>💡</span> Konteks
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Context Panel */}
                        {showContext && quote.context && !isAnimating && (
                            <div style={{
                                marginTop: "1rem",
                                padding: "1rem",
                                backgroundColor: "var(--hover-bg)",
                                borderRadius: "6px",
                                textAlign: "left",
                                borderLeft: "2px solid var(--border)"
                            }}>
                                <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "var(--foreground)" }}>
                                    {quote.context}
                                </p>
                                {authorBios[quote.author] && (
                                    <p style={{ fontSize: "0.7rem", marginTop: "0.75rem", color: "var(--text-secondary)" }}>
                                        ┊ {authorBios[quote.author].bio} ({authorBios[quote.author].era})
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <p style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "0.9rem" }}>
                        Tekan tombol untuk dapat quote...
                    </p>
                )}
            </div>

            {/* Main Buttons - Mobile Optimized */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
            }}>
                <button
                    onClick={getRandomQuote}
                    disabled={isAnimating}
                    aria-label="Dapatkan quote random"
                    style={{
                        backgroundColor: "var(--foreground)",
                        color: "var(--background)",
                        padding: "1rem 1.5rem",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderRadius: "6px",
                        border: "none",
                        cursor: isAnimating ? "wait" : "pointer",
                        opacity: isAnimating ? 0.6 : 1,
                        minHeight: "48px"
                    }}
                >
                    {isAnimating ? <span>🎰 Rolling...</span> : <span>✨ I'm Feeling Lucky</span>}
                </button>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                        onClick={getDailyQuote}
                        aria-label="Lihat quote hari ini"
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            color: "var(--foreground)",
                            padding: "0.875rem 1rem",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                            minHeight: "48px"
                        }}
                    >
                        <span>📅</span> Hari Ini
                    </button>

                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        aria-label={`Lihat ${favorites.length} favorit`}
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            color: "var(--foreground)",
                            padding: "0.875rem 1rem",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                            minHeight: "48px"
                        }}
                    >
                        <span>❤️</span> Favorit ({favorites.length})
                    </button>
                </div>
            </div>

            {/* Favorites Panel */}
            {showFavorites && (
                <div style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "var(--hover-bg)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    textAlign: "left"
                }}>
                    <h3 style={{ fontSize: "0.85rem", marginBottom: "1rem", fontWeight: 600, opacity: 0.8 }}>
                        <span>❤️</span> Koleksi ({favorites.length})
                    </h3>
                    {favorites.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {favorites.map(idx => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setQuote(quotes[idx]);
                                        setIsDailyQuote(false);
                                        setShowContext(false);
                                        setShowFavorites(false);
                                    }}
                                    style={{
                                        padding: "0.875rem",
                                        backgroundColor: "var(--hover-bg)",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        border: "1px solid var(--border)",
                                        color: "var(--foreground)",
                                        minHeight: "48px"
                                    }}
                                >
                                    <p style={{ fontSize: "0.8rem", fontStyle: "italic", marginBottom: "0.35rem", opacity: 0.9 }}>
                                        "{quotes[idx].text.length > 80 ? quotes[idx].text.slice(0, 80) + "..." : quotes[idx].text}"
                                    </p>
                                    <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                                        — {quotes[idx].author}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: "0.8rem", opacity: 0.4, textAlign: "center", padding: "1rem" }}>
                            Belum ada favorit. Tekan 🤍 Simpan pada quote.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
