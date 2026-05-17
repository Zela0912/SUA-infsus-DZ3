import { Plus, RefreshCw, Save, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { normalizeTerminPayload } from '../lib/formPayloads.js';

const emptyTermin = {
  id: null,
  kandidatId: '',
  instruktorId: '',
  voziloId: '',
  pocetak: '',
  kraj: '',
  vrsta: 'voznja',
  status: 'Zakazan',
  napomena: ''
};

function splitDateTime(value) {
  const [date = '', time = ''] = String(value || '').split('T');
  return { date, time };
}

function joinDateTime(currentValue, part, value) {
  const current = splitDateTime(currentValue);
  const next = { ...current, [part]: value };
  if (!next.date && !next.time) return '';
  return `${next.date}T${next.time || '00:00'}`;
}

export function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('hr-HR', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false
  });
}

function toFormTermin(termin) {
  return {
    id: termin.id || null,
    kandidatId: termin.kandidatId || '',
    instruktorId: termin.instruktorId || '',
    voziloId: termin.voziloId || '',
    pocetak: termin.pocetak ? new Date(termin.pocetak).toISOString().slice(0, 16) : '',
    kraj: termin.kraj ? new Date(termin.kraj).toISOString().slice(0, 16) : '',
    vrsta: termin.vrsta || 'voznja',
    status: termin.status || 'Zakazan',
    napomena: termin.napomena || ''
  };
}

export function TerminForm({ form, lookups, onChange, onSubmit, onDelete }) {
  return (
    <form className="editor" onSubmit={onSubmit}>
      <div className="editor-header">
        <div>
          <p className="eyebrow">Master-detail</p>
          <h2>{form.id ? `Termin #${form.id}` : 'Novi termin'}</h2>
        </div>
        <div className="actions">
          {form.id ? (
            <button type="button" className="danger" onClick={onDelete} title="Obriši termin">
              <Trash2 size={17} />
            </button>
          ) : null}
          <button type="submit" title="Spremi termin">
            <Save size={17} />
            Spremi
          </button>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Kandidat
          <select value={form.kandidatId} onChange={(event) => onChange('kandidatId', event.target.value)}>
            <option value="">Odaberi kandidata</option>
            {lookups.kandidati.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Instruktor
          <select value={form.instruktorId} onChange={(event) => onChange('instruktorId', event.target.value)}>
            <option value="">Odaberi instruktora</option>
            {lookups.instruktori.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vozilo
          <select value={form.voziloId} onChange={(event) => onChange('voziloId', event.target.value)}>
            <option value="">Odaberi vozilo</option>
            {lookups.vozila.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vrsta
          <select value={form.vrsta} onChange={(event) => onChange('vrsta', event.target.value)}>
            <option value="voznja">Vožnja</option>
            <option value="teorija">Teorija</option>
          </select>
        </label>
        <label>
          Početak
          <div className="date-time-row">
            <input
              aria-label="Datum početka"
              type="date"
              value={splitDateTime(form.pocetak).date}
              onChange={(event) => onChange('pocetak', joinDateTime(form.pocetak, 'date', event.target.value))}
            />
            <input
              aria-label="Vrijeme početka"
              type="time"
              value={splitDateTime(form.pocetak).time}
              onChange={(event) => onChange('pocetak', joinDateTime(form.pocetak, 'time', event.target.value))}
            />
          </div>
        </label>
        <label>
          Kraj
          <div className="date-time-row">
            <input
              aria-label="Datum kraja"
              type="date"
              value={splitDateTime(form.kraj).date}
              onChange={(event) => onChange('kraj', joinDateTime(form.kraj, 'date', event.target.value))}
            />
            <input
              aria-label="Vrijeme kraja"
              type="time"
              value={splitDateTime(form.kraj).time}
              onChange={(event) => onChange('kraj', joinDateTime(form.kraj, 'time', event.target.value))}
            />
          </div>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => onChange('status', event.target.value)}>
            <option>Zakazan</option>
            <option>Odrzan</option>
            <option>Otkazan</option>
          </select>
        </label>
        <label className="wide">
          Napomena
          <textarea value={form.napomena} onChange={(event) => onChange('napomena', event.target.value)} rows="4" />
        </label>
      </div>
    </form>
  );
}

export function TerminiPage() {
  const [termini, setTermini] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyTermin);
  const [lookups, setLookups] = useState({ kandidati: [], instruktori: [], vozila: [] });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadTermini(currentSearch = search) {
    setTermini(await api.listTermini(currentSearch));
  }

  async function loadLookups() {
    const [kandidati, instruktori, vozila] = await Promise.all([api.kandidati(), api.instruktori(), api.vozila()]);
    setLookups({ kandidati, instruktori, vozila });
  }

  useEffect(() => {
    Promise.all([loadTermini(''), loadLookups()]).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const saved = await api.saveTermin(normalizeTerminPayload(form));
      setForm(toFormTermin(saved));
      setMessage('Termin je spremljen.');
      await loadTermini();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    setError('');
    try {
      await api.deleteTermin(form.id);
      setForm(emptyTermin);
      setMessage('Termin je obrisan.');
      await loadTermini();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="workspace">
      <header className="page-header">
        <div>
          <p className="eyebrow">SUA</p>
          <h1>Termini nastave</h1>
        </div>
        <button onClick={() => setForm(emptyTermin)}>
          <Plus size={17} />
          Novi termin
        </button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pretraži kandidata, instruktora, vozilo ili status" />
        </div>
        <button onClick={() => loadTermini(search)} title="Osvježi popis">
          <RefreshCw size={17} />
        </button>
      </div>

      {message ? <div className="notice">{message}</div> : null}
      {error ? <div className="error">{error}</div> : null}

      <div className="master-detail">
        <div className="list-pane">
          {termini.map((termin) => (
            <button key={termin.id} className={form.id === termin.id ? 'list-item selected' : 'list-item'} onClick={() => setForm(toFormTermin(termin))}>
              <strong>{termin.kandidat}</strong>
              <span>{formatDateTime(termin.pocetak)} - {termin.instruktor}</span>
              <small>{termin.vozilo} · {termin.status}</small>
            </button>
          ))}
        </div>
        <TerminForm
          form={form}
          lookups={lookups}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
