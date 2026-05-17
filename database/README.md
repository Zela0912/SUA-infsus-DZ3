
```bash
# Kreiraj bazu
psql -U postgres -c "CREATE DATABASE sua_autoskola;"

# Pokreni schema + seed
psql -U postgres -d sua_autoskola -f database/01_schema.sql
psql -U postgres -d sua_autoskola -f database/02_seed.sql
```

Ili jednom naredbom:

```bash
psql -U postgres -d sua_autoskola -f database/setup.sql
```

## Datoteke koje su kroistene

01_schema.sql – DROP + CREATE TABLE naredbe za sve tablice
02_seed.sql – testni podaci (kategorije, korisnici, instruktori, kandidati, vozila, termini)
setup.sql – pokreće 01 i 02 redom

## Reset baze

```bash
npm run db:reset
```

Ova naredba pokreće `src/server/db/reset.js` koji koristi istu schema datoteku.
