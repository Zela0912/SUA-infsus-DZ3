import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './pool.js';
import { config } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');
const sql = await fs.readFile(schemaPath, 'utf8');
const databaseUrl = process.env.NODE_ENV === 'test' ? config.testDatabaseUrl : config.databaseUrl;
const pool = createPool(databaseUrl);

try {
  await pool.query(sql);
  console.log('Database reset completed.');
} finally {
  await pool.end();
}
