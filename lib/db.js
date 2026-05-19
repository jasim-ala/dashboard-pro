import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set. Add it to .env.local');
}

// Raw neon client — used below to build our helpers
const _neon = neon(process.env.POSTGRES_URL);

/**
 * Tagged template literal SQL helper.
 * Returns { rows: [...] } to match the @vercel/postgres API shape
 * used throughout actions.js.
 *
 * Usage:
 *   const { rows } = await sql`SELECT * FROM users`
 *   await sql`INSERT INTO users (email) VALUES (${email})`
 */
export async function sql(strings, ...values) {
  // Neon tagged template returns the rows array directly
  const rows = await _neon(strings, ...values);
  return { rows: Array.isArray(rows) ? rows : [] };
}
