// components/insights/PainelInsightsRegionais.tsx
// Módulo isolado de Insights Regionais.
// Responsabilidade: exibir concentração de talentos por região
// e cobertura de rede (dados Vísent CDRView / Anatel).

import { useState, useEffect } from 'react';
import './paineldeinsightsregionais.css';

// ── Config da API ───────────────────────────────────────────────────────────
// TODO: ajustar para a URL real do backend
const API_BASE_URL = 'http://localhost:5173';

function regioesEndpoint(filtroUF: FiltroUF, ordenarPor: 'talentos' | '5g' | '4g') {
  const params = new URLSearchParams();
  if (filtroUF !== 'Todos') params.set('uf', filtroUF);
  params.set('ordenarPor', ordenarPor);
  return `${API_BASE_URL}/api/insights/regioes?${params.toString()}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Regiao {
  id: number;
  nome: string;
  estado: string;
  uf: string;
  talentos: number;
  cobertura5g: number;
  cobertura4g: number;
  erbs: number;
  gruposPredominantes: string[];
}

type FiltroUF = 'Todos' | 'SP' | 'RJ' | 'DF';

// ── Helpers ───────────────────────────────────────────────────────────────────

function coberturaStyle(v: number): { color: string; label: string; bg: string } {
  if (v >= 60) return { color: '#166534', label: 'Boa',   bg: '#dcfce7' };
  if (v >= 35) return { color: '#92400e', label: 'Média', bg: '#fef3c7' };
  return             { color: '#991b1b', label: 'Baixa',  bg: '#fee2e2' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PainelInsightsRegionais() {
  const [filtroUF, setFiltroUF]       = useState<FiltroUF>('Todos');
  const [ordenarPor, setOrdenarPor]   = useState<'talentos' | '5g' | '4g'>('talentos');
  const [regiaoAtiva, setRegiaoAtiva] = useState<Regiao | null>(null);

  const [regioes, setRegioes]         = useState<Regiao[]>([]);
  const [carregando, setCarregando]   = useState<boolean>(true);
  const [erro, setErro]               = useState<string | null>(null);

  // ── Buscar regiões toda vez que filtro ou ordenação mudarem ─────────────
  useEffect(() => {
    let ativo = true;

    async function buscarRegioes() {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await fetch(regioesEndpoint(filtroUF, ordenarPor));
        if (!resposta.ok) throw new Error(`Erro ao buscar regiões: ${resposta.status}`);

        const dados: Regiao[] = await resposta.json();
        if (!ativo) return;

        setRegioes(dados);

        // Se a região selecionada não existir mais no novo recorte, limpa a seleção
        setRegiaoAtiva(prev => (prev && dados.some(r => r.id === prev.id) ? prev : null));
      } catch (err) {
        if (ativo) setErro(err instanceof Error ? err.message : 'Não foi possível carregar os insights regionais.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscarRegioes();
    return () => { ativo = false; };
  }, [filtroUF, ordenarPor]);

  const totalTalentos = regioes.reduce((s, r) => s + r.talentos, 0);

  return (
    <div className="ir-shell">

      {/* ── Header ── */}
      <div className="ir-header">
        <div>
          <h2 className="ir-header__titulo">Insights regionais</h2>
          <p className="ir-header__sub">Concentração de talentos · Dados Vísent CDRView / Anatel</p>
        </div>
        <div className="ir-header__controls">
          <select
            className="ir-select"
            value={filtroUF}
            onChange={e => { setFiltroUF(e.target.value as FiltroUF); setRegiaoAtiva(null); }}
          >
            <option value="Todos">Todos os estados</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="DF">Distrito Federal</option>
          </select>
          <select
            className="ir-select"
            value={ordenarPor}
            onChange={e => setOrdenarPor(e.target.value as typeof ordenarPor)}
          >
            <option value="talentos">Ordenar por talentos</option>
            <option value="5g">Ordenar por cobertura 5G</option>
            <option value="4g">Ordenar por cobertura 4G</option>
          </select>
        </div>
      </div>
      <div className="ir-body">

        {carregando && (
          <div className="ir-estado">Carregando insights regionais...</div>
        )}

        {!carregando && erro && (
          <div className="ir-estado ir-estado--erro">⚠️ {erro}</div>
        )}

        {!carregando && !erro && regioes.length === 0 && (
          <div className="ir-estado">Nenhuma região encontrada para esse filtro.</div>
        )}

        {!carregando && !erro && regioes.length > 0 && (
          <>
            {/* ── KPIs rápidos ── */}
            <div className="ir-kpis">
              <div className="ir-kpi">
                <span className="ir-kpi__valor">{totalTalentos}</span>
                <span className="ir-kpi__label">talentos disponíveis</span>
              </div>
              <div className="ir-kpi">
                <span className="ir-kpi__valor">{regioes.length}</span>
                <span className="ir-kpi__label">regiões mapeadas</span>
              </div>
              <div className="ir-kpi">
                <span className="ir-kpi__valor">
                  {Math.round(regioes.reduce((s, r) => s + r.cobertura5g, 0) / (regioes.length || 1))}%
                </span>
                <span className="ir-kpi__label">cobertura 5G média</span>
              </div>
              <div className="ir-kpi">
                <span className="ir-kpi__valor">
                  {regioes.reduce((s, r) => s + r.erbs, 0)}
                </span>
                <span className="ir-kpi__label">ERBs na área</span>
              </div>
            </div>

            <div className="ir-content">

              {/* ── Lista de regiões ── */}
              <div className="ir-lista">
                {regioes.map(r => {
                  const c5 = coberturaStyle(r.cobertura5g);
                  const isAtiva = regiaoAtiva?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      className={`ir-regiao-card ${isAtiva ? 'ir-regiao-card--ativa' : ''}`}
                      onClick={() => setRegiaoAtiva(isAtiva ? null : r)}
                    >
                      <div className="ir-regiao-card__top">
                        <div>
                          <p className="ir-regiao-card__nome">{r.nome}</p>
                          <p className="ir-regiao-card__estado">📍 {r.estado}</p>
                        </div>
                        <div className="ir-regiao-card__talentos">
                          <span className="ir-regiao-card__talentos-num">{r.talentos}</span>
                          <span className="ir-regiao-card__talentos-label">talentos</span>
                        </div>
                      </div>

                      {/* Barra 5G */}
                      <div className="ir-bar-row">
                        <span className="ir-bar-label">5G</span>
                        <div className="ir-bar-track">
                          <div className="ir-bar-fill" style={{ width: `${r.cobertura5g}%`, background: c5.color }} />
                        </div>
                        <span className="ir-bar-pct" style={{ color: c5.color }}>{r.cobertura5g}%</span>
                        <span className="ir-bar-badge" style={{ background: c5.bg, color: c5.color }}>{c5.label}</span>
                      </div>

                      {/* Barra 4G */}
                      <div className="ir-bar-row">
                        <span className="ir-bar-label">4G</span>
                        <div className="ir-bar-track">
                          <div className="ir-bar-fill" style={{ width: `${r.cobertura4g}%`, background: '#7c3aed' }} />
                        </div>
                        <span className="ir-bar-pct" style={{ color: '#7c3aed' }}>{r.cobertura4g}%</span>
                        <span className="ir-bar-badge" style={{ background: '#ede9fe', color: '#5b21b6' }}>
                          {coberturaStyle(r.cobertura4g).label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Detalhe da região ── */}
              <div className="ir-detalhe">
                {regiaoAtiva ? (
                  <div className="ir-detalhe__content">
                    <h3 className="ir-detalhe__titulo">{regiaoAtiva.nome}</h3>
                    <p className="ir-detalhe__estado">📍 {regiaoAtiva.estado} — {regiaoAtiva.uf}</p>

                    <div className="ir-detalhe__stats">
                      <div className="ir-detalhe__stat">
                        <span className="ir-detalhe__stat-val">{regiaoAtiva.talentos}</span>
                        <span className="ir-detalhe__stat-lbl">Talentos</span>
                      </div>
                      <div className="ir-detalhe__stat">
                        <span className="ir-detalhe__stat-val">{regiaoAtiva.erbs}</span>
                        <span className="ir-detalhe__stat-lbl">ERBs Anatel</span>
                      </div>
                      <div className="ir-detalhe__stat">
                        <span className="ir-detalhe__stat-val" style={{ color: coberturaStyle(regiaoAtiva.cobertura5g).color }}>
                          {regiaoAtiva.cobertura5g}%
                        </span>
                        <span className="ir-detalhe__stat-lbl">Cobertura 5G</span>
                      </div>
                      <div className="ir-detalhe__stat">
                        <span className="ir-detalhe__stat-val" style={{ color: '#7c3aed' }}>
                          {regiaoAtiva.cobertura4g}%
                        </span>
                        <span className="ir-detalhe__stat-lbl">Cobertura 4G</span>
                      </div>
                    </div>

                    <div className="ir-detalhe__divider" />

                    <p className="ir-detalhe__section-label">Grupos predominantes</p>
                    <div className="ir-detalhe__badges">
                      {regiaoAtiva.gruposPredominantes.map(g => (
                        <span key={g} className="ir-detalhe__badge">{g}</span>
                      ))}
                    </div>

                    <div className="ir-detalhe__divider" />

                    <p className="ir-detalhe__section-label">Recomendação de conectividade</p>
                    <div className={`ir-detalhe__rec ir-detalhe__rec--${coberturaStyle(regiaoAtiva.cobertura5g).label.toLowerCase()}`}>
                      {regiaoAtiva.cobertura5g >= 60
                        ? '✅ Cobertura adequada. Baixo risco de necessidade de auxílio-conectividade.'
                        : regiaoAtiva.cobertura5g >= 35
                        ? '⚠️ Cobertura moderada. Considere oferecer auxílio-conectividade parcial.'
                        : '🔴 Cobertura crítica. Recomenda-se auxílio-conectividade obrigatório para candidatos remotos.'}
                    </div>
                  </div>
                ) : (
                  <div className="ir-detalhe__empty">
                    <span>📡</span>
                    <p>Selecione uma região para ver os detalhes de conectividade</p>
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}