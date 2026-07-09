// RelatorioESG/RelatorioESG.tsx
// Módulo isolado do Relatório ESG.
// Responsabilidade: exibir métricas ESG consolidadas e exportar relatório.

import { useState, useEffect, useCallback } from 'react';
import './relatorioesg.css';

// ── Config da API ───────────────────────────────────────────────────────────
// TODO: ajustar para a URL real do backend
const API_BASE_URL = 'http://localhost:5173';

const HISTORICO_ENDPOINT = `${API_BASE_URL}/api/esg/historico`;
const metasEndpoint      = (periodo: string) => `${API_BASE_URL}/api/esg/metas?periodo=${encodeURIComponent(periodo)}`;
const exportarEndpoint   = (periodo: string) => `${API_BASE_URL}/api/esg/relatorio/pdf?periodo=${encodeURIComponent(periodo)}`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetaESG {
  id: number;
  categoria: string;
  descricao: string;
  atual: number;
  meta: number;
  unidade: string;
  icone: string;
}

interface HistoricoItem {
  periodo: string;
  scoreGeral: number;
  genero: number;
  raca: number;
  pcd: number;
  lgbtqia: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function progressColor(atual: number, meta: number): string {
  const pct = atual / meta;
  if (pct >= 1)    return '#16a34a';
  if (pct >= 0.65) return '#7c3aed';
  if (pct >= 0.4)  return '#d97706';
  return '#dc2626';
}

function progressLabel(atual: number, meta: number): string {
  const pct = atual / meta;
  if (pct >= 1)    return 'Meta atingida';
  if (pct >= 0.65) return 'No caminho certo';
  if (pct >= 0.4)  return 'Atenção necessária';
  return 'Meta crítica';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RelatorioESG() {
  // Histórico (define também os períodos disponíveis no select)
  const [historico, setHistorico]                 = useState<HistoricoItem[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState<boolean>(true);
  const [erroHistorico, setErroHistorico]         = useState<string | null>(null);

  const [periodoAtivo, setPeriodoAtivo] = useState<string | null>(null);

  // Metas do período selecionado
  const [metas, setMetas]                     = useState<MetaESG[]>([]);
  const [carregandoMetas, setCarregandoMetas] = useState<boolean>(false);
  const [erroMetas, setErroMetas]             = useState<string | null>(null);

  // Exportação
  const [exportando, setExportando] = useState<boolean>(false);
  const [erroExportar, setErroExportar] = useState<string | null>(null);

  // ── Buscar histórico ao montar ──────────────────────────────────────────
  useEffect(() => {
    let ativo = true;

    async function buscarHistorico() {
      setCarregandoHistorico(true);
      setErroHistorico(null);

      try {
        const resposta = await fetch(HISTORICO_ENDPOINT);
        if (!resposta.ok) throw new Error(`Erro ao buscar histórico: ${resposta.status}`);

        const dados: HistoricoItem[] = await resposta.json();
        if (!ativo) return;

        setHistorico(dados);
        // Seleciona o período mais recente por padrão (último item da lista)
        setPeriodoAtivo(prev => {
          if (prev && dados.some(h => h.periodo === prev)) return prev;
          return dados[dados.length - 1]?.periodo ?? null;
        });
      } catch (err) {
        if (ativo) setErroHistorico(err instanceof Error ? err.message : 'Não foi possível carregar o histórico.');
      } finally {
        if (ativo) setCarregandoHistorico(false);
      }
    }

    buscarHistorico();
    return () => { ativo = false; };
  }, []);

  // ── Buscar metas sempre que o período mudar ─────────────────────────────
  useEffect(() => {
    if (!periodoAtivo) {
      setMetas([]);
      return;
    }

    let ativo = true;

    async function buscarMetas() {
      setCarregandoMetas(true);
      setErroMetas(null);

      try {
        const resposta = await fetch(metasEndpoint(periodoAtivo as string));
        if (!resposta.ok) throw new Error(`Erro ao buscar metas: ${resposta.status}`);

        const dados: MetaESG[] = await resposta.json();
        if (ativo) setMetas(dados);
      } catch (err) {
        if (ativo) setErroMetas(err instanceof Error ? err.message : 'Não foi possível carregar as metas.');
      } finally {
        if (ativo) setCarregandoMetas(false);
      }
    }

    buscarMetas();
    return () => { ativo = false; };
  }, [periodoAtivo]);

  // ── Exportar PDF ─────────────────────────────────────────────────────────
  const handleExportar = useCallback(async () => {
    if (!periodoAtivo) return;

    setExportando(true);
    setErroExportar(null);

    try {
      const resposta = await fetch(exportarEndpoint(periodoAtivo));
      if (!resposta.ok) throw new Error(`Erro ao exportar relatório: ${resposta.status}`);

      const blob = await resposta.blob();
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-esg-${periodoAtivo}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErroExportar(err instanceof Error ? err.message : 'Não foi possível exportar o relatório.');
    } finally {
      setExportando(false);
    }
  }, [periodoAtivo]);

  const scoreAtual = historico.find(h => h.periodo === periodoAtivo)?.scoreGeral ?? null;

  return (
    <div className="esg-shell">

      {/* ── Header do painel ── */}
      <div className="esg-header">
        <div>
          <h2 className="esg-header__titulo">Relatório ESG</h2>
          <p className="esg-header__sub">Métricas de diversidade e inclusão · Accenture Brasil</p>
        </div>
        <div className="esg-header__actions">
          <select
            className="esg-select"
            value={periodoAtivo ?? ''}
            onChange={e => setPeriodoAtivo(e.target.value)}
            disabled={carregandoHistorico || historico.length === 0}
          >
            {historico.map(h => (
              <option key={h.periodo} value={h.periodo}>{h.periodo}</option>
            ))}
          </select>
          <button
            className="esg-btn-exportar"
            onClick={handleExportar}
            disabled={exportando || !periodoAtivo}
          >
            {exportando ? <><span className="esg-spinner" /> Exportando...</> : <>📄 Exportar PDF</>}
          </button>
        </div>
      </div>

      <div className="esg-body">

        {erroExportar && (
          <div className="esg-alerta esg-alerta--erro">⚠️ {erroExportar}</div>
        )}

        {/* ── Estado geral de carregamento do histórico ── */}
        {carregandoHistorico && (
          <div className="esg-estado">Carregando relatório ESG...</div>
        )}

        {!carregandoHistorico && erroHistorico && (
          <div className="esg-estado esg-estado--erro">⚠️ {erroHistorico}</div>
        )}

        {!carregandoHistorico && !erroHistorico && historico.length === 0 && (
          <div className="esg-estado">Nenhum dado de ESG disponível ainda.</div>
        )}

        {!carregandoHistorico && !erroHistorico && historico.length > 0 && (
          <>
            {/* ── Score geral ── */}
            <div className="esg-score-card">
              <div className="esg-score-card__ring">
                <span className="esg-score-card__num">{scoreAtual ?? '-'}</span>
                <span className="esg-score-card__label">/ 100</span>
              </div>
              <div>
                <p className="esg-score-card__titulo">Score ESG geral</p>
                <p className="esg-score-card__periodo">{periodoAtivo}</p>
                {scoreAtual !== null && (
                  <span className="esg-score-card__badge">
                    {scoreAtual >= 80 ? '🟢 Bom' : scoreAtual >= 60 ? '🟡 Moderado' : '🔴 Crítico'}
                  </span>
                )}
              </div>
            </div>

            {/* ── Metas de diversidade ── */}
            <section className="esg-section">
              <h3 className="esg-section__titulo">Progresso por meta</h3>

              {carregandoMetas && (
                <div className="esg-estado">Carregando metas...</div>
              )}

              {!carregandoMetas && erroMetas && (
                <div className="esg-estado esg-estado--erro">⚠️ {erroMetas}</div>
              )}

              {!carregandoMetas && !erroMetas && metas.length === 0 && (
                <div className="esg-estado">Nenhuma meta cadastrada para este período.</div>
              )}

              {!carregandoMetas && !erroMetas && metas.length > 0 && (
                <div className="esg-metas">
                  {metas.map(m => {
                    const pct    = Math.min(Math.round((m.atual / m.meta) * 100), 100);
                    const cor    = progressColor(m.atual, m.meta);
                    const rotulo = progressLabel(m.atual, m.meta);
                    return (
                      <div key={m.id} className="esg-meta-card">
                        <div className="esg-meta-card__header">
                          <span className="esg-meta-card__icone">{m.icone}</span>
                          <div>
                            <p className="esg-meta-card__categoria">{m.categoria}</p>
                            <p className="esg-meta-card__descricao">{m.descricao}</p>
                          </div>
                          <span className="esg-meta-card__rotulo" style={{ color: cor }}>
                            {rotulo}
                          </span>
                        </div>
                        <div className="esg-meta-card__bar-wrap">
                          <div className="esg-meta-card__bar-track">
                            <div
                              className="esg-meta-card__bar-fill"
                              style={{ width: `${pct}%`, background: cor }}
                            />
                          </div>
                          <span className="esg-meta-card__valores">
                            <strong>{m.atual}{m.unidade === '%' ? '%' : ''}</strong>
                            <span> / meta {m.meta}{m.unidade === '%' ? '%' : ` ${m.unidade}`}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Histórico trimestral ── */}
            <section className="esg-section">
              <h3 className="esg-section__titulo">Evolução trimestral</h3>
              <div className="esg-historico">
                <div className="esg-historico__head">
                  <span>Período</span>
                  <span>Score geral</span>
                  <span>Gênero</span>
                  <span>Raça</span>
                  <span>PcD</span>
                  <span>LGBTQIA+</span>
                </div>
                {historico.map(h => (
                  <div
                    key={h.periodo}
                    className={`esg-historico__row ${h.periodo === periodoAtivo ? 'esg-historico__row--ativo' : ''}`}
                    onClick={() => setPeriodoAtivo(h.periodo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setPeriodoAtivo(h.periodo)}
                  >
                    <span className="esg-historico__periodo">{h.periodo}</span>
                    <span className="esg-historico__score">{h.scoreGeral}</span>
                    <span>{h.genero}%</span>
                    <span>{h.raca}%</span>
                    <span>{h.pcd}</span>
                    <span>{h.lgbtqia}%</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}