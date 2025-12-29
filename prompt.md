# Public ADU Issue Documentation Website — Build Prompt (Cloudflare Pages + R2 + Astro)

**Use this as a single “master prompt” for Claude Code (or any coding agent).**  
Goal: generate a production-ready, static, public website that documents ADU construction issues with photos/videos hosted on Cloudflare R2, and the site hosted on Cloudflare Pages.

---

## 0) High-level requirements

### Must-have
- **Static site** (no server required): **Astro** + TypeScript.
- **Hosting**: Cloudflare Pages.
- **Media storage**: Cloudflare R2 (public read via a public bucket + custom domain or the R2 public URL).
- **Pages**
  - `/` Overview (summary of all issues + latest update)
  - `/timeline` Timeline of events (date-based entries)
  - `/issues/wall-cracks`
  - `/issues/doors-not-closing`
  - `/issues/water-heater-door`
  - `/issues/window-left-open-water-intrusion`
  - `/gallery` Filterable gallery (by issue, room, media type, date)
  - `/downloads` Links to zipped evidence packages and/or CSV export (optional but recommended)
- **Data-driven content**: pages and gallery are generated from a single evidence dataset (`content/evidence.yaml` or `content/evidence.json`).
- **Captions + metadata**: each photo/video has `date_taken`, `room`, `issue_tags`, `caption`.
- **Performance**
  - Lazy-load images
  - Thumbnails for gallery
  - Responsive layout
- **Public-ready**
  - Minimal personally identifying info (no full street address; use generic “ADU in San Jose, CA”).
  - A visible **Last Updated** timestamp.
- **DX**
  - Simple workflow: upload media to R2 → update evidence data file → push to Git → auto deploy.

### Nice-to-have
- CSV export of the evidence log at `/downloads/evidence.csv`
- SHA256 hashing for originals (integrity log)
- “Status” badges per issue (Open/Acknowledged/Scheduled/Fixed/Reopened)

---

## 1) Content model (data schema)

Create a single source of truth for all evidence items at:

- `content/evidence.yaml` (preferred) OR `content/evidence.json`

### Schema (YAML example)

```yaml
site:
  title: "ADU Issue Log"
  location_general: "San Jose, CA (ADU)"
  last_updated: "2025-12-27"
  disclaimer: "Public documentation of construction issues. Personal identifiers removed."

issues:
  - id: "wall-cracks"
    title: "Wall cracks in multiple rooms"
    slug: "wall-cracks"
    status: "Open"
    summary: "Vertical/horizontal hairline cracks observed throughout the unit."
    rooms: ["master_bed", "bedroom", "bath_1", "bath_2", "living", "laundry"]
    requested_remediation:
      - "Assess root cause (settlement vs framing)"
      - "Repair and re-texture/repaint affected drywall"
      - "Confirm if any structural movement is present"
  - id: "doors-not-closing"
    title: "Doors not closing (frame shift)"
    slug: "doors-not-closing"
    status: "Open"
    summary: "Multiple interior doors do not latch/close properly, suggesting frame alignment shift."
    rooms: ["master_bed", "bath_1", "bath_2", "bedroom", "laundry"]
    requested_remediation:
      - "Re-square door frames"
      - "Adjust hinges/strike plates"
      - "Verify framing alignment and settlement impacts"
  - id: "water-heater-door"
    title: "Backyard fire suppression water tank access door left open"
    slug: "water-heater-door"
    status: "Open"
    summary: "Access door to backyard fire suppression water tank was found not closed."
    rooms: ["utility"]
    requested_remediation:
      - "Close/secure access panel"
      - "Confirm no code/safety concerns"
  - id: "window-water-intrusion"
    title: "Master bedroom window left open → water intrusion"
    slug: "window-left-open-water-intrusion"
    status: "Open"
    summary: "Master bedroom window was open; water leaked in. Watermarks on wall and floor."
    rooms: ["master_bed"]
    requested_remediation:
      - "Water intrusion assessment (moisture test)"
      - "Dry-out and remediation plan"
      - "Repair drywall/floor as needed; confirm mold prevention steps"

timeline:
  - date: "2025-12-26"
    title: "Site visit — issues discovered"
    notes:
      - "Cracks observed in all rooms"
      - "Multiple doors not closing"
      - "Backyard fire suppression water tank access door not closed"
      - "Window open; water intrusion with visible watermarks"
    related_issues: ["wall-cracks", "doors-not-closing", "water-heater-door", "window-water-intrusion"]

media:
  - id: "img_001"
    type: "photo"
    date_taken: "2025-12-26"
    room: "master_bed"
    issue_tags: ["wall-cracks"]
    caption: "Vertical crack running from ceiling down the wall."
    original_filename: "PXL_....jpg"
    public_url: "https://<your-r2-public-domain>/photos/img_001.jpg"
    thumb_url: "https://<your-r2-public-domain>/thumbs/img_001.webp"

  - id: "vid_001"
    type: "video"
    date_taken: "2025-12-26"
    room: "master_bed"
    issue_tags: ["window-water-intrusion"]
    caption: "Video showing watermarks and damp floor area."
    original_filename: "VID_....mp4"
    public_url: "https://<your-r2-public-domain>/videos/vid_001.mp4"
```

**Rooms:** use consistent slugs: `master_bed`, `bedroom`, `bath_1`, `bath_2`, `living`, `laundry`, `utility`.

---

## 2) Site structure / routes

Astro pages:
- `src/pages/index.astro`
- `src/pages/timeline.astro`
- `src/pages/gallery.astro`
- `src/pages/downloads.astro`
- `src/pages/issues/[slug].astro` (dynamic route driven by `issues` list)

Components:
- `src/components/Layout.astro`
- `src/components/IssueCard.astro`
- `src/components/MediaGrid.astro`
- `src/components/MediaModal.astro` (lightbox)
- `src/components/Filters.astro`
- `src/components/Badge.astro`
- `src/components/LastUpdated.astro`

Content/data loader:
- `src/lib/content.ts` parses YAML/JSON, validates schema (zod recommended).

Styling:
- Use **Tailwind** OR simple CSS modules. (Pick Tailwind for speed.)

---

## 3) Gallery behavior

On `/gallery`:
- Filter chips / dropdowns:
  - Issue (multi-select)
  - Room
  - Type (photo/video)
  - Sort (date desc, date asc)
- Clicking a photo opens modal with caption + metadata and “Open original” link.
- Videos render as `<video controls preload="metadata">` with poster image optional.

---

## 4) Cloudflare R2 setup (public)

Create an R2 bucket, enable public access via one of:
- R2 public bucket URL (if available on your account)
- **Preferred**: Custom domain via Cloudflare (e.g., `media.yourdomain.com`) pointing to R2.

Folder layout in R2:
- `/photos/*`
- `/thumbs/*`
- `/videos/*`
- `/downloads/*` (optional zipped packages)

Thumbnails:
- Use a local script to generate `.webp` thumbnails for photos (width ~600px).
- For videos, optional poster images in `/thumbs/`.

---

## 5) Build steps the agent must implement

### A) Create the Astro project
- `npm create astro@latest`
- TypeScript enabled
- Add Tailwind (`npx astro add tailwind`)

### B) Add data file + schema validation
- Create `content/evidence.yaml`
- Add zod schema in `src/lib/schema.ts`
- Parsing in `src/lib/content.ts`

### C) Generate routes from data
- Dynamic issue page at `src/pages/issues/[slug].astro` using `getStaticPaths()`.

### D) Implement gallery with filtering
- Filtering can be client-side (small dataset: 50 images + 3 videos).
- Use minimal client JS (`Astro + islands`) for filters.
- Ensure SSR output is still usable without JS (basic list visible).

### E) Add SEO + headers
- Add `robots` meta: allow indexing (public) but include basic metadata.
- Add OpenGraph tags.
- Add `sitemap.xml` generation if easy.

### F) Add a “Print / PDF” friendly issue summary
- A `/print` route that lists all issues + evidence log (nice-to-have).

### G) Provide clear README
Include:
- How to upload to R2
- How to update `evidence.yaml`
- How to run locally
- How to deploy to Cloudflare Pages

---

## 6) Cloudflare Pages deployment

The agent should:
- Ensure `npm run build` outputs static site (Astro default: `dist/`).
- Provide Cloudflare Pages settings:
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Node version: specify in `.nvmrc` or `package.json` engines (optional)

Environment variables:
- Not required if media URLs are absolute in the data file.
- Optional: `PUBLIC_MEDIA_BASE_URL` to avoid repeating domains.

---

## 7) Suggested CLI helper (optional but recommended)

Create a script:
- `scripts/add-evidence.ts`
- Inputs: folder path, issue tags, room, date_taken
- Outputs:
  - Uploads to R2 using `wrangler r2 object put ...`
  - Generates thumbnails for images (use `sharp`)
  - Appends entries into `content/evidence.yaml`

If this is too heavy, keep it as a “future enhancement” section in README.

---

## 8) Acceptance criteria

The deliverable is complete when:
- `npm install && npm run dev` works.
- `npm run build` produces static pages.
- All routes exist and render with placeholder content.
- Adding a new media item to `content/evidence.yaml` makes it appear on:
  - its issue page
  - the gallery
- Site is accessible and reasonably fast with 50 images + 3 videos.

---

## 9) Tasks for the agent (explicit checklist)

1. Create Astro + Tailwind project
2. Add `content/evidence.yaml` with the schema above + sample entries
3. Implement data loader + schema validation
4. Build pages: overview, timeline, issue detail, gallery, downloads
5. Implement client-side filtering on gallery
6. Add layout, navigation, simple clean styling
7. Write README with Cloudflare Pages + R2 instructions
8. (Optional) Add CSV export of evidence log

---

## 10) Output format

- Return the full repository with all files.
- Include `README.md` with step-by-step setup and deploy instructions.
- Include a `TODO.md` for future improvements.

---

## (Agent instruction) Start here

**Claude Code:** Create the repo now following the above requirements.  
If any detail is ambiguous, make a reasonable default that prioritizes: simplicity, clarity, and quick updates.
