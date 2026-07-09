import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  sidebarAberta: boolean; // Alterado de 'aberta' para 'sidebarAberta' para casar com o AppLayout
  onClose: () => void;
}

interface SidebarItem {
  label: string;
  icon: string;
  section: string;
  path?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Minhas vagas', icon: '💼', section: 'Recrutamento', path: '/vagas' },
  { label: 'Shortlist', icon: '📊', section: 'Recrutamento', path: '/shortlist' },
  { label: 'Dashboard executivo', icon: '📊', section: 'Diversidade', path: '/dashboard' },
  { label: 'Relatório ESG', icon: '📈', section: 'Diversidade', path: '/relatorio-esg' },
  { label: 'Saúde do time', icon: '❤️', section: 'Diversidade', path: '/saude-do-time' },
  { label: 'Eventos', icon: '📍', section: 'Capacitação & Engajamento', path: '/eventos' },
  { label: 'Mentorias', icon: '🤝', section: 'Capacitação & Engajamento', path: '/mentorias' },
  { label: 'Trilha de Capacitações', icon: '🎓', section: 'Capacitação & Engajamento', path: '/trilhas' },
];

const SECTIONS = ['Recrutamento', 'Diversidade', 'Capacitação & Engajamento'];

export default function Sidebar({ activeItem, onItemChange, sidebarAberta, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    onItemChange(item.label);
    if (item.path) navigate(item.path);
    if (sidebarAberta && onClose) onClose();
  };

  return (
    <>
      {/* Overlay de fundo para fechar ao clicar fora (útil para mobile) */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.2)',
          zIndex: 40,
          display: sidebarAberta ? 'block' : 'none',
        }}
      />

      {/* Caixa da Barra Lateral */}
      <aside 
        style={{
          width: sidebarAberta ? '240px' : '0px', // Transição de tamanho baseada no clique
          opacity: sidebarAberta ? 1 : 0,
          visibility: sidebarAberta ? 'visible' : 'hidden',
          overflowX: 'hidden',
          background: '#fff',
          borderRight: '0.5px solid #e5e7eb',
          height: 'calc(100vh - 56px)',
          position: 'sticky',
          top: '56px',
          zIndex: 45,
          display: 'flex',
          flexDirection: 'column',
          padding: sidebarAberta ? '12px' : '0px', // Zera o preenchimento para não quebrar o layout ao sumir
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s ease, opacity 0.15s ease',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {SECTIONS.map((section) => (
          <React.Fragment key={section}>
            <span style={{
              display: 'block',
              fontSize: 10,
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '18px 8px 6px',
              whiteSpace: 'nowrap',
            }}>
              {section}
            </span>

            {SIDEBAR_ITEMS.filter((i) => i.section === section).map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 13,
                  color: activeItem === item.label ? '#6C3FC5' : '#4b5563',
                  background: activeItem === item.label ? '#EEE9FC' : 'transparent',
                  fontWeight: activeItem === item.label ? 500 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  margin: '2px 0',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </React.Fragment>
        ))}
      </aside>
    </>
  );
}


/* TODO: Recriar isto usando ProSidebar, para que seja possível ter submenus e uma melhor organização do código.

 * Base pegada do npm react-pro-sidebar: https://www.npmjs.com/package/react-pro-sidebar

import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

export default function MySidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sidebar collapsed={collapsed}>
            <Menu
                menuItemStyles={{
                    button: {
                        [`&.active`]: {
                            backgroundColor: '#13395e',
                            color: '#b6c8d9',
                        },
                    },
                }}
            >
                <MenuItem component={<Link to="/documentation" />}>Documentation</MenuItem>
                <MenuItem component={<Link to="/calendar" />}>Calendar</MenuItem>
                <MenuItem component={<Link to="/e-commerce" />}>E-commerce</MenuItem>
            </Menu>
        </Sidebar>
    );
}



*/
