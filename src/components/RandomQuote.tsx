"use client";

import { useState } from "react";

interface Quote {
    text: string;
    textId?: string; // Indonesian translation (optional, only for English quotes)
    author: string;
    weight: number;
}

const quotes: Quote[] = [
    // Stoic Philosophy
    { text: "We suffer more often in imagination than in reality.", textId: "Kita lebih sering menderita dalam imajinasi daripada dalam kenyataan.", author: "Seneca", weight: 3 },
    { text: "The obstacle is the way.", textId: "Rintangan adalah jalannya.", author: "Marcus Aurelius", weight: 3 },
    { text: "No man is free who is not master of himself.", textId: "Tidak ada orang bebas yang bukan tuan atas dirinya sendiri.", author: "Epictetus", weight: 3 },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", textId: "Bukan karena kita punya waktu hidup yang singkat, tapi karena kita menyia-nyiakan banyak waktu.", author: "Seneca", weight: 3 },
    { text: "You have power over your mind—not outside events. Realize this, and you will find strength.", textId: "Kamu punya kuasa atas pikiranmu—bukan kejadian di luar. Sadari ini, dan kamu akan menemukan kekuatan.", author: "Marcus Aurelius", weight: 3 },
    { text: "He who fears death will never do anything worthy of a living man.", textId: "Dia yang takut mati tidak akan pernah melakukan sesuatu yang layak bagi orang hidup.", author: "Seneca", weight: 2 },

    // Existentialism
    { text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", textId: "Manusia dikutuk untuk bebas; karena begitu dilempar ke dunia, ia bertanggung jawab atas segala yang ia lakukan.", author: "Jean-Paul Sartre", weight: 3 },
    { text: "One must imagine Sisyphus happy.", textId: "Kita harus membayangkan Sisyphus bahagia.", author: "Albert Camus", weight: 3 },
    { text: "He who has a why to live can bear almost any how.", textId: "Dia yang punya alasan untuk hidup dapat menanggung hampir segala cara.", author: "Friedrich Nietzsche", weight: 3 },
    { text: "In the midst of winter, I found there was, within me, an invincible summer.", textId: "Di tengah musim dingin, aku menemukan ada, di dalam diriku, musim panas yang tak terkalahkan.", author: "Albert Camus", weight: 3 },
    { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", textId: "Satu-satunya cara menghadapi dunia yang tidak bebas adalah menjadi begitu mutlak bebas sehingga keberadaanmu sendiri adalah tindakan pemberontakan.", author: "Albert Camus", weight: 2 },
    { text: "God is dead. God remains dead. And we have killed him.", textId: "Tuhan telah mati. Tuhan tetap mati. Dan kita telah membunuhnya.", author: "Friedrich Nietzsche", weight: 2 },

    // Eastern Philosophy
    { text: "The mind is everything. What you think, you become.", textId: "Pikiran adalah segalanya. Apa yang kamu pikirkan, itulah dirimu.", author: "Buddha", weight: 3 },
    { text: "Knowing others is intelligence; knowing yourself is true wisdom.", textId: "Mengenal orang lain adalah kecerdasan; mengenal diri sendiri adalah kebijaksanaan sejati.", author: "Lao Tzu", weight: 3 },
    { text: "The journey of a thousand miles begins with a single step.", textId: "Perjalanan seribu mil dimulai dengan satu langkah.", author: "Lao Tzu", weight: 2 },
    { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", textId: "Sebelum pencerahan, potong kayu, angkut air. Setelah pencerahan, potong kayu, angkut air.", author: "Zen Proverb", weight: 3 },
    { text: "The bamboo that bends is stronger than the oak that resists.", textId: "Bambu yang melengkung lebih kuat dari pohon ek yang melawan.", author: "Japanese Proverb", weight: 2 },

    // Writers & Literature
    { text: "A writer is someone for whom writing is more difficult than it is for other people.", textId: "Penulis adalah seseorang yang baginya menulis lebih sulit daripada bagi orang lain.", author: "Thomas Mann", weight: 2 },
    { text: "The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved.", textId: "Satu-satunya orang untukku adalah mereka yang gila, yang gila ingin hidup, gila berbicara, gila ingin diselamatkan.", author: "Jack Kerouac", weight: 3 },
    { text: "I have no special talents. I am only passionately curious.", textId: "Aku tidak punya bakat khusus. Aku hanya penasaran dengan penuh gairah.", author: "Albert Einstein", weight: 2 },
    { text: "The unexamined life is not worth living.", textId: "Hidup yang tidak diperiksa tidak layak dijalani.", author: "Socrates", weight: 3 },
    { text: "To live is the rarest thing in the world. Most people exist, that is all.", textId: "Hidup adalah hal paling langka di dunia. Kebanyakan orang hanya ada, itu saja.", author: "Oscar Wilde", weight: 3 },
    { text: "If you want to live a happy life, tie it to a goal, not to people or things.", textId: "Jika kamu ingin hidup bahagia, ikatkan pada tujuan, bukan pada orang atau benda.", author: "Albert Einstein", weight: 2 },
    { text: "Pain is inevitable. Suffering is optional.", textId: "Rasa sakit tidak terelakkan. Penderitaan adalah pilihan.", author: "Haruki Murakami", weight: 3 },
    { text: "And once the storm is over, you won't remember how you made it through. But one thing is certain: when you come out of the storm, you won't be the same person who walked in.", textId: "Dan setelah badai berlalu, kamu tidak akan ingat bagaimana kamu melewatinya. Tapi satu hal pasti: saat keluar dari badai, kamu bukan lagi orang yang sama yang masuk.", author: "Haruki Murakami", weight: 3 },

    // Tech & Business Leaders
    { text: "The only real test of intelligence is if you get what you want out of life.", textId: "Satu-satunya ujian nyata kecerdasan adalah apakah kamu mendapat apa yang kamu inginkan dari hidup.", author: "Naval Ravikant", weight: 3 },
    { text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", textId: "Keinginan adalah kontrak yang kamu buat dengan dirimu sendiri untuk tidak bahagia sampai kamu mendapat yang kamu mau.", author: "Naval Ravikant", weight: 3 },
    { text: "Play stupid games, win stupid prizes.", textId: "Mainkan permainan bodoh, menangkan hadiah bodoh.", author: "Naval Ravikant", weight: 3 },
    { text: "Escape competition through authenticity.", textId: "Lepas dari kompetisi melalui keaslian.", author: "Naval Ravikant", weight: 3 },
    { text: "The best minds of my generation are thinking about how to make people click ads. That sucks.", textId: "Pikiran terbaik generasiku sedang memikirkan cara membuat orang mengklik iklan. Menyedihkan.", author: "Jeff Hammerbacher", weight: 2 },
    { text: "Startups don't die from competition. They die from suicide.", textId: "Startup tidak mati karena kompetisi. Mereka mati karena bunuh diri.", author: "Paul Graham", weight: 2 },
    { text: "The way to get startup ideas is not to try to think of startup ideas.", textId: "Cara mendapat ide startup bukan dengan mencoba memikirkan ide startup.", author: "Paul Graham", weight: 2 },
    { text: "Stay hungry. Stay foolish.", textId: "Tetap lapar. Tetap bodoh.", author: "Steve Jobs", weight: 2 },
    { text: "Your time is limited. Don't waste it living someone else's life.", textId: "Waktumu terbatas. Jangan sia-siakan untuk menjalani hidup orang lain.", author: "Steve Jobs", weight: 3 },
    { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", textId: "Bergerak cepat dan hancurkan sesuatu. Kalau kamu tidak menghancurkan apapun, kamu tidak cukup cepat.", author: "Mark Zuckerberg", weight: 1 },

    // Modern Thinkers
    { text: "Hard choices, easy life. Easy choices, hard life.", textId: "Pilihan sulit, hidup mudah. Pilihan mudah, hidup sulit.", author: "Jerzy Gregorek", weight: 3 },
    { text: "The world is changed by your example, not by your opinion.", textId: "Dunia diubah oleh teladanmu, bukan oleh pendapatmu.", author: "Paulo Coelho", weight: 2 },
    { text: "What we fear doing most is usually what we most need to do.", textId: "Apa yang paling kita takuti untuk lakukan biasanya adalah apa yang paling perlu kita lakukan.", author: "Tim Ferriss", weight: 2 },
    { text: "A person's success in life can usually be measured by the number of uncomfortable conversations they are willing to have.", textId: "Kesuksesan seseorang biasanya bisa diukur dari jumlah percakapan tidak nyaman yang bersedia ia jalani.", author: "Tim Ferriss", weight: 2 },
    { text: "The quality of your life is a direct reflection of the quality of the questions you are asking yourself.", textId: "Kualitas hidupmu adalah cerminan langsung dari kualitas pertanyaan yang kamu ajukan pada dirimu sendiri.", author: "Tony Robbins", weight: 2 },

    // Indonesian Literature & Thinkers (Higher weight, no translation needed)
    { text: "Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah.", author: "Pramoedya Ananta Toer", weight: 5 },
    { text: "Menulis adalah bekerja untuk keabadian.", author: "Pramoedya Ananta Toer", weight: 5 },
    { text: "Hidup ini sederhana, yang rumit itu keinginan.", author: "Sapardi Djoko Damono", weight: 5 },
    { text: "Hujan bulan Juni. Tak ada yang lebih tabah dari hujan bulan Juni.", author: "Sapardi Djoko Damono", weight: 5 },
    { text: "Aku ingin mencintaimu dengan sederhana.", author: "Sapardi Djoko Damono", weight: 4 },
    { text: "Jangan sekali-kali meninggalkan sejarah.", author: "Soekarno", weight: 5 },
    { text: "Bangsa yang besar adalah bangsa yang menghormati jasa pahlawannya.", author: "Soekarno", weight: 4 },
    { text: "Gantungkan cita-citamu setinggi langit.", author: "Soekarno", weight: 4 },
    { text: "Perjuanganku lebih mudah karena mengusir penjajah. Perjuanganmu lebih sulit karena melawan bangsamu sendiri.", author: "Soekarno", weight: 5 },
    { text: "Kebenaran akan tetap ada, sekalipun ia ditekan oleh kekuasaan.", author: "Tan Malaka", weight: 5 },
    { text: "Tujuan pendidikan itu untuk mempertajam kecerdasan, memperkukuh kemauan serta memperhalus perasaan.", author: "Tan Malaka", weight: 4 },
    { text: "Hidup yang tidak dipertaruhkan tidak akan pernah dimenangkan.", author: "Sutan Sjahrir", weight: 5 },
    { text: "Buku adalah jendela dunia.", author: "Pepatah Indonesia", weight: 3 },
    { text: "Air beriak tanda tak dalam.", author: "Pepatah Melayu", weight: 4 },
    { text: "Di mana bumi dipijak, di situ langit dijunjung.", author: "Pepatah Melayu", weight: 4 },

    // Psychology & Philosophy of Mind
    { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", textId: "Antara stimulus dan respons ada ruang. Di ruang itu ada kekuatan kita untuk memilih respons.", author: "Viktor Frankl", weight: 3 },
    { text: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.", textId: "Segalanya bisa diambil dari manusia kecuali satu hal: kebebasan manusia terakhir—memilih sikapnya dalam situasi apapun.", author: "Viktor Frankl", weight: 3 },
    { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", textId: "Sampai kamu membuat yang tak sadar menjadi sadar, ia akan mengarahkan hidupmu dan kamu akan menyebutnya takdir.", author: "Carl Jung", weight: 3 },
    { text: "Loneliness does not come from having no people around you, but from being unable to communicate the things that seem important to you.", textId: "Kesepian tidak datang dari tidak punya orang di sekitarmu, tapi dari ketidakmampuan mengomunikasikan hal-hal yang penting bagimu.", author: "Carl Jung", weight: 2 },
    { text: "The privilege of a lifetime is to become who you truly are.", textId: "Hak istimewa seumur hidup adalah menjadi siapa dirimu sebenarnya.", author: "Carl Jung", weight: 3 },

    // Art & Creativity
    { text: "Creativity is intelligence having fun.", textId: "Kreativitas adalah kecerdasan yang sedang bersenang-senang.", author: "Albert Einstein", weight: 2 },
    { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", textId: "Setiap anak adalah seniman. Masalahnya adalah bagaimana tetap menjadi seniman setelah dewasa.", author: "Pablo Picasso", weight: 2 },
    { text: "The chief enemy of creativity is good sense.", textId: "Musuh utama kreativitas adalah akal sehat.", author: "Pablo Picasso", weight: 2 },
    { text: "Art is not what you see, but what you make others see.", textId: "Seni bukan apa yang kamu lihat, tapi apa yang kamu buat orang lain lihat.", author: "Edgar Degas", weight: 2 },

    // Life & Death
    { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", textId: "Mengingat bahwa kamu akan mati adalah cara terbaik yang kutahu untuk menghindari jebakan berpikir kamu punya sesuatu untuk kehilangan.", author: "Steve Jobs", weight: 3 },
    { text: "It is not death that a man should fear, but he should fear never beginning to live.", textId: "Bukan kematian yang harus ditakuti manusia, tapi ia harus takut tidak pernah mulai hidup.", author: "Marcus Aurelius", weight: 3 },
    { text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.", textId: "Ketakutan akan kematian mengikuti ketakutan akan hidup. Orang yang hidup sepenuhnya siap mati kapan saja.", author: "Mark Twain", weight: 2 },
    { text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life.", textId: "Aku pergi ke hutan karena ingin hidup dengan sengaja, menghadapi hanya fakta-fakta esensial kehidupan.", author: "Henry David Thoreau", weight: 2 },
];

export function RandomQuote() {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shownIndices, setShownIndices] = useState<Set<number>>(new Set());
    const [showTranslation, setShowTranslation] = useState(false);

    // Weighted random selection from available indices
    const weightedRandomPick = (indices: number[]) => {
        const weights = indices.map(i => quotes[i].weight);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < indices.length; i++) {
            random -= weights[i];
            if (random <= 0) return indices[i];
        }
        return indices[indices.length - 1];
    };

    const getRandomQuote = () => {
        setIsAnimating(true);
        setShowTranslation(false);

        // Get available indices (not yet shown)
        let availableIndices = quotes
            .map((_, i) => i)
            .filter(i => !shownIndices.has(i));

        // If all quotes have been shown, reset
        if (availableIndices.length === 0) {
            availableIndices = quotes.map((_, i) => i);
            setShownIndices(new Set());
        }

        // Shuffle animation effect
        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[randomIndex]);
            shuffleCount++;

            if (shuffleCount >= 8) {
                clearInterval(shuffleInterval);
                // Pick final quote using weighted selection
                const finalIndex = weightedRandomPick(availableIndices);
                setQuote(quotes[finalIndex]);
                setShownIndices(prev => new Set([...prev, finalIndex]));
                setIsAnimating(false);
            }
        }, 80);
    };

    const displayText = showTranslation && quote?.textId ? quote.textId : quote?.text;

    return (
        <div style={{
            maxWidth: "42rem",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1
        }} className="animate-fade-in">
            <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                marginBottom: "1rem",
                color: "white"
            }}>
                🎲 Wisdom Gacha
            </h2>
            <p style={{
                fontSize: "1rem",
                opacity: 0.7,
                marginBottom: "2rem",
                fontWeight: 300,
                lineHeight: 1.7
            }}>
                Butuh reminder random buat hari ini? Tekan tombol di bawah.
            </p>

            {/* Quote Display */}
            <div style={{
                minHeight: "140px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
                padding: "1.5rem",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
            }}>
                {quote ? (
                    <div style={{
                        opacity: isAnimating ? 0.5 : 1,
                        transition: "opacity 0.2s ease",
                        width: "100%"
                    }}>
                        <p style={{
                            fontSize: "1.25rem",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                            marginBottom: "0.75rem",
                            color: "white",
                            transition: "opacity 0.3s ease"
                        }}>
                            "{displayText}"
                        </p>
                        <p style={{
                            fontSize: "0.875rem",
                            opacity: 0.6,
                            marginBottom: quote.textId ? "1rem" : 0
                        }}>
                            — {quote.author}
                        </p>

                        {/* Translate Button - only show for English quotes */}
                        {quote.textId && !isAnimating && (
                            <button
                                onClick={() => setShowTranslation(!showTranslation)}
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "20px",
                                    padding: "0.4rem 0.8rem",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.6)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem"
                                }}
                                className="hover:border-white/40 hover:text-white/80"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 8l6 6" />
                                    <path d="M4 14l6-6 2-3" />
                                    <path d="M2 5h12" />
                                    <path d="M7 2h1" />
                                    <path d="M22 22l-5-10-5 10" />
                                    <path d="M14 18h6" />
                                </svg>
                                {showTranslation ? "Original" : "Terjemahan"}
                            </button>
                        )}
                    </div>
                ) : (
                    <p style={{ opacity: 0.5, fontStyle: "italic" }}>
                        Tekan tombol untuk dapat quote...
                    </p>
                )}
            </div>

            {/* Button */}
            <button
                onClick={getRandomQuote}
                disabled={isAnimating}
                style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "1rem 2rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderRadius: "50px",
                    border: "none",
                    cursor: isAnimating ? "wait" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: isAnimating ? 0.7 : 1,
                    transform: isAnimating ? "scale(0.98)" : "scale(1)"
                }}
                className="hover:opacity-90 active:scale-95"
            >
                {isAnimating ? "🎰 Rolling..." : "✨ I'm Feeling Lucky"}
            </button>
        </div>
    );
}
