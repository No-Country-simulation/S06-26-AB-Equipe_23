import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aprovarCandidato, executarMatch } from '../../../lib/appbitApi';
import type { CandidatoMatch, ContatoAprovado, MatchResponse } from '../../../lib/appbitTypes';
import './shortlist.css';

const EMPRESA_ID = 'emp_001';

const MATCH_REQUEST = {
  empresa_id: EMPRESA_ID,
  vaga: {
    titulo: 'Analista de Dados Junior',
    skills: ['sql', 'python', 'power bi'],
    nivel: 'junior',
    modelo_trabalho: 'hibrido',
  },
  filtros: {
    anti_vies: true,
    limite_resultados: 8,
  },
};

const VAGA_OFICIAL = {
  titulo: 'Analista de Dados Junior',
  area: 'Dados',
  modelo: 'Hibrido',
  local: 'Brasil',
  scoreESG: 92,
};

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Mulher: { bg: '#F3EFFE', color: '#6D28D9' },
  'Mulher negra em tecnologia': { bg: '#EDE9FE', color: '#5B21B6' },
  'Pessoa com deficiencia': { bg: '#FEF3C7', color: '#92400E' },
  'Primeira geracao no ensino superior': { bg: '#DCFCE7', color: '#166534' },
  'Talento de baixa renda': { bg: '#FCE7F3', color: '#9D174D' },
};

function scoreStyle(s: number) {
  if (s >= 90) return { bg: '#DCFCE7', color: '#166534', ring: '#4ADE80' };
  if (s >= 80) return { bg: '#EDE9FE', color: '#5B21B6', ring: '#8B5CF6' };
  return { bg: '#FEF3C7', color: '#92400E', ring: '#F59E0B' };
}

function firstSkillLabel(candidate: CandidatoMatch) {
  return candidate.skills.length ? candidate.skills.join(', ') : 'Nao informado';
}

export default function ShortList() {
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [error, setError] = useState('');
  const [revealing, setRevealing] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<Record<string, string>>({});
  const [approvedContacts, setApprovedContacts] = useState<Record<string, ContatoAprovado>>({});

  useEffect(() => {
    executarMatch(MATCH_REQUEST)
      .then((response) => {
        setMatch(response);
        setError('');
      })
      .catch(() => {
        setError('Nao foi possivel carregar o POST /match. A shortlist oficial depende do backend.');
      });
  }, []);

  const candidatos = match?.candidatos ?? [];

  const averageScore = useMemo(() => {
    if (!candidatos.length) return 0;
    return Math.round(candidatos.reduce((sum, item) => sum + item.score_match, 0) / candidatos.length);
  }, [candidatos]);

  async function handleAprovar(candidateId: string) {
    setRevealing(candidateId);
    setApprovalError((prev) => ({ ...prev, [candidateId]: '' }));

    try {
      const contato = await aprovarCandidato({ candidato_id: candidateId, empresa_id: EMPRESA_ID });
      setApprovedContacts((prev) => ({ ...prev, [candidateId]: contato }));
    } catch {
      setApprovalError((prev) => ({
        ...prev,
        [candidateId]: 'Aprovacao nao confirmada pelo backend. Dados sensiveis permanecem ocultos.',
      }));
    } finally {
      setRevealing(null);
    }
  }

  return (
    <div className="sl-shell">
      <header className="sl-topbar">
        <div className="sl-topbar__left">
          <button className="sl-back-btn" onClick={() => navigate('/')} aria-label="Voltar">
            ←
          </button>
          <div>
            <nav className="sl-breadcrumb">
              <span
                className="sl-breadcrumb__link"
                onClick={() => navigate('/')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
              >
                Minhas vagas
              </span>
              <span className="sl-breadcrumb__sep">›</span>
              <span className="sl-breadcrumb__current">Shortlist — {VAGA_OFICIAL.titulo}</span>
            </nav>
            <h1 className="sl-topbar__title">
              Lista de triagem
              <span className="sl-topbar__count">{candidatos.length} candidatos oficiais</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="sl-body">
        <aside className="sl-sidebar">
          <p className="sl-sidebar__heading">Vaga oficial do MVP</p>
          <button className="sl-vaga-item sl-vaga-item--active">
            <span className="sl-vaga-item__titulo">{VAGA_OFICIAL.titulo}</span>
            <span className="sl-vaga-item__area">{VAGA_OFICIAL.area}</span>
            <span className="sl-vaga-item__local">
              📍 {VAGA_OFICIAL.modelo} · {VAGA_OFICIAL.local}
            </span>
            <div className="sl-vaga-item__bar-wrap">
              <div className="sl-vaga-item__bar" style={{ width: `${VAGA_OFICIAL.scoreESG}%` }} />
              <span className="sl-vaga-item__pct">{VAGA_OFICIAL.scoreESG}%</span>
            </div>
          </button>
        </aside>

        <main className="sl-main">
          <div className="sl-notice">
            🛡️
            <p>
              <strong>Filtro anti-vies ativo</strong> — a tela consome o contrato oficial do backend e nao carrega
              nome, e-mail, telefone ou LinkedIn na shortlist inicial.
            </p>
          </div>

          <div className="sl-insights-bar">
            <p className="sl-insights-bar__text">
              Fonte: {match?.fonte_candidatos ?? 'POST /match'} · analisados: {match?.total_analisados ?? 0} · score medio: {averageScore}
            </p>
            <button className="sl-btn-insights" onClick={() => navigate('/insights/regioes')}>
              Ver insights da rede →
            </button>
          </div>

          {error ? (
            <div className="sl-empty">
              👥
              <p>{error}</p>
            </div>
          ) : !match ? (
            <div className="sl-empty">
              👥
              <p>Carregando shortlist oficial...</p>
            </div>
          ) : candidatos.length === 0 ? (
            <div className="sl-empty">
              👥
              <p>Nenhum candidato retornado pelo contrato oficial.</p>
            </div>
          ) : (
            <div className="sl-grid">
              {candidatos.map((candidate) => {
                const approved = approvedContacts[candidate.candidato_id];
                const isRevealing = revealing === candidate.candidato_id;
                const sc = scoreStyle(candidate.score_match);
                const badge = candidate.badge_diversidade;
                const badgeStyle = badge ? BADGE_COLORS[badge] ?? { bg: '#F3F4F6', color: '#6B7280' } : null;

                return (
                  <article key={candidate.candidato_id} className={`sl-card${approved ? ' sl-card--aprovado' : ''}`}>
                    {approved && <div className="sl-card__ribbon">✓ Aprovado</div>}

                    <div className="sl-card__header">
                      <div className="sl-card__avatar">
                        {approved ? <span className="sl-card__initial">{approved.contato_liberado.nome[0]}</span> : <span>👤</span>}
                      </div>
                      <div className="sl-card__id-block">
                        <p className="sl-card__codinome">{approved ? approved.contato_liberado.nome : candidate.apelido_exibicao}</p>
                        <div className="sl-card__meta">
                          <span>📍 {candidate.regiao}</span>
                          <span className="sl-dot" />
                          <span>{candidate.nivel}</span>
                        </div>
                      </div>
                      <div className="sl-score" style={{ background: sc.bg, borderColor: sc.ring, color: sc.color }}>
                        <span className="sl-score__num">{candidate.score_match}</span>
                        <span className="sl-score__pct">%</span>
                      </div>
                    </div>

                    {badge && badgeStyle && (
                      <div className="sl-card__badges">
                        <span className="sl-badge" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                          {badge}
                        </span>
                      </div>
                    )}

                    <div className="sl-card__divider" />

                    <div className="sl-card__section">
                      <p className="sl-card__section-label">Competencias tecnicas</p>
                      <div className="sl-card__skills">
                        {candidate.skills.map((skill) => (
                          <span key={skill} className="sl-skill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sl-card__row">
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Experiencia</span>
                        <span className="sl-card__detail-value">{candidate.anos_experiencia ?? 0} ano(s)</span>
                      </div>
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Modelo</span>
                        <span className="sl-card__detail-value">{candidate.modelo_trabalho_preferido ?? 'Nao informado'}</span>
                      </div>
                    </div>

                    {!approved && (
                      <div className="sl-card__anon">
                        🔒 Dados sensiveis ocultos. Skills: {firstSkillLabel(candidate)}
                      </div>
                    )}

                    {approved && (
                      <div className="sl-card__contact">
                        <div className="sl-card__contact-item">✉️ <a href={`mailto:${approved.contato_liberado.email}`}>{approved.contato_liberado.email}</a></div>
                        <div className="sl-card__contact-item">☎ {approved.contato_liberado.telefone}</div>
                        <div className="sl-card__contact-item">
                          🔗 <a href={approved.contato_liberado.linkedin} target="_blank" rel="noopener noreferrer">{approved.contato_liberado.linkedin}</a>
                        </div>
                      </div>
                    )}

                    {approvalError[candidate.candidato_id] && (
                      <div className="sl-card__anon">{approvalError[candidate.candidato_id]}</div>
                    )}

                    {!approved ? (
                      <button className="sl-btn-aprovar" onClick={() => handleAprovar(candidate.candidato_id)} disabled={isRevealing}>
                        {isRevealing ? <><span className="sl-spinner" /> Aprovando...</> : <>✓ Aprovar para entrevista</>}
                      </button>
                    ) : (
                      <button className="sl-btn-aprovado" onClick={() => navigate('/')}>
                        Ver pre-aprovados →
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
