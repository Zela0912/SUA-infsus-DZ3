import pg from 'pg';
import { config } from '../config/env.js';

export function createPool(connectionString = config.databaseUrl) {
  return new pg.Pool({ connectionString });
}

export const pool = createPool();
