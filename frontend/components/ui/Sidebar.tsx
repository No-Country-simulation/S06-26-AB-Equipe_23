import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  aberta: boolean;
  onClose: () => void;
}

interface SidebarItem {
  label: string;
  icon: string;
  section: string;
  path?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  /* SESSÃO: Recrutamento */
  { label: 'Minhas vagas', icon: '💼', section: 'Recrutamento', path: '/vagas' },
  { label: 'Shortlist', icon: '📊', section: 'Recrutamento', path: '/shortlist' },
  
  /* SESSÃO: Diversidade */
  { label: 'Dashboard executivo', icon: '📊', section: 'Diversidade', path: '/dashboard' },
  { label: 'Relatório ESG', icon: '📈', section: 'Diversidade', path: '/relatorio-esg' },
  { label: 'Saúde do time', icon: '❤️', section: 'Diversidade', path: '/saude-do-time' },
  
  /* SEÇÃO: Capacitação & Engajamento */
  { label: 'Eventos', icon: '📍', section: 'Capacitação & Engajamento', path: '/eventos' },
  { label: 'Mentorias', icon: '🤝', section: 'Capacitação & Engajamento', path: '/mentorias' },
  { label: 'Trilha de Capacitações', icon: '🎓', section: 'Capacitação & Engajamento', path: '/trilhas' },
];


const SECTIONS = ['Recrutamento', 'Diversidade', 'Capacitação & Engajamento'];

export default function Sidebar({ activeItem, onItemChange, aberta, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    onItemChange(item.label);
    
    if (item.path) {
      navigate(item.path);
    }
    
    if (aberta && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`app-sidebar__overlay ${aberta ? 'app-sidebar__overlay--visivel' : ''}`}
        onClick={onClose}
      />

      <aside className={`app-sidebar ${aberta ? 'app-sidebar--aberta' : 'app-sidebar--fechada'}`}>
        {SECTIONS.map((section) => (
          <React.Fragment key={section}>
            {/* Título da Divisão */}
            <span style={{
              display: 'block',
              fontSize: 10,
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '18px 8px 6px', // Ajustado padding superior para dar espaçamento entre blocos
            }}>
              {section}
            </span>

            {/* Itens da Divisão */}
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
