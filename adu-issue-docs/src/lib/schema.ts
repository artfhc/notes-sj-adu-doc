import { z } from 'zod';

// Room slugs used throughout the site
export const roomSlugSchema = z.enum([
  'master_bed',
  'bedroom',
  'bath_1',
  'bath_2',
  'living',
  'laundry',
  'utility',
  'exterior',
  'main_house',
]);

export type RoomSlug = z.infer<typeof roomSlugSchema>;

// Issue status types
export const issueStatusSchema = z.enum([
  'Open',
  'Acknowledged',
  'Scheduled',
  'Completed',
  'Fixed',
  'Reopened',
]);

export type IssueStatus = z.infer<typeof issueStatusSchema>;

// Media type
export const mediaTypeSchema = z.enum(['photo', 'video']);

export type MediaType = z.infer<typeof mediaTypeSchema>;

// Site metadata schema
export const siteSchema = z.object({
  title: z.string(),
  location_general: z.string(),
  last_updated: z.string(),
  disclaimer: z.string(),
});

export type Site = z.infer<typeof siteSchema>;

// Issue schema
export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: issueStatusSchema,
  summary: z.string(),
  rooms: z.array(roomSlugSchema),
  requested_remediation: z.array(z.string()),
});

export type Issue = z.infer<typeof issueSchema>;

// Timeline entry schema
export const timelineEntrySchema = z.object({
  date: z.string(),
  title: z.string(),
  notes: z.array(z.string()),
  related_issues: z.array(z.string()),
});

export type TimelineEntry = z.infer<typeof timelineEntrySchema>;

// Media item schema
export const mediaItemSchema = z.object({
  id: z.string(),
  type: mediaTypeSchema,
  date_taken: z.string(),
  room: roomSlugSchema,
  issue_tags: z.array(z.string()),
  caption: z.string(),
  original_filename: z.string(),
  public_url: z.string(),
  thumb_url: z.string().optional(),
});

export type MediaItem = z.infer<typeof mediaItemSchema>;

// Full evidence data schema
export const evidenceDataSchema = z.object({
  site: siteSchema,
  issues: z.array(issueSchema),
  timeline: z.array(timelineEntrySchema),
  media: z.array(mediaItemSchema),
});

export type EvidenceData = z.infer<typeof evidenceDataSchema>;

// Room display names
export const roomDisplayNames: Record<RoomSlug, string> = {
  master_bed: 'Master Bedroom',
  bedroom: 'Bedroom',
  bath_1: 'Bathroom 1',
  bath_2: 'Bathroom 2',
  living: 'Living Room',
  laundry: 'Laundry Room',
  utility: 'Utility Room',
  exterior: 'Exterior',
  main_house: 'Main House',
};
