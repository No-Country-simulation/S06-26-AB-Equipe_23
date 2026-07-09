import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/ui/Header.tsx';
import Sidebar from '../../../components/ui/Sidebar.tsx';
import PainelEmpregabilidade from '../../../components/charts/PainelEmpregabilidade';
import PainelInsightsRegionais from '../../../components/charts/PainelInsightsRegionais';
import DashboardExecutivo from '../../../components/charts/DashboardExecutivo';
import PainelRelatorioESG from '../../../components/charts/PainelRelatorioESG';
import PainelSaudeTime from '../../../components/charts/PainelSaudeTime';
import PainelFormacoes from '../../../components/charts/PainelFormacoes';
import PainelMentorias from '../../../components/charts/PainelMentorias';
 
const ROTAS_EXTERNAS: Record<string, string> = {
  'Shortlist': '/shortlist',
};

const PAINEL_POR_ROTA: Record<string, string> = {
  '/vagas': 'Minhas vagas',
  '/dashboard': 'Dashboard executivo',
  '/insights/regioes': 'Insights regionais',
  '/relatorio-esg': 'Relatório ESG',
  '/saude-time': 'Saúde do time',
};
 
const PAINEIS_LOCAIS = [
  'Minhas vagas',
  'Dashboard executivo',
  'Insights regionais',
  'Relatório ESG',
  'Saúde do time',
];
 
// Tudo que tem destino (local ou externo) — EmptyState só aparece para o resto
const ITENS_CONHECIDOS = [...PAINEIS_LOCAIS, ...Object.keys(ROTAS_EXTERNAS)];
 
function EmptyState({ label }: { label: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, color: '#9ca3af',
    }}>
      <span style={{ fontSize: 40 }}>🚧</span>
      <p style={{ fontSize: 14, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 13 }}>Módulo em desenvolvimento</p>
    </div>
  );
}
 
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('Empregabilidade');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Minhas vagas');

  useEffect(() => {
    const painel = PAINEL_POR_ROTA[location.pathname];
    if (painel) {
      setActiveNav('Empregabilidade');
      setActiveSidebarItem(painel);
    }
  }, [location.pathname]);
 
  useEffect(() => {
    const rota = ROTAS_EXTERNAS[activeSidebarItem];
    if (rota) navigate(rota);
  }, [activeSidebarItem, navigate]);
 
  const isRotaExterna = activeSidebarItem in ROTAS_EXTERNAS;
 
  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'Métricas ESG') {
      setActiveNav('Empregabilidade');
      setActiveSidebarItem('Relatório ESG');
    } else if (nav === 'Insights') {
      setActiveNav('Empregabilidade');
      setActiveSidebarItem('Insights regionais');
    } else if (nav === 'Empregabilidade') {
      setActiveSidebarItem('Minhas vagas');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header activeNav={activeNav} onNavChange={handleNavChange} />
 
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {activeNav === 'Empregabilidade' && (
          <Sidebar activeItem={activeSidebarItem} onItemChange={setActiveSidebarItem} />
        )}
 
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeNav === 'Formações' && <PainelFormacoes />}
          {activeNav === 'Mentorias' && <PainelMentorias />}
 
          {activeNav === 'Empregabilidade' && !isRotaExterna && (
            <>
              {activeSidebarItem === 'Minhas vagas'        && <PainelEmpregabilidade />}
              {activeSidebarItem === 'Dashboard executivo' && <DashboardExecutivo />}
              {activeSidebarItem === 'Insights regionais'  && <PainelInsightsRegionais />}
              {activeSidebarItem === 'Relatório ESG'       && <PainelRelatorioESG />}
              {activeSidebarItem === 'Saúde do time'       && <PainelSaudeTime />}
              {/* EmptyState só para itens sem destino definido */}
              {!ITENS_CONHECIDOS.includes(activeSidebarItem) && (
                <EmptyState label={activeSidebarItem} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
