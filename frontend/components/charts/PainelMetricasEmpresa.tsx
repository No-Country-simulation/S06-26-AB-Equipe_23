const turnoverMensal = [3.8, 5.1, 4.2, 5.8, 4.7, 3.9, 5.4, 4.5, 3.6, 5.0, 4.3, 4.0];
const departamentos = [
  { nome: 'Tecnologia', valor: 5.6 },
  { nome: 'Operações', valor: 6.4 },
  { nome: 'Comercial', valor: 4.7 },
  { nome: 'Administrativo', valor: 3.1 },
];

function Card({ label, value }: { label: string; value: string }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}><div style={{ color: '#64748b', fontSize: 12 }}>{label}</div><div style={{ fontSize: 25, fontWeight: 700, marginTop: 8 }}>{value}</div></div>;
}

export default function PainelMetricasEmpresa() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ display: 'inline-block', background: '#fff3cd', color: '#805b00', borderRadius: 6, padding: '7px 10px', fontSize: 12, fontWeight: 700 }}>DADOS DEMONSTRATIVOS — EMPRESAS GENÉRICAS</div>
      <h1 style={{ marginBottom: 4 }}>Saúde do Time e ESG</h1>
      <p style={{ color: '#64748b', marginTop: 0 }}>Área reservada para incorporação do Power BI ou componentes conectados aos dados da empresa.</p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: 12 }}>
        <Card label="Turnover geral" value="4,8%" />
        <Card label="Desligamentos" value="17" />
        <Card label="Participação diversa" value="43,0%" />
        <Card label="Meta ESG" value="Atingida" />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginTop: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Evolução mensal do turnover</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'end', gap: 10 }}>
            {turnoverMensal.map((valor, index) => <div key={index} title={`${valor.toFixed(1)}%`} style={{ flex: 1, height: `${valor * 13}%`, maxHeight: '90%', background: '#6C3FC5', borderRadius: '5px 5px 0 0' }} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 11 }}><span>Jan/2026</span><span>Dez/2026</span></div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Turnover por departamento</h2>
          {departamentos.map((item) => <div key={item.nome} style={{ margin: '18px 0' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>{item.nome}</span><strong>{item.valor.toFixed(1)}%</strong></div><div style={{ height: 9, background: '#ede9fe', borderRadius: 8, marginTop: 5 }}><div style={{ height: 9, width: `${item.valor * 12}%`, background: '#16a34a', borderRadius: 8 }} /></div></div>)}
        </div>

        <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px dashed #94a3b8', borderRadius: 10, padding: 22, textAlign: 'center', color: '#475569' }}>
          Espaço reservado para iframe do Power BI. Substituir os dados demonstrativos após a empresa cadastrar a base corporativa.
        </div>
      </section>
    </div>
  );
}
