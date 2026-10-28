interface HeaderProps {
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  sidebarAberta?: boolean;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

export default function Header({ sidebarAberta = true, onToggleSidebar, onLogout }: HeaderProps) {
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

      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/vagas';
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Ir para a página inicial"
      >
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #6C3FC5 0%, #8B5CF6 100%)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15,
          boxShadow: '0 2px 4px rgba(108, 63, 197, 0.25)',
        }}>B</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
          app<span style={{ color: '#6C3FC5' }}>BiT</span>
        </span>
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: '#EEE9FC',
          border: '1px solid #DDD6FE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#534AB7', fontSize: 13, fontWeight: 600,
        }} title="Perfil do Recrutador / RH">RH</div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 6,
              background: '#fff',
              color: '#374151',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
