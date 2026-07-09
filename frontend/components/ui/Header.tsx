interface HeaderProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  sidebarAberta?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ sidebarAberta = true, onToggleSidebar }: HeaderProps) {
  return (
    <header style={{
      background: '#fff',
      borderBottom: '0.5px solid #e5e7eb',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarAberta ? 'Fechar menu lateral' : 'Abrir menu lateral'}
          aria-expanded={sidebarAberta}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
            width: 32,
            height: 32,
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            cursor: 'pointer',
            padding: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 18, height: 2, background: '#374151', borderRadius: 2 }} />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      <div style={{ marginLeft: 'auto' }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: '#EEE9FC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#534AB7', fontSize: 13, fontWeight: 500,
        }}>RH</div>
      </div>
    </header>
  );
}
