const turnoverMensal = [6.2, 5.8, 5.6, 5.6, 6.3, 5.7, 6.0, 5.9, 5.8, 6.3, 5.6, 5.8];

const riscos = [
  { area: 'Tecnologia', risco: 'Moderado', valor: 58, cor: '#7c3aed' },
  { area: 'Operações', risco: 'Alto', valor: 72, cor: '#dc2626' },
  { area: 'Comercial', risco: 'Baixo', valor: 38, cor: '#16a34a' },
  { area: 'Administrativo', risco: 'Moderado', valor: 54, cor: '#d97706' },
];

const indicadores = [
  { label: 'Índice de Bem-Estar', value: '74%' },
  { label: 'Risco de Burnout', value: '18%' },
  { label: 'Turnover - Dez/2026', value: '5,8%' },
  { label: 'Participação Diversa', value: '86,5%' },
];

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
      <div style={{ color: '#111827', fontSize: 26, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

export default function PainelSaudeTime() {
  return (
    <div className="responsive-panel" style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ display: 'inline-block', background: '#fee2e2', color: '#991b1b', borderRadius: 6, padding: '7px 10px', fontSize: 12, fontWeight: 700 }}>
        SAÚDE DO TIME - DADOS DEMONSTRATIVOS
      </div>

      <h1 style={{ marginBottom: 4 }}>Saúde do Time</h1>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        Recorte demonstrativo de bem-estar por área e risco operacional usando dados agregados.
      </p>

      <section className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
        {indicadores.map((item) => <Card key={item.label} label={item.label} value={item.value} />)}
      </section>

      <section className="two-column-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Evolução Mensal do Turnover</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'end', gap: 10 }}>
            {turnoverMensal.map((valor, index) => (
              <div key={index} title={`${valor.toFixed(1)}%`} style={{ flex: 1, height: `${valor * 13}%`, maxHeight: '90%', background: '#6C3FC5', borderRadius: '5px 5px 0 0' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 11 }}>
            <span>Jan/2026</span>
            <span>Dez/2026</span>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Risco por Área</h2>
          {riscos.map((item) => (
            <div key={item.area} style={{ margin: '18px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{item.area}</span>
                <strong>{item.risco}</strong>
              </div>
              <div style={{ height: 9, background: '#e5e7eb', borderRadius: 8, marginTop: 6 }}>
                <div style={{ height: 9, width: `${item.valor}%`, background: item.cor, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Sinais para Acompanhamento</h2>
          <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.6, marginBottom: 0 }}>
            Operações concentra o maior nível de risco no recorte demonstrativo. A recomendação para a demo
            é apresentar este painel como suporte preventivo ao RH: identificar áreas com maior pressão,
            cruzar com diversidade/região e agir antes que exclusão ou Burnout se tornem problema.
          </p>
        </div>
        <p style={{ gridColumn: '1 / -1', color: '#64748b', fontSize: 12, margin: 0 }}>
          Módulo demonstrativo: os indicadores apresentados não representam uma medição produtiva auditada.
        </p>
      </section>
    </div>
  );
}
