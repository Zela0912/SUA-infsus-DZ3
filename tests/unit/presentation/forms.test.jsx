import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KategorijaForm } from '../../../src/client/components/KategorijePage.jsx';
import { formatDateTime, TerminForm } from '../../../src/client/components/TerminiPage.jsx';
import { normalizeKategorijaPayload, normalizeTerminPayload } from '../../../src/client/lib/formPayloads.js';

describe('React presentation forms', () => {
  it('renders foreign key dropdowns on the termin form', () => {
    render(
      <TerminForm
        form={{
          instruktorId: '',
          voziloId: '',
          pocetak: '',
          kraj: '',
          vrsta: 'voznja',
          status: 'Zakazan',
          napomena: '',
          kandidatId: ''
        }}
        lookups={{
          kandidati: [{ id: 1, label: 'Marko Horvat (B)' }],
          instruktori: [{ id: 2, label: 'Ivan Babic (B,A)' }],
          vozila: [{ id: 3, label: 'ZG-123-AB - Volkswagen Golf (B)' }]
        }}
        onChange={vi.fn()}
        onSubmit={vi.fn((event) => event.preventDefault())}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Marko Horvat (B)')).toBeInTheDocument();
    expect(screen.getByText('Ivan Babic (B,A)')).toBeInTheDocument();
    expect(screen.getByText('ZG-123-AB - Volkswagen Golf (B)')).toBeInTheDocument();
  });

  it('submits the category form through the provided handler', () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <KategorijaForm
        form={{ oznaka: 'B', opis: 'Osobni automobil', minSatiTeorija: 35, minSatiVoznja: 30 }}
        onChange={vi.fn()}
        onSubmit={onSubmit}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTitle('Spremi kategoriju'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('normalizes form payloads before API calls', () => {
    expect(normalizeTerminPayload({
      id: null,
      kandidatId: '1',
      instruktorId: '2',
      voziloId: '3',
      pocetak: '2026-05-12T09:00',
      kraj: '2026-05-12T10:00',
      vrsta: 'voznja',
      status: 'Zakazan',
      napomena: '  test  '
    })).toMatchObject({
      kandidatId: 1,
      instruktorId: 2,
      voziloId: 3,
      napomena: 'test'
    });

    expect(normalizeKategorijaPayload({
      oznaka: ' b ',
      opis: ' opis ',
      minSatiTeorija: '35',
      minSatiVoznja: '30'
    })).toEqual({ id: undefined, oznaka: 'B', opis: 'opis', minSatiTeorija: 35, minSatiVoznja: 30 });
  });

  it('formats termin time with a 24-hour clock', () => {
    expect(formatDateTime('2026-05-13T14:05:00')).toContain('14:05');
  });

  it('uses separate date and 24-hour time inputs for termin start and end', () => {
    render(
      <TerminForm
        form={{
          instruktorId: '',
          voziloId: '',
          pocetak: '2026-05-16T00:00',
          kraj: '2026-05-16T12:00',
          vrsta: 'voznja',
          status: 'Zakazan',
          napomena: '',
          kandidatId: ''
        }}
        lookups={{ kandidati: [], instruktori: [], vozila: [] }}
        onChange={vi.fn()}
        onSubmit={vi.fn((event) => event.preventDefault())}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Vrijeme početka')).toHaveAttribute('type', 'time');
    expect(screen.getByLabelText('Vrijeme početka')).toHaveValue('00:00');
    expect(screen.getByLabelText('Vrijeme kraja')).toHaveValue('12:00');
  });
});
