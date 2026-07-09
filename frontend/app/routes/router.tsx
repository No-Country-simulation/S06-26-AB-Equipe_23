import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login/Login.tsx';
import AppLayout from '../../components/layout/AppLayout.tsx';
import Vagas from '../pages/Vagas/Vagas.tsx';
import PainelInsightsRegionais from '../pages/Paineldeinsightsregionais/paineldeinsightsregionais.tsx';
import RelatorioESG from '../pages/RelatorioESG/relatorioesg.tsx';
import ShortList from '../pages/Shortlist/shortlist.tsx';
import DashboardExecutivo from '../../components/charts/DashboardExecutivo.tsx';
import Eventos from '../pages/Eventos/Eventoscorporativos.tsx';
import Trilhadecapacitações from '../pages/Trilhascapacitacoes/trilhadecapacitacoes.tsx';
import Mentorias from '../pages/Mentorias/mentorias.tsx';

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
        <Route path="/" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/insights-regionais" element={<PainelInsightsRegionais />} />
          <Route path="/relatorio-esg" element={<RelatorioESG />} />
          <Route path="/shortlist" element={<ShortList />} />
          <Route path="/shortlist/:vagaId" element={<ShortList />} />
          <Route path="/dashboard" element={<DashboardExecutivo />} />
          <Route path="/candidatos" element={<EmDesenvolvimento label="Candidatos" />} />
          <Route path="/saude-do-time" element={<EmDesenvolvimento label="Saúde do time" />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/trilhas" element={<Trilhadecapacitações />} />
          <Route path="/mentorias" element={<Mentorias />} />
          <Route path="*" element={<NaoEncontradaRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
