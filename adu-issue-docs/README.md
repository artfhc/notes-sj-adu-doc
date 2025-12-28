# ADU Issue Documentation Website

A static website for documenting construction issues in an Accessory Dwelling Unit (ADU) with photo/video evidence hosted on Cloudflare R2 and the site deployed on Cloudflare Pages.

## Overview

This site provides a clean, professional interface for documenting construction issues with:
- Issue tracking with status badges
- Timeline of events
- Filterable media gallery
- CSV export of evidence log
- Responsive design
- Public-ready with privacy considerations

## Tech Stack

- **Framework**: [Astro](https://astro.build) + TypeScript
- **Styling**: Tailwind CSS
- **Data Source**: YAML file (`content/evidence.yaml`)
- **Validation**: Zod schemas
- **Hosting**: Cloudflare Pages (recommended)
- **Media Storage**: Cloudflare R2 (recommended)

## Project Structure

```
/
├── content/
│   └── evidence.yaml          # Single source of truth for all data
├── src/
│   ├── components/
│   │   ├── Layout.astro       # Main layout with navigation
│   │   ├── IssueCard.astro    # Issue summary card
│   │   ├── Badge.astro        # Status badge
│   │   ├── MediaGrid.astro    # Gallery grid with filtering
│   │   └── MediaModal.astro   # Lightbox for media viewing
│   ├── lib/
│   │   ├── schema.ts          # Zod schemas for validation
│   │   └── content.ts         # Data loader and utilities
│   ├── pages/
│   │   ├── index.astro        # Overview page
│   │   ├── timeline.astro     # Timeline of events
│   │   ├── gallery.astro      # Filterable media gallery
│   │   ├── downloads.astro    # Downloads and exports
│   │   ├── api/
│   │   │   └── evidence.csv.ts # CSV export endpoint
│   │   └── issues/
│   │       └── [slug].astro   # Dynamic issue pages
│   └── styles/
│       └── global.css         # Global styles (Tailwind)
└── public/                     # Static assets
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:4321 in your browser

### Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro check` | Run TypeScript type checking |

## Content Management

### Updating Evidence Data

All content is managed through a single YAML file: `content/evidence.yaml`

#### Data Structure

The evidence file contains four main sections:

1. **Site metadata** - Title, location, last updated, disclaimer
2. **Issues** - List of construction issues with details
3. **Timeline** - Chronological events
4. **Media** - Photos and videos with metadata

#### Adding New Media

1. **Upload media to Cloudflare R2**:
   - Photos to `/photos/` folder
   - Videos to `/videos/` folder
   - Generate thumbnails (WebP, ~600px width) to `/thumbs/` folder

2. **Update `content/evidence.yaml`**:

```yaml
media:
  - id: "img_011"
    type: "photo"
    date_taken: "2025-12-28"
    room: "living"
    issue_tags: ["wall-cracks"]
    caption: "New crack discovered in living room"
    original_filename: "PXL_20251228_011.jpg"
    public_url: "https://your-r2-domain.com/photos/img_011.jpg"
    thumb_url: "https://your-r2-domain.com/thumbs/img_011.webp"
```

3. **Commit and push** - Cloudflare Pages will auto-deploy

#### Adding New Issues

```yaml
issues:
  - id: "new-issue"
    title: "Issue Title"
    slug: "new-issue"
    status: "Open"
    summary: "Brief description of the issue"
    rooms: ["master_bed", "living"]
    requested_remediation:
      - "Action item 1"
      - "Action item 2"
```

#### Room Slugs

Use these consistent room identifiers:
- `master_bed` - Master Bedroom
- `bedroom` - Bedroom
- `bath_1` - Bathroom 1
- `bath_2` - Bathroom 2
- `living` - Living Room
- `laundry` - Laundry Room
- `utility` - Utility Room

#### Status Values

Available issue statuses:
- `Open` - Issue identified, not yet addressed
- `Acknowledged` - Contractor acknowledged the issue
- `Scheduled` - Repair scheduled
- `Fixed` - Issue resolved
- `Reopened` - Previously fixed but reoccurred

## Cloudflare R2 Setup

### Creating and Configuring R2 Bucket

1. **Create R2 bucket**:
   - Log in to Cloudflare Dashboard
   - Navigate to R2 Object Storage
   - Create a new bucket (e.g., `adu-evidence`)

2. **Enable public access**:
   - Go to bucket settings
   - Enable public access or set up a custom domain

3. **Folder structure**:
```
/photos/     - Original or optimized photos
/thumbs/     - WebP thumbnails (~600px width)
/videos/     - Video files
/downloads/  - Optional zipped packages
```

4. **Upload files using Wrangler CLI**:

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Upload a file
wrangler r2 object put adu-evidence/photos/img_001.jpg --file ./img_001.jpg

# Upload entire directory
wrangler r2 object put adu-evidence/photos --recursive --directory ./photos
```

### Generating Thumbnails

Use Sharp or similar tool to create thumbnails:

```bash
npm install -g sharp-cli

# Convert to WebP with 600px width
sharp -i photo.jpg -o thumb.webp resize 600 --withoutEnlargement
```

## Cloudflare Pages Deployment

### Initial Setup

1. **Push code to Git** (GitHub, GitLab, or Bitbucket)

2. **Connect to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your Git repository

3. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18 or later (set in Environment variables if needed)

4. **Deploy** - Cloudflare Pages will build and deploy automatically

### Environment Variables

No environment variables are required if media URLs are absolute in `evidence.yaml`.

Optional:
- `PUBLIC_MEDIA_BASE_URL` - Base URL for media if using relative paths

### Automatic Deployments

Once connected, Cloudflare Pages will:
- Build and deploy on every push to main branch
- Create preview deployments for pull requests
- Provide deployment URLs and status

### Custom Domain

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Add your domain
4. Configure DNS (automatic if domain is on Cloudflare)

## Privacy Considerations

This site is designed to be **public**. The following privacy measures are implemented:

- Generic location only: "San Jose, CA (ADU)"
- No full street addresses
- No personal identifying information in captions or metadata
- Visible disclaimer on all pages
- Last updated timestamp for transparency

**Before deploying**: Review all content in `evidence.yaml` to ensure no sensitive information is included.

## CSV Export

The site includes a CSV export feature at `/downloads`:
- Downloads all evidence metadata as a spreadsheet
- Includes: ID, type, date, room, tags, caption, filename, URL
- Compatible with Excel, Google Sheets, etc.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- JavaScript optional (basic functionality works without JS)
- Progressive enhancement for filters and modals

## Performance

- Lazy-loading images
- WebP thumbnails for faster loading
- Static site generation (no server required)
- Optimized for Cloudflare's global CDN

## Troubleshooting

### Build fails with "Cannot find module 'js-yaml'"

```bash
npm install js-yaml
npm install --save-dev @types/js-yaml
```

### Media not displaying

1. Check that URLs in `evidence.yaml` are correct and publicly accessible
2. Verify R2 bucket has public access enabled
3. Check browser console for CORS errors

### Changes not appearing after deployment

1. Verify the `last_updated` field in `evidence.yaml` is current
2. Clear Cloudflare cache if using custom domain
3. Check Cloudflare Pages deployment logs for errors

## Contributing

To update content:
1. Edit `content/evidence.yaml`
2. Test locally with `npm run dev`
3. Commit and push to trigger deployment

## License

This project is for documentation purposes. Modify as needed for your use case.

## Support

For issues or questions about:
- **Astro**: https://docs.astro.build
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **Cloudflare R2**: https://developers.cloudflare.com/r2
- **Tailwind CSS**: https://tailwindcss.com/docs
