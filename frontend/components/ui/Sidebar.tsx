import React from 'react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
}

interface SidebarItem {
  label: string;
  icon: string;
  section: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Minhas vagas', icon: '💼', section: 'Recrutamento' },
  { label: 'Candidatos', icon: '👥', section: 'Recrutamento' },
  { label: 'Shortlist', icon: '📊', section: 'Recrutamento' },
  { label: 'Dashboard executivo', icon: '📊', section: 'Diversidade' },
  { label: 'Insights regionais', icon: '📍', section: 'Diversidade' },
  { label: 'Relatório ESG', icon: '📈', section: 'Diversidade' },
  { label: 'Saúde do time', icon: '❤️', section: 'Diversidade' },
];

const SECTIONS = ['Recrutamento', 'Diversidade'];

export default function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  
  return (
    <aside style={{
      width: 220,
      borderRight: '0.5px solid #e5e7eb',
      background: '#fff',
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flexShrink: 0,
      height: 'calc(100vh - 57px)',
      overflowY: 'auto',
    }}>
      {SECTIONS.map((section) => (
        <React.Fragment key={section}>
          <span style={{
            fontSize: 10,
            color: '#9ca3af',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '10px 8px 4px',
          }}>
            {section}
          </span>
          {SIDEBAR_ITEMS.filter((i) => i.section === section).map((item) => (
            <button
              key={item.label}
              onClick={() => onItemChange(item.label)}
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
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </React.Fragment>
      ))}
    </aside>
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
