DROP TABLE IF EXISTS podsjetnik CASCADE;
DROP TABLE IF EXISTS ispitna_prijava CASCADE;
DROP TABLE IF EXISTS dokument_kandidata CASCADE;
DROP TABLE IF EXISTS termin CASCADE;
DROP TABLE IF EXISTS ispit CASCADE;
DROP TABLE IF EXISTS kandidat CASCADE;
DROP TABLE IF EXISTS instruktor CASCADE;
DROP TABLE IF EXISTS vozilo CASCADE;
DROP TABLE IF EXISTS kategorija_dozvole CASCADE;
DROP TABLE IF EXISTS korisnik CASCADE;

CREATE TABLE korisnik (
    id SERIAL PRIMARY KEY,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    lozinka_hash VARCHAR(255) NOT NULL,
    uloga VARCHAR(20) NOT NULL CHECK (uloga IN ('kandidat', 'instruktor', 'administrator'))
);

CREATE TABLE kategorija_dozvole (
    id SERIAL PRIMARY KEY,
    oznaka VARCHAR(5) NOT NULL UNIQUE,
    opis VARCHAR(200),
    min_sati_teorija INT NOT NULL CHECK (min_sati_teorija >= 0),
    min_sati_voznja INT NOT NULL CHECK (min_sati_voznja >= 0)
);

CREATE TABLE vozilo (
    id SERIAL PRIMARY KEY,
    registracija VARCHAR(10) NOT NULL UNIQUE,
    marka VARCHAR(50) NOT NULL,
    model VARCHAR(50),
    kategorija VARCHAR(5) NOT NULL,
    tehnicka_istice DATE,
    dostupno BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE kandidat (
    id SERIAL PRIMARY KEY,
    korisnik_id INT NOT NULL REFERENCES korisnik(id),
    kategorija_id INT NOT NULL REFERENCES kategorija_dozvole(id),
    oib CHAR(11) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'Upisan'
        CHECK (status IN ('Upisan', 'Aktivna nastava', 'Prijavljen ispit', 'Polozio', 'Odustao')),
    datum_upisa DATE NOT NULL DEFAULT CURRENT_DATE,
    odslusani_sati_teorija INT NOT NULL DEFAULT 0,
    odslusani_sati_voznja INT NOT NULL DEFAULT 0
);

CREATE TABLE instruktor (
    id SERIAL PRIMARY KEY,
    korisnik_id INT NOT NULL REFERENCES korisnik(id),
    licenca_broj VARCHAR(20) UNIQUE,
    licenca_istice DATE,
    kategorije VARCHAR(50),
    aktivan BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE termin (
    id SERIAL PRIMARY KEY,
    kandidat_id INT NOT NULL REFERENCES kandidat(id),
    instruktor_id INT NOT NULL REFERENCES instruktor(id),
    vozilo_id INT NOT NULL REFERENCES vozilo(id),
    pocetak TIMESTAMP NOT NULL,
    kraj TIMESTAMP NOT NULL,
    vrsta VARCHAR(20) NOT NULL CHECK (vrsta IN ('teorija', 'voznja')),
    status VARCHAR(20) NOT NULL DEFAULT 'Zakazan'
        CHECK (status IN ('Zakazan', 'Odrzan', 'Otkazan')),
    napomena TEXT,
    CHECK (pocetak < kraj)
);

CREATE TABLE ispit (
    id SERIAL PRIMARY KEY,
    instruktor_id INT NOT NULL REFERENCES instruktor(id),
    datum DATE NOT NULL,
    vrsta VARCHAR(20) NOT NULL CHECK (vrsta IN ('teorijski', 'voznja')),
    lokacija VARCHAR(100),
    kategorija_id INT REFERENCES kategorija_dozvole(id)
);

CREATE TABLE ispitna_prijava (
    id SERIAL PRIMARY KEY,
    kandidat_id INT NOT NULL REFERENCES kandidat(id),
    ispit_id INT NOT NULL REFERENCES ispit(id),
    datum_prijave DATE NOT NULL DEFAULT CURRENT_DATE,
    rezultat VARCHAR(10) CHECK (rezultat IN ('Polozio', 'Pao', NULL)),
    pokusaj_br INT NOT NULL DEFAULT 1,
    UNIQUE (kandidat_id, ispit_id)
);

CREATE TABLE dokument_kandidata (
    id SERIAL PRIMARY KEY,
    kandidat_id INT NOT NULL REFERENCES kandidat(id),
    tip VARCHAR(50) NOT NULL CHECK (tip IN ('lijecnicki', 'osobna', 'fotografija', 'ostalo')),
    putanja VARCHAR(255),
    datum_isteka DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Aktivan'
        CHECK (status IN ('Aktivan', 'Istekao', 'Na cekanju'))
);

CREATE TABLE podsjetnik (
    id SERIAL PRIMARY KEY,
    korisnik_id INT NOT NULL REFERENCES korisnik(id),
    tip VARCHAR(50) NOT NULL,
    poruka TEXT NOT NULL,
    vrijeme_slanja TIMESTAMP NOT NULL,
    poslano BOOLEAN NOT NULL DEFAULT FALSE
);
