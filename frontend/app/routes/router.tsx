import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/App.tsx';
import ShortList from '../pages/Shortlist/shortlist.tsx';
import LoginPage from '../pages/Login/Login.tsx';
import OAuth2RedirectPage from '../pages/Login/oauth2Redirect.tsx';
import TrilhasCapacitacaoPage from '../pages/Trilhascapacitacoes/trilhadecapacitacoes.tsx';
import EventosCorporativosPage from '../pages/Eventos/Eventoscorporativos.tsx';
import MentoriasPage from '../pages/Mentorias/mentorias.tsx';
import CadastroCandidatoPage from '../pages/Candidato/CadastroCandidato.tsx';
import PerfilCandidatoPage from '../pages/Candidato/PerfilCandidato.tsx';
import { getSessionType, hasValidSessionToken } from '../../lib/session';


const SobreRoute = () => (
  <div>
    <h2>Sobre Nós</h2>
    <p>Esta é a página sobre a nossa empresa.</p>
  </div>
);

const ContatoRoute = () => (
  <div>
    <h2>Contato</h2>
    <p>Fale conosco em: contato@email.com</p>
  </div>
);

const NaoEncontradaRoute = () => (
  <div>
    <h2>Erro 404</h2>
    <p>Página não encontrada!</p>
  </div>
);

const RecruiterRoute = ({ children }: { children: ReactNode }) => {
  if (!hasValidSessionToken()) return <Navigate to="/login" replace />;
  return getSessionType() === 'CANDIDATO'
    ? <Navigate to="/candidato/perfil" replace />
    : children;
};

const CandidateRoute = ({ children }: { children: ReactNode }) => {
  if (!hasValidSessionToken()) return <Navigate to="/login" replace />;
  return getSessionType() === 'CANDIDATO'
    ? children
    : <Navigate to="/vagas" replace />;
};

const DefaultRoute = () => {
  if (!hasValidSessionToken()) return <Navigate to="/login" replace />;
  return <Navigate to={getSessionType() === 'CANDIDATO' ? '/candidato/perfil' : '/vagas'} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <main>

        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
          <Route path="/candidato/cadastro" element={<CadastroCandidatoPage />} />
          <Route path="/cadastro-candidato" element={<CadastroCandidatoPage />} />
          <Route path="/candidato/perfil" element={<CandidateRoute><PerfilCandidatoPage /></CandidateRoute>} />
          <Route path="/formacoes" element={<RecruiterRoute><TrilhasCapacitacaoPage /></RecruiterRoute>} />

          <Route path="/trilhas-capacitacoes" element={<RecruiterRoute><TrilhasCapacitacaoPage /></RecruiterRoute>} />
          <Route path="/trilhas" element={<RecruiterRoute><TrilhasCapacitacaoPage /></RecruiterRoute>} />
          <Route path="/eventos" element={<RecruiterRoute><EventosCorporativosPage /></RecruiterRoute>} />
          <Route path="/mentorias" element={<RecruiterRoute><MentoriasPage /></RecruiterRoute>} />
          <Route path="/vagas" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/candidatos" element={<RecruiterRoute><Navigate to="/shortlist" replace /></RecruiterRoute>} />
          <Route path="/dashboard" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/insights/regioes" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/insights-regionais" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/relatorio-esg" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/saude-time" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/saude-do-time" element={<RecruiterRoute><Home /></RecruiterRoute>} />
          <Route path="/sobre" element={<SobreRoute />} />
          <Route path="/contato" element={<ContatoRoute />} />
          <Route path="/shortlist" element={<RecruiterRoute><ShortList /></RecruiterRoute>} />
          <Route path="/shortlist/:vagaId" element={<RecruiterRoute><ShortList /></RecruiterRoute>} />
          <Route path="*" element={<NaoEncontradaRoute />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
