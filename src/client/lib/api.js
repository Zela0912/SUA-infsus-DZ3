async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Zahtjev nije uspio.');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  listTermini: (search) => request(`/api/termini?search=${encodeURIComponent(search || '')}`),
  getTermin: (id) => request(`/api/termini/${id}`),
  saveTermin: (termin) =>
    termin.id
      ? request(`/api/termini/${termin.id}`, { method: 'PUT', body: JSON.stringify(termin) })
      : request('/api/termini', { method: 'POST', body: JSON.stringify(termin) }),
  deleteTermin: (id) => request(`/api/termini/${id}`, { method: 'DELETE' }),

  listKategorije: (search) => request(`/api/kategorije?search=${encodeURIComponent(search || '')}`),
  saveKategorija: (kategorija) =>
    kategorija.id
      ? request(`/api/kategorije/${kategorija.id}`, { method: 'PUT', body: JSON.stringify(kategorija) })
      : request('/api/kategorije', { method: 'POST', body: JSON.stringify(kategorija) }),
  deleteKategorija: (id) => request(`/api/kategorije/${id}`, { method: 'DELETE' }),

  kandidati: () => request('/api/lookups/kandidati'),
  instruktori: () => request('/api/lookups/instruktori'),
  vozila: () => request('/api/lookups/vozila')
};
