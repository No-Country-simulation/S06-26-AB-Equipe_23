const metasEsg = [
  { nome: 'Representatividade em Liderança', atual: 78, meta: 75, cor: '#16a34a' },
  { nome: 'Shortlist com Diversidade Validada', atual: 86, meta: 80, cor: '#7c3aed' },
  { nome: 'Cobertura Regional Mapeada', atual: 92, meta: 85, cor: '#2563eb' },
  { nome: 'Privacidade na Triagem Inicial', atual: 100, meta: 100, cor: '#0f766e' },
];

const indicadores = [
  { label: 'Score ESG Geral', value: '86/100' },
  { label: 'Metas Atingidas', value: '4/4' },
  { label: 'Candidatos Anonimizados', value: '100%' },
  { label: 'Regiões Monitoradas', value: '24' },
];

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
      <div style={{ color: '#111827', fontSize: 26, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

export default function PainelRelatorioESG() {
  const powerBiUrl = import.meta.env.VITE_POWERBI_URL;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '7px 10px', fontSize: 12, fontWeight: 700 }}>
        RELATÓRIO ESG - DADOS DEMONSTRATIVOS
      </div>

      <h1 style={{ marginBottom: 4 }}>Relatório ESG</h1>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        Indicadores executivos de diversidade, privacidade e impacto regional para apoiar a tomada de decisão do RH.
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
        {indicadores.map((item) => <Card key={item.label} label={item.label} value={item.value} />)}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Progresso das Metas ESG</h2>
          {metasEsg.map((meta) => (
            <div key={meta.nome} style={{ margin: '18px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
                <span>{meta.nome}</span>
                <strong>{meta.atual}% / {meta.meta}%</strong>
              </div>
              <div style={{ height: 9, background: '#e5e7eb', borderRadius: 8, marginTop: 6 }}>
                <div style={{ height: 9, width: `${Math.min(meta.atual, 100)}%`, background: meta.cor, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Leitura Executiva</h2>
          <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.6 }}>
            Este recorte demonstrativo ilustra como o RH pode acompanhar diversidade, cobertura regional
            e privacidade na triagem. Os valores não representam uma medição produtiva auditada.
          </p>
          <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 14, color: '#334155', fontSize: 13 }}>
            Módulo demonstrativo — integração com Power BI prevista para uma próxima versão.
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px dashed #94a3b8', borderRadius: 8, minHeight: 180, overflow: 'hidden' }}>
          {powerBiUrl ? (
            <iframe title="Power BI - Relatorio ESG" src={powerBiUrl} style={{ width: '100%', height: 360, border: 0 }} />
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#475569', padding: 20 }}>
              Módulo demonstrativo — nenhum dashboard Power BI publicado está configurado.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
