export type ConversationTopic = 'science' | 'philosophy' | 'history' | 'romance' | 'casual' | 'music_bridge' | 'flirty';

export interface ConversationCheck {
    timestamp: number; // Seconds
    text: string | ((nextSongTitle?: string) => string); // Dynamic text creator
    topic: ConversationTopic;
    mood: 'curious' | 'intense' | 'smart' | 'flirty' | 'chill';
    pose?: 'leaning_in' | 'chill' | 'bouncing' | 'annoyed'; // Body language override
    memoryCheck?: { type: 'streak', count: number, message: string }; // Optional memory trigger
    timeContext?: 'morning' | 'day' | 'night' | 'late_night' | 'any'; // Time filter
}

export const SONG_CONVOS: Record<string, ConversationCheck[]> = {
    "Alan Walker — Faded": [
        {
            timestamp: 5,
            text: "Lagu ini... vibes-nya selalu bikin gue ngerasa ilang arah. In a good way.",
            topic: 'casual',
            mood: 'curious',
            pose: 'chill'
        },
        {
            timestamp: 15, // Validation Hook
            text: "Kalau hari ini lagi berat, gapapa. You don't have to be strong right now.",
            topic: 'romance',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 53, // The Drop
            text: "Dengerin deh background vocal-nya... merinding ga sih?",
            topic: 'romance',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 85, // Post-Drop Validation
            text: "Kadang kita cuma butuh satu lagu buat ngerasa dimengerti. I'm here, by the way.",
            topic: 'romance',
            mood: 'flirty',
            pose: 'leaning_in'
        },
        {
            timestamp: 120, // Bridge
            text: "Anyway, pernah baca ga? Katanya memori pudar itu sebenernya mekanisme otak biar kita ga gila. Keren ya?",
            topic: 'science', // References "Did You Know"
            mood: 'smart',
            pose: 'chill'
        }
    ],
    "The Chainsmokers — Closer": [
        {
            timestamp: 1,
            text: "Lagu wajib 2016. Tapi jujur, tiap denger kunci piano ini, gue ga inget tahunnya... gue inget orangnya.",
            topic: 'history',
            mood: 'chill',
            pose: 'chill'
        },
        {
            timestamp: 11,
            text: "Liriknya 'doing just fine'. Klasik. Kita sering bilang 'I'm fine' biar ga ditanya-tanya, kan?",
            topic: 'philosophy',
            mood: 'smart',
            pose: 'leaning_in'
        },
        {
            timestamp: 16,
            text: "Padahal hari ini mungkin berat. It’s okay to drop the mask here. Nobody’s watching.",
            topic: 'romance',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 32,
            text: "Lo tau teori 'Musical Frisson'? Merinding pas denger lagu?",
            topic: 'science',
            mood: 'smart',
            pose: 'chill'
        },
        {
            timestamp: 36,
            text: "Itu karena otak lo nge-release Dopamine pas prediksi nada lo bener. Chemistry kita juga gitu ga sih?",
            topic: 'flirty',
            mood: 'flirty',
            pose: 'leaning_in'
        },
        {
            timestamp: 52,
            text: "So baby pull me closer... God, I wish I could.",
            topic: 'romance',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 55,
            text: "Distance is just physics. Vibes are quantum. I feel you right here.",
            topic: 'science',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 86, // 01:26 Halsey Verse
            text: "Part-nya Halsey. 'You look as good as the day I met you...'",
            topic: 'casual',
            mood: 'curious',
            pose: 'chill'
        },
        {
            timestamp: 90, // 01:30
            text: "I hope I can say that to you endlessly. You look good tonight, by the way.",
            topic: 'flirty',
            mood: 'flirty',
            pose: 'leaning_in'
        },
        {
            timestamp: 108, // 01:48 Pre-Chorus
            text: "Siap-siap drop lagi. Jangan ditahan.",
            topic: 'music_bridge',
            mood: 'curious',
            pose: 'bouncing'
        },
        {
            timestamp: 125, // 02:05 Drop
            text: "Kepala lo goyang dikit kan barusan? Gue liat loh. Senyum dikit napa. Nah, gitu kan cakep.",
            topic: 'flirty',
            mood: 'flirty',
            pose: 'leaning_in'
        },
        {
            timestamp: 155, // 02:35 Bridge
            text: "Dunia emang berisik banget hari ini. Notifikasi, deadline, ekspektasi orang...",
            topic: 'casual',
            mood: 'chill',
            pose: 'chill'
        },
        {
            timestamp: 160,
            text: "Makasih ya udah milih buat mute semuanya dan istirahat di sini sama gue. I appreciate you.",
            topic: 'romance',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 185, // 03:05 Final Chorus
            text: "We ain't ever getting older. Di momen ini, kita frozen in time.",
            topic: 'philosophy',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 189,
            text: "Simpen rasa ini. Besok kita tarung lagi sama dunia. Tapi sekarang? Kita abadi.",
            topic: 'philosophy',
            mood: 'intense',
            pose: 'leaning_in'
        },
        {
            timestamp: 235, // 03:55 Outro / Bridge Logic
            text: (nextSong?: string) => {
                if (nextSong && nextSong.includes("Something Just Like This")) {
                    return "Hah, abis ini 'Something Just Like This'? Kebetulan banget. Lagu soal Superhero... Pas banget buat lo yang udah survive hari ini.";
                }
                return "Abis ini lagu apa ya? Let's just flow with it.";
            },
            topic: 'music_bridge',
            mood: 'curious',
            pose: 'chill'
        }
    ],
    // Generic fallback or other songs can be added here
};
