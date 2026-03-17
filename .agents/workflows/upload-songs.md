---
description: How to upload and normalize new songs in the music library
---

# Music Library Management Workflow

To ensure permanent playback stability and visual consistency, all new songs must follow the established normalization pipeline.

## 1. Preparation
Place new `.mp3` files in the following directory:
`c:\Users\ThinkPad\.gemini\antigravity\scratch\muhammadfaza16.github.io\public\audio\new song to populate\`

> [!TIP]
> Try to ensure files are named loosely as `Artist - Title.mp3` for the automated scanner to pick up metadata correctly.

## 2. Execution
Run the automated ingestion script to slugify filenames and update the database:
```powershell
npx tsx scripts/process_new_songs.ts
```

## 3. What the Script Does (The Standard)
The script automatically enforces these rules:
1.  **Database Title**: Stored as "Pretty" text (e.g., `Artist — Title (Slowed & Reverb)`). This is what users see in the UI.
2.  **Filename (Slug)**: Stored as a URL-safe slug (e.g., `artist-title-slowed-reverb.mp3`). This ensures stable playback across all browsers.
3.  **URL**: Automatically generates `/audio/slug-name.mp3` without needing complex encoding.

## 4. Metadata Distillation Rules
The script `process_new_songs.ts` uses smart regex to "distill" labels from filenames into the database `title`:
- **Versions**: If it finds `slowed`, `reverb`, or `sped up` (case-insensitive) in the filename, it appends `(Slowed & Reverb)` or `(Sped Up)` to the title properly.
- **Cleaning**: It automatically strips YouTube-style "noise" like `(Official Music Video)`, `(Lyrics)`, `[Lirik]`, or random YouTube IDs in brackets.
- **Dashes**: It converts simple hyphens `-` into the premium em-dash `—` used in the UI.

> [!NOTE]
> If a filename is `Virzha - Aku Lelakimu slowed.mp3`, the script distills it into:
> - **Title**: `Virzha — Aku Lelakimu (Slowed & Reverb)`
> - **Slug**: `virzha-aku-lelakimu-slowed-reverb.mp3`

## 4. Troubleshooting
If songs are not appearing or playing:
- Run `npx tsx scripts/normalize_library.ts` to perform a full audit and resync of the existing library.
- Verify the physical file exists in `public/audio/` with the exact slug name found in the database `audioUrl` field.
