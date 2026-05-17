import { describe, expect, it, vi } from 'vitest';
import { TerminRepository } from '../../../src/server/repositories/terminRepository.js';

describe('TerminRepository', () => {
  it('maps joined termin rows to read DTOs', async () => {
    const pool = {
      query: vi.fn(async () => ({
        rows: [{
          id: 1,
          kandidat_id: 1,
          instruktor_id: 3,
          vozilo_id: 4,
          pocetak: '2026-05-12 09:00',
          kraj: '2026-05-12 10:00',
          vrsta: 'voznja',
          status: 'Zakazan',
          napomena: null,
          kandidat: 'Marko Horvat',
          instruktor: 'Ivan Babic',
          vozilo: 'ZG-123-AB - Volkswagen Golf',
          kategorija: 'B'
        }]
      }))
    };
    const repository = new TerminRepository(pool);

    const result = await repository.getById(1);

    expect(result).toMatchObject({
      id: 1,
      kandidatId: 1,
      instruktorId: 3,
      voziloId: 4,
      kandidat: 'Marko Horvat'
    });
  });
});
