import { describe, expect, it, vi } from 'vitest';
import { CategoryService } from '../../../src/server/services/categoryService.js';

describe('CategoryService', () => {
  it('normalizes and creates a category', async () => {
    const repository = {
      create: vi.fn(async (category) => ({ id: 10, ...category }))
    };
    const service = new CategoryService(repository);

    const result = await service.create({
      oznaka: ' b ',
      opis: 'Osobni automobil',
      minSatiTeorija: '35',
      minSatiVoznja: '30'
    });

    expect(result.oznaka).toBe('B');
    expect(repository.create).toHaveBeenCalledWith({
      oznaka: 'B',
      opis: 'Osobni automobil',
      minSatiTeorija: 35,
      minSatiVoznja: 30
    });
  });

  it('rejects a category without any required training hours', async () => {
    const service = new CategoryService({ create: vi.fn() });

    await expect(
      service.create({ oznaka: 'X', opis: '', minSatiTeorija: 0, minSatiVoznja: 0 })
    ).rejects.toThrow('barem jedan sat');
  });
});
