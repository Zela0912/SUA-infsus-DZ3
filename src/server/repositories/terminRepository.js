function mapTermin(row) {
  return {
    id: row.id,
    kandidatId: row.kandidat_id,
    instruktorId: row.instruktor_id,
    voziloId: row.vozilo_id,
    pocetak: row.pocetak,
    kraj: row.kraj,
    vrsta: row.vrsta,
    status: row.status,
    napomena: row.napomena,
    kandidat: row.kandidat,
    instruktor: row.instruktor,
    vozilo: row.vozilo,
    kategorija: row.kategorija
  };
}

const terminSelect = `
  SELECT
    t.id, t.kandidat_id, t.instruktor_id, t.vozilo_id, t.pocetak, t.kraj,
    t.vrsta, t.status, t.napomena,
    kk.ime || ' ' || kk.prezime AS kandidat,
    ik.ime || ' ' || ik.prezime AS instruktor,
    v.registracija || ' - ' || v.marka || COALESCE(' ' || v.model, '') AS vozilo,
    kd.oznaka AS kategorija
  FROM termin t
  JOIN kandidat k ON k.id = t.kandidat_id
  JOIN korisnik kk ON kk.id = k.korisnik_id
  JOIN instruktor i ON i.id = t.instruktor_id
  JOIN korisnik ik ON ik.id = i.korisnik_id
  JOIN vozilo v ON v.id = t.vozilo_id
  JOIN kategorija_dozvole kd ON kd.id = k.kategorija_id
`;

export class TerminRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list(search = '') {
    const like = `%${search.toLowerCase()}%`;
    const result = await this.pool.query(
      `${terminSelect}
       WHERE LOWER(kk.ime || ' ' || kk.prezime) LIKE $1
          OR LOWER(ik.ime || ' ' || ik.prezime) LIKE $1
          OR LOWER(v.registracija) LIKE $1
          OR LOWER(t.status) LIKE $1
       ORDER BY t.pocetak DESC`,
      [like]
    );
    return result.rows.map(mapTermin);
  }

  async getById(id) {
    const result = await this.pool.query(`${terminSelect} WHERE t.id = $1`, [id]);
    return result.rows[0] ? mapTermin(result.rows[0]) : null;
  }

  async create(termin) {
    const result = await this.pool.query(
      `INSERT INTO termin (kandidat_id, instruktor_id, vozilo_id, pocetak, kraj, vrsta, status, napomena)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        termin.kandidatId,
        termin.instruktorId,
        termin.voziloId,
        termin.pocetak,
        termin.kraj,
        termin.vrsta,
        termin.status,
        termin.napomena
      ]
    );
    return this.getById(result.rows[0].id);
  }

  async update(id, termin) {
    const result = await this.pool.query(
      `UPDATE termin
       SET kandidat_id = $1, instruktor_id = $2, vozilo_id = $3, pocetak = $4,
           kraj = $5, vrsta = $6, status = $7, napomena = $8
       WHERE id = $9
       RETURNING id`,
      [
        termin.kandidatId,
        termin.instruktorId,
        termin.voziloId,
        termin.pocetak,
        termin.kraj,
        termin.vrsta,
        termin.status,
        termin.napomena,
        id
      ]
    );
    return result.rows[0] ? this.getById(result.rows[0].id) : null;
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM termin WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async findOverlap({ id, instruktorId, voziloId, pocetak, kraj }) {
    const result = await this.pool.query(
      `SELECT id, instruktor_id, vozilo_id
       FROM termin
       WHERE ($1::int IS NULL OR id <> $1)
         AND status <> 'Otkazan'
         AND pocetak < $4
         AND kraj > $3
         AND (instruktor_id = $2 OR vozilo_id = $5)
       ORDER BY pocetak
       LIMIT 1`,
      [id || null, instruktorId, pocetak, kraj, voziloId]
    );
    return result.rows[0] || null;
  }

  async getCandidateCategory(kandidatId) {
    const result = await this.pool.query(
      `SELECT kd.oznaka
       FROM kandidat k
       JOIN kategorija_dozvole kd ON kd.id = k.kategorija_id
       WHERE k.id = $1`,
      [kandidatId]
    );
    return result.rows[0]?.oznaka || null;
  }

  async getVehicle(voziloId) {
    const result = await this.pool.query(
      'SELECT id, registracija, kategorija, dostupno FROM vozilo WHERE id = $1',
      [voziloId]
    );
    return result.rows[0] || null;
  }
}
