import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/App.tsx';
import ShortList from '../pages/Shortlist/shortlist.tsx';
import LoginPage from '../pages/Login/Login.tsx';
import TrilhasCapacitacaoPage from '../pages/Trilhascapacitacoes/trilhadecapacitacoes.tsx';
import EventosCorporativosPage from '../pages/Eventos/Eventoscorporativos.tsx';
import MentoriasPage from '../pages/Mentorias/mentorias.tsx';

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

const hasToken = () => Boolean(localStorage.getItem('token'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return hasToken() ? children : <Navigate to="/login" replace />;
};

const DefaultRoute = () => {
  return hasToken() ? <Navigate to="/vagas" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <main>

        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/formacoes" element={<ProtectedRoute><TrilhasCapacitacaoPage /></ProtectedRoute>} />
          <Route path="/trilhas-capacitacoes" element={<ProtectedRoute><TrilhasCapacitacaoPage /></ProtectedRoute>} />
          <Route path="/trilhas" element={<ProtectedRoute><TrilhasCapacitacaoPage /></ProtectedRoute>} />
          <Route path="/eventos" element={<ProtectedRoute><EventosCorporativosPage /></ProtectedRoute>} />
          <Route path="/mentorias" element={<ProtectedRoute><MentoriasPage /></ProtectedRoute>} />
          <Route path="/vagas" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/candidatos" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/insights/regioes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/insights-regionais" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/relatorio-esg" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/saude-time" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/saude-do-time" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/sobre" element={<SobreRoute />} />
          <Route path="/contato" element={<ContatoRoute />} />
          <Route path="/shortlist" element={<ProtectedRoute><ShortList /></ProtectedRoute>} />
          <Route path="/shortlist/:vagaId" element={<ProtectedRoute><ShortList /></ProtectedRoute>} />
          <Route path="*" element={<NaoEncontradaRoute />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

