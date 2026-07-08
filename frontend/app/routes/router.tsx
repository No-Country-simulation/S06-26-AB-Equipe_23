import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login/Login.tsx';
import AppLayout from '../../components/layout/AppLayout.tsx';
import Vagas from '../pages/Vagas/Vagas.tsx';
import PainelInsightsRegionais from '../pages/Paineldeinsightsregionais/paineldeinsightsregionais.tsx';
import RelatorioESG from '../pages/RelatorioESG/relatorioesg.tsx';
import ShortList from '../pages/Shortlist/shortlist.tsx';
import DashboardExecutivo from '../../components/charts/DashboardExecutivo.tsx';

const NaoEncontradaRoute = () => (
  <div style={{ padding: 24 }}>
    <h2>Erro 404</h2>
    <p>Página não encontrada!</p>
  </div>
);

function EmDesenvolvimento({ label }: { label: string }) {
  return (
    <div className="app-empty-state">
      <span>🚧</span>
      <p className="app-empty-state__label">{label}</p>
      <p className="app-empty-state__sub">Módulo em desenvolvimento</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ROTA DE LOGIN DEFINIDA COMO TELA INICIAL (FORA DO LAYOUT) */}
        <Route path="/" element={<LoginPage />} />

        {/* 2. DEMAIS ROTAS DA APLICAÇÃO (DENTRO DO LAYOUT LOGADO) */}
        <Route element={<AppLayout />}>
          {/* Vagas configurada para /vagas para não chocar com a raiz de login */}
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/insights-regionais" element={<PainelInsightsRegionais />} />
          <Route path="/relatorio-esg" element={<RelatorioESG />} />
          <Route path="/shortlist" element={<ShortList />} />
          <Route path="/dashboard" element={<DashboardExecutivo />} />
          <Route path="/candidatos" element={<EmDesenvolvimento label="Candidatos" />} />
          <Route path="/saude-do-time" element={<EmDesenvolvimento label="Saúde do time" />} />
          
          {/* Captura qualquer outra rota inexistente dentro do painel */}
          <Route path="*" element={<NaoEncontradaRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
