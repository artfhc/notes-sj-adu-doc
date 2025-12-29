import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { evidenceDataSchema, type EvidenceData, type Issue, type MediaItem } from './schema';

let cachedData: EvidenceData | null = null;

/**
 * Load and parse the evidence.yaml file with schema validation
 */
export function loadEvidenceData(): EvidenceData {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Read the YAML file
    const filePath = join(process.cwd(), 'content', 'evidence.yaml');
    const fileContents = readFileSync(filePath, 'utf8');

    // Parse YAML
    const rawData = yaml.load(fileContents);

    // Validate with Zod schema
    const validatedData = evidenceDataSchema.parse(rawData);

    cachedData = validatedData;
    return validatedData;
  } catch (error) {
    console.error('Error loading evidence data:', error);
    throw error;
  }
}

/**
 * Get all issues
 */
export function getIssues(): Issue[] {
  const data = loadEvidenceData();
  return data.issues;
}

/**
 * Get a single issue by slug
 */
export function getIssueBySlug(slug: string): Issue | undefined {
  const issues = getIssues();
  return issues.find((issue) => issue.slug === slug);
}

/**
 * Get all media items
 */
export function getMediaItems(): MediaItem[] {
  const data = loadEvidenceData();
  return data.media;
}

/**
 * Get media items for a specific issue
 */
export function getMediaForIssue(issueId: string): MediaItem[] {
  const media = getMediaItems();
  return media.filter((item) => item.issue_tags.includes(issueId));
}

/**
 * Get media items for a specific room
 */
export function getMediaForRoom(room: string): MediaItem[] {
  const media = getMediaItems();
  return media.filter((item) => item.room === room);
}

/**
 * Get timeline entries
 */
export function getTimeline() {
  const data = loadEvidenceData();
  return data.timeline;
}

/**
 * Get site metadata
 */
export function getSiteMetadata() {
  const data = loadEvidenceData();
  return data.site;
}

/**
 * Get unique rooms from all media items
 */
export function getUniqueRooms(): string[] {
  const media = getMediaItems();
  const rooms = new Set(media.map((item) => item.room));
  return Array.from(rooms).sort();
}

/**
 * Get unique issue tags from all media items
 */
export function getUniqueIssueTags(): string[] {
  const media = getMediaItems();
  const tags = new Set(media.flatMap((item) => item.issue_tags));
  return Array.from(tags).sort();
}

/**
 * Generate CSV export of documentation log
 */
export function generateEvidenceCSV(): string {
  const media = getMediaItems();

  // CSV header
  const headers = ['ID', 'Type', 'Date Taken', 'Room', 'Issue Tags', 'Caption', 'Filename', 'URL'];

  // CSV rows
  const rows = media.map((item) => [
    item.id,
    item.type,
    item.date_taken,
    item.room,
    item.issue_tags.join('; '),
    `"${item.caption.replace(/"/g, '""')}"`, // Escape quotes in caption
    item.original_filename,
    item.public_url,
  ]);

  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}
