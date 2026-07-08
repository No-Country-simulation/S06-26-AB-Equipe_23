import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './shortlist.css';
import api from '../../../lib/axios';

// ── Types ────────────────────────────────────────────────────────────────

interface RegiaoResponse {
  id: number;
  cluster: string;
  municipio: string;
  lat: number;
  lon: number;
  perfil: string;
  fonte: string;
}

interface Vaga {
  id: number;
  empresaId: string;
  titulo: string;
  nivel: string;
  regiaoAlvo: RegiaoResponse;
  diversidadeMinima: number;
  antiVies: boolean;
  criacao: string;
}


interface CandidatoMatch {
  candidato_id: number;
  nome: string;
  cargo_alvo: string;
  nivel: string;
  regiao: string;
  cluster_residencia: string;
  cep: string;
  lat: number;
  lon: number;
  modelo_trabalho_preferido: string;
  skills: string[];
  anos_experiencia: number;
  badge_diversidade: string;
  score_match: number;
}

interface MetricaDiversidade {
  percentualShortlistDiversa: number;
  metaDiversidade: number;
  metaAtingida: boolean;
}

interface MatchingResponse {
  fonte_candidatos: string;
  total_analisados: number;
  total_retorno: number;
  regra_privacidade: string;
  metrica_diversidade: MetricaDiversidade;
  candidatos: CandidatoMatch[];
}

interface ContatoLiberado {
  nome: string;
  email: string;
  telefone: string;
  linkedin: string;
}

interface ContatoAprovado {
  candidato_id: string;
  apelido_exibicao: string;
  contato_liberado: ContatoLiberado;
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  'Mulher': { bg: '#F3EFFE', color: '#6D28D9' },
  'Preta': { bg: '#EDE9FE', color: '#5B21B6' },
  'Preto/Pardo': { bg: '#EDE9FE', color: '#5B21B6' },
  'PcD': { bg: '#FEF3C7', color: '#92400E' },
  'LGBTQIA+': { bg: '#FCE7F3', color: '#9D174D' },
};

function scoreStyle(s: number) {
  if (s >= 90) return { bg: '#DCFCE7', color: '#166534', ring: '#4ADE80' };
  if (s >= 80) return { bg: '#EDE9FE', color: '#5B21B6', ring: '#8B5CF6' };
  return { bg: '#FEF3C7', color: '#92400E', ring: '#F59E0B' };
}

//  empresaId é String no backend (AprovacaoRequestDTO / MatchingRequestDTO /
// VagaResponseDTO). Precisa vir de contexto de autenticação real.
const EMPRESA_ID = 1; // TODO: pegar de autenticação

export default function ShortList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const vagaIdParam = Number(params.get('vaga')) || null;

  // Vagas (sidebar) — GET /vagas
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregandoVagas, setCarregandoVagas] = useState<boolean>(true);
  const [erroVagas, setErroVagas] = useState<string | null>(null);
  const [vagaAtiva, setVagaAtiva] = useState<number | null>(vagaIdParam);

  // Resultado do matching (main) — POST /match
  const [matching, setMatching] = useState<MatchingResponse | null>(null);
  const [carregandoCandidatos, setCarregandoCandidatos] = useState<boolean>(false);
  const [erroCandidatos, setErroCandidatos] = useState<string | null>(null);

  const [aprovados, setAprovados] = useState<Set<number>>(new Set());
  const [revealing, setRevealing] = useState<number | null>(null);
  const [contatos, setContatos] = useState<Record<number, ContatoLiberado>>({});

  // ── Buscar vagas: GET /vagas ────────────────────────────────────────────
  useEffect(() => {
    let ativo = true;

    async function buscarVagas() {
      setCarregandoVagas(true);
      setErroVagas(null);

      try {
        const resposta = await api.get<Vaga[]>('/vagas');
        if (!ativo) return;
        const dados = resposta.data;

        setVagas(dados);
        setVagaAtiva(prev => {
          if (prev && dados.some(v => v.id === prev)) return prev;
          return dados[0]?.id ?? null;
        });
      } catch (erro: any) {
        if (ativo) {
          setErroVagas(
            erro.response?.status
              ? `Erro ao buscar vagas: ${erro.response.status}`
              : erro.message
          );
        }
      } finally {
        if (ativo) setCarregandoVagas(false);
      }
    }

    buscarVagas();
    return () => { ativo = false; };
  }, []);

  // ── Rodar matching sempre que a vaga ativa mudar: POST /match ──────────
  useEffect(() => {
    if (vagaAtiva === null) {
      setMatching(null);
      return;
    }

    const vaga = vagas.find(v => v.id === vagaAtiva);
    if (!vaga) return;

    let ativo = true;

    async function executarMatch() {
      setCarregandoCandidatos(true);
      setErroCandidatos(null);

      try {
        const resposta = await api.post<MatchingResponse>('/match', {
          empresa_id: EMPRESA_ID,
          vaga: {
            titulo: vaga!.titulo,
            skills: [] as string[],
            nivel: vaga!.nivel,
            regiao: vaga!.regiaoAlvo?.municipio ?? vaga!.regiaoAlvo?.cluster ?? '',
            modelo_trabalho: undefined as string | undefined,
          },
          filtros: {
            anti_vies: vaga!.antiVies,
            diversidade_minima: Math.round(vaga!.diversidadeMinima),
            limite_resultados: 10,
          },
        });

        if (ativo) setMatching(resposta.data);
      } catch (erro: any) {
        if (ativo) {
          setErroCandidatos(
            erro.response?.status
              ? `Erro ao buscar candidatos: ${erro.response.status}`
              : 'Não foi possível carregar os candidatos.'
          );
        }
      } finally {
        if (ativo) setCarregandoCandidatos(false);
      }
    }

    executarMatch();
    return () => { ativo = false; };

  }, [vagaAtiva, vagas]);

  // ── Aprovar candidato: POST /match/aprovar-candidato ────────────────────
  const handleAprovar = useCallback(async (candidatoId: number) => {
    setRevealing(candidatoId);

    try {
      const resposta = await api.post<ContatoAprovado>('/match/aprovar-candidato', {
        candidato_id: candidatoId,
        empresa_id: EMPRESA_ID,
      });

      const contato = resposta.data;

      setContatos(prev => ({ ...prev, [candidatoId]: contato.contato_liberado }));
      setAprovados(prev => new Set(prev).add(candidatoId));
    } catch (err) {
      console.error(err);
      alert('Não foi possível aprovar o candidato. Tente novamente.');
    } finally {
      setRevealing(null);
    }
  }, []);

  const vaga = vagas.find(v => v.id === vagaAtiva) ?? null;
  const candidatos = matching?.candidatos ?? [];
  const metricaDiversidade = matching?.metrica_diversidade ?? null;

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
              <span className="sl-vaga-item__area">{v.nivel}</span>
              <span className="sl-vaga-item__local">📍 {v.diversidadeMinima} · {v.regiaoAlvo?.municipio}</span>
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
                const isAprovado = aprovados.has(c.candidato_id);
                const isRevealing = revealing === c.candidato_id;
                const sc = scoreStyle(c.score_match);

                return (
                  <article key={c.candidato_id} className={`sl-card${isAprovado ? ' sl-card--aprovado' : ''}`}>

                    {isAprovado && (
                      <div className="sl-card__ribbon">✓ Aprovado</div>
                    )}

                    {/* Header */}
                    <div className="sl-card__header">
                      <div className="sl-card__avatar">
                        {isAprovado
                          ? <span className="sl-card__initial">{c.nome[0]}</span>
                          : <span>👤</span>
                        }
                      </div>
                      <div className="sl-card__id-block">
                        <p className="sl-card__codinome">
                          {isAprovado ? c.nome : c.nome}
                        </p>
                        <div className="sl-card__meta">
                          <span>📍 {c.regiao}, {c.cluster_residencia}</span>
                          <span className="sl-dot" />
                          <span>{c.nivel}</span>
                        </div>
                      </div>
                      <div
                        className="sl-score"
                        style={{ background: sc.bg, borderColor: sc.ring, color: sc.color }}
                      >
                        <span className="sl-score__num">{c.score_match}</span>
                        <span className="sl-score__pct">%</span>
                      </div>
                    </div>

                    {/* Badges de diversidade */}
                    {(() => {
                      // Converte string para array separando por vírgula e remove espaços extras
                      const badgesArray = typeof c.badge_diversidade === 'string'
                        ? c.badge_diversidade.split(',').map(b => b.trim()).filter(Boolean)
                        : (Array.isArray(c.badge_diversidade) ? c.badge_diversidade : []);

                      if (badgesArray.length === 0) return null;

                      return (
                        <div className="sl-card__badges">
                          {badgesArray.map(b => {
                            const s = BADGE_COLORS[b] ?? { bg: '#F3F4F6', color: '#6B7280' };
                            return (
                              <span key={b} className="sl-badge" style={{ background: s.bg, color: s.color }}>
                                {b}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })()}


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
                        <span className="sl-card__detail-label">Anos de experiência</span>
                        <span className="sl-card__detail-value">{c.anos_experiencia}</span>
                      </div>
                      <div className="sl-card__detail">
                        <span className="sl-card__detail-label">Nível</span>
                        <span className="sl-card__detail-value">{c.nivel}</span>
                      </div>
                    </div>

                    {/* Contato oculto / revelado */}
                    {isAprovado ? (
                      <div className="sl-card__contact">
                        <div className="sl-card__contact-item">✉️ <a href={`mailto:${contatos[c.candidato_id]?.email}`}>${contatos[c.candidato_id]?.email}</a></div>
                        <div className="sl-card__contact-item">🔗 <a href={`https://${contatos[c.candidato_id]?.linkedin}`} target="_blank" rel="noopener noreferrer">{contatos[c.candidato_id]?.linkedin}</a></div>
                      </div>
                    ) : null}

                    {/* CTA */}
                    {!isAprovado ? (
                      <button
                        className="sl-btn-aprovar"
                        onClick={() => handleAprovar(c.candidato_id)}
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
