import React, { useState } from 'react';
import Header from '../../../components/ui/Header.tsx';
import Sidebar from '../../../components/ui/Sidebar.tsx';
import PainelEmpregabilidade from '../../../components/charts/PainelEmpregabilidade';

export default function App() {
  const [activeNav, setActiveNav] = useState('Empregabilidade');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Minhas vagas');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header activeNav={activeNav} onNavChange={setActiveNav} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeItem={activeSidebarItem} onItemChange={setActiveSidebarItem} />
        
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeNav === 'Empregabilidade' && activeSidebarItem === 'Minhas vagas' ? (
            <PainelEmpregabilidade />
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12, color: '#9ca3af',
            }}>
              <span style={{ fontSize: 40 }}>🚧</span>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{activeSidebarItem}</p>
              <p style={{ fontSize: 13 }}>Módulo em desenvolvimento</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
