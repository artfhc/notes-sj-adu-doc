# Future Enhancements

This document tracks potential improvements and features for the ADU Issue Documentation Website.

## High Priority

- [ ] **CLI Helper Script** (`scripts/add-evidence.ts`)
  - Accept folder path, issue tags, room, and date as inputs
  - Upload media to R2 using Wrangler
  - Generate thumbnails using Sharp
  - Automatically append entries to `content/evidence.yaml`

- [ ] **SHA256 Hashing for Integrity**
  - Generate SHA256 hashes for all original media files
  - Store hashes in evidence.yaml or separate integrity log
  - Provide verification tool to ensure files haven't been tampered with

## Medium Priority

- [ ] **Zipped Evidence Packages**
  - Create downloadable ZIP files organized by issue
  - Include all photos, videos, and metadata for each issue
  - Store in R2 `/downloads/` folder
  - Link from Downloads page

- [ ] **Print/PDF-Friendly Summary**
  - Create `/print` route for printer-friendly issue summary
  - Include all issues with evidence thumbnails
  - Optimized layout for PDF generation

- [ ] **Issue Comments/Notes Timeline**
  - Add ability to track contractor responses or additional notes
  - Append-only timeline for each issue
  - Include in evidence.yaml under each issue

- [ ] **Multi-Issue Filtering in Gallery**
  - Allow selecting multiple issues simultaneously
  - Update filter UI to use checkboxes instead of dropdown
  - Display active filters as removable chips

## Low Priority

- [ ] **Search Functionality**
  - Full-text search across captions and issue descriptions
  - Filter gallery by keywords
  - Could be client-side given small dataset

- [ ] **Image Comparison Slider**
  - For before/after photos of repairs
  - Side-by-side or overlay comparison
  - Useful for tracking issue resolution

- [ ] **Video Thumbnails/Posters**
  - Generate poster images from first frame of videos
  - Display in gallery instead of generic play icon
  - Store in R2 `/thumbs/` folder

- [ ] **Progressive Web App (PWA)**
  - Add service worker for offline viewing
  - Cache static assets and data
  - Enable "Add to Home Screen" on mobile

- [ ] **Analytics/Tracking**
  - Optional privacy-friendly analytics (e.g., Plausible, Simple Analytics)
  - Track page views and download counts
  - Help understand which issues get most attention

## Documentation Improvements

- [ ] **Video Tutorial**
  - Screen recording showing how to add new evidence
  - Upload to YouTube or host on R2
  - Link from README

- [ ] **Template Issues**
  - Provide example YAML snippets for common issue types
  - Include in README or separate TEMPLATES.md

## Technical Improvements

- [ ] **Automated Tests**
  - Validate evidence.yaml schema in CI/CD
  - Test that all media URLs are accessible
  - Check for broken links

- [ ] **Image Optimization Pipeline**
  - Automated WebP conversion on upload
  - Multiple sizes for responsive images
  - EXIF data extraction for timestamps

- [ ] **Incremental Static Regeneration (ISR)**
  - If switching to SSR-capable platform
  - Allow updates without full rebuild
  - Faster content updates

## Nice-to-Have Features

- [ ] **Issue Grouping/Categories**
  - Group related issues (e.g., "Structural", "Water Damage", "Cosmetic")
  - Filter overview page by category

- [ ] **Map View**
  - If floor plan available, mark issue locations
  - Interactive room-based navigation

- [ ] **Related Issues**
  - Show connections between issues
  - Link issues that might share root causes

- [ ] **Export to PDF Report**
  - Generate professional PDF report of all issues
  - Include photos, descriptions, and remediation requests
  - Useful for legal or insurance purposes

## Completed Features

- [x] Static site with Astro + TypeScript
- [x] Tailwind CSS styling
- [x] Data-driven content from YAML
- [x] Issue tracking with status badges
- [x] Timeline of events
- [x] Filterable media gallery
- [x] Lightbox modal for media viewing
- [x] CSV export of evidence log
- [x] Cloudflare Pages deployment ready
- [x] Comprehensive README documentation
- [x] Privacy-conscious design
- [x] Responsive layout
- [x] Lazy-loading images
