# Narrative Engine Design: The "Holistic Intellectual" Persona

This document captures the design concepts for the new song conversation system, replacing the random one-liners with a context-aware, timed narrative flow.

## 1. Core Philosophy
The goal is to move from a "DJ" persona to an "Intellectual Crush" persona. The Avatar should feel like it has a memory and deep knowledge of the entire application content (Science, History, Philosophy), bridging those topics naturally into romantic/flirty conversations.

## 2. Conversation Flow (The "Slow Burn")
Instead of random messages, each song will follow a 3-act structure to simulate a natural conversation curve:

### Phase 1: The Hook (Intro / 00:00 - 00:45)
*   **Goal:** Casual opener. Discusses the *situation* or *feeling*, not just the song.
*   **Tone:** "Gila, ini jam segini loh..." / "Kadang gue mikir..."

### Phase 2: The Bridge (Context / Mid-Song)
*   **Goal:** Connecting the situation to the song or a broader topic.
*   **Mechanism:** Cross-referencing other app sections:
    *   **Science (Did You Know):** Referencing time, space, neuroscience.
    *   **Philosophy (Deep Thought):** Referencing stoicism, existentialism.
    *   **History (On This Day):** Referencing nostalgia, timelines.

### Phase 3: The Core (Deep / Pre-Chorus / Drop)
*   **Goal:** Emotional payoff. Specific, hard-hitting romance.
*   **Tone:** "I don't care where we go, as long as it's with you."

## 3. Technical Mechanism: Timestamp Triggers
To achieve "Frame Perfect" immersion, we will use specific timestamps (LRC-style) rather than generic intervals.

*   **Logic:** `AudioContext.currentTime` matches defined triggers.
*   **Benefit:** Reactions sync perfectly with lyrics, beat drops, or silence.

## 4. Feature: Inter-Song Bridging (Playlist Context)
To make the library feel cohesive, conversations will reference other songs in the playlist.

*   **Mechanism:** `AudioContext` will expose the `nextSong` or `playlist` state to the narrative engine.
*   **Trigger (Outro / Last 10s):**
    *   *Context:* If the next song is known (e.g. Shuffle is OFF or Next in Queue).
    *   *Tone:* "Hype man" or "Smooth Transition".
    *   *Example:* "Abis ini 'Yellow'-nya Coldplay kan? Siap-siap tisu."
*   **Thematic Links:**
    *   If current song is "Faded", referencing similar vibes: "This reminds me of 'Heroes Tonight'. Same energy, different font."

## 5. Feature: The Complete Package (Polish)
To elevate the experience from "Program" to "Persona":

### A. The "Deja Vu" Effect (Memory)
*   **Logic:** Track play count of specific songs in `localStorage` or session.
*   **Reaction:** If played 3x in a row -> "Oke, ini ketiga kalinya. *You okay?* Atau emang lagi enak vibenya?"
*   **Impact:** User feels observed and cared for.

### B. Narrative Body Language
*   **Logic:** Sync avatar animation with conversation topic, not just music beat.
*   **States:**
    *   *Flirty* -> Leaning in (Condong depan)
    *   *Deep* -> Chill/Head down/Slow bob
    *   *Hype* -> Bouncing/Active
*   **Implementation:** Add `pose` field to conversation data.

### C. "Pause" Banter
*   **Logic:** Triggered when `isPlaying` goes from `true` to `false` mid-song.
*   **Reaction:** "Yah... lagi enak-enaknya. Toilet break?" or "Jangan lama-lama."
*   **Impact:** Agency. The avatar "minds" being interrupted.

## 6. Feature: The Warm Welcome (Narrative Onboarding)
A dedicated "Opening Conversation" for first-time visitors to smooth the transition into the app.

*   **Logic:** Check `localStorage` for `has_met_avatar`.
*   **Trigger:** First interaction (Click/Tap) OR Autoplay (if allowed).
*   **Flow:**
    1.  **Greeting:** "Hey... you made it." (Not jumping straight to music).
    2.  **Context Setting:** "This isn't just a playlist. It's a collection of my thoughts. Ready to dive in?"
    3.  **Action:** "Pick a song. Any song. Let's see where it takes us."
*   **Impact:** Sets the "Persona" tone immediately. Not a tool, but a host.

## 7. Feature: First Music Onboarding (The First Play)
Ensuring the very first song played feels special, not just a standard flow.

*   **Logic:** Check `localStorage` for `has_played_music`.
*   **Trigger:** When user hits PLAY for the very first time.
*   **Flow:**
    *   *Override Phase 1 (Hook):* Instead of generic opener, say: "Good choice for a first track." or "Finally. I've been waiting for you to press play."
    *   *Then:* Transition normally into Phase 2 (Bridge).
*   **Impact:** Acknowledges the "start" of the shared listening session.

## 8. Proposed Data Structure

```typescript
type ConversationTopic = 'science' | 'philosophy' | 'history' | 'romance' | 'casual' | 'music_bridge';

interface ConversationCheck {
    timestamp: number; // Seconds
    text: string | ((nextSongTitle?: string) => string); // Dynamic text creator
    topic: ConversationTopic;
    mood: 'curious' | 'intense' | 'smart' | 'flirty';
    pose?: 'leaning_in' | 'chill' | 'bouncing' | 'annoyed'; // Body language override
    memoryCheck?: { type: 'streak', count: number, message: string }; // Optional memory trigger
}

export const SONG_CONVOS: Record<string, ConversationCheck[]> = {
    "Alan Walker — Faded": [
        {
            timestamp: 5, 
            text: "Lagu ini... vibes-nya selalu bikin gue ngerasa ilang arah. In a good way.",
            topic: 'casual',
            mood: 'curious'
        },
        {
            timestamp: 53, // The Drop
            text: "Dengerin deh background vocal-nya... merinding ga sih?",
            topic: 'romance',
            mood: 'intense'
        },
        {
            timestamp: 120, // Bridge
            text: "Anyway, pernah baca ga? Katanya memori pudar itu sebenernya mekanisme otak biar kita ga gila. Keren ya?",
            topic: 'science', // References "Did You Know"
            mood: 'smart'
        }
    ]
};
```

## 9. Next Steps
1.  **Pilot Project:** Implement this structure for 1-2 key songs (e.g., "Faded").
2.  **Data Collection:** Gather timestamps and timestamps for "Key Moments" in these songs.
3.  **Engine Update:** Update `CurrentlyStrip.tsx` (or a new `NarrativeEngine.tsx`) to consume this new timeline-based data.
