import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export interface SidebarProps {
  activeItem?: string;
  onItemChange?: (item: string) => void;
  onNavigate?: () => void;
  style?: React.CSSProperties;
}

interface SidebarItem {
  label: string;
  iconKey: string;
  section: string;
  path: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Minhas vagas', iconKey: 'vagas', section: 'Recrutamento', path: '/vagas' },
  { label: 'Candidatos', iconKey: 'candidatos', section: 'Recrutamento', path: '/shortlist' },
  { label: 'Dashboard executivo', iconKey: 'dashboard', section: 'Diversidade', path: '/dashboard' },
  { label: 'Relatório ESG', iconKey: 'esg', section: 'Diversidade', path: '/relatorio-esg' },
  { label: 'Saúde do time', iconKey: 'saude', section: 'Diversidade', path: '/saude-time' },
  { label: 'Formações', iconKey: 'formacoes', section: 'Capacitação', path: '/trilhas-capacitacoes' },
  { label: 'Eventos', iconKey: 'eventos', section: 'Capacitação', path: '/eventos' },
  { label: 'Mentorias', iconKey: 'mentorias', section: 'Capacitação', path: '/mentorias' },
];

const SECTIONS = ['Recrutamento', 'Diversidade', 'Capacitação'] as const;

function renderIcon(key: string) {
  switch (key) {
    case 'vagas':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'candidatos':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case 'esg':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      );
    case 'saude':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'formacoes':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'eventos':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'mentorias':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="18" cy="18" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ activeItem, onItemChange, onNavigate, style }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isItemActive = (item: SidebarItem) => {
    if (activeItem && activeItem === item.label) return true;
    if (location.pathname === item.path) return true;
    if (item.path === '/vagas' && location.pathname === '/') return true;
    if (item.path === '/shortlist' && (location.pathname.startsWith('/shortlist') || location.pathname === '/candidatos')) return true;
    if (item.path === '/trilhas-capacitacoes' && (location.pathname === '/formacoes' || location.pathname === '/trilhas')) return true;
    if (item.path === '/saude-time' && location.pathname === '/saude-do-time') return true;
    return false;
  };

  const handleItemClick = (item: SidebarItem) => {
    if (onItemChange) {
      onItemChange(item.label);
    }
    if (item.path) {
      navigate(item.path);
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="appbit-sidebar" style={style} aria-label="Menu de navegação do sistema">
      {SECTIONS.map((section) => (
        <React.Fragment key={section}>
          <span className="appbit-sidebar__section-title">
            {section}
          </span>
          {SIDEBAR_ITEMS.filter((i) => i.section === section).map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`appbit-sidebar__btn ${active ? 'appbit-sidebar__btn--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="appbit-sidebar__icon">{renderIcon(item.iconKey)}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </aside>
  );
}
