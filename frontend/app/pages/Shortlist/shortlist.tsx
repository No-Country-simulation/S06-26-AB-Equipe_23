import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { aprovarCandidato, executarMatch, buscarVagaPorId, buscarVagas } from '../../../lib/appbitApi';
import type { CandidatoMatch, ContatoAprovado, MatchResponse, MatchRequest, VagaBackend } from '../../../lib/appbitTypes';
import { formatarNivelMvp, formatarSkillMvp, formatarTextoMvp } from '../../../lib/formatarTextoMvp';
import './shortlist.css';

const EMPRESA_ID = 'emp_001';

const MATCH_REQUEST: MatchRequest = {
  empresa_id: EMPRESA_ID,
  vaga: {
    titulo: 'Analista de Dados Júnior',
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
  titulo: 'Analista de Dados Júnior',
  area: 'Dados',
  modelo: 'Híbrido',
  local: 'Brasil',
  scoreESG: 92,
  nivel: 'Júnior',
};

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Mulher: { bg: '#F3EFFE', color: '#6D28D9' },
  'Mulher negra em tecnologia': { bg: '#EDE9FE', color: '#5B21B6' },
  'Pessoa com deficiencia': { bg: '#FEF3C7', color: '#92400E' },
  'Primeira geracao no ensino superior': { bg: '#DCFCE7', color: '#166534' },
  'Talento de baixa renda': { bg: '#FCE7F3', color: '#9D174D' },
  'Talento de regiao com menor acesso': { bg: '#FEF3C7', color: '#92400E' },
  'Perfil junior em formacao tecnica': { bg: '#E0F2FE', color: '#0369A1' },
  'Mulher em transicao de carreira para tecnologia': { bg: '#FCE7F3', color: '#9D174D' },
};

function scoreStyle(s: number) {
  if (s >= 90) return { bg: '#DCFCE7', color: '#166534', ring: '#4ADE80' };
  if (s >= 80) return { bg: '#EDE9FE', color: '#5B21B6', ring: '#8B5CF6' };
  return { bg: '#FEF3C7', color: '#92400E', ring: '#F59E0B' };
}

function getCandidateSkills(candidate: CandidatoMatch) {
  return Array.isArray(candidate.skills) ? candidate.skills : [];
}

function firstSkillLabel(candidate: CandidatoMatch) {
  const skills = getCandidateSkills(candidate);
  return skills.length ? skills.map(formatarSkillMvp).join(', ') : 'Não informado';
}

function isContatoAprovado(value: unknown): value is ContatoAprovado {
  if (!value || typeof value !== 'object') return false;
  const contato = (value as Partial<ContatoAprovado>).contato_liberado;
  return Boolean(
    contato &&
      typeof contato.nome === 'string' &&
      typeof contato.email === 'string' &&
      typeof contato.telefone === 'string' &&
      typeof contato.linkedin === 'string'
  );
}

function getApprovedContactsStorageKey(vagaId: string) {
  return `appbit:shortlist:approved:${EMPRESA_ID}:vaga:${vagaId}`;
}

function loadApprovedContacts(storageKey: string): Record<string, ContatoAprovado> {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => isContatoAprovado(value))
    ) as Record<string, ContatoAprovado>;
  } catch {
    return {};
  }
}

function saveApprovedContacts(storageKey: string, contacts: Record<string, ContatoAprovado>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(contacts));
  } catch {
    // Se o navegador bloquear armazenamento local, a aprovação segue válida na sessão atual.
  }
}

export default function ShortList() {
  const navigate = useNavigate();
  const { vagaId: paramVagaId } = useParams();
  const [searchParams] = useSearchParams();
  const vagaId = searchParams.get('vaga') ?? paramVagaId ?? 'mvp-oficial';
  const approvedContactsStorageKey = useMemo(() => getApprovedContactsStorageKey(vagaId), [vagaId]);

  const [todasVagas, setTodasVagas] = useState<VagaBackend[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [vagaAtual, setVagaAtual] = useState({
    titulo: VAGA_OFICIAL.titulo,
    area: VAGA_OFICIAL.area,
    modelo: VAGA_OFICIAL.modelo,
    local: VAGA_OFICIAL.local,
    scoreESG: VAGA_OFICIAL.scoreESG,
    nivel: VAGA_OFICIAL.nivel,
    isCustom: false,
  });
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [error, setError] = useState('');
  const [revealing, setRevealing] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<Record<string, string>>({});
  const [approvedContacts, setApprovedContacts] = useState<Record<string, ContatoAprovado>>(() =>
    loadApprovedContacts(approvedContactsStorageKey)
  );

  // Carrega lista de vagas cadastradas para a sidebar e mobile select
  useEffect(() => {
    let ativo = true;
    buscarVagas()
      .then((vagas) => {
        if (ativo) setTodasVagas(vagas);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    // The query parameter can change while this component stays mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApprovedContacts(loadApprovedContacts(approvedContactsStorageKey));
  }, [approvedContactsStorageKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarregando(true);
    const idNum = Number(vagaId);
    if (!isNaN(idNum) && idNum > 0) {
      buscarVagaPorId(idNum)
        .then((vagaBackend) => {
          setVagaAtual({
            titulo: vagaBackend.titulo,
            area: vagaBackend.area || 'Dados',
            modelo: vagaBackend.modalidade || 'Híbrido',
            local: vagaBackend.regiaoAlvo?.municipio || 'Brasil',
            scoreESG: vagaBackend.esgMatch ?? 85,
            nivel: vagaBackend.nivel ? formatarNivelMvp(vagaBackend.nivel) : 'Júnior',
            isCustom: true,
          });
          const req: MatchRequest = {
            empresa_id: EMPRESA_ID,
            vaga: {
              titulo: vagaBackend.titulo,
              skills: vagaBackend.skills && vagaBackend.skills.length ? vagaBackend.skills : ['sql', 'python'],
              nivel: vagaBackend.nivel ? vagaBackend.nivel.toLowerCase() : 'junior',
              modelo_trabalho: vagaBackend.modalidade ? vagaBackend.modalidade.toLowerCase() : 'hibrido',
            },
            filtros: {
              anti_vies: vagaBackend.antiVies ?? true,
              diversidade_minima: vagaBackend.diversidadeMinima ? Number(vagaBackend.diversidadeMinima) : 40,
              limite_resultados: 8,
            },
          };
          return executarMatch(req);
        })
        .then((response) => {
          setMatch(response);
          setError('');
        })
        .catch(() => {
          setVagaAtual({
            titulo: VAGA_OFICIAL.titulo,
            area: VAGA_OFICIAL.area,
            modelo: VAGA_OFICIAL.modelo,
            local: VAGA_OFICIAL.local,
            scoreESG: VAGA_OFICIAL.scoreESG,
            nivel: VAGA_OFICIAL.nivel,
            isCustom: false,
          });
          executarMatch(MATCH_REQUEST)
            .then((res) => {
              setMatch(res);
              setError('');
            })
            .catch(() => {
              setError('Não foi possível carregar o POST /match. A shortlist oficial depende do backend.');
            });
        })
        .finally(() => {
          setCarregando(false);
        });
    } else {
      setVagaAtual({
        titulo: VAGA_OFICIAL.titulo,
        area: VAGA_OFICIAL.area,
        modelo: VAGA_OFICIAL.modelo,
        local: VAGA_OFICIAL.local,
        scoreESG: VAGA_OFICIAL.scoreESG,
        nivel: VAGA_OFICIAL.nivel,
        isCustom: false,
      });
      executarMatch(MATCH_REQUEST)
        .then((response) => {
          setMatch(response);
          setError('');
        })
        .catch(() => {
          setError('Não foi possível carregar o POST /match. A shortlist oficial depende do backend.');
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [vagaId]);

  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'aprovados' | 'pendentes'>('todos');
  const [filtroMinScore, setFiltroMinScore] = useState<number>(0);
  const [filtroBadge, setFiltroBadge] = useState<string>('');
  const [filtroModelo, setFiltroModelo] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<string>('score_desc');

  const candidatos = useMemo(() => match?.candidatos ?? [], [match]);

  const totalAprovados = useMemo(() => {
    return candidatos.filter((c) => isContatoAprovado(approvedContacts[c.candidato_id])).length;
  }, [candidatos, approvedContacts]);

  const badgesDisponiveis = useMemo(() => {
    const set = new Set<string>();
    candidatos.forEach((c) => {
      if (c.badge_diversidade && c.badge_diversidade !== 'Sem badge informada' && c.badge_diversidade !== 'Nenhum') {
        set.add(c.badge_diversidade);
      }
    });
    return Array.from(set);
  }, [candidatos]);

  const candidatosFiltrados = useMemo(() => {
    return candidatos
      .filter((c) => {
        const aprovado = isContatoAprovado(approvedContacts[c.candidato_id]);
        if (filtroStatus === 'aprovados' && !aprovado) return false;
        if (filtroStatus === 'pendentes' && aprovado) return false;
        if (filtroMinScore > 0 && c.score_match < filtroMinScore) return false;
        if (filtroBadge && c.badge_diversidade !== filtroBadge) return false;
        if (
          filtroModelo &&
          c.modelo_trabalho_preferido &&
          !c.modelo_trabalho_preferido.toLowerCase().includes(filtroModelo.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (ordenacao === 'score_desc') return b.score_match - a.score_match;
        if (ordenacao === 'score_asc') return a.score_match - b.score_match;
        if (ordenacao === 'exp_desc') return (b.anos_experiencia ?? 0) - (a.anos_experiencia ?? 0);
        return 0;
      });
  }, [candidatos, approvedContacts, filtroStatus, filtroMinScore, filtroBadge, filtroModelo, ordenacao]);

  const averageScore = useMemo(() => {
    if (!candidatosFiltrados.length) return 0;
    return Math.round(candidatosFiltrados.reduce((sum, item) => sum + item.score_match, 0) / candidatosFiltrados.length);
  }, [candidatosFiltrados]);

  async function handleAprovar(candidateId: string) {
    setRevealing(candidateId);
    setApprovalError((prev) => ({ ...prev, [candidateId]: '' }));

    try {
      const contato = await aprovarCandidato({ candidato_id: candidateId, empresa_id: EMPRESA_ID });
      setApprovedContacts((prev) => {
        const next = { ...prev, [candidateId]: contato };
        saveApprovedContacts(approvedContactsStorageKey, next);
        return next;
      });
    } catch {
      setApprovalError((prev) => ({
        ...prev,
        [candidateId]: 'Aprovação não confirmada pelo backend. Dados sensíveis permanecem ocultos.',
      }));
    } finally {
      setRevealing(null);
    }
  }

  const temFiltroAtivo =
    filtroStatus !== 'todos' ||
    filtroMinScore > 0 ||
    Boolean(filtroBadge) ||
    Boolean(filtroModelo) ||
    ordenacao !== 'score_desc';

  function limparFiltros() {
    setFiltroStatus('todos');
    setFiltroMinScore(0);
    setFiltroBadge('');
    setFiltroModelo('');
    setOrdenacao('score_desc');
  }

  return (
    <div className="sl-shell">
      <header className="sl-topbar">
        <div className="sl-topbar__left">
          <button className="sl-back-btn" onClick={() => navigate('/vagas')} aria-label="Voltar para Minhas Vagas">
            ←
          </button>
          <div>
            <nav className="sl-breadcrumb">
              <span
                className="sl-breadcrumb__link"
                onClick={() => navigate('/vagas')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/vagas')}
              >
                Minhas vagas
              </span>
              <span className="sl-breadcrumb__sep">›</span>
              <span className="sl-breadcrumb__current">Shortlist — {formatarTextoMvp(vagaAtual.titulo)}</span>
            </nav>
            <h1 className="sl-topbar__title">
              Lista de triagem
              <span className="sl-topbar__count">{candidatosFiltrados.length} de {candidatos.length} candidatos</span>
            </h1>
          </div>
        </div>

        <div className="sl-topbar__right">
          <select
            className="sl-vaga-select"
            value={vagaId}
            onChange={(e) => {
              const val = e.target.value;
              navigate(val === 'mvp-oficial' ? '/shortlist' : `/shortlist?vaga=${val}`);
            }}
            aria-label="Selecionar vaga"
          >
            <option value="mvp-oficial">⭐ Vaga MVP: {VAGA_OFICIAL.titulo}</option>
            {todasVagas.map((v) => (
              <option key={v.id} value={String(v.id)}>
                {v.titulo} ({v.nivel ?? 'Júnior'})
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="sl-body">
        <aside className="sl-sidebar">
          <p className="sl-sidebar__heading">Vaga oficial do MVP</p>
          <button
            type="button"
            className={`sl-vaga-item ${vagaId === 'mvp-oficial' ? 'sl-vaga-item--active' : ''}`}
            onClick={() => navigate('/shortlist')}
          >
            <span className="sl-vaga-item__titulo">{formatarTextoMvp(VAGA_OFICIAL.titulo)}</span>
            <span className="sl-vaga-item__area">{VAGA_OFICIAL.area} · {VAGA_OFICIAL.nivel}</span>
            <span className="sl-vaga-item__local">
              📍 {formatarTextoMvp(VAGA_OFICIAL.modelo)} · {VAGA_OFICIAL.local}
            </span>
            <div className="sl-vaga-item__bar-wrap">
              <div className="sl-vaga-item__bar" style={{ width: `${VAGA_OFICIAL.scoreESG}%` }} />
              <span className="sl-vaga-item__pct">{VAGA_OFICIAL.scoreESG}%</span>
            </div>
          </button>

          {todasVagas.length > 0 && (
            <>
              <p className="sl-sidebar__heading" style={{ marginTop: 16 }}>Vagas da empresa ({todasVagas.length})</p>
              {todasVagas.map((v) => {
                const isActive = vagaId === String(v.id);
                const esg = v.esgMatch ?? 85;
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`sl-vaga-item ${isActive ? 'sl-vaga-item--active' : ''}`}
                    onClick={() => navigate(`/shortlist?vaga=${v.id}`)}
                  >
                    <span className="sl-vaga-item__titulo">{formatarTextoMvp(v.titulo)}</span>
                    <span className="sl-vaga-item__area">
                      {v.area || 'Dados'} · {v.nivel ? formatarNivelMvp(v.nivel) : 'Júnior'}
                    </span>
                    <span className="sl-vaga-item__local">
                      📍 {formatarTextoMvp(v.modalidade || 'Híbrido')} · {v.regiaoAlvo?.municipio || 'Brasil'}
                    </span>
                    <div className="sl-vaga-item__bar-wrap">
                      <div className="sl-vaga-item__bar" style={{ width: `${esg}%` }} />
                      <span className="sl-vaga-item__pct">{esg}%</span>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </aside>

        <main className="sl-main">
          <div className="sl-notice">
            🛡️
            <p>
              <strong>Filtro anti-viés ativo</strong> — a tela consome o contrato oficial do backend e não carrega
              nome, e-mail, telefone ou LinkedIn na shortlist inicial.
            </p>
          </div>

          <div className="sl-insights-bar">
            <p className="sl-insights-bar__text">
              Fonte: {match?.fonte_candidatos ?? 'POST /match'} · analisados: {match?.total_analisados ?? 0} · score médio: {averageScore}
            </p>
            <button className="sl-btn-insights" onClick={() => navigate('/insights/regioes')}>
              Ver insights da rede →
            </button>
          </div>

          {/* Barra de Filtros Rápidos */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: 12,
            }}
          >
            <span style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
              ⚡ Filtros Rápidos:
            </span>

            {/* Status (Todos / Aprovados / Pendentes) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ color: '#64748b', fontWeight: 500 }}>Status:</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as 'todos' | 'aprovados' | 'pendentes')}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              >
                <option value="todos">Todos ({candidatos.length})</option>
                <option value="aprovados">Aprovados ({totalAprovados})</option>
                <option value="pendentes">Pendentes ({Math.max(0, candidatos.length - totalAprovados)})</option>
              </select>
            </div>

            {/* Score Mínimo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ color: '#64748b', fontWeight: 500 }}>Score Mínimo:</label>
              <select
                value={filtroMinScore}
                onChange={(e) => setFiltroMinScore(Number(e.target.value))}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              >
                <option value={0}>Todos os Scores</option>
                <option value={70}>70%+ (Alta similaridade)</option>
                <option value={80}>80%+ (Excelente match)</option>
                <option value={90}>90%+ (Top Match)</option>
              </select>
            </div>

            {/* Diversidade */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ color: '#64748b', fontWeight: 500 }}>Diversidade:</label>
              <select
                value={filtroBadge}
                onChange={(e) => setFiltroBadge(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              >
                <option value="">Todas as Badges</option>
                {badgesDisponiveis.map((b) => (
                  <option key={b} value={b}>
                    {formatarTextoMvp(b)}
                  </option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ color: '#64748b', fontWeight: 500 }}>Modelo:</label>
              <select
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              >
                <option value="">Todos</option>
                <option value="hibrido">Híbrido</option>
                <option value="remoto">Remoto</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ color: '#64748b', fontWeight: 500 }}>Ordenar por:</label>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              >
                <option value="score_desc">Maior Score Match</option>
                <option value="score_asc">Menor Score Match</option>
                <option value="exp_desc">Mais Experiência</option>
              </select>
            </div>

            {temFiltroAtivo && (
              <button
                type="button"
                onClick={limparFiltros}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 11,
                  padding: 0,
                  marginLeft: 'auto',
                }}
              >
                Limpar filtros ✕
              </button>
            )}
          </div>

          {error ? (
            <div className="sl-empty">
              👥
              <p>{error}</p>
            </div>
          ) : carregando ? (
            <div className="sl-empty">
              <span
                className="sl-spinner"
                style={{
                  width: 30,
                  height: 30,
                  border: '3px solid rgba(108, 63, 197, 0.2)',
                  borderTopColor: '#6C3FC5',
                }}
              />
              <p style={{ marginTop: 10, fontWeight: 500, color: '#475569' }}>
                Carregando candidatos da shortlist...
              </p>
            </div>
          ) : candidatosFiltrados.length === 0 ? (
            <div className="sl-empty">
              👥
              <p style={{ fontWeight: 600, color: '#1e1b4b', margin: '8px 0 4px' }}>
                Nenhum candidato atende aos filtros {vagaAtual.isCustom ? `ou requisitos desta vaga (${vagaAtual.titulo})` : 'selecionados'}.
              </p>
              {vagaAtual.isCustom && match?.candidatos.length === 0 && (
                <p style={{ fontSize: 13, color: '#64748b', maxWidth: 480, margin: '6px auto 14px', lineHeight: 1.4 }}>
                  O dataset de demonstração do MVP possui 8 perfis em Dados no nível Júnior. Vagas com outros níveis ou skills retornam triagem zerada.
                </p>
              )}
              {vagaAtual.isCustom && (
                <button
                  type="button"
                  onClick={() => navigate('/shortlist')}
                  style={{
                    background: '#6C3FC5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 99,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginTop: 4,
                  }}
                >
                  Ver shortlist oficial do MVP (8 candidatos) →
                </button>
              )}
            </div>
          ) : (
            <div className="sl-grid">
              {candidatosFiltrados.map((candidate) => {
                const approved = isContatoAprovado(approvedContacts[candidate.candidato_id])
                  ? approvedContacts[candidate.candidato_id]
                  : null;
                const isRevealing = revealing === candidate.candidato_id;
                const sc = scoreStyle(candidate.score_match);
                const rawBadge = candidate.badge_diversidade;
                const hasValidBadge =
                  rawBadge &&
                  rawBadge !== 'Sem badge informada' &&
                  rawBadge !== 'Nenhum';
                const badgeStyle = hasValidBadge
                  ? BADGE_COLORS[rawBadge] ?? { bg: '#F3F4F6', color: '#6B7280' }
                  : null;
                const regiao = formatarTextoMvp(candidate.regiao);
                const nivel = formatarNivelMvp(candidate.nivel);
                const modelo = formatarTextoMvp(candidate.modelo_trabalho_preferido ?? 'Não informado');
                const badgeLabel = hasValidBadge ? formatarTextoMvp(rawBadge) : '';
                const skills = getCandidateSkills(candidate);

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
                          <span>📍 {regiao}</span>
                          <span className="sl-dot" />
                          <span>{nivel}</span>
                        </div>
                      </div>
                      <div className="sl-score" style={{ background: sc.bg, borderColor: sc.ring, color: sc.color }}>
                        <span className="sl-score__num">{candidate.score_match}</span>
                        <span className="sl-score__pct">%</span>
                      </div>
                    </div>

                    {hasValidBadge && badgeStyle && (
                      <div className="sl-card__badges">
                        <span className="sl-badge" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                          {badgeLabel}
                        </span>
                      </div>
                    )}

                    <div className="sl-card__divider" />

                    <div className="sl-card__section">
                      <p className="sl-card__section-label">Competências técnicas</p>
                      <div className="sl-card__skills">
                        {skills.map((skill) => (
                          <span key={skill} className="sl-skill">
                            {formatarSkillMvp(skill)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {candidate.justificativa_ai && (
                      <div className="sl-card__section" style={{ background: '#f8fafc', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 8 }}>
                        <p className="sl-card__section-label" style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 4px', color: '#6366f1', fontWeight: 700 }}>
                          🤖 Justificativa da IA
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: '#475569', lineHeight: 1.35 }}>
                          {candidate.justificativa_ai}
                        </p>
                      </div>
                    )}

                    <div className="sl-card__row">
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Experiência</span>
                        <span className="sl-card__detail-value">{candidate.anos_experiencia ?? 0} ano(s)</span>
                      </div>
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Modelo</span>
                        <span className="sl-card__detail-value">{modelo}</span>
                      </div>
                    </div>

                    {!approved && (
                      <div className="sl-card__anon">
                        🔒 Dados sensíveis ocultos. Skills: {firstSkillLabel(candidate)}
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
                      <button
                        type="button"
                        className="sl-btn-aprovar"
                        onClick={() => handleAprovar(candidate.candidato_id)}
                        disabled={Boolean(revealing)}
                      >
                        {isRevealing ? (
                          <>
                            <span className="sl-spinner" /> Aprovando...
                          </>
                        ) : (
                          <>✓ Aprovar para entrevista</>
                        )}
                      </button>
                    ) : (
                      <a
                        className="sl-btn-aprovado"
                        href={`mailto:${approved.contato_liberado.email}?subject=Processo%20Seletivo%20appBiT%20-%20${encodeURIComponent(vagaAtual.titulo)}`}
                      >
                        ✉️ Convidar por e-mail
                      </a>
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
