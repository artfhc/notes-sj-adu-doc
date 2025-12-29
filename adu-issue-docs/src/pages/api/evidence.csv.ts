import type { APIRoute } from 'astro';
import { generateEvidenceCSV } from '../../lib/content';

export const GET: APIRoute = () => {
  try {
    const csv = generateEvidenceCSV();

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="documentation-log.csv"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate CSV' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
