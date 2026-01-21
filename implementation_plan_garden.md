# Implementation Plan: The Celestial Gardens (Final)

# Goal Description
Restructure the application into a **5-Pillar Universe** ("Celestial Gardens"), creating distinct environments for professional, personal, intimate, educational, and technical content.

## User Review Required
> [!IMPORTANT]
> **Navigation Change:** Homepage (`/`) becomes the "Star Map" (Hub), not a feed.
> **Auth:** V1 uses Client-side Hashing for privacy (obscurity).

## Proposed Changes

### 1. Core Architecture (Routing)
*   **[NEW] Route Groups:** Organize by access level.
    *   `src/app/(public)/museum/page.tsx`
    *   `src/app/(public)/open/page.tsx`
    *   `src/app/(public)/engine/page.tsx`
    *   `src/app/(private)/sanctuary/page.tsx` (Angel - renamed for obscurity)
    *   `src/app/(private)/void/page.tsx` (Private - renamed for obscurity)

### 2. The Hub (Homepage)
*   **Component:** `StarMap.tsx`
*   **Features:**
    *   Interactive Orrery/Solar System navigation.
    *   5 Distinct Entry Points (Planets/Stars).

### 3. The Gardens (Feature Breakdown)

#### A. The Open Garden (Portfolio)
*   **Component:** `ConstellationLayout.tsx`
*   **Features:**
    *   `ProjectConstellation`: Nodes (projects) connected by lines (skills).
    *   `SignalReceiver`: Rebranded Contact Form (Radar aesthetic).

#### B. The Museum (Knowledge)
*   **Component:** `MuseumLayout.tsx`
*   **Features:**
    *   `TimelineOfEverything`: Horizontal scroll (Science, History, Politics tracks).
    *   `FactCurator`: Existing `DidYouKnow` / `DeepThought` content.

#### C. The Garden of the Angel (Sanctuary) -> `/sanctuary`
*   **Component:** `SanctuaryLayout.tsx`
*   **Theme:** "The Oasis" (Morning Light / Healing).
*   **Features:**
    *   `ComfortStation`: Breathing guide, calming audio.
    *   `TheMirror`: Validation module.
    *   `StarGlass`: Worry jar (Input -> Delete animation).
    *   `GardenChime`: "New Content" functionality (Local Storage check vs Timestamp).

#### D. The Private Garden (The Void) -> `/void`
*   **Component:** `VoidLayout.tsx`
*   **Theme:** "Cabin" or "Space Station".
*   **Features:**
    *   `VisualBookshelf`: Spine view.
    *   `CinemaWall`: Poster grid.
    *   `TheVent`: Private text dump.

#### E. The Engine Room (Meta)
*   **Component:** `EngineLayout.tsx`
*   **Theme:** Wireframe/Terminal.
*   **Features:** `TechBlueprint`, `Changelog`.

### 4. Shared Utilities
*   **Auth:** `StarGate` component (Input Code -> Session Unlock).
*   **Navigation:** `WarpDrive` transition effect between gardens.

---

## Verification Plan
1.  **Routing:** Verify all 5 paths load distinct layouts.
2.  **Auth:** Verify `/sanctuary` and `/void` redirect to `StarGate` if locked.
3.  **Chime:** Verify "New Content" indicator appears when data timestamp > last visit.
