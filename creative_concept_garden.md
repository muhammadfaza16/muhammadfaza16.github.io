# Creative Concept V3: The 5 Pillars of Existence

> "A Portfolio, A Sanctuary, A Museum, A Love Letter, and A Blueprint."

## 1. The Open Garden (The Public Persona)
*   **Role:** The Professional Face.
*   **Content:**
    *   **About Me:** The narrative bio.
    *   **Projects:** Detailed case studies.
    *   **Professional Journey:** CV/Resume.
*   **Design Idea:** **"Constellation of Works"**. Instead of a grid, projects are stars connected by lines (skills). Hovering a skill lights up related projects.

## 2. Private Garden (The Inner Sanctum)
*   **Role:** The Authentic Self (Me Time).
*   **Access:** Locked (Owner Only).
*   **Content:**
    *   **The Library:** (Bookshelf) Visual spine view of read/reading books.
    *   **Cinema Paradiso:** (Movie List) Poster wall of watched films.
    *   **The Vault:** (Ideas/TIL) Raw snippets of code or thoughts.
    *   **Wishlist:** Items or goals.
*   **Design Idea:** Cozy, warm lighting. Maybe a "Cabin in the woods" vibe or a "Relaxing Space Station" interior aesthetic.

## 3. Garden of the Angel (The Twin Star)
*   **Role:** The Devotion.
*   **Access:** Shared (Passcode).
*   **Content:**
    *   **Time Capsules:** Messages locked until a date.
    *   **Support System:** A "Panic Button" that shows comforting messages/photos when pressed.
    *   **Letters:** Epistolary format.
*   **Design Idea:** Ethereal, soft pink/gold. "The only place in the universe that feels like home."

## 4. The Museum of Existence (The Grand Archive)
*   **Role:** The Objective Truth. Pure Knowledge.
*   **Philosophy:** Detached from the author. Showcasing the universe's beauty.
*   **Content:**
    *   **The Timeline of Everything:** A massive horizontal scroll journey.
        *   *Tracks:* Science (Big Bang -> AI), Politics (Empires -> UN), Earth (Pangea -> Anthropocene).
    *   **Deep Facts:** The `DidYouKnow` / `DeepThought` content lives here.
*   **Design Idea:** Clean, museum-style typography (Helvetica/Inter). Minimalist. High contrast. 

## 5. The Engine Room (The Meta Garden)
*   **Role:** The Mechanic's Workshop.
*   **Content:**
    *   **Blueprint:** Tech Stack visualization (Dependencies as nodes).
    *   **Changelog:** The "App's Diary". Not just "Bug fix", but "Why I built this".
    *   **System Status:** Real-time uptime or "Vitals".
*   **Design Idea:** "Wireframe" or "Terminal" aesthetic. Green/Amber monochrome mode option.

---

## 2. Navigation Strategy
Since these are 5 distinct "Worlds", the Homepage acts as the **Hub**.
*   **Central Visual:** The Wanderer/Avatar floating in the center.
*   **Orbits:** 5 "Planets" or "Gates" orbiting the user.
    *   Clicking "The Museum" warps the screen to that aesthetic.
    *   Clicking "The Engine" strips the UI down to wireframes.

---

## 3. Implementation Roadmap
1.  **Refactor Directory Structure:**
    *   `src/app/garden/open/...`
    *   `src/app/garden/private/...`
    *   `src/app/garden/angel/...`
    *   `src/app/museum/...`
    *   `src/app/meta/...`
2.  **Build The Museum:**
    *   Focus on the "Timeline" component (Horizontal Scroll).
3.  **Refactor Existing:**
    *   Move `PostList` to Open Garden.
    *   Move `DeepThinking` to Museum.
