# SUA – Sustav za upravljanje autoškolom

Projektni zadatak za kolegij Informacijski sustavi 2, FER.

Aplikacija ima dva ekrana: **Termini nastave** (master-detail, CRUD) i **Kategorije dozvole** (šifrarnik, CRUD).

## Tech stack

- React 19 + Vite (frontend)
- Express 5 / Node.js (backend)
- PostgreSQL

## Pokretanje

```bash
npm install
```

Postavljanje baze:

```bash
psql -U postgres -c "CREATE DATABASE sua_autoskola;"
psql -U postgres -d sua_autoskola -f database/setup.sql
```

Ili kratko:

```bash
npm run db:reset
```

Pokretanje:

```bash
npm run dev:server   # backend – port 3002
npm run dev:client   # frontend – Vite dev server
```

Ako trebaš drugačije credentialse, napravi `.env`:

```
DATABASE_URL=postgres://user:password@localhost:5432/sua_autoskola
```
