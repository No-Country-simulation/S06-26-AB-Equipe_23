// pages/Vagas/Vagas.tsx
// Módulo isolado de gerenciamento de vagas.
// Responsabilidade: listagem, seleção e detalhes das vagas publicadas.

import { useState, useEffect } from 'react';
import './Vagas.css';

// ── Config da API ───────────────────────────────────────────────────────────
// TODO: ajustar para a URL real do backend (ex: via variável de ambiente)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5173';
const VAGAS_ENDPOINT = `${API_BASE_URL}/api/vagas`; // <-- rota do backend para listar vagas

// ── Types ─────────────────────────────────────────────────────────────────────

interface Vaga {
  id: number;
  titulo: string;
  area: string;
  modelo: string;
  local: string;
  nivel: string;
  scoreESG: number;
  badges: string[];
  descricao: string;
  skills: string[];
}

function scoreBadgeStyle(score: number): { background: string; color: string } {
  if (score >= 90) return { background: '#DCFCE7', color: '#166534' };
  if (score >= 75) return { background: '#EDE9FE', color: '#5B21B6' };
  return { background: '#FEF3C7', color: '#92400E' };
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true; // evita atualizar estado se o componente já desmontou

    async function buscarVagas() {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await fetch(VAGAS_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`, // se precisar de autenticação
          },
        });

        if (!resposta.ok) {
          throw new Error(`Erro ao buscar vagas: ${resposta.status}`);
        }

        const dados: Vaga[] = await resposta.json();

        if (ativo) {
          setVagas(dados);
        }
      } catch (err) {
        if (ativo) {
          setErro(
            err instanceof Error ? err.message : 'Não foi possível carregar as vagas.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarVagas();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="pv-shell">

      {/* ── Coluna esquerda: lista de vagas ── */}
      <div className="pv-lista">
        <div className="pv-lista__header">
          <span className="pv-lista__titulo">
            Vagas publicadas <span className="pv-lista__count">({vagas.length})</span>
          </span>
          <button className="pv-btn-nova">+ Nova vaga</button>
        </div>

        <div className="pv-lista__itens">
          {carregando && (
            <div className="pv-lista__estado">
              <p>Carregando vagas...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="pv-lista__estado pv-lista__estado--erro">
              <p>⚠️ {erro}</p>
            </div>
          )}

          {!carregando && !erro && vagas.length === 0 && (
            <div className="pv-lista__estado">
              <span className="pv-detalhe__empty-icon">📭</span>
              <p>Nenhuma vaga publicada ainda.</p>
            </div>
          )}

          {!carregando &&
            !erro &&
            vagas.map(vaga => (
              <button
                key={vaga.id}
                className={`pv-vaga-card ${vagaSelecionada?.id === vaga.id ? 'pv-vaga-card--ativa' : ''}`}
                onClick={() => setVagaSelecionada(vaga)}
              >
                <p className="pv-vaga-card__titulo">{vaga.titulo}</p>
                <p className="pv-vaga-card__area">{vaga.area}</p>
                <p className="pv-vaga-card__local">📍 {vaga.modelo} · {vaga.local}</p>

                <div className="pv-vaga-card__badges">
                  <span className="pv-badge pv-badge--nivel">{vaga.nivel}</span>
                  {vaga.badges.map(b => (
                    <span key={b} className="pv-badge pv-badge--grupo">{b}</span>
                  ))}
                  <span
                    className="pv-badge pv-badge--esg"
                    style={scoreBadgeStyle(vaga.scoreESG)}
                  >
                    ESG {vaga.scoreESG}%
                  </span>
                </div>

                <div className="pv-vaga-card__bar-wrap">
                  <span className="pv-vaga-card__bar-label">Score diversidade</span>
                  <div className="pv-vaga-card__bar-track">
                    <div
                      className="pv-vaga-card__bar-fill"
                      style={{ width: `${vaga.scoreESG}%` }}
                    />
                  </div>
                  <span
                    className="pv-vaga-card__bar-pct"
                    style={{ color: scoreBadgeStyle(vaga.scoreESG).color }}
                  >
                    {vaga.scoreESG}%
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* ── Coluna direita: detalhe da vaga ou placeholder ── */}
      <div className="pv-detalhe">
        {vagaSelecionada ? (
          <div className="pv-detalhe__content">
            <h2 className="pv-detalhe__titulo">{vagaSelecionada.titulo}</h2>
            <p className="pv-detalhe__empresa">🏢 Sua empresa</p>

            <div className="pv-detalhe__meta">
              <span>📍 {vagaSelecionada.modelo}</span>
              <span>🌐 {vagaSelecionada.local}</span>
              <span>📋 {vagaSelecionada.nivel}</span>
              <span>📁 {vagaSelecionada.area}</span>
            </div>

            <div className="pv-detalhe__badges">
              {vagaSelecionada.badges.map(b => (
                <span key={b} className="pv-badge pv-badge--grupo">{b}</span>
              ))}
              <span
                className="pv-badge pv-badge--esg"
                style={scoreBadgeStyle(vagaSelecionada.scoreESG)}
              >
                Score ESG: {vagaSelecionada.scoreESG}%
              </span>
              <span className="pv-badge pv-badge--antivies">🛡 Anti-viés ativo</span>
            </div>

            {/* Botão shortlist */}
            <button
              className="pv-btn-shortlist"
              onClick={() => {
                window.location.href = `/shortlist?vaga=${vagaSelecionada.id}`;
              }}
            >
              👥 Ver shortlist de candidatos
            </button>

            <div className="pv-detalhe__divider" />

            <section>
              <h3 className="pv-detalhe__section-title">Sobre a vaga</h3>
              <p className="pv-detalhe__descricao">{vagaSelecionada.descricao}</p>
            </section>

            <section>
              <h3 className="pv-detalhe__section-title">Skills exigidas</h3>
              <div className="pv-detalhe__skills">
                {vagaSelecionada.skills.map(s => (
                  <span key={s} className="pv-skill">{s}</span>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="pv-detalhe__empty">
            <span className="pv-detalhe__empty-icon">💼</span>
            <p>Selecione uma vaga para ver os detalhes</p>
          </div>
        )}
      </div>

    </div>
  );
}
