import React from 'react';
//import './Sidebar.css';

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
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Minhas vagas', icon: '💼', section: 'Recrutamento' },
  { label: 'Shortlist', icon: '📊', section: 'Recrutamento' },
  { label: 'Dashboard executivo', icon: '📊', section: 'Diversidade' },
  { label: 'Insights regionais', icon: '📍', section: 'Diversidade' },
  { label: 'Relatório ESG', icon: '📈', section: 'Diversidade' },
  { label: 'Saúde do time', icon: '❤️', section: 'Diversidade' },
];

const SECTIONS = ['Recrutamento', 'Diversidade'];

export default function Sidebar({ activeItem, onItemChange, aberta, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`app-sidebar__overlay ${aberta ? 'app-sidebar__overlay--visivel' : ''}`}
        onClick={onClose}
      />

      <aside className={`app-sidebar ${aberta ? 'app-sidebar--aberta' : 'app-sidebar--fechada'}`}>
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
    </>
  );
}
