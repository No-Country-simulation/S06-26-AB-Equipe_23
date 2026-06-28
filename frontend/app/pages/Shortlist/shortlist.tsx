import { useState }                     from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './shortlist.css';
 
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
 
// ── Mock data ─────────────────────────────────────────────────────────────────
 
const VAGAS: Vaga[] = [
  { id: 1, titulo: 'Engenheira de Dados Sênior',   area: 'Dados',      modelo: 'Remoto',  local: 'Brasil',         scoreESG: 92 },
  { id: 2, titulo: 'Desenvolvedora Frontend React', area: 'Tecnologia', modelo: 'Híbrido', local: 'São Paulo, SP',  scoreESG: 78 },
  { id: 3, titulo: 'Product Manager — Inclusão',   area: 'Produto',    modelo: 'Remoto',  local: 'Brasil',         scoreESG: 95 },
];
 
const CANDIDATOS: Candidato[] = [
  {
    id: 1, vagaId: 1,
    codinome: 'Candidato #1', nomeReal: 'Ana Clara Ferreira',
    email: 'ana.ferreira@email.com', linkedin: 'linkedin.com/in/anaclara',
    scoreMatch: 94, skills: ['Python', 'SQL', 'dbt', 'Airflow', 'Spark'],
    regiao: 'Zona Norte', estado: 'SP', senioridade: 'Sênior',
    disponibilidade: 'Imediata', badges: ['Mulher', 'Preta'],
  },
  {
    id: 2, vagaId: 1,
    codinome: 'Candidato #2', nomeReal: 'Marcos Oliveira Santos',
    email: 'marcos.santos@email.com', linkedin: 'linkedin.com/in/marcosoliveira',
    scoreMatch: 89, skills: ['BigQuery', 'dbt', 'Python', 'Looker'],
    regiao: 'Baixada Fluminense', estado: 'RJ', senioridade: 'Sênior',
    disponibilidade: '30 dias', badges: ['Preto/Pardo'],
  },
  {
    id: 3, vagaId: 1,
    codinome: 'Candidato #3', nomeReal: 'Juliana Costa Lima',
    email: 'juliana.lima@email.com', linkedin: 'linkedin.com/in/julianalima',
    scoreMatch: 87, skills: ['Spark', 'Kafka', 'Scala', 'AWS Glue'],
    regiao: 'Ceilândia', estado: 'DF', senioridade: 'Sênior',
    disponibilidade: 'Imediata', badges: ['Mulher', 'LGBTQIA+'],
  },
  {
    id: 4, vagaId: 2,
    codinome: 'Candidato #4', nomeReal: 'Rafael Moura Braga',
    email: 'rafael.braga@email.com', linkedin: 'linkedin.com/in/rafaelmoura',
    scoreMatch: 91, skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    regiao: 'Zona Leste', estado: 'SP', senioridade: 'Pleno',
    disponibilidade: 'Imediata', badges: ['PcD'],
  },
  {
    id: 5, vagaId: 2,
    codinome: 'Candidato #5', nomeReal: 'Beatriz Nascimento',
    email: 'beatriz.nasc@email.com', linkedin: 'linkedin.com/in/beatriznasc',
    scoreMatch: 85, skills: ['React', 'Vue.js', 'Figma', 'CSS'],
    regiao: 'Brasilândia', estado: 'SP', senioridade: 'Pleno',
    disponibilidade: '15 dias', badges: ['Mulher', 'LGBTQIA+'],
  },
  {
    id: 6, vagaId: 3,
    codinome: 'Candidato #6', nomeReal: 'Camila Rocha Mendes',
    email: 'camila.mendes@email.com', linkedin: 'linkedin.com/in/camilamendes',
    scoreMatch: 96, skills: ['Product Strategy', 'OKRs', 'Data-driven', 'Agile'],
    regiao: 'Itaquera', estado: 'SP', senioridade: 'Sênior',
    disponibilidade: 'Imediata', badges: ['Mulher', 'Preta'],
  },
];
 
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
  const navigate        = useNavigate();
  const [params]        = useSearchParams();
  const vagaIdParam     = Number(params.get('vaga')) || VAGAS[0].id;
 
  const [vagaAtiva, setVagaAtiva]   = useState<number>(vagaIdParam);
  const [aprovados, setAprovados]   = useState<Set<number>>(new Set());
  const [revealing, setRevealing]   = useState<number | null>(null);
 
  const vaga       = VAGAS.find(v => v.id === vagaAtiva) ?? VAGAS[0];
  const candidatos = CANDIDATOS.filter(c => c.vagaId === vagaAtiva);
 
  function handleAprovar(id: number) {
    setRevealing(id);
    setTimeout(() => {
      setAprovados(prev => new Set(prev).add(id));
      setRevealing(null);
    }, 700);
  }
 
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
              <span className="sl-breadcrumb__current">Shortlist — {vaga.titulo}</span>
            </nav>
            <h1 className="sl-topbar__title">
              Lista de triagem
              <span className="sl-topbar__count">{candidatos.length} candidatos</span>
            </h1>
          </div>
        </div>
 
        {/* Select visível só em mobile quando sidebar some */}
        <div className="sl-topbar__right">
          <select
            className="sl-vaga-select"
            value={vagaAtiva}
            onChange={e => setVagaAtiva(Number(e.target.value))}
            aria-label="Trocar vaga"
          >
            {VAGAS.map(v => (
              <option key={v.id} value={v.id}>{v.titulo}</option>
            ))}
          </select>
        </div>
      </header>
 
      <div className="sl-body">
 
        {/* ── Sidebar de vagas ────────────────────────────────────────────── */}
        <aside className="sl-sidebar">
          <p className="sl-sidebar__heading">Vagas publicadas ({VAGAS.length})</p>
          {VAGAS.map(v => (
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
 
          {/* Grid de candidatos */}
          {candidatos.length === 0 ? (
            <div className="sl-empty">
              👥
              <p>Nenhum candidato encontrado para esta vaga.</p>
            </div>
          ) : (
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
 