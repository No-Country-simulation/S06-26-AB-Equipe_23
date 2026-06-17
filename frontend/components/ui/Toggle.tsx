interface ToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, description, value, onChange }: ToggleProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      border: '0.5px solid #e5e7eb',
      borderRadius: 8,
    }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 11, color: '#9ca3af' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
        style={{
          width: 36, height: 20,
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          background: value ? '#6C3FC5' : '#d1d5db',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          display: 'block',
          width: 14, height: 14,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          left: value ? 19 : 3,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}
