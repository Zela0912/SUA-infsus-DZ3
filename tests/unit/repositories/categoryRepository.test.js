import { describe, expect, it, vi } from 'vitest';
import { CategoryRepository } from '../../../src/server/repositories/categoryRepository.js';

describe('CategoryRepository', () => {
  it('maps list rows to category DTOs', async () => {
    const pool = {
      query: vi.fn(async () => ({
        rows: [{ id: 1, oznaka: 'B', opis: 'Osobni automobil', min_sati_teorija: 35, min_sati_voznja: 30 }]
      }))
    };
    const repository = new CategoryRepository(pool);

    const result = await repository.list('b');

    expect(result).toEqual([{ id: 1, oznaka: 'B', opis: 'Osobni automobil', minSatiTeorija: 35, minSatiVoznja: 30 }]);
  });

  it('returns false when delete does not affect a row', async () => {
    const repository = new CategoryRepository({ query: vi.fn(async () => ({ rowCount: 0 })) });

    await expect(repository.delete(99)).resolves.toBe(false);
  });
});
