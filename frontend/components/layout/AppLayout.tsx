import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';

interface AppLayoutProps {
  activeNav: string;
  children: React.ReactNode;
}

const NAV_ROUTES: Record<string, string> = {
  'Formações': '/trilhas-capacitacoes',
  'Eventos': '/eventos',
  'Empregabilidade': '/vagas',
  'Mentorias': '/mentorias',
  'Métricas ESG': '/relatorio-esg',
  'Insights': '/insights/regioes',
};

export default function AppLayout({ activeNav, children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const handleNavChange = (nav: string) => {
    const route = NAV_ROUTES[nav];
    if (route) {
      navigate(route);
      setSidebarAberta(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header
        activeNav={activeNav}
        onNavChange={handleNavChange}
        sidebarAberta={sidebarAberta}
        onToggleSidebar={() => setSidebarAberta((prev) => !prev)}
      />
      {sidebarAberta && (
        <>
          <button
            type="button"
            aria-label="Fechar menu lateral"
            onClick={() => setSidebarAberta(false)}
            style={{
              position: 'fixed',
              inset: 0,
              border: 0,
              background: 'rgba(15, 23, 42, 0.12)',
              zIndex: 40,
              cursor: 'default',
            }}
          />
          <aside
            aria-label="Menu lateral"
            style={{
              position: 'fixed',
              top: 57,
              left: 0,
              bottom: 0,
              width: 256,
              background: '#fff',
              borderRight: '1px solid #e5e7eb',
              boxShadow: '0 18px 36px rgba(15, 23, 42, 0.14)',
              zIndex: 45,
              padding: 16,
            }}
          >
            <nav style={{ display: 'grid', gap: 8 }}>
              {Object.entries(NAV_ROUTES).map(([nav, route]) => {
                const isActive = activeNav === nav;

                return (
                  <button
                    key={route}
                    type="button"
                    onClick={() => handleNavChange(nav)}
                    style={{
                      width: '100%',
                      border: '1px solid transparent',
                      borderRadius: 8,
                      background: isActive ? '#EEE9FC' : '#fff',
                      color: isActive ? '#5B35B1' : '#334155',
                      cursor: 'pointer',
                      fontWeight: isActive ? 700 : 500,
                      padding: '11px 12px',
                      textAlign: 'left',
                    }}
                  >
                    {nav}
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}
      <main style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {children}
      </main>
    </div>
  );
}
