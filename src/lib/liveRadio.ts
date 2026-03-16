import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuration for Starlight Radio
const RADIO_CONFIG = {
    playlistId: "indo-hits", // Hardcoded for now per "teman-sunyi" vibe
    startTime: "21:00", // Start at 9 PM local
};

export interface RadioStatus {
    isActive: boolean;
    currentSong: any;
    elapsedInSong: number; // seconds
    elapsedInPlaylist: number; // total seconds since start
    totalDuration: number;
    listeners: number;
}

export async function getLiveRadioStatus(): Promise<RadioStatus> {
    const now = new Date();
    const currentDay = now.toISOString().split('T')[0];
    const [startHour, startMin] = RADIO_CONFIG.startTime.split(':').map(Number);
    
    // Create start time object for today
    const radioStart = new Date(now);
    radioStart.setHours(startHour, startMin, 0, 0);

    // If current time is before start time, it's not active yet
    if (now < radioStart) {
        return { isActive: false, currentSong: null, elapsedInSong: 0, elapsedInPlaylist: 0, totalDuration: 0, listeners: 0 };
    }

    // Fetch playlist songs with durations
    // For now, we manually simulate the "Indo Hits" playlist logic or fetch it
    // Logic: fetch all songs, apply INDO_ARTISTS filter (same as UI)
    const INDO_ARTISTS = [
        'Sheila on 7', 'Noah', 'Ungu', 'Ungu', 'Samsons', 'D\'masiv', 'St12', 'Hijau Daun', 'Vagetoz', 
        'Vierra', 'Virgoun', 'Virzha', 'Wali', 'Slam', 'Exists', 'Exist', 'Spoon', 'Screen', 'Ukays', 
        'Ella', 'Stings', 'Taxi', 'Taxi Band', 'Utopia', 'For Revenge', 'Fredy', 'Geisha', 
        'Element', 'Eren', 'Janji', 'Desy Ratnasari', 'David Bayu', 'Daun Jatuh', 'Last Child',
        'Lyodra', 'Andra', 'Dewa', 'Tulus', 'Risalah'
    ];

    const songs = await prisma.song.findMany({
        where: {
            OR: INDO_ARTISTS.map(artist => ({
                title: { contains: artist, mode: 'insensitive' }
            }))
        },
        orderBy: { title: 'asc' }
    });

    const totalPlaylistDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
    const timeSinceStart = Math.floor((now.getTime() - radioStart.getTime()) / 1000);

    // If session has ended
    if (timeSinceStart >= totalPlaylistDuration) {
        return { isActive: false, currentSong: null, elapsedInSong: 0, elapsedInPlaylist: 0, totalDuration: totalPlaylistDuration, listeners: 0 };
    }

    // Find current song in sequence
    let accumulated = 0;
    let currentSong = null;
    let elapsedInSong = 0;

    for (const song of songs) {
        const d = song.duration || 0;
        if (timeSinceStart < accumulated + d) {
            currentSong = song;
            elapsedInSong = timeSinceStart - accumulated;
            break;
        }
        accumulated += d;
    }

    return {
        isActive: true,
        currentSong,
        elapsedInSong,
        elapsedInPlaylist: timeSinceStart,
        totalDuration: totalPlaylistDuration,
        listeners: Math.floor(Math.random() * 50) + 100 // Mock listeners
    };
}
