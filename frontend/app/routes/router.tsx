import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home/App.tsx';

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

// 2. Componente Principal de Navegação
export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: '10px', background: '#eee' }}>
        <nav style={{ display: 'flex', gap: '15px' }}>
  
          <Link to="/">Início</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/insights/regioes" element={<Home />} />
          <Route path="/sobre" element={<SobreRoute />} />
          <Route path="/contato" element={<ContatoRoute />} />
          <Route path="*" element={<NaoEncontradaRoute />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
