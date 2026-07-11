import { useEffect, useMemo, useState } from 'react';
import { executarMatch } from '../../lib/appbitApi';
import type { MatchResponse } from '../../lib/appbitTypes';
import { formatarNivelMvp, formatarSkillMvp, formatarTextoMvp } from '../../lib/formatarTextoMvp';

function Card({ label, value, icon, gradient }: { label: string; value: string | number; icon: string; gradient: string }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: 16,
      padding: '20px 24px',
      color: '#fff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 110,
      transition: 'transform 0.2s ease-in-out',
      cursor: 'default'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>{label}</span>
        <span style={{ fontSize: 24, opacity: 0.95 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 12, zIndex: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{
        position: 'absolute',
        right: -10,
        bottom: -20,
        fontSize: 100,
        opacity: 0.06,
        fontWeight: 900,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        {icon}
      </div>
    </div>
  );
}

const getScoreColor = (score: number) => {
  if (score >= 83) return { border: '#10b981', text: '#047857', bg: '#ecfdf5' };
  if (score >= 78) return { border: '#6366f1', text: '#4338ca', bg: '#e0e7ff' };
  return { border: '#f59e0b', text: '#b45309', bg: '#fffbeb' };
};

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
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24, fontFamily: '"Inter", system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.02em' }}>Dashboard Executivo</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>
            Triagem automatizada de candidatos · Fonte: <strong style={{ color: '#7c3aed' }}>{match.fonte_candidatos}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#ede9fe', color: '#6d28d9', padding: '8px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
          🛡️ Filtro Anti-Viés Ativo
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card label="Candidatos analisados" value={match.total_analisados} icon="👥" gradient="linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)" />
        <Card label="Candidatos retornados" value={match.total_retorno} icon="🎯" gradient="linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)" />
        <Card label="Score médio informado" value={`${averageScore}%`} icon="📈" gradient="linear-gradient(135deg, #059669 0%, #34d399 100%)" />
      </div>

      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Candidatos na Shortlist</h2>
          <span style={{ fontSize: 12, color: '#6b7280', background: '#f1f5f9', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>
            {match.regra_privacidade}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
          {match.candidatos.map((candidate) => {
            const scColor = getScoreColor(candidate.score_match);
            return (
              <article 
                key={candidate.candidato_id} 
                className="dashboard-card"
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 16, 
                  padding: 20, 
                  background: '#fff',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 180
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ color: '#7c3aed', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {formatarNivelMvp(candidate.nivel)} · {formatarTextoMvp(candidate.regiao)}
                      </div>
                      <div style={{ color: '#1e1b4b', fontSize: 14, fontWeight: 700, marginTop: 6 }}>
                        {candidate.badge_diversidade ? formatarTextoMvp(candidate.badge_diversidade) : 'Sem badge de diversidade'}
                      </div>
                    </div>
                    <div style={{ 
                      minWidth: 54, 
                      height: 54, 
                      background: scColor.bg,
                      border: `2px solid ${scColor.border}`, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: scColor.text, 
                      fontWeight: 800,
                      fontSize: 14
                    }}>
                      {candidate.score_match}%
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {candidate.skills.map((skill) => (
                      <span key={skill} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px', color: '#475569', fontSize: 11, fontWeight: 600 }}>
                        {formatarSkillMvp(skill)}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.justificativa_ai && (
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6366f1', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      🤖 Justificativa da IA
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: '#475569', lineHeight: 1.45 }}>
                      {candidate.justificativa_ai}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <p style={{ color: '#6b7280', fontSize: 13, marginTop: 16 }}>A estrutura demonstrativa de Turnover e ESG está disponível nas telas “Relatório ESG” e “Saúde do time”.</p>
    </div>
  );
}
