import { describe, expect, it, vi } from 'vitest';
import { TerminService } from '../../../src/server/services/terminService.js';

const validPayload = {
  instruktorId: 2,
  voziloId: 3,
  pocetak: '2026-05-12T09:00',
  kraj: '2026-05-12T10:00',
  vrsta: 'voznja',
  status: 'Zakazan',
  napomena: '',
  kandidatId: 1
};

function repository(overrides = {}) {
  return {
    getVehicle: vi.fn(async () => ({ id: 3, kategorija: 'B', dostupno: true })),
    getCandidateCategory: vi.fn(async () => 'B'),
    findOverlap: vi.fn(async () => null),
    create: vi.fn(async (termin) => ({ id: 1, ...termin })),
    update: vi.fn(async (id, termin) => ({ id, ...termin })),
    ...overrides
  };
}

describe('TerminService', () => {
  it('creates a valid termin when there is no conflict', async () => {
    const repo = repository();
    const service = new TerminService(repo);

    const result = await service.create(validPayload);

    expect(result.id).toBe(1);
    expect(repo.findOverlap).toHaveBeenCalledWith({
      id: null,
      instruktorId: 2,
      voziloId: 3,
      pocetak: '2026-05-12 09:00',
      kraj: '2026-05-12 10:00'
    });
  });

  it('rejects overlapping instructor termini', async () => {
    const service = new TerminService(repository({ findOverlap: vi.fn(async () => ({ instruktor_id: 2 })) }));

    await expect(service.create(validPayload)).rejects.toThrow('Instruktor vec ima termin');
  });

  it('rejects overlapping vehicle termini', async () => {
    const service = new TerminService(repository({ findOverlap: vi.fn(async () => ({ vozilo_id: 3 })) }));

    await expect(service.create(validPayload)).rejects.toThrow('Vozilo vec ima termin');
  });

  it('rejects vehicle category that does not match candidate category', async () => {
    const service = new TerminService(repository({ getVehicle: vi.fn(async () => ({ id: 3, kategorija: 'A', dostupno: true })) }));

    await expect(service.create(validPayload)).rejects.toThrow('Vozilo mora odgovarati');
  });

  it('rejects missing candidate id', async () => {
    const service = new TerminService(repository());

    await expect(
      service.create({
        ...validPayload,
        kandidatId: ''
      })
    ).rejects.toThrow('Kandidat nije valjan');
  });

  it('rejects unavailable vehicles', async () => {
    const service = new TerminService(repository({ getVehicle: vi.fn(async () => ({ id: 3, kategorija: 'B', dostupno: false })) }));

    await expect(service.create(validPayload)).rejects.toThrow('Odabrano vozilo nije dostupno');
  });

  it('rejects invalid time ranges', async () => {
    const service = new TerminService(repository());

    await expect(
      service.create({
        ...validPayload,
        kraj: '2026-05-12T09:00'
      })
    ).rejects.toThrow('Pocetak termina mora biti prije kraja termina');
  });
});
