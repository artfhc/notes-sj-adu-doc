# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository contains the project specification (`prompt.md`) for building a public ADU (Accessory Dwelling Unit) construction issue documentation website. The specification is a comprehensive build prompt for creating a static site that documents construction issues with photos/videos.

**Current State**: This is a specification-only repository. The actual codebase needs to be generated based on `prompt.md`.

## Project Overview

The goal is to build a production-ready static website with:
- **Framework**: Astro + TypeScript
- **Hosting**: Cloudflare Pages
- **Media Storage**: Cloudflare R2 (public bucket)
- **Styling**: Tailwind CSS
- **Data Source**: Single YAML/JSON file (`content/evidence.yaml`)

## Key Architecture Points

### Data-Driven Design
All content is generated from a single source of truth (`content/evidence.yaml` or `content/evidence.json`) containing:
- Site metadata (title, location, last updated)
- Issues list (wall-cracks, doors-not-closing, water-heater-door, window-water-intrusion)
- Timeline entries (date-based events)
- Media items (photos/videos with metadata: date, room, issue tags, captions, URLs)

### Route Structure
- `/` - Overview page (summary of all issues + latest update)
- `/timeline` - Date-based timeline of events
- `/issues/[slug]` - Dynamic issue detail pages
- `/gallery` - Filterable media gallery
- `/downloads` - Links to evidence packages/CSV exports

### Content Model Schema
The evidence data file uses consistent room slugs: `master_bed`, `bedroom`, `bath_1`, `bath_2`, `living`, `laundry`, `utility`.

Each media item must include: `id`, `type`, `date_taken`, `room`, `issue_tags`, `caption`, `original_filename`, `public_url`, and optionally `thumb_url`.

### Critical Components
- `src/lib/content.ts` - Parses and validates the evidence YAML/JSON (use Zod for schema validation)
- `src/lib/schema.ts` - Zod schema definitions
- `src/pages/issues/[slug].astro` - Dynamic route using `getStaticPaths()` from issues data
- Client-side filtering on `/gallery` (small dataset, minimal JS via Astro islands)

## Development Workflow

### Initial Setup (when implementing)
```bash
npm create astro@latest
npx astro add tailwind
npm install zod js-yaml
npm install --save-dev @types/js-yaml
```

### Running Locally (once implemented)
```bash
npm install
npm run dev
```

### Building for Production (once implemented)
```bash
npm run build
```

### Cloudflare Pages Deployment Settings
- Build command: `npm run build`
- Build output directory: `dist`
- No environment variables required if media URLs are absolute in data file

## Media Management

### R2 Bucket Structure
```
/photos/*     - Original/optimized photos
/thumbs/*     - WebP thumbnails (~600px width)
/videos/*     - Video files
/downloads/*  - Optional zipped evidence packages
```

### Adding New Evidence
1. Upload media to appropriate R2 folder
2. Generate thumbnails for photos (use Sharp library)
3. Update `content/evidence.yaml` with new media entry
4. Push to Git → Cloudflare Pages auto-deploys

## Important Constraints

### Privacy
- Use generic location: "ADU in San Jose, CA" (no full street address)
- Remove personally identifying information
- Display visible "Last Updated" timestamp

### Performance
- Lazy-load images in gallery
- Use WebP thumbnails
- Responsive layout
- Videos use `<video controls preload="metadata">`

### Accessibility
- Site must be usable without JavaScript (basic content visible)
- Gallery filters are progressive enhancement

## Reading the Specification

When starting work on this project, read `prompt.md` sections in this order:
1. Section 1 (Content model/schema) - Understand the data structure
2. Section 2 (Site structure/routes) - Understand page architecture
3. Section 5 (Build steps) - Implementation checklist
4. Section 8 (Acceptance criteria) - Definition of done

## Status Badges (Nice-to-Have)
Each issue can have status: Open/Acknowledged/Scheduled/Fixed/Reopened

## Optional Enhancements
- CSV export at `/downloads/evidence.csv`
- SHA256 hashing for media integrity log
- `/print` route for print-friendly issue summary
- `scripts/add-evidence.ts` CLI helper for uploading to R2 and updating YAML
