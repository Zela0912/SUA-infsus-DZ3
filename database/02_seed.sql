INSERT INTO kategorija_dozvole (oznaka, opis, min_sati_teorija, min_sati_voznja) VALUES
('B', 'Osobni automobili do 3500kg', 35, 30),
('A', 'Motocikli', 30, 20),
('A1', 'Laki motocikli do 125cc', 25, 15),
('C', 'Teretna vozila preko 3500kg', 40, 35),
('BE', 'B kategorija s prikolicom', 10, 10);

INSERT INTO korisnik (ime, prezime, email, lozinka_hash, uloga) VALUES
('Marko', 'Horvat', 'marko.horvat@email.com', 'hash1', 'kandidat'),
('Ana', 'Kovac', 'ana.kovac@email.com', 'hash2', 'kandidat'),
('Petra', 'Novak', 'petra.novak@email.com', 'hash3', 'kandidat'),
('Ivan', 'Babic', 'ivan.babic@email.com', 'hash4', 'instruktor'),
('Tomislav', 'Juric', 'tomislav.juric@email.com', 'hash5', 'instruktor'),
('Sandra', 'Blazevic', 'sandra.blazevic@email.com', 'hash6', 'administrator'),
('Luka', 'Maric', 'luka.maric@email.com', 'hash7', 'kandidat'),
('Maja', 'Peric', 'maja.peric@email.com', 'hash8', 'kandidat'),
('Dino', 'Vidovic', 'dino.vidovic@email.com', 'hash9', 'kandidat'),
('Ivana', 'Grgic', 'ivana.grgic@email.com', 'hash10', 'instruktor'),
('Hrvoje', 'Kralj', 'hrvoje.kralj@email.com', 'hash11', 'instruktor');

INSERT INTO instruktor (korisnik_id, licenca_broj, licenca_istice, kategorije, aktivan) VALUES
(4, 'INS-2021-0042', '2026-12-31', 'B,A', TRUE),
(5, 'INS-2019-0017', '2026-08-15', 'B,C', TRUE),
(10, 'INS-2020-0033', '2027-04-10', 'A,A1', TRUE),
(11, 'INS-2018-0091', '2026-10-20', 'B,BE', TRUE);

INSERT INTO kandidat (korisnik_id, kategorija_id, oib, status, datum_upisa, odslusani_sati_teorija, odslusani_sati_voznja) VALUES
(1, 1, '12345678901', 'Aktivna nastava', '2026-01-10', 35, 12),
(2, 1, '23456789012', 'Upisan', '2026-02-01', 4, 0),
(3, 2, '34567890123', 'Prijavljen ispit', '2026-01-15', 30, 20),
(4, 1, '45678901234', 'Aktivna nastava', '2026-03-05', 35, 24),
(5, 3, '56789012345', 'Aktivna nastava', '2026-03-12', 25, 9),
(6, 5, '67890123456', 'Upisan', '2026-04-02', 10, 2);

INSERT INTO vozilo (registracija, marka, model, kategorija, tehnicka_istice, dostupno) VALUES
('ZG-123-AB', 'Volkswagen', 'Golf', 'B', '2027-03-15', TRUE),
('ZG-456-CD', 'Opel', 'Astra', 'B', '2027-07-20', TRUE),
('ZG-789-EF', 'Honda', 'CB500F', 'A', '2026-11-30', TRUE),
('ZG-321-GH', 'Skoda', 'Fabia', 'B', '2027-09-01', TRUE),
('ZG-654-IJ', 'Yamaha', 'MT-07', 'A', '2026-12-10', TRUE),
('ZG-987-KL', 'Volkswagen', 'Golf Variant', 'BE', '2027-01-25', TRUE);

INSERT INTO termin (kandidat_id, instruktor_id, vozilo_id, pocetak, kraj, vrsta, status, napomena) VALUES
(1, 1, 1, '2026-05-12 09:00', '2026-05-12 10:00', 'voznja', 'Odrzan', 'Prva gradska voznja'),
(1, 1, 1, '2026-05-13 10:00', '2026-05-13 11:00', 'voznja', 'Zakazan', NULL),
(2, 2, 2, '2026-05-12 14:00', '2026-05-12 15:00', 'teorija', 'Zakazan', 'Online priprema'),
(3, 1, 3, '2026-05-14 09:00', '2026-05-14 10:00', 'voznja', 'Zakazan', NULL),
(4, 4, 4, '2026-05-15 08:00', '2026-05-15 09:30', 'voznja', 'Zakazan', 'Parkiranje i poligon'),
(5, 3, 5, '2026-05-15 11:00', '2026-05-15 12:00', 'voznja', 'Zakazan', 'A1 osnovne vjezbe'),
(6, 4, 6, '2026-05-16 13:00', '2026-05-16 14:00', 'voznja', 'Zakazan', 'Voznja s prikolicom'),
(4, 2, 2, '2026-05-17 16:00', '2026-05-17 17:00', 'teorija', 'Odrzan', 'Prometni znakovi'),
(2, 1, 1, '2026-05-18 09:00', '2026-05-18 10:00', 'voznja', 'Otkazan', 'Kandidat zatrazio novi termin');
