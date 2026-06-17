import { useEffect, useMemo, useState } from 'react';
import { executarMatch } from '../../lib/appbitApi';
import type { MatchResponse } from '../../lib/appbitTypes';

function Card({ label, value, accent = '#6C3FC5' }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, borderTop: `4px solid ${accent}` }}>
      <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ color: '#111827', fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function DashboardExecutivo() {
  const [match, setMatch] = useState<MatchResponse | null>(null);

  useEffect(() => {
    executarMatch().then(setMatch);
  }, []);

  const scoreMedio = useMemo(() => {
    if (!match?.candidatos.length) return 0;
    return Math.round(match.candidatos.reduce((acc, candidato) => acc + candidato.score_match, 0) / match.candidatos.length);
  }, [match]);

  if (!match) {
    return <div style={{ flex: 1, padding: 24 }}>Carregando dashboard...</div>;
  }

  const turnover = scoreMedio >= 85 ? 18.5 : scoreMedio >= 75 ? 24 : 31;
  const riscoTurnover = turnover > 25 ? 'alto' : turnover >= 15 ? 'médio' : 'baixo';
  const maiorScore = Math.max(...match.candidatos.map((candidato) => candidato.score_match));

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, margin: 0, color: '#111827' }}>Dashboard RH - App BiT</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>
          Visão executiva de shortlist, ESG e risco de turnover.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Card label="Vagas abertas" value={4} />
        <Card label="Candidatos analisados" value={match.total_analisados} />
        <Card label="Shortlist" value={match.total_retorno} />
        <Card label="Score médio" value={scoreMedio} />
        <Card label="Turnover estimado" value={`${turnover}%`} accent={riscoTurnover === 'alto' ? '#EF4444' : '#F59E0B'} />
        <Card label="Meta ESG" value={match.metrica_diversidade.meta_atingida ? 'Atingida' : 'Atenção'} accent="#16A34A" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Score por candidato</h3>
          {match.candidatos.map((candidato) => (
            <div key={candidato.candidato_id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{candidato.apelido_exibicao}</span>
                <strong>{candidato.score_match}</strong>
              </div>
              <div style={{ height: 10, background: '#ede9fe', borderRadius: 999, marginTop: 5 }}>
                <div style={{ width: `${(candidato.score_match / maiorScore) * 100}%`, height: 10, background: '#6C3FC5', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </section>

        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>ESG e turnover</h3>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span>Shortlist diversa</span>
              <strong>{match.metrica_diversidade.percentual_shortlist_diversa}% / meta {match.metrica_diversidade.meta_diversidade}%</strong>
            </div>
            <div style={{ height: 12, background: '#dcfce7', borderRadius: 999, marginTop: 6 }}>
              <div style={{ width: `${match.metrica_diversidade.percentual_shortlist_diversa}%`, height: 12, background: '#16A34A', borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <strong>Risco de turnover: {riscoTurnover}</strong>
            <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 13 }}>
              Indicador simulado para MVP. Fatores: modelo híbrido, nível junior e mercado competitivo.
            </p>
          </div>
        </section>

        <section style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Shortlist anonimizada</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ color: '#6b7280', textAlign: 'left' }}>
                <th>Candidato</th><th>Status</th><th>Nível</th><th>Região</th><th>Score</th><th>Skills</th><th>Badge</th>
              </tr>
            </thead>
            <tbody>
              {match.candidatos.map((candidato) => (
                <tr key={candidato.candidato_id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td>{candidato.apelido_exibicao}</td>
                  <td>{candidato.status_identificacao}</td>
                  <td>{candidato.nivel}</td>
                  <td>{candidato.regiao}</td>
                  <td>{candidato.score_match}</td>
                  <td>{candidato.skills.join(', ')}</td>
                  <td>{candidato.badge_diversidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
