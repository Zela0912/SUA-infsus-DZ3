function mapCategory(row) {
  return {
    id: row.id,
    oznaka: row.oznaka,
    opis: row.opis,
    minSatiTeorija: row.min_sati_teorija,
    minSatiVoznja: row.min_sati_voznja
  };
}

export class CategoryRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list(search = '') {
    const like = `%${search.toLowerCase()}%`;
    const result = await this.pool.query(
      `SELECT id, oznaka, opis, min_sati_teorija, min_sati_voznja
       FROM kategorija_dozvole
       WHERE LOWER(oznaka) LIKE $1 OR LOWER(COALESCE(opis, '')) LIKE $1
       ORDER BY oznaka`,
      [like]
    );
    return result.rows.map(mapCategory);
  }

  async getById(id) {
    const result = await this.pool.query(
      `SELECT id, oznaka, opis, min_sati_teorija, min_sati_voznja
       FROM kategorija_dozvole
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }

  async create(category) {
    const result = await this.pool.query(
      `INSERT INTO kategorija_dozvole (oznaka, opis, min_sati_teorija, min_sati_voznja)
       VALUES ($1, $2, $3, $4)
       RETURNING id, oznaka, opis, min_sati_teorija, min_sati_voznja`,
      [category.oznaka, category.opis, category.minSatiTeorija, category.minSatiVoznja]
    );
    return mapCategory(result.rows[0]);
  }

  async update(id, category) {
    const result = await this.pool.query(
      `UPDATE kategorija_dozvole
       SET oznaka = $1, opis = $2, min_sati_teorija = $3, min_sati_voznja = $4
       WHERE id = $5
       RETURNING id, oznaka, opis, min_sati_teorija, min_sati_voznja`,
      [category.oznaka, category.opis, category.minSatiTeorija, category.minSatiVoznja, id]
    );
    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM kategorija_dozvole WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}
