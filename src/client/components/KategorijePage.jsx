import { Plus, RefreshCw, Save, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { normalizeKategorijaPayload } from '../lib/formPayloads.js';

const emptyKategorija = {
  id: null,
  oznaka: '',
  opis: '',
  minSatiTeorija: 0,
  minSatiVoznja: 0
};

export function KategorijaForm({ form, onChange, onSubmit, onDelete }) {
  return (
    <form className="editor compact" onSubmit={onSubmit}>
      <div className="editor-header">
        <div>
          <p className="eyebrow">Šifrarnik</p>
          <h2>{form.id ? `Kategorija ${form.oznaka}` : 'Nova kategorija'}</h2>
        </div>
        <div className="actions">
          {form.id ? (
            <button type="button" className="danger" onClick={onDelete} title="Obriši kategoriju">
              <Trash2 size={17} />
            </button>
          ) : null}
          <button type="submit" title="Spremi kategoriju">
            <Save size={17} />
            Spremi
          </button>
        </div>
      </div>
      <div className="form-grid">
        <label>
          Oznaka
          <input value={form.oznaka} maxLength="5" onChange={(event) => onChange('oznaka', event.target.value)} />
        </label>
        <label>
          Minimalni sati teorije
          <input type="number" min="0" value={form.minSatiTeorija} onChange={(event) => onChange('minSatiTeorija', event.target.value)} />
        </label>
        <label>
          Minimalni sati vožnje
          <input type="number" min="0" value={form.minSatiVoznja} onChange={(event) => onChange('minSatiVoznja', event.target.value)} />
        </label>
        <label className="wide">
          Opis
          <textarea value={form.opis} onChange={(event) => onChange('opis', event.target.value)} rows="3" />
        </label>
      </div>
    </form>
  );
}

export function KategorijePage() {
  const [kategorije, setKategorije] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyKategorija);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadKategorije(currentSearch = search) {
    setKategorije(await api.listKategorije(currentSearch));
  }

  useEffect(() => {
    loadKategorije('').catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const saved = await api.saveKategorija(normalizeKategorijaPayload(form));
      setForm(saved);
      setMessage('Kategorija je spremljena.');
      await loadKategorije();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    setError('');
    try {
      await api.deleteKategorija(form.id);
      setForm(emptyKategorija);
      setMessage('Kategorija je obrisana.');
      await loadKategorije();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="workspace">
      <header className="page-header">
        <div>
          <p className="eyebrow">SUA</p>
          <h1>Kategorije dozvole</h1>
        </div>
        <button onClick={() => setForm(emptyKategorija)}>
          <Plus size={17} />
          Nova kategorija
        </button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pretraži oznaku ili opis" />
        </div>
        <button onClick={() => loadKategorije(search)} title="Osvježi popis">
          <RefreshCw size={17} />
        </button>
      </div>

      {message ? <div className="notice">{message}</div> : null}
      {error ? <div className="error">{error}</div> : null}

      <div className="master-detail">
        <div className="list-pane">
          {kategorije.map((kategorija) => (
            <button key={kategorija.id} className={form.id === kategorija.id ? 'list-item selected' : 'list-item'} onClick={() => setForm(kategorija)}>
              <strong>{kategorija.oznaka}</strong>
              <span>{kategorija.opis || 'Bez opisa'}</span>
              <small>{kategorija.minSatiTeorija}h teorije · {kategorija.minSatiVoznja}h vožnje</small>
            </button>
          ))}
        </div>
        <KategorijaForm
          form={form}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
