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
The script `process_new_songs.ts` uses smart logic to "distill" labels from filenames into the database `title`:
- **Version Detection**:
    - `slowed` or `reverb` anywhere in the filename $\rightarrow$ Appends `(Slowed & Reverb)` to the title.
    - `speed up` or `sped up` anywhere in the filename $\rightarrow$ Appends `(Sped Up)` to the title.
- **Cleaning Noise**: It recursively strips YouTube-style "noise" (e.g., `(Lyrics)`, `[Lirik]`, `(Official Music Video)`, etc.) to keep the title clean.
- **Hyphen to Em-dash**: It automatically replaces standard hyphens `-` with the premium em-dash `—` used throughout the UI.
- **Case Sensitivity**: If the input filename is completely lowercase, the script tries to capitalize words smartly (e.g., `ungu - lirik` $\rightarrow$ `Ungu — Lirik`).
- **Inversion Overrides**: The script contains hardcoded fixes for known inverted titles (e.g., `Aku Lelakimu — Virzha` $\rightarrow$ `Virzha — Aku Lelakimu`).

> [!TIP]
> **Preferred Naming**: For best results, name your files as `Artist - Title.mp3`.
> **Example**: `Virzha - Aku Lelakimu slowed.mp3` distills into:
> - **Title**: `Virzha — Aku Lelakimu (Slowed & Reverb)`
> - **Filename/Slug**: `virzha-aku-lelakimu-slowed-reverb.mp3`
> - **URL**: `/audio/virzha-aku-lelakimu-slowed-reverb.mp3`

## 5. Troubleshooting & Maintenance
If songs are not appearing or playing:
- **Resync Library**: Run `npx tsx scripts/normalize_library.ts`. This script audits the entire `public/audio` folder, slugifies any non-conforming files, and updates the database entries for every matching song.
- **Check Database**: Ensure the `audioUrl` in the database exactly matches the slugified filename in `public/audio/`.
