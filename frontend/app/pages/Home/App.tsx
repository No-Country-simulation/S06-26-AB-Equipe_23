import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../../../components/layout/AppLayout';
import PainelEmpregabilidade from '../../../components/charts/PainelEmpregabilidade';
import PainelInsightsRegionais from '../../../components/charts/PainelInsightsRegionais';
import DashboardExecutivo from '../../../components/charts/DashboardExecutivo';
import PainelRelatorioESG from '../../../components/charts/PainelRelatorioESG';
import PainelSaudeTime from '../../../components/charts/PainelSaudeTime';

const ROTAS_EXTERNAS: Record<string, string> = {
  Shortlist: '/shortlist',
  Candidatos: '/shortlist',
};

const PAINEL_POR_ROTA: Record<string, string> = {
  '/vagas': 'Minhas vagas',
  '/candidatos': 'Candidatos',
  '/dashboard': 'Dashboard executivo',
  '/insights/regioes': 'Insights regionais',
  '/insights-regionais': 'Insights regionais',
  '/relatorio-esg': 'Relatório ESG',
  '/saude-time': 'Saúde do time',
  '/saude-do-time': 'Saúde do time',
};

const PAINEIS_LOCAIS = [
  'Minhas vagas',
  'Dashboard executivo',
  'Insights regionais',
  'Relatório ESG',
  'Saúde do time',
];

const ITENS_CONHECIDOS = [...PAINEIS_LOCAIS, ...Object.keys(ROTAS_EXTERNAS)];

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        color: '#9ca3af',
      }}
    >
      <span style={{ fontSize: 40 }}>🚧</span>
      <p style={{ fontSize: 14, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 13 }}>Módulo em desenvolvimento</p>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSidebarItem] = useState('Minhas vagas');

  const painelRoteado = PAINEL_POR_ROTA[location.pathname];
  const sidebarItemExibido = painelRoteado ?? activeSidebarItem;

  useEffect(() => {
    const rota = ROTAS_EXTERNAS[activeSidebarItem];
    if (rota) navigate(rota);
  }, [activeSidebarItem, navigate]);

  const isRotaExterna = sidebarItemExibido in ROTAS_EXTERNAS;

  return (
    <AppLayout activeSidebarItem={sidebarItemExibido}>
      {!isRotaExterna && (
        <>
          {sidebarItemExibido === 'Minhas vagas' && <PainelEmpregabilidade />}
          {sidebarItemExibido === 'Dashboard executivo' && <DashboardExecutivo />}
          {sidebarItemExibido === 'Insights regionais' && <PainelInsightsRegionais />}
          {sidebarItemExibido === 'Relatório ESG' && <PainelRelatorioESG />}
          {sidebarItemExibido === 'Saúde do time' && <PainelSaudeTime />}
          {!ITENS_CONHECIDOS.includes(sidebarItemExibido) && (
            <EmptyState label={sidebarItemExibido} />
          )}
        </>
      )}
    </AppLayout>
  );
}
