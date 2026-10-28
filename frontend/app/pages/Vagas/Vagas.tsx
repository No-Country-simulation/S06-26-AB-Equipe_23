// pages/Vagas/Vagas.tsx
// Módulo isolado de gerenciamento de vagas com paginação visual.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarVagasPaginadas } from '../../../lib/appbitApi';
import type { VagaBackend } from '../../../lib/appbitTypes';
import './Vagas.css';

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

function backendToVaga(bv: VagaBackend): Vaga {
  const badges: string[] = [];
  if (bv.prioridadeMulheres) badges.push('Mulheres');
  if (bv.prioridadeNegros) badges.push('Pessoas negras');
  if (bv.prioridadePcd) badges.push('PcD');
  if (bv.prioridadeLgbt) badges.push('LGBTQIA+');
  if (badges.length === 0) badges.push('Inclusiva');

  return {
    id: bv.id,
    titulo: bv.titulo,
    area: bv.area || 'Tecnologia',
    modelo: bv.modalidade || 'Híbrido',
    local: bv.regiaoAlvo?.municipio || 'Brasil',
    nivel: bv.nivel || 'Júnior',
    scoreESG: bv.esgMatch ?? 85,
    badges,
    descricao: bv.descricao || 'Descrição da vaga a ser definida.',
    skills: bv.skills && bv.skills.length > 0 ? bv.skills : ['Geral'],
  };
}

export default function Vagas() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [pagina, setPagina] = useState<number>(0);
  const [tamanhoPagina] = useState<number>(6);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      setCarregando(true);
      setErro(null);

      try {
        const pageData = await buscarVagasPaginadas(pagina, tamanhoPagina);
        if (!ativo) return;
        const convertidas = (pageData.content || []).map(backendToVaga);
        setVagas(convertidas);
        setTotalPaginas(Math.max(1, pageData.totalPages || 1));
        setTotalElementos(pageData.totalElements ?? convertidas.length);

        if (convertidas.length > 0) {
          setVagaSelecionada((prev) => {
            const match = convertidas.find((v) => v.id === prev?.id);
            return match ?? convertidas[0];
          });
        } else {
          setVagaSelecionada(null);
        }
      } catch (err) {
        if (!ativo) return;
        console.error('Erro ao buscar vagas paginadas:', err);
        setErro(err instanceof Error ? err.message : 'Não foi possível carregar as vagas.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();

    return () => {
      ativo = false;
    };
  }, [pagina, tamanhoPagina]);


  return (
    <div className="pv-shell">
      {/* ── Coluna esquerda: lista de vagas ── */}
      <div className="pv-lista">
        <div className="pv-lista__header">
          <div>
            <span className="pv-lista__titulo">
              Vagas publicadas <span className="pv-lista__count">({totalElementos})</span>
            </span>
          </div>
          <button className="pv-btn-nova" onClick={() => navigate('/vagas')}>
            + Nova vaga
          </button>
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
            vagas.map((vaga) => (
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
                  {vaga.badges.map((b) => (
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

        {/* ── Barra de Paginação ── */}
        <div className="pv-paginacao">
          <button
            type="button"
            className="pv-paginacao__btn"
            onClick={() => setPagina((prev) => Math.max(0, prev - 1))}
            disabled={pagina <= 0 || carregando}
          >
            ‹ Anterior
          </button>
          <span className="pv-paginacao__info">
            Pág. {pagina + 1} de {totalPaginas}
          </span>
          <button
            type="button"
            className="pv-paginacao__btn"
            onClick={() => setPagina((prev) => Math.min(totalPaginas - 1, prev + 1))}
            disabled={pagina >= totalPaginas - 1 || carregando}
          >
            Próxima ›
          </button>
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
              {vagaSelecionada.badges.map((b) => (
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
                navigate(`/shortlist?vaga=${vagaSelecionada.id}`);
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
                {vagaSelecionada.skills.map((s) => (
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

