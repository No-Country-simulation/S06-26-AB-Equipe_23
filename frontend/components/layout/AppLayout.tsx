import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import { clearAppSession } from '../../lib/session';

interface AppLayoutProps {
  activeNav?: string;
  activeSidebarItem?: string;
  children: React.ReactNode;
}

export default function AppLayout({ activeNav = 'Empregabilidade', activeSidebarItem, children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  const [sidebarAberta, setSidebarAberta] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    clearAppSession();
    navigate('/login', { replace: true });
  };

  const handleCloseMobileDrawer = () => {
    if (isMobile) {
      setSidebarAberta(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header
        activeNav={activeNav}
        onNavChange={(nav) => {
          if (nav === 'Formações') navigate('/trilhas-capacitacoes');
          else if (nav === 'Eventos') navigate('/eventos');
          else if (nav === 'Mentorias') navigate('/mentorias');
          else if (nav === 'Métricas ESG') navigate('/relatorio-esg');
          else if (nav === 'Insights') navigate('/insights/regioes');
          else if (nav === 'Empregabilidade') navigate('/vagas');
        }}
        sidebarAberta={sidebarAberta}
        onToggleSidebar={() => setSidebarAberta((prev) => !prev)}
        onLogout={handleLogout}
      />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop Sidebar */}
        {!isMobile && sidebarAberta && (
          <Sidebar
            activeItem={activeSidebarItem}
          />
        )}

        {/* Mobile Sidebar (Drawer + Overlay) */}
        {isMobile && sidebarAberta && (
          <>
            <button
              type="button"
              aria-label="Fechar menu lateral"
              onClick={() => setSidebarAberta(false)}
              style={{
                position: 'fixed',
                inset: 0,
                border: 0,
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(2px)',
                zIndex: 40,
                cursor: 'default',
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: 57,
                left: 0,
                bottom: 0,
                width: 250,
                zIndex: 45,
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Sidebar
                activeItem={activeSidebarItem}
                onNavigate={handleCloseMobileDrawer}
                style={{ width: '100%', height: '100%', borderRight: 'none' }}
              />
            </div>
          </>
        )}

        <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
