import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/server/app.js';
import { config } from '../../src/server/config/env.js';
import { createPool } from '../../src/server/db/pool.js';

const runDatabaseTests = process.env.RUN_DB_TESTS === '1';
const dbDescribe = runDatabaseTests ? describe : describe.skip;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../../src/server/db/schema.sql');

dbDescribe('API integration with PostgreSQL', () => {
  const pool = createPool(config.testDatabaseUrl);
  const app = createApp(pool);

  beforeEach(async () => {
    const schema = await fs.readFile(schemaPath, 'utf8');
    await pool.query(schema);
  });

  it('creates, reads, updates and deletes categories through all layers', async () => {
    const created = await request(app)
      .post('/api/kategorije')
      .send({ oznaka: 'D', opis: 'Probna kategorija', minSatiTeorija: 8, minSatiVoznja: 12 })
      .expect(201);

    expect(created.body.id).toBeGreaterThan(0);

    await request(app)
      .put(`/api/kategorije/${created.body.id}`)
      .send({ oznaka: 'D1', opis: 'Promijenjena kategorija', minSatiTeorija: 9, minSatiVoznja: 12 })
      .expect(200);

    const list = await request(app).get('/api/kategorije?search=D1').expect(200);
    expect(list.body).toHaveLength(1);

    await request(app).delete(`/api/kategorije/${created.body.id}`).expect(204);
  });

  it('rejects a conflicting termin without inserting it', async () => {
    const response = await request(app)
      .post('/api/termini')
      .send({
        instruktorId: 1,
        voziloId: 1,
        pocetak: '2026-05-13T10:30',
        kraj: '2026-05-13T11:30',
        vrsta: 'voznja',
        status: 'Zakazan',
        napomena: '',
        kandidatId: 1
      })
      .expect(400);

    expect(response.body.error).toContain('Instruktor vec ima termin');
  });

  it('creates and reads a termin', async () => {
    const created = await request(app)
      .post('/api/termini')
      .send({
        kandidatId: 2,
        instruktorId: 2,
        voziloId: 2,
        pocetak: '2026-05-20T12:00',
        kraj: '2026-05-20T13:00',
        vrsta: 'teorija',
        status: 'Zakazan',
        napomena: 'Grupni termin'
      })
      .expect(201);

    expect(created.body).toMatchObject({ kandidatId: 2, instruktorId: 2, voziloId: 2 });

    const fetched = await request(app).get(`/api/termini/${created.body.id}`).expect(200);
    expect(fetched.body).toMatchObject({
      id: created.body.id,
      kandidatId: 2,
      instruktorId: 2,
      voziloId: 2,
      kandidat: 'Ana Kovac'
    });
  });
});
