import { AppError } from '../errors/AppError.js';
import { toDbTimestamp } from '../utils/dateTime.js';

const allowedVrste = new Set(['teorija', 'voznja']);
const allowedStatuses = new Set(['Zakazan', 'Odrzan', 'Otkazan']);

function parseId(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${label} nije valjan.`);
  }
  return parsed;
}

export class TerminService {
  constructor(terminRepository) {
    this.terminRepository = terminRepository;
  }

  list(search) {
    return this.terminRepository.list(search);
  }

  async getById(id) {
    const termin = await this.terminRepository.getById(id);
    if (!termin) throw new AppError('Termin nije pronaden.', 404);
    return termin;
  }

  async create(payload) {
    const termin = await this.validate(payload);
    return this.terminRepository.create(termin);
  }

  async update(id, payload) {
    const termin = await this.validate(payload, Number(id));
    const updated = await this.terminRepository.update(id, termin);
    if (!updated) throw new AppError('Termin nije pronaden.', 404);
    return updated;
  }

  async delete(id) {
    const deleted = await this.terminRepository.delete(id);
    if (!deleted) throw new AppError('Termin nije pronaden.', 404);
  }

  async validate(payload, id = null) {
    const kandidatId = parseId(payload.kandidatId, 'Kandidat');
    const instruktorId = parseId(payload.instruktorId, 'Instruktor');
    const voziloId = parseId(payload.voziloId, 'Vozilo');
    const vrsta = String(payload.vrsta || '').trim();
    const status = String(payload.status || 'Zakazan').trim();
    const pocetak = toDbTimestamp(payload.pocetak);
    const kraj = toDbTimestamp(payload.kraj);

    if (!allowedVrste.has(vrsta)) throw new AppError('Vrsta termina mora biti teorija ili voznja.');
    if (!allowedStatuses.has(status)) throw new AppError('Status termina nije valjan.');
    if (!pocetak || !kraj || new Date(pocetak) >= new Date(kraj)) {
      throw new AppError('Pocetak termina mora biti prije kraja termina.');
    }

    const vehicle = await this.terminRepository.getVehicle(voziloId);
    if (!vehicle) throw new AppError('Odabrano vozilo ne postoji.', 404);
    if (!vehicle.dostupno) throw new AppError('Odabrano vozilo nije dostupno.');

    const candidateCategory = await this.terminRepository.getCandidateCategory(kandidatId);
    if (!candidateCategory) throw new AppError('Odabrani kandidat ne postoji.', 404);
    if (vrsta === 'voznja' && vehicle.kategorija !== candidateCategory) {
      throw new AppError('Vozilo mora odgovarati kategoriji dozvole kandidata.');
    }

    const overlap = await this.terminRepository.findOverlap({ id, instruktorId, voziloId, pocetak, kraj });
    if (overlap?.instruktor_id === instruktorId) {
      throw new AppError('Instruktor vec ima termin u odabranom vremenu.');
    }
    if (overlap?.vozilo_id === voziloId) {
      throw new AppError('Vozilo vec ima termin u odabranom vremenu.');
    }

    return {
      kandidatId,
      instruktorId,
      voziloId,
      pocetak,
      kraj,
      vrsta,
      status,
      napomena: String(payload.napomena || '').trim() || null
    };
  }
}
