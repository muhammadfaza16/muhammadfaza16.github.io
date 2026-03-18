# 📡 Live Music Platform — Technical Documentation

> Last updated: 19 March 2026

## Overview

Live Music is a real-time synchronized radio feature. All listeners hear the same song at the same moment — the server calculates playback position from wall-clock time. The platform supports multiple simultaneous stations.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                        │
│                                                 │
│  LiveMusicProvider (sessionId?)                 │
│  ├── Primary <audio> (all events bound here)    │
│  ├── Preload <audio> (HTTP cache warmer only)   │
│  └── State: isPlaying, isTransitioning, etc.    │
│                                                 │
│  Live Hub (/music/live-hub)                     │
│  ├── Fetches /api/live-music/sessions           │
│  ├── Hero card = primary session                │
│  └── Station cards = secondary sessions         │
│                                                 │
│  Live Player (/music/live?session=<id>)         │
│  ├── Nested LiveMusicProvider with sessionId    │
│  └── LiveMusicPlayer component                  │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                   SERVER                        │
│                                                 │
│  /api/live-music          Admin start/stop      │
│  /api/live-music/now      Current song + seek   │
│  /api/live-music/next     Next song for preload │
│  /api/live-music/sessions All active sessions   │
│                                                 │
│  Position = (now - session.startedAt) % total   │
└─────────────────────┬───────────────────────────┘
                      │
              ┌───────▼───────┐
              │   Supabase    │
              │  PostgreSQL   │
              │  (Prisma ORM) │
              └───────────────┘
```

---

## Database Schema (Live-related)

```prisma
model LiveSession {
  id          String   @id @default(uuid())
  playlistId  String
  playlist    Playlist @relation(fields: [playlistId], references: [id])
  title       String?          // Custom station name
  description String?          // Station tagline
  startedAt   DateTime @default(now())
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([isActive])
}

model MusicAccessLog {
  id         String   @id @default(uuid())
  ip         String
  city       String?
  country    String?
  region     String?
  isp        String?
  userAgent  String?
  songTitle  String?
  sessionId  String?
  duration   Int      @default(0)
  latitude   Float?
  longitude  Float?
  timezone   String?
  postal     String?
  timestamp  DateTime @default(now())
  lastActive DateTime @default(now())
  @@index([timestamp])
  @@index([sessionId])
}
```

---

## API Endpoints

### `GET /api/live-music`
Admin. Returns all active sessions.

### `POST /api/live-music`
Admin. Actions: `start` (creates session), `stop` (ends session).
```json
// Start
{ "action": "start", "playlistId": "...", "title": "Station Name", "description": "..." }
// Stop specific
{ "action": "stop", "sessionId": "..." }
// Stop all
{ "action": "stop" }
```

### `GET /api/live-music/now?sessionId=X`
Public. Returns current song, seek position, tracklist, listener count.
Without sessionId → returns most recent active session.

### `GET /api/live-music/next?currentIndex=N&sessionId=X`
Public. Returns next song data for client-side preloading.

### `GET /api/live-music/sessions`
Public. Returns all active sessions enriched with current playing song.
Used by Live Hub for station cards.

---

## Audio Engine

### Sync Mechanism
Server computes position from wall-clock: `elapsed = (now - startedAt) / 1000`, then walks the playlist to find which song + seek position. Client fetches this and seeks to match.

### Predictive Preloading
1. `onTimeUpdate` monitors remaining time on current song
2. At ≤8 seconds remaining → fetch `/api/live-music/next` to get next song URL
3. Hidden preload `<audio>` element loads the URL → warms browser HTTP cache
4. When `onEnded` fires → primary element sets `src` to cached URL → browser loads from cache (near-instant)
5. Background `fetchAndSync({ metadataOnly: true })` refreshes metadata 500ms later

### Critical: No Ref Swapping
Previous implementation tried to swap `audioRef` and `preloadAudioRef` — this **breaks React event bindings**. Events like `onTimeUpdate`, `onEnded`, `onPlaying` are bound to the original DOM node, not the ref. After swap: events fire on wrong element → tracker stuck at 0, transitions fail.

**Rule: Never swap React refs between DOM elements. Always keep playback on the primary `<audio>` element.**

### Transition States
- `isWaitingForSync` — true during first play (shows spinner while initial fetch runs)
- `isTransitioning` — true during song changes (keeps spinner visible, prevents micro-pause flash)
- `isTransitioningRef` — mirror ref to prevent `onPause` from setting `isPlaying=false` mid-transition

---

## Key Files

| File | Purpose |
|------|---------|
| `src/components/live/LiveMusicContext.tsx` | Core engine: state, audio, sync, preload |
| `src/components/live/LiveMusicPlayer.tsx` | Player UI: controls, progress, tracklist |
| `src/app/music/live/page.tsx` | Full-screen player page (reads ?session) |
| `src/app/music/live-hub/page.tsx` | Station discovery hub |
| `src/app/music/layout.tsx` | Music layout (hides theme toggler on live pages) |
| `src/app/api/live-music/route.ts` | Admin start/stop API |
| `src/app/api/live-music/now/route.ts` | Current song + position API |
| `src/app/api/live-music/next/route.ts` | Next song preload API |
| `src/app/api/live-music/sessions/route.ts` | Active sessions listing API |

---

## Feature Roadmap

### ✅ Completed
- [x] Predictive preloading (zero-gap transitions)
- [x] Play button UX (sync spinner on first play + transitions)
- [x] Fix ref-swapping bug (transition gap + stuck tracker)
- [x] Phase 1: Multiple live sessions (schema, API, context, UI)

### ⬜ Phase 2 — Listener Presence
- Schema: Add `nickname`, `avatarSeed` to MusicAccessLog
- API: `/api/live-music/presence` — heartbeat + active listeners
- Hook: `usePresence()` — auto heartbeat every 30s
- Component: `<ListenerAvatars />` — avatar stack

### ⬜ Phase 3 — Reactions Feed
- Schema: New `LiveReaction` model
- API: `/api/live-music/reactions` — submit + poll
- Shared floating emoji animations (❤️🔥👏✨)

### ⬜ Phase 4 — Song Change Notification
- Browser Notification API (background tab)
- In-app `<SongChangeToast />` (foreground tab)

### ⬜ Phase 5 — Share Current Song
- API: `/api/live-music/share` — OG metadata
- Web Share API (mobile) / clipboard (desktop)

### ⬜ Phase 6 — Scheduled Sessions
- Schema: Add `scheduledAt`, `endedAt` to LiveSession
- API: `/api/live-music/schedule`
- UI: "Coming Up" section with countdown

### ⬜ Phase 7 — Offline Fallback
- API: `/api/live-music/highlights`
- UI: "Recently Played" + graceful offline state

### ⬜ Phase 8 — Analytics Dashboard
- API: `/api/live-music/analytics`
- Page: `/music/live-analytics` (admin)

---

## Known Gotchas

1. **Prisma generate on Windows** — Sometimes fails with `EPERM: operation not permitted` when dev server holds a lock on the DLL. Kill the dev server first, or just run `npx next build` which handles regeneration.
2. **`useSearchParams()` in Next.js** — Must be wrapped in `<Suspense>` boundary for static export. The live player page uses this pattern.
3. **iOS Safari scroll lock** — Live player page locks `body.overflow = hidden` and `overscrollBehavior = none` to prevent rubber-banding. Restored on unmount.
4. **Multi-provider nesting** — Root layout has a default `LiveMusicProvider` (no sessionId). Live player page nests a second provider with the specific sessionId, which overrides the context for that subtree.
