import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';
import { clearAppSession } from '../../lib/session';

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

const DRAWER_NAV_ITEMS = [
  'Formações',
  'Eventos',
  'Mentorias',
  'Métricas ESG',
  'Insights',
] as const;

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

  const handleLogout = () => {
    clearAppSession();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header
        activeNav={activeNav}
        onNavChange={handleNavChange}
        sidebarAberta={sidebarAberta}
        onToggleSidebar={() => setSidebarAberta((prev) => !prev)}
        onLogout={handleLogout}
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
              width: 220,
              background: '#fff',
              borderRight: '0.5px solid #e5e7eb',
              zIndex: 45,
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              flexShrink: 0,
              height: 'calc(100vh - 57px)',
              overflowY: 'auto',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {DRAWER_NAV_ITEMS.map((nav) => {
                const route = NAV_ROUTES[nav];
                const isActive = activeNav === nav;

                return (
                  <button
                    key={route}
                    type="button"
                    onClick={() => handleNavChange(nav)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      border: 'none',
                      borderRadius: 8,
                      background: isActive ? '#EEE9FC' : 'transparent',
                      color: isActive ? '#6C3FC5' : '#4b5563',
                      cursor: 'pointer',
                      fontWeight: isActive ? 500 : 400,
                      padding: '8px 10px',
                      textAlign: 'left',
                      fontSize: 13,
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
