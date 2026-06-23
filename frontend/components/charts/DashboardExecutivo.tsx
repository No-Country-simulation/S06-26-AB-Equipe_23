import { useEffect, useMemo, useState } from 'react';
import { executarMatch } from '../../lib/appbitApi';
import type { MatchResponse } from '../../lib/appbitTypes';

function Card({ label, value }: { label: string; value: string | number }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14 }}><div style={{ color: '#6b7280', fontSize: 12 }}>{label}</div><div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div></div>;
}

export default function DashboardExecutivo() {
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    executarMatch().then(setMatch).catch(() => setError('Não foi possível carregar o POST /match. O frontend não usa mais candidatos inventados como fallback.'));
  }, []);

  const averageScore = useMemo(() => {
    if (!match?.candidatos.length) return 0;
    return Math.round(match.candidatos.reduce((sum, item) => sum + item.score_match, 0) / match.candidatos.length);
  }, [match]);

  if (error) return <div style={{ padding: 24, color: '#b91c1c' }}>{error}</div>;
  if (!match) return <div style={{ padding: 24 }}>Carregando shortlist...</div>;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <h1 style={{ margin: 0 }}>Shortlist do MVP</h1>
      <p style={{ color: '#6b7280' }}>Fonte informada pelo backend: {match.fonte_candidatos}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Card label="Candidatos analisados" value={match.total_analisados} />
        <Card label="Candidatos retornados" value={match.total_retorno} />
        <Card label="Score médio informado" value={averageScore} />
      </div>
      <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
        <p style={{ color: '#6b7280', fontSize: 13 }}>{match.regra_privacidade}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr style={{ textAlign: 'left' }}><th>Candidato</th><th>Nível</th><th>Região</th><th>Score</th><th>Skills</th><th>Badge informado</th></tr></thead>
          <tbody>{match.candidatos.map((candidate) => <tr key={candidate.candidato_id} style={{ borderTop: '1px solid #e5e7eb' }}><td>{candidate.apelido_exibicao}</td><td>{candidate.nivel}</td><td>{candidate.regiao}</td><td>{candidate.score_match}</td><td>{candidate.skills.join(', ')}</td><td>{candidate.badge_diversidade ?? 'Não informado'}</td></tr>)}</tbody>
        </table>
      </section>
      <p style={{ color: '#6b7280', fontSize: 13 }}>A estrutura demonstrativa de Turnover e ESG está disponível nas telas “Relatório ESG” e “Saúde do time”.</p>
    </div>
  );
}
