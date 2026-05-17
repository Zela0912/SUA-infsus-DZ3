import { AppError } from '../errors/AppError.js';

function parseNonNegativeInt(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new AppError(`${label} mora biti cijeli broj 0 ili veci.`);
  }
  return parsed;
}

export class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  list(search) {
    return this.categoryRepository.list(search);
  }

  async getById(id) {
    const kategorija = await this.categoryRepository.getById(id);
    if (!kategorija) throw new AppError('Kategorija nije pronadena.', 404);
    return kategorija;
  }

  async create(payload) {
    return this.categoryRepository.create(this.validate(payload));
  }

  async update(id, payload) {
    const updated = await this.categoryRepository.update(id, this.validate(payload));
    if (!updated) throw new AppError('Kategorija nije pronadena.', 404);
    return updated;
  }

  async delete(id) {
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) throw new AppError('Kategorija nije pronadena.', 404);
  }

  validate(payload) {
    const oznaka = String(payload.oznaka || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{1,5}$/.test(oznaka)) {
      throw new AppError('Oznaka kategorije smije imati 1 do 5 slova ili brojeva.');
    }

    const minSatiTeorija = parseNonNegativeInt(payload.minSatiTeorija, 'Minimalni sati teorije');
    const minSatiVoznja = parseNonNegativeInt(payload.minSatiVoznja, 'Minimalni sati voznje');

    if (minSatiTeorija + minSatiVoznja === 0) {
      throw new AppError('Kategorija mora zahtijevati barem jedan sat teorije ili voznje.');
    }

    return {
      oznaka,
      opis: String(payload.opis || '').trim() || null,
      minSatiTeorija,
      minSatiVoznja
    };
  }
}
