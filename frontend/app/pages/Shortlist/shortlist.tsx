import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams }      from 'react-router-dom';
import './shortlist.css';

// ── Config da API ───────────────────────────────────────────────────────────
// TODO: ajustar para a URL real do backend (ex: via variável de ambiente)
const API_BASE_URL = 'http://localhost:5173'; // troque pela URL real, ou use import.meta.env.VITE_API_URL / process.env.REACT_APP_API_URL

const VAGAS_ENDPOINT = `${API_BASE_URL}/api/vagas`;
const candidatosEndpoint = (vagaId: number) => `${API_BASE_URL}/api/vagas/${vagaId}/candidatos`;
const aprovarEndpoint    = (candidatoId: number) => `${API_BASE_URL}/api/candidatos/${candidatoId}/aprovar`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Candidato {
  id: number;
  vagaId: number;
  codinome: string;
  nomeReal: string;
  email: string;
  linkedin: string;
  scoreMatch: number;
  skills: string[];
  regiao: string;
  estado: string;
  senioridade: string;
  disponibilidade: string;
  badges: string[];
}

interface Vaga {
  id: number;
  titulo: string;
  area: string;
  modelo: string;
  local: string;
  scoreESG: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  'Mulher':      { bg: '#F3EFFE', color: '#6D28D9' },
  'Preta':       { bg: '#EDE9FE', color: '#5B21B6' },
  'Preto/Pardo': { bg: '#EDE9FE', color: '#5B21B6' },
  'PcD':         { bg: '#FEF3C7', color: '#92400E' },
  'LGBTQIA+':    { bg: '#FCE7F3', color: '#9D174D' },
};

function scoreStyle(s: number) {
  if (s >= 90) return { bg: '#DCFCE7', color: '#166534', ring: '#4ADE80' };
  if (s >= 80) return { bg: '#EDE9FE', color: '#5B21B6', ring: '#8B5CF6' };
  return              { bg: '#FEF3C7', color: '#92400E', ring: '#F59E0B' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShortList() {
  const navigate  = useNavigate();
  const [params]  = useSearchParams();
  const vagaIdParam = Number(params.get('vaga')) || null;

  // Vagas (sidebar)
  const [vagas, setVagas]                 = useState<Vaga[]>([]);
  const [carregandoVagas, setCarregandoVagas] = useState<boolean>(true);
  const [erroVagas, setErroVagas]         = useState<string | null>(null);

  const [vagaAtiva, setVagaAtiva]         = useState<number | null>(vagaIdParam);

  // Candidatos (main)
  const [candidatos, setCandidatos]           = useState<Candidato[]>([]);
  const [carregandoCandidatos, setCarregandoCandidatos] = useState<boolean>(false);
  const [erroCandidatos, setErroCandidatos]   = useState<string | null>(null);

  const [aprovados, setAprovados] = useState<Set<number>>(new Set());
  const [revealing, setRevealing] = useState<number | null>(null);

  // ── Buscar vagas ao montar ──────────────────────────────────────────────
  useEffect(() => {
    let ativo = true;

    async function buscarVagas() {
      setCarregandoVagas(true);
      setErroVagas(null);

      try {
        const resposta = await fetch(VAGAS_ENDPOINT);
        if (!resposta.ok) throw new Error(`Erro ao buscar vagas: ${resposta.status}`);

        const dados: Vaga[] = await resposta.json();
        if (!ativo) return;

        setVagas(dados);

        // Se não veio vagaId pela URL, ou a vaga não existe mais, seleciona a primeira disponível
        setVagaAtiva(prev => {
          if (prev && dados.some(v => v.id === prev)) return prev;
          return dados[0]?.id ?? null;
        });
      } catch (err) {
        if (ativo) setErroVagas(err instanceof Error ? err.message : 'Não foi possível carregar as vagas.');
      } finally {
        if (ativo) setCarregandoVagas(false);
      }
    }

    buscarVagas();
    return () => { ativo = false; };
  }, []);

  // ── Buscar candidatos toda vez que a vaga ativa mudar ──────────────────
  useEffect(() => {
    if (vagaAtiva === null) {
      setCandidatos([]);
      return;
    }

    let ativo = true;

    async function buscarCandidatos() {
      setCarregandoCandidatos(true);
      setErroCandidatos(null);

      try {
        const resposta = await fetch(candidatosEndpoint(vagaAtiva as number));
        if (!resposta.ok) throw new Error(`Erro ao buscar candidatos: ${resposta.status}`);

        const dados: Candidato[] = await resposta.json();
        if (ativo) setCandidatos(dados);
      } catch (err) {
        if (ativo) setErroCandidatos(err instanceof Error ? err.message : 'Não foi possível carregar os candidatos.');
      } finally {
        if (ativo) setCarregandoCandidatos(false);
      }
    }

    buscarCandidatos();
    return () => { ativo = false; };
  }, [vagaAtiva]);

  // ── Aprovar candidato (chama backend, que deve retornar os dados revelados) ──
  const handleAprovar = useCallback(async (id: number) => {
    setRevealing(id);

    try {
      const resposta = await fetch(aprovarEndpoint(id), { method: 'POST' });
      if (!resposta.ok) throw new Error(`Erro ao aprovar candidato: ${resposta.status}`);

      const candidatoAtualizado: Candidato = await resposta.json();

      setCandidatos(prev =>
        prev.map(c => (c.id === id ? candidatoAtualizado : c))
      );
      setAprovados(prev => new Set(prev).add(id));
    } catch (err) {
      // Poderia mostrar um toast/alerta aqui
      console.error(err);
      alert('Não foi possível aprovar o candidato. Tente novamente.');
    } finally {
      setRevealing(null);
    }
  }, []);

  const vaga = vagas.find(v => v.id === vagaAtiva) ?? null;

  return (
    <div className="sl-shell">

      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <header className="sl-topbar">
        <div className="sl-topbar__left">
          <button
            className="sl-back-btn"
            onClick={() => navigate('/')}
            aria-label="Voltar"
          >
            ←
          </button>
          <div>
            <nav className="sl-breadcrumb">
              <span className="sl-breadcrumb__link" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/')}>
                Minhas vagas
              </span>
              <span className="sl-breadcrumb__sep">›</span>
              <span className="sl-breadcrumb__current">
                Shortlist{vaga ? ` — ${vaga.titulo}` : ''}
              </span>
            </nav>
            <h1 className="sl-topbar__title">
              Lista de triagem
              <span className="sl-topbar__count">
                {carregandoCandidatos ? '...' : `${candidatos.length} candidatos`}
              </span>
            </h1>
          </div>
        </div>

        {/* Select visível só em mobile quando sidebar some */}
        <div className="sl-topbar__right">
          <select
            className="sl-vaga-select"
            value={vagaAtiva ?? ''}
            onChange={e => setVagaAtiva(Number(e.target.value))}
            aria-label="Trocar vaga"
            disabled={carregandoVagas || vagas.length === 0}
          >
            {vagas.map(v => (
              <option key={v.id} value={v.id}>{v.titulo}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="sl-body">

        {/* ── Sidebar de vagas ────────────────────────────────────────────── */}
        <aside className="sl-sidebar">
          <p className="sl-sidebar__heading">
            Vagas publicadas {!carregandoVagas && `(${vagas.length})`}
          </p>

          {carregandoVagas && <p className="sl-sidebar__estado">Carregando vagas...</p>}

          {!carregandoVagas && erroVagas && (
            <p className="sl-sidebar__estado sl-sidebar__estado--erro">⚠️ {erroVagas}</p>
          )}

          {!carregandoVagas && !erroVagas && vagas.length === 0 && (
            <p className="sl-sidebar__estado">Nenhuma vaga publicada.</p>
          )}

          {!carregandoVagas && !erroVagas && vagas.map(v => (
            <button
              key={v.id}
              className={`sl-vaga-item${v.id === vagaAtiva ? ' sl-vaga-item--active' : ''}`}
              onClick={() => setVagaAtiva(v.id)}
            >
              <span className="sl-vaga-item__titulo">{v.titulo}</span>
              <span className="sl-vaga-item__area">{v.area}</span>
              <span className="sl-vaga-item__local">📍 {v.modelo} · {v.local}</span>
              <div className="sl-vaga-item__bar-wrap">
                <div
                  className="sl-vaga-item__bar"
                  style={{ width: `${v.scoreESG}%` }}
                />
                <span className="sl-vaga-item__pct">{v.scoreESG}%</span>
              </div>
            </button>
          ))}
        </aside>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="sl-main">

          {/* Aviso anti-viés */}
          <div className="sl-notice">
            🛡️
            <p>
              <strong>Filtro anti-viés ativo</strong> — Nomes, fotos e contatos estão ocultos.
              Avalie somente competências técnicas, região e score de match.
            </p>
          </div>

          {/* Barra de insights */}
          <div className="sl-insights-bar">
            <p className="sl-insights-bar__text">
              📡 Candidatos em múltiplas regiões — verifique cobertura de rede antes de definir auxílio-conectividade
            </p>
            <button
              className="sl-btn-insights"
              onClick={() => navigate('/conectividade')}
            >
              Ver insights da rede →
            </button>
          </div>

          {/* Estados de carregamento / erro / vazio */}
          {vagaAtiva === null && !carregandoVagas && (
            <div className="sl-empty">
              💼
              <p>Nenhuma vaga selecionada.</p>
            </div>
          )}

          {vagaAtiva !== null && carregandoCandidatos && (
            <div className="sl-empty">
              <p>Carregando candidatos...</p>
            </div>
          )}

          {vagaAtiva !== null && !carregandoCandidatos && erroCandidatos && (
            <div className="sl-empty sl-empty--erro">
              ⚠️
              <p>{erroCandidatos}</p>
            </div>
          )}

          {vagaAtiva !== null && !carregandoCandidatos && !erroCandidatos && candidatos.length === 0 && (
            <div className="sl-empty">
              👥
              <p>Nenhum candidato encontrado para esta vaga.</p>
            </div>
          )}

          {/* Grid de candidatos */}
          {vagaAtiva !== null && !carregandoCandidatos && !erroCandidatos && candidatos.length > 0 && (
            <div className="sl-grid">
              {candidatos.map(c => {
                const isAprovado  = aprovados.has(c.id);
                const isRevealing = revealing === c.id;
                const sc          = scoreStyle(c.scoreMatch);

                return (
                  <article key={c.id} className={`sl-card${isAprovado ? ' sl-card--aprovado' : ''}`}>

                    {isAprovado && (
                      <div className="sl-card__ribbon">✓ Aprovado</div>
                    )}

                    {/* Header */}
                    <div className="sl-card__header">
                      <div className="sl-card__avatar">
                        {isAprovado
                          ? <span className="sl-card__initial">{c.nomeReal[0]}</span>
                          : <span>👤</span>
                        }
                      </div>
                      <div className="sl-card__id-block">
                        <p className="sl-card__codinome">
                          {isAprovado ? c.nomeReal : c.codinome}
                        </p>
                        <div className="sl-card__meta">
                          <span>📍 {c.regiao}, {c.estado}</span>
                          <span className="sl-dot" />
                          <span>{c.senioridade}</span>
                        </div>
                      </div>
                      <div
                        className="sl-score"
                        style={{ background: sc.bg, borderColor: sc.ring, color: sc.color }}
                      >
                        <span className="sl-score__num">{c.scoreMatch}</span>
                        <span className="sl-score__pct">%</span>
                      </div>
                    </div>

                    {/* Badges de diversidade */}
                    {c.badges.length > 0 && (
                      <div className="sl-card__badges">
                        {c.badges.map(b => {
                          const s = BADGE_COLORS[b] ?? { bg: '#F3F4F6', color: '#6B7280' };
                          return (
                            <span key={b} className="sl-badge" style={{ background: s.bg, color: s.color }}>
                              {b}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="sl-card__divider" />

                    {/* Skills */}
                    <div className="sl-card__section">
                      <p className="sl-card__section-label">Competências técnicas</p>
                      <div className="sl-card__skills">
                        {c.skills.map(s => <span key={s} className="sl-skill">{s}</span>)}
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className="sl-card__row">
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Disponibilidade</span>
                        <span className="sl-card__detail-value">{c.disponibilidade}</span>
                      </div>
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Senioridade</span>
                        <span className="sl-card__detail-value">{c.senioridade}</span>
                      </div>
                    </div>

                    {/* Contato oculto / revelado */}
                    {isAprovado ? (
                      <div className="sl-card__contact">
                        <div className="sl-card__contact-item">✉️ <a href={`mailto:${c.email}`}>{c.email}</a></div>
                        <div className="sl-card__contact-item">🔗 <a href={`https://${c.linkedin}`} target="_blank" rel="noopener noreferrer">{c.linkedin}</a></div>
                      </div>
                    ) : null}

                    {/* CTA */}
                    {!isAprovado ? (
                      <button
                        className="sl-btn-aprovar"
                        onClick={() => handleAprovar(c.id)}
                        disabled={isRevealing}
                      >
                        {isRevealing
                          ? <><span className="sl-spinner" /> Aprovando...</>
                          : <>✓ Aprovar para entrevista</>
                        }
                      </button>
                    ) : (
                      <button className="sl-btn-aprovado" onClick={() => navigate('/')}>
                        Ver pré-aprovados →
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