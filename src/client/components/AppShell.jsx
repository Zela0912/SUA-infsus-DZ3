import { BookOpen, CalendarDays } from 'lucide-react';

export function AppShell({ activeView, onChangeView, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span >SUA</span>
            <div>Autoškola</div>
        </div>
        <nav className="nav">
          <button className={activeView === 'termini' ? 'active' : ''} onClick={() => onChangeView('termini')}>
            <CalendarDays size={18} />
            Termini nastave
          </button>
          <button className={activeView === 'kategorije' ? 'active' : ''} onClick={() => onChangeView('kategorije')}>
            <BookOpen size={18} />
            Kategorije dozvole
          </button>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
