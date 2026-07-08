// components/layout/AppLayout.tsx
// Casca persistente do app: Header + Sidebar (toggleável) + conteúdo da rota atual.
 
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../ui/Header.tsx';
import Sidebar from '../ui/Sidebar.tsx';
//import './AppLayout.css';
 
const ROTA_POR_ITEM: Record<string, string> = {
  'Minhas vagas': '/',
  'Candidatos': '/candidatos',
  'Shortlist': '/shortlist',
  'Dashboard executivo': '/dashboard',
  'Insights regionais': '/insights-regionais',
  'Relatório ESG': '/relatorio-esg',
  'Saúde do time': '/saude-do-time',
};
 
const ITEM_POR_ROTA: Record<string, string> = Object.fromEntries(
  Object.entries(ROTA_POR_ITEM).map(([item, rota]) => [rota, item]),
);
 
export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [activeNav, setActiveNav] = useState('Empregabilidade');
  const [sidebarAberta, setSidebarAberta] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 768,
  );
 
  const activeSidebarItem = ITEM_POR_ROTA[location.pathname] ?? 'Minhas vagas';
 
  function handleItemChange(item: string) {
    const rota = ROTA_POR_ITEM[item];
    if (rota) navigate(rota);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSidebarAberta(false);
    }
  }
 
  return (
    <div className="app-shell">
      <Header
        activeNav={activeNav}
        onNavChange={setActiveNav}
        sidebarAberta={sidebarAberta}
        onToggleSidebar={() => setSidebarAberta((v) => !v)}
      />
 
      <div className="app-body">
        <Sidebar
          activeItem={activeSidebarItem}
          onItemChange={handleItemChange}
          aberta={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />
 
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}