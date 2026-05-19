// Run this script once to create all tables in the Neon database.
// Usage: node db/migrate.js

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not set. Run: POSTGRES_URL="..." node db/migrate.js');
  process.exit(1);
}

const sql = neon(POSTGRES_URL);
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

// Split on ; and run each statement
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Running ${statements.length} migration statements...`);
for (const stmt of statements) {
  try {
    await sql([stmt + ';']);
    console.log(`✓ ${stmt.slice(0, 60).replace(/\n/g, ' ')}...`);
  } catch (e) {
    console.error(`❌ Failed: ${stmt.slice(0, 60)}`);
    console.error(e.message);
  }
}
console.log('\n✅ Migration complete.');
