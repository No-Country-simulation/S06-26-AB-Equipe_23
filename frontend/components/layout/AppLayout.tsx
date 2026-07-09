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

  const handleNavChange = (nav: string) => {
    const route = NAV_ROUTES[nav];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header activeNav={activeNav} onNavChange={handleNavChange} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {children}
      </main>
    </div>
  );
}
