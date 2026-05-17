export class LookupRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async kandidati() {
    const result = await this.pool.query(
      `SELECT k.id, ku.ime || ' ' || ku.prezime || ' (' || kd.oznaka || ')' AS label
       FROM kandidat k
       JOIN korisnik ku ON ku.id = k.korisnik_id
       JOIN kategorija_dozvole kd ON kd.id = k.kategorija_id
       ORDER BY ku.prezime, ku.ime`
    );
    return result.rows;
  }

  async instruktori() {
    const result = await this.pool.query(
      `SELECT i.id, ku.ime || ' ' || ku.prezime || ' (' || i.kategorije || ')' AS label
       FROM instruktor i
       JOIN korisnik ku ON ku.id = i.korisnik_id
       WHERE i.aktivan = TRUE
       ORDER BY ku.prezime, ku.ime`
    );
    return result.rows;
  }

  async vozila() {
    const result = await this.pool.query(
      `SELECT id, registracija || ' - ' || marka || COALESCE(' ' || model, '') || ' (' || kategorija || ')' AS label
       FROM vozilo
       WHERE dostupno = TRUE
       ORDER BY registracija`
    );
    return result.rows;
  }
}
