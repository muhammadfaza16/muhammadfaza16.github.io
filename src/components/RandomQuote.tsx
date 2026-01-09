"use client";

import { useState } from "react";

const quotes = [
    // Stoic Philosophy
    { text: "We suffer more often in imagination than in reality.", author: "Seneca", weight: 3 },
    { text: "The obstacle is the way.", author: "Marcus Aurelius", weight: 3 },
    { text: "No man is free who is not master of himself.", author: "Epictetus", weight: 3 },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca", weight: 3 },
    { text: "You have power over your mind—not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", weight: 3 },
    { text: "He who fears death will never do anything worthy of a living man.", author: "Seneca", weight: 2 },

    // Existentialism
    { text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", author: "Jean-Paul Sartre", weight: 3 },
    { text: "One must imagine Sisyphus happy.", author: "Albert Camus", weight: 3 },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", weight: 3 },
    { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus", weight: 3 },
    { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus", weight: 2 },
    { text: "God is dead. God remains dead. And we have killed him.", author: "Friedrich Nietzsche", weight: 2 },

    // Eastern Philosophy
    { text: "The mind is everything. What you think, you become.", author: "Buddha", weight: 3 },
    { text: "Knowing others is intelligence; knowing yourself is true wisdom.", author: "Lao Tzu", weight: 3 },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", weight: 2 },
    { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", author: "Zen Proverb", weight: 3 },
    { text: "The bamboo that bends is stronger than the oak that resists.", author: "Japanese Proverb", weight: 2 },

    // Writers & Literature
    { text: "A writer is someone for whom writing is more difficult than it is for other people.", author: "Thomas Mann", weight: 2 },
    { text: "The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved.", author: "Jack Kerouac", weight: 3 },
    { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein", weight: 2 },
    { text: "The unexamined life is not worth living.", author: "Socrates", weight: 3 },
    { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", weight: 3 },
    { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein", weight: 2 },
    { text: "Pain is inevitable. Suffering is optional.", author: "Haruki Murakami", weight: 3 },
    { text: "And once the storm is over, you won't remember how you made it through. But one thing is certain: when you come out of the storm, you won't be the same person who walked in.", author: "Haruki Murakami", weight: 3 },

    // Tech & Business Leaders
    { text: "The only real test of intelligence is if you get what you want out of life.", author: "Naval Ravikant", weight: 3 },
    { text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", author: "Naval Ravikant", weight: 3 },
    { text: "Play stupid games, win stupid prizes.", author: "Naval Ravikant", weight: 3 },
    { text: "Escape competition through authenticity.", author: "Naval Ravikant", weight: 3 },
    { text: "The best minds of my generation are thinking about how to make people click ads. That sucks.", author: "Jeff Hammerbacher", weight: 2 },
    { text: "Startups don't die from competition. They die from suicide.", author: "Paul Graham", weight: 2 },
    { text: "The way to get startup ideas is not to try to think of startup ideas.", author: "Paul Graham", weight: 2 },
    { text: "Stay hungry. Stay foolish.", author: "Steve Jobs", weight: 2 },
    { text: "Your time is limited. Don't waste it living someone else's life.", author: "Steve Jobs", weight: 3 },
    { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg", weight: 1 },

    // Modern Thinkers
    { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek", weight: 3 },
    { text: "The world is changed by your example, not by your opinion.", author: "Paulo Coelho", weight: 2 },
    { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss", weight: 2 },
    { text: "A person's success in life can usually be measured by the number of uncomfortable conversations they are willing to have.", author: "Tim Ferriss", weight: 2 },
    { text: "The quality of your life is a direct reflection of the quality of the questions you are asking yourself.", author: "Tony Robbins", weight: 2 },

    // Indonesian Literature & Thinkers (Higher weight)
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
    { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl", weight: 3 },
    { text: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.", author: "Viktor Frankl", weight: 3 },
    { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Jung", weight: 3 },
    { text: "Loneliness does not come from having no people around you, but from being unable to communicate the things that seem important to you.", author: "Carl Jung", weight: 2 },
    { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung", weight: 3 },

    // Art & Creativity
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein", weight: 2 },
    { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso", weight: 2 },
    { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso", weight: 2 },
    { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas", weight: 2 },

    // Life & Death
    { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", author: "Steve Jobs", weight: 3 },
    { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", weight: 3 },
    { text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.", author: "Mark Twain", weight: 2 },
    { text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life.", author: "Henry David Thoreau", weight: 2 },
];

export function RandomQuote() {
    const [quote, setQuote] = useState<typeof quotes[0] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shownIndices, setShownIndices] = useState<Set<number>>(new Set());

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
                minHeight: "120px",
                display: "flex",
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
                        transition: "opacity 0.2s ease"
                    }}>
                        <p style={{
                            fontSize: "1.25rem",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                            marginBottom: "0.75rem",
                            color: "white"
                        }}>
                            "{quote.text}"
                        </p>
                        <p style={{
                            fontSize: "0.875rem",
                            opacity: 0.6
                        }}>
                            — {quote.author}
                        </p>
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
