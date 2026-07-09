import { useEffect, useMemo, useState } from 'react';
import { executarMatch } from '../../lib/appbitApi';
import type { MatchResponse } from '../../lib/appbitTypes';
import { formatarNivelMvp, formatarSkillMvp, formatarTextoMvp } from '../../lib/formatarTextoMvp';

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
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0 }}>{match.regra_privacidade}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {match.candidatos.map((candidate) => (
            <article key={candidate.candidato_id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {formatarNivelMvp(candidate.nivel)} · {formatarTextoMvp(candidate.regiao)}
                  </div>
                  <div style={{ color: '#111827', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                    {candidate.badge_diversidade ? formatarTextoMvp(candidate.badge_diversidade) : 'Sem badge informada'}
                  </div>
                </div>
                <div style={{ minWidth: 54, height: 54, border: '2px solid #7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b21b6', fontWeight: 800 }}>
                  {candidate.score_match}%
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {candidate.skills.map((skill) => (
                  <span key={skill} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', color: '#1e1b4b', fontSize: 11, fontWeight: 600 }}>
                    {formatarSkillMvp(skill)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <p style={{ color: '#6b7280', fontSize: 13 }}>A estrutura demonstrativa de Turnover e ESG está disponível nas telas “Relatório ESG” e “Saúde do time”.</p>
    </div>
  );
}
