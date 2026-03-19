---
description: How to continue building the Curation Super App multi-vertical expansion (Books, Skills Lab, Frameworks, Codex pages)
---

# Curation Super App — Full Handover & Build Guide

> **Read this entire document before doing anything.** This is the definitive guide for continuing the multi-vertical curation expansion project.

---

## 1. PROJECT CONTEXT

The user (`muhammadfaza16`) has a personal website built with **Next.js 16 + Tailwind CSS + Prisma + PostgreSQL**. The `/curation` section is a knowledge curation app that currently only supports **Articles** (sourced from X/Twitter threads with AI-generated summaries).

The goal is to expand it into a **5-vertical knowledge super app**:

| # | Vertical | Route | DB Model | Status |
|---|---|---|---|---|
| 1 | **Articles** | `/curation` (existing) | `Article` | ✅ Fully built |
| 2 | **Books** | `/curation/books` | `Book` | ⬜ Needs UI pages |
| 3 | **Skills Lab** | `/curation/skills` | `Course` | ⬜ Needs UI pages |
| 4 | **Frameworks** | `/curation/frameworks` | `Framework` | ⬜ Needs UI pages |
| 5 | **Codex** | `/curation/codex` | `Codex` | ⬜ Needs UI pages |

---

## 2. WHAT IS ALREADY DONE (Phase 1 — Foundation)

**All backend infrastructure is complete and build-verified (`npx next build` → exit code 0).**

### Files created in Phase 1:

| File | What it does |
|---|---|
| `src/lib/curation-config.ts` | Shared constants: `VERTICALS`, `CATEGORIES`, `BOOK_STATUSES`, `SOURCE_TYPES`, `DIFFICULTY_LEVELS`, `FRAMEWORK_TYPES`, `CODEX_STATUSES` + helper functions |
| `src/types/curation.ts` | TypeScript interfaces: `BookEntry`, `SkillEntry`, `FrameworkEntry`, `CodexEntry`, `ListResponse<T>`, `MutationResponse<T>` |
| `src/app/api/curation/books/route.ts` | GET (list with ?category, ?status, ?sortBy) + POST (admin-only create) |
| `src/app/api/curation/books/[id]/route.ts` | GET single + PUT update + DELETE (admin-only) |
| `src/app/api/curation/skills/route.ts` | GET (list with ?category, ?difficulty) + POST |
| `src/app/api/curation/skills/[id]/route.ts` | GET + PUT + DELETE |
| `src/app/api/curation/frameworks/route.ts` | GET (list with ?category, ?type) + POST |
| `src/app/api/curation/frameworks/[id]/route.ts` | GET + PUT + DELETE |
| `src/app/api/curation/codex/route.ts` | GET (list with ?category, ?domain) + POST |
| `src/app/api/curation/codex/[id]/route.ts` | GET + PUT + DELETE |

### Files modified in Phase 1:

| File | What changed |
|---|---|
| `prisma/schema.prisma` | Extended `Book` model (added status, verdict, takeaways, category, finishedAt, indexes). Added `Course`, `Framework`, `Codex` models |
| `src/app/master/actions.ts` | Full CRUD server actions for Book (updated signature to object params), Course, Framework, Codex |
| `src/app/curation/layout.tsx` | `shouldShowDock` logic now includes `/curation/books`, `/skills`, `/frameworks`, `/codex` |
| `src/app/master/page.tsx` | Fixed `createBook`/`updateBook` call sites to use new object-based signatures |

---

## 3. WHAT REMAINS (Phase 2–7)

You need to build **8 new page files** (list + detail for each of the 4 verticals) and optionally update the home page.

### Phase 2: Home Page Enhancement (OPTIONAL — can be deferred)
- Add vertical nav pills below the hero in `src/app/curation/page.tsx`
- This is a 93KB file — be very careful editing it. The simplest approach: add a horizontal scrollable pill bar at line ~940 (just before the article feed starts rendering)

### Phase 3: Books Vertical (PRIORITY — do this first)
- `src/app/curation/books/page.tsx` — bookshelf grid page
- `src/app/curation/books/[id]/page.tsx` — book detail page

### Phase 4: Skills Lab Vertical
- `src/app/curation/skills/page.tsx` — skills content feed
- `src/app/curation/skills/[id]/page.tsx` — skill detail/reader page

### Phase 5: Frameworks Vertical
- `src/app/curation/frameworks/page.tsx` — frameworks grid
- `src/app/curation/frameworks/[id]/page.tsx` — framework detail page

### Phase 6: Codex Vertical
- `src/app/curation/codex/page.tsx` — codex entries list
- `src/app/curation/codex/[id]/page.tsx` — codex doctrine detail page

---

## 4. CRITICAL GOTCHAS & RULES

### 4.1 Next.js 16 Params
This project uses **Next.js 16.1.1**. The `params` in dynamic route handlers and page components are **Promises**:

```typescript
// API Routes — CORRECT:
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // ...
}

// Page Components — CORRECT:
export default async function PageName({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // ... BUT if "use client" page, use useParams() hook instead
}
```

### 4.2 Client Components
All curation pages use `"use client"` at the top. For extracting the `id` param in client components, use:
```typescript
"use client";
import { useParams } from "next/navigation";

export default function BookDetail() {
    const { id } = useParams<{ id: string }>();
    // ...
}
```

### 4.3 Theme Support
The app has dark/light theme via `useTheme()` from `@/components/ThemeProvider`. EVERY new page MUST support both themes. Use Tailwind `dark:` prefix for all colors:
```
bg-white dark:bg-zinc-900
text-zinc-900 dark:text-zinc-100
border-zinc-200 dark:border-zinc-800
```

### 4.4 Admin Check Pattern
To check if visitor is admin (for showing edit/create buttons):
```typescript
const [isAdmin, setIsAdmin] = useState(false);
useEffect(() => {
    fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); });
}, []);
```

### 4.5 Image Upload Pattern
For admin forms with image upload, use:
```typescript
import { uploadImageToSupabase } from "@/lib/uploadImage";
// Then in your save handler:
const uploadedUrl = await uploadImageToSupabase(file);
```

### 4.6 Reusable Components Available
Import from `@/components/sanctuary`:
- `BottomSheet` — modal slide-up form sheet
- `ImagePicker` — image file selector with preview
- `QuickPasteInput` — input field with clipboard paste support
- `RichTextEditor` — rich text editor for content

### 4.7 Animation Library
The project uses `framer-motion` for animations. Import from `framer-motion`:
```typescript
import { motion, AnimatePresence } from "framer-motion";
```

### 4.8 Icons
Use `lucide-react` for all icons:
```typescript
import { BookOpen, ArrowLeft, Star, Plus } from "lucide-react";
```

### 4.9 Toast Notifications
```typescript
import { Toaster, toast } from "react-hot-toast";
// In JSX: <Toaster position="bottom-center" toastOptions={{...}} />
toast.success("Done!"); toast.error("Failed");
```

### 4.10 Database Migration
If deploying to production, you MUST run:
```bash
npx prisma migrate dev --name add-curation-verticals
```
The schema changes are already saved in `prisma/schema.prisma`, but the migration file hasn't been created yet. Run the above command ONCE before deploying.

---

## 5. STEP-BY-STEP: Building the Books Vertical (Reference Pattern)

This is the **exact template** to follow for every vertical. Build Books first, then copy the pattern for Skills, Frameworks, and Codex.

### Step 5.1: Create `src/app/curation/books/page.tsx`

This is a `"use client"` page. Here's the structure:

```
1. "use client" + imports (React, framer-motion, lucide-react, next/navigation, next/link)
2. Import types from "@/types/curation" (BookEntry)
3. Import config from "@/lib/curation-config" (CATEGORIES, BOOK_STATUSES)
4. Import theme from "@/components/ThemeProvider" (useTheme)
5. Component state:
   - books: BookEntry[] — fetched from API
   - loading: boolean
   - activeStatus: string — filter by book status
   - activeCategory: string — filter by category
   - isAdmin: boolean
   - isSheetOpen: boolean — for add/edit form
   - editBook: BookEntry | null — editing state
   - form fields: title, author, review, imageUrl, status, verdict, takeaways, category, rating, url
6. useEffect: fetch books from /api/curation/books (with query params)
7. useEffect: check admin status
8. Render:
   a. Header with back button (Link to /curation), title "Books", add button (admin only)
   b. Status filter pills (horizontal scroll): All | Want to Read | Reading | Finished | Abandoned
   c. Category filter pills (optional second row)
   d. Grid of book cards (2 columns, aspect-[3/4] for book cover look)
   e. Each card: cover image, title, author, rating stars, status badge
   f. Click card → navigate to /curation/books/{id}
   g. BottomSheet form for admin create/edit
   h. Padding-bottom for dock (pb-24)
```

**Key styling to match existing app:**
- Page background: `bg-[#fafaf8] dark:bg-[#050505]`
- Card background: `bg-white dark:bg-zinc-900`
- Card shadow: `shadow-[0_2px_12px_rgb(0,0,0,0.04)]`
- Card border radius: `rounded-2xl`
- Text: `font-bold tracking-tight` for titles
- Pill buttons: `rounded-full px-4 py-1.5 text-[13px] font-bold`
- Active pill: `bg-zinc-900 dark:bg-white text-white dark:text-zinc-900`
- Inactive pill: `bg-white dark:bg-zinc-800 text-zinc-500`
- Header height area: `pt-14 px-5`

### Step 5.2: Create `src/app/curation/books/[id]/page.tsx`

This is a `"use client"` page. Structure:

```
1. "use client" + imports
2. useParams() to get id
3. Fetch book from /api/curation/books/{id}
4. Render:
   a. Back button (router.back() or Link to /curation/books)
   b. Hero section: large cover image
   c. Title + Author (prominent)
   d. Rating (star display)
   e. Status badge
   f. Verdict section (if exists) — styled as a callout/quote
   g. Key Takeaways section (if exists 0 rendered as bullet points or numbered list
   h. Full Review section (if exists) — rendered as rich text
   i. Category badge at bottom
   j. Admin: edit/delete buttons
   k. Admin: BottomSheet edit form (same fields as list page)
```

### Step 5.3: Verify

```bash
npx next build
```
Must pass with exit code 0. Then test the pages locally.

---

## 6. ADAPTING THE PATTERN FOR OTHER VERTICALS

### Skills Lab (`/curation/skills`)
- Fetch from: `/api/curation/skills`
- Type: `SkillEntry` from `@/types/curation`
- Config: `SOURCE_TYPES`, `DIFFICULTY_LEVELS` from `@/lib/curation-config`
- Filter pills: Category + Difficulty
- Card layout: Similar to articles. Each card shows: title, source badge, difficulty badge, category
- Detail page: Full content rendered as rich text (similar to article reader). Has source attribution
- **Key difference from Books**: Content is long-form text (uploaded reading material), so the detail page should feel like a reader, not a review page

### Frameworks (`/curation/frameworks`)
- Fetch from: `/api/curation/frameworks`
- Type: `FrameworkEntry` from `@/types/curation`
- Config: `FRAMEWORK_TYPES` from `@/lib/curation-config`
- Note: Framework uses `name` field instead of `title`
- Filter pills: Category + Type (mental-model, decision-framework, playbook, principle)
- Card layout: Clean grid, each card has: type emoji, name, one-line summary, category badge
- Detail page: Immersive — name, type badge, summary, "When to use" callout, full content, source

### Codex (`/curation/codex`)
- Fetch from: `/api/curation/codex`
- Type: `CodexEntry` from `@/types/curation`
- Config: `CODEX_STATUSES` from `@/lib/curation-config`
- Filter pills: Category + Domain
- Card layout: Each card shows: title, one-line conviction, domain badge, status indicator (evolving/solidified)
- Detail page: Title, conviction statement (large/prominent typography), full content, status badge, timestamps
- **Key difference**: This is the most personal/legacy-defining vertical. The UI should feel weighty and intentional

---

## 7. PRISMA SCHEMA REFERENCE (current state)

```prisma
model Book {
  id         String    @id @default(uuid())
  title      String
  author     String
  review     String?
  rating     Int       @default(0)
  status     String    @default("want-to-read")
  verdict    String?
  takeaways  String?
  category   String?
  finishedAt DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  imageUrl   String?   @map("image_url")
  url        String?
  @@index([category])
  @@index([status])
}

model Course {
  id         String   @id @default(uuid())
  title      String
  content    String?
  source     String?
  sourceType String?
  category   String?
  difficulty String?
  imageUrl   String?  @map("image_url")
  url        String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@index([category])
}

model Framework {
  id        String   @id @default(uuid())
  name      String
  type      String   @default("mental-model")
  summary   String?
  content   String?
  source    String?
  whenToUse String?
  category  String?
  imageUrl  String?  @map("image_url")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([category])
  @@index([type])
}

model Codex {
  id         String   @id @default(uuid())
  title      String
  domain     String?
  content    String?
  conviction String?
  status     String   @default("evolving")
  category   String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@index([category])
  @@index([domain])
}
```

---

## 8. API ENDPOINTS REFERENCE (all working)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/curation/books?category=X&status=Y&sortBy=Z` | No | List books |
| POST | `/api/curation/books` | Admin | Create book |
| GET | `/api/curation/books/:id` | No | Single book |
| PUT | `/api/curation/books/:id` | Admin | Update book |
| DELETE | `/api/curation/books/:id` | Admin | Delete book |
| GET | `/api/curation/skills?category=X&difficulty=Y` | No | List courses |
| POST | `/api/curation/skills` | Admin | Create course |
| GET | `/api/curation/skills/:id` | No | Single course |
| PUT | `/api/curation/skills/:id` | Admin | Update course |
| DELETE | `/api/curation/skills/:id` | Admin | Delete course |
| GET | `/api/curation/frameworks?category=X&type=Y` | No | List frameworks |
| POST | `/api/curation/frameworks` | Admin | Create framework |
| GET | `/api/curation/frameworks/:id` | No | Single framework |
| PUT | `/api/curation/frameworks/:id` | Admin | Update framework |
| DELETE | `/api/curation/frameworks/:id` | Admin | Delete framework |
| GET | `/api/curation/codex?category=X&domain=Y` | No | List codex entries |
| POST | `/api/curation/codex` | Admin | Create codex entry |
| GET | `/api/curation/codex/:id` | No | Single codex entry |
| PUT | `/api/curation/codex/:id` | Admin | Update codex entry |
| DELETE | `/api/curation/codex/:id` | Admin | Delete codex entry |

All API responses follow:
- List: `{ items: T[], totalCount: number }`
- Single: `{ success: true, data: T }`
- Create: `{ success: true, data: T }` (status 201)
- Error: `{ error: "message" }` (status 4xx/5xx)

---

## 9. SERVER ACTIONS REFERENCE (in `src/app/master/actions.ts`)

Available server actions for each vertical:

```
Books:      getBooks(options?), getBookById(id), createBook(data), updateBook(id, data), deleteBook(id)
Courses:    getCourses(options?), getCourseById(id), createCourse(data), updateCourse(id, data), deleteCourse(id)
Frameworks: getFrameworks(options?), getFrameworkById(id), createFramework(data), updateFramework(id, data), deleteFramework(id)
Codex:      getCodexEntries(options?), getCodexById(id), createCodexEntry(data), updateCodexEntry(id, data), deleteCodexEntry(id)
```

You can use either the API routes (fetch from client) or the server actions (direct import in "use server" contexts). For client pages, use `fetch()` to hit the API routes.

---

## 10. DESIGN LANGUAGE REFERENCE

The existing curation app uses a very specific design language. **Match this exactly.**

### Colors
```
Background:       bg-[#fafaf8] dark:bg-[#050505]
Card:             bg-white dark:bg-zinc-900
Card shadow:      shadow-[0_2px_12px_rgb(0,0,0,0.04)]
Text primary:     text-zinc-900 dark:text-zinc-100
Text secondary:   text-zinc-500 dark:text-zinc-400
Border:           border-zinc-200/50 dark:border-zinc-800
Active pill:      bg-zinc-900 dark:bg-white text-white dark:text-zinc-900
Inactive pill:    bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400
```

### Typography
```
Page title:       text-[24px] font-bold tracking-tight
Section title:    text-[17px] font-bold tracking-tight
Card title:       text-[15px] font-bold tracking-tight
Card subtitle:    text-[13px] text-zinc-500 font-medium
Badge text:       text-[11px] font-bold uppercase tracking-wider
```

### Spacing & Layout
```
Page padding:     px-5 pt-14
Card radius:      rounded-2xl
Pill radius:      rounded-full
Grid gap:         gap-4
Bottom padding:   pb-24 (to clear the dock navigation)
```

### Animations (framer-motion)
```typescript
// Page enter
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}

// Card tap
whileTap={{ scale: 0.97 }}

// Staggered list items
transition={{ delay: index * 0.05 }}
```

---

## 11. FILE TREE OF WHAT EXISTS vs WHAT TO BUILD

```
src/app/curation/
├── layout.tsx              ✅ DONE (dock updated)
├── page.tsx                ✅ EXISTS (article feed — optionally add vertical pills later)
├── [id]/page.tsx           ✅ EXISTS (article detail reader)
├── discover/page.tsx       ✅ EXISTS
├── library/page.tsx        ✅ EXISTS
├── collections/page.tsx    ✅ EXISTS
├── highlights/page.tsx     ✅ EXISTS
├── recap/page.tsx          ✅ EXISTS
├── profile/page.tsx        ✅ EXISTS
├── dashboard/page.tsx      ✅ EXISTS (placeholder)
│
├── books/                  ⬜ TO BUILD
│   ├── page.tsx            ⬜ Bookshelf grid
│   └── [id]/page.tsx       ⬜ Book detail
│
├── skills/                 ⬜ TO BUILD
│   ├── page.tsx            ⬜ Skills Lab feed
│   └── [id]/page.tsx       ⬜ Skill detail/reader
│
├── frameworks/             ⬜ TO BUILD
│   ├── page.tsx            ⬜ Frameworks grid
│   └── [id]/page.tsx       ⬜ Framework detail
│
└── codex/                  ⬜ TO BUILD
    ├── page.tsx            ⬜ Codex entries list
    └── [id]/page.tsx       ⬜ Codex doctrine detail

src/app/api/curation/
├── route.ts                ✅ EXISTS (articles API)
├── [id]/route.ts           ✅ EXISTS (article detail API)
├── books/route.ts          ✅ DONE
├── books/[id]/route.ts     ✅ DONE
├── skills/route.ts         ✅ DONE
├── skills/[id]/route.ts    ✅ DONE
├── frameworks/route.ts     ✅ DONE
├── frameworks/[id]/route.ts ✅ DONE
├── codex/route.ts          ✅ DONE
└── codex/[id]/route.ts     ✅ DONE
```

---

## 12. EXECUTION ORDER

1. **Build Books vertical** (`/curation/books` + `/curation/books/[id]`) — use Section 5 as exact template
2. **Build Skills vertical** — adapt Books pattern, but detail page is a reader (long-form content)
3. **Build Frameworks vertical** — adapt Books pattern, note `name` instead of `title`
4. **Build Codex vertical** — adapt Books pattern, conviction statement is the hero element
5. **After all verticals**: optionally add vertical nav pills to the home page (`/curation/page.tsx`)
6. **After each step**: run `npx next build` to verify

---

## 13. VERIFICATION CHECKLIST

After building each vertical, verify:

- [ ] `npx next build` passes (exit code 0)
- [ ] List page loads and fetches data from API
- [ ] Empty state shows gracefully (no items yet)
- [ ] Filter pills work (category, status/type/difficulty)
- [ ] Admin: add button visible, form opens, create works
- [ ] Admin: edit button visible, form pre-fills, update works
- [ ] Admin: delete works
- [ ] Detail page loads and renders all fields
- [ ] Dark mode looks correct on both list and detail pages
- [ ] Bottom dock navigation is visible on list pages
- [ ] Back navigation works from detail pages
- [ ] Page has `pb-24` so content doesn't hide behind dock
