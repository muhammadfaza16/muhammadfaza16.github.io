import { useState, useEffect, useRef } from 'react';
import { SONG_CONVOS } from '../data/songConversations';

interface UseNarrativeEngineProps {
    currentSongTitle: string;
    isPlaying: boolean;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    nextSongTitle?: string;
}

export function useNarrativeEngine({ currentSongTitle, isPlaying, audioRef, nextSongTitle }: UseNarrativeEngineProps) {
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [mood, setMood] = useState<'curious' | 'intense' | 'smart' | 'flirty' | 'chill'>('curious');
    const [pose, setPose] = useState<'leaning_in' | 'chill' | 'bouncing' | 'annoyed'>('chill');

    const lastTriggeredTimestampRef = useRef<number | null>(null);
    const triggeredIndicesRef = useRef<Set<number>>(new Set());
    const lastSongTitleRef = useRef<string>(currentSongTitle);
    const rafRef = useRef<number | null>(null);

    // Reset state on song change
    useEffect(() => {
        if (currentSongTitle !== lastSongTitleRef.current) {
            lastSongTitleRef.current = currentSongTitle;
            setCurrentMessage("");
            setMood('curious');
            setPose('chill');
            lastTriggeredTimestampRef.current = null;
            triggeredIndicesRef.current.clear();
        }
    }, [currentSongTitle]);

    // Polling Loop
    useEffect(() => {
        if (!isPlaying) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            return;
        }

        const tick = () => {
            if (!audioRef.current) return;
            const currentTime = audioRef.current.currentTime;

            checkTriggers(currentTime);

            rafRef.current = requestAnimationFrame(tick);
        };

        const checkTriggers = (currentTime: number) => {
            const convos = SONG_CONVOS[currentSongTitle];
            if (!convos) return;

            const timeOfDay = getTimeContext();

            convos.forEach((check, index) => {
                if (triggeredIndicesRef.current.has(index)) return;

                if (check.timeContext && check.timeContext !== 'any') {
                    if (check.timeContext !== timeOfDay) return;
                }

                const timeDiff = Math.abs(currentTime - check.timestamp);
                if (timeDiff < 0.8) { // Slightly tighter window to avoid pre-triggering
                    let text = "";
                    if (typeof check.text === 'function') {
                        text = check.text(nextSongTitle);
                    } else {
                        text = check.text;
                    }

                    setCurrentMessage(text);
                    setMood(check.mood);
                    if (check.pose) setPose(check.pose);

                    triggeredIndicesRef.current.add(index);
                    lastTriggeredTimestampRef.current = check.timestamp;
                }
            });
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isPlaying, currentSongTitle, audioRef, nextSongTitle]);

    return {
        text: currentMessage,
        mood,
        pose
    };
}

function getTimeContext(): 'morning' | 'day' | 'night' | 'late_night' {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return 'morning';
    if (h >= 11 && h < 18) return 'day';
    if (h >= 18 && h < 23) return 'night';
    return 'late_night';
}
