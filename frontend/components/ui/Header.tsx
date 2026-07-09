import React from 'react';

interface HeaderProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  sidebarAberta: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ sidebarAberta, onToggleSidebar }: HeaderProps) {
  
  const handleUserClick = () => {
    // Insira aqui a lógica para abrir o perfil, logout ou configurações do usuário
    console.log('Botão do usuário clicado!');
  };

  return (
    <header style={{
      background: '#fff',
      borderBottom: '0.5px solid #e5e7eb',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '56px',
      boxSizing: 'border-box'
    }}>
      
      {/* 1. Botão Hambúrguer — Controla a visibilidade da Sidebar */}
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarAberta ? "Fechar menu lateral" : "Abrir menu lateral"}
        aria-expanded={sidebarAberta}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
          width: 32,
          height: 32,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          borderRadius: 8,
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
        // Opcional: leve feedback visual ao passar o mouse
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
        <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
        <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
      </button>

      {/* 2. Logo Centralizado */}
      <div style={{ 
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <div style={{
          width: 32, height: 32,
          background: '#6C3FC5',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 600, fontSize: 14,
        }}>B</div>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#111' }}>
          app<span style={{ color: '#6C3FC5' }}>BiT</span>
        </span>
      </div>

      {/* 3. Botão do Usuário (RH) — Transformado em elemento clicável */}
      <button
        onClick={handleUserClick}
        aria-label="Menu do usuário"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          borderRadius: '50%',
          flexShrink: 0,
          outline: 'none',
          transition: 'transform 0.1s, opacity 0.2s',
        }}
        // Feedback visual de clique rápido
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: '#EEE9FC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#534AB7', fontSize: 13, fontWeight: 500,
        }}>
          RH
        </div>
      </button>

    </header>
  );
}
}
