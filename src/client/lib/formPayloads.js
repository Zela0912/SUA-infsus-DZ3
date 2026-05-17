export function normalizeTerminPayload(form) {
  return {
    id: form.id || undefined,
    kandidatId: Number(form.kandidatId),
    instruktorId: Number(form.instruktorId),
    voziloId: Number(form.voziloId),
    pocetak: form.pocetak,
    kraj: form.kraj,
    vrsta: form.vrsta,
    status: form.status,
    napomena: form.napomena.trim()
  };
}

export function normalizeKategorijaPayload(form) {
  return {
    id: form.id || undefined,
    oznaka: form.oznaka.trim().toUpperCase(),
    opis: form.opis.trim(),
    minSatiTeorija: Number(form.minSatiTeorija),
    minSatiVoznja: Number(form.minSatiVoznja)
  };
}
