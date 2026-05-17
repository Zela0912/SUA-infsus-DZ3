import { useState } from 'react';
import { AppShell } from './components/AppShell.jsx';
import { KategorijePage } from './components/KategorijePage.jsx';
import { TerminiPage } from './components/TerminiPage.jsx';

export function App() {
  const [activeView, setActiveView] = useState('termini');

  return (
    <AppShell activeView={activeView} onChangeView={setActiveView}>
      {activeView === 'termini' ? <TerminiPage /> : <KategorijePage />}
    </AppShell>
  );
}
