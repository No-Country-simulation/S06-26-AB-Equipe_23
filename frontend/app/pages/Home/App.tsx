import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/ui/Header.tsx';
import Sidebar from '../../../components/ui/Sidebar.tsx';
import PainelEmpregabilidade from '../../../components/charts/PainelEmpregabilidade';
import PainelInsightsRegionais from '../../../components/charts/PainelInsightsRegionais';
import DashboardExecutivo from '../../../components/charts/DashboardExecutivo';
import PainelMetricasEmpresa from '../../../components/charts/PainelMetricasEmpresa';
import PainelServicosMvp from '../../../components/charts/PainelServicosMvp';
 
const ROTAS_EXTERNAS: Record<string, string> = {
  'Shortlist': '/shortlist',
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
  const [activeNav, setActiveNav] = useState('Empregabilidade');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Minhas vagas');
  const isServicosMvp = activeNav === 'Formações' || activeNav === 'Mentorias';
 
  useEffect(() => {
    const rota = ROTAS_EXTERNAS[activeSidebarItem];
    if (rota) navigate(rota);
  }, [activeSidebarItem, navigate]);
 
  const isRotaExterna = activeSidebarItem in ROTAS_EXTERNAS;
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header activeNav={activeNav} onNavChange={setActiveNav} />
 
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isServicosMvp && (
          <Sidebar activeItem={activeSidebarItem} onItemChange={setActiveSidebarItem} />
        )}
 
        {isServicosMvp && <PainelServicosMvp />}

        {!isServicosMvp && !isRotaExterna && (
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {activeSidebarItem === 'Minhas vagas'        && <PainelEmpregabilidade />}
            {activeSidebarItem === 'Dashboard executivo' && <DashboardExecutivo />}
            {activeSidebarItem === 'Insights regionais'  && <PainelInsightsRegionais />}
            {['Relatório ESG', 'Saúde do time'].includes(activeSidebarItem) && <PainelMetricasEmpresa />}
 
            {/* EmptyState só para itens sem destino definido */}
            {!ITENS_CONHECIDOS.includes(activeSidebarItem) && (
              <EmptyState label={activeSidebarItem} />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
