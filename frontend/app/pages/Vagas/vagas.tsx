// pages/Vagas/Vagas.tsx
// Módulo isolado de gerenciamento de vagas.
// Responsabilidade: listagem, seleção e detalhes das vagas publicadas.
import { useState, useEffect } from 'react';
import './vagas.css';
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
 
interface VagaSkill {
  vagaId: number;
  skillId: number;
  peso: number;
}

interface Skill {
  id: number;
  nome: string;
  categoria: string;
}
 
function scoreBadgeStyle(score: number): { background: string; color: string } {
  if (score >= 90) return { background: '#DCFCE7', color: '#166534' };
  if (score >= 75) return { background: '#EDE9FE', color: '#5B21B6' };
  return { background: '#FEF3C7', color: '#92400E' };
}
 
// ── Componente ───────────────────────────────────────────────────────────
export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
 
  // Skills da vaga selecionada — GET /vaga-skills/vaga/{vagaId}
  const [vagaSkills, setVagaSkills] = useState<VagaSkill[]>([]);
  const [carregandoSkills, setCarregandoSkills] = useState<boolean>(false);
 
  // Catálogo de skills — GET /skills, usado só pra resolver skillId -> nome.
  const [catalogoSkills, setCatalogoSkills] = useState<Skill[]>([]);
 
  useEffect(() => {
    let ativo = true;
 
    async function buscarVagas() {
      setCarregando(true);
      setErro(null);
 
      try {

        const resposta = await api.get<Vaga[]>('/vagas');
        if (!ativo) return;
 
        const dados: Vaga[] = resposta.data;
        setVagas(dados);
      } catch (err: any) {
        if (ativo) {
          setErro(
            err.response?.status
              ? `Erro ao buscar vagas: ${err.response.status}`
              : err instanceof Error
                ? err.message
                : 'Não foi possível carregar as vagas.'
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
 
  // ── Buscar catálogo de skills: GET /skills ──────────────────────────────

  useEffect(() => {
    let ativo = true;
 
    async function buscarCatalogoSkills() {
      try {
        const resposta = await api.get<Skill[]>('/skills');
        if (ativo) setCatalogoSkills(resposta.data);
      } catch (err) {
        console.error('Erro ao buscar catálogo de skills:', err);
      }
    }
 
    buscarCatalogoSkills();
    return () => { ativo = false; };
  }, []);
 
  useEffect(() => {
    if (!vagaSelecionada) {
      setVagaSkills([]);
      return;
    }
 
    let ativo = true;
 
    async function buscarVagaSkills() {
      setCarregandoSkills(true);
 
      try {
        const resposta = await api.get<VagaSkill[]>(`/vaga-skills/vaga/${vagaSelecionada!.id}`);
        if (ativo) setVagaSkills(resposta.data);
      } catch (err) {
        // Poderia expor um erro próprio aqui; mantendo silencioso por ora
        // pra não travar a exibição do resto do detalhe da vaga.
        console.error('Erro ao buscar skills da vaga:', err);
        if (ativo) setVagaSkills([]);
      } finally {
        if (ativo) setCarregandoSkills(false);
      }
    }
 
    buscarVagaSkills();
    return () => { ativo = false; };
  }, [vagaSelecionada]);
 
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
       
                <p className="pv-vaga-card__area">{vaga.regiaoAlvo?.perfil}</p>
           
                <p className="pv-vaga-card__local">📍 {vaga.regiaoAlvo?.municipio}</p>
 
                <div className="pv-vaga-card__badges">
                  <span className="pv-badge pv-badge--nivel">{vaga.nivel}</span>
      
                  {vaga.antiVies && (
                    <span className="pv-badge pv-badge--grupo">🛡 Anti-viés</span>
                  )}
              
                  <span
                    className="pv-badge pv-badge--esg"
                    style={scoreBadgeStyle(vaga.diversidadeMinima)}
                  >
                    Diversidade {vaga.diversidadeMinima}%
                  </span>
                </div>
 
                <div className="pv-vaga-card__bar-wrap">
                  <span className="pv-vaga-card__bar-label">Score diversidade</span>
                  <div className="pv-vaga-card__bar-track">
                    <div
                      className="pv-vaga-card__bar-fill"
                      style={{ width: `${vaga.diversidadeMinima}%` }}
                    />
                  </div>
                  <span
                    className="pv-vaga-card__bar-pct"
                    style={{ color: scoreBadgeStyle(vaga.diversidadeMinima).color }}
                  >
                    {vaga.diversidadeMinima}%
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
     
            <p className="pv-detalhe__empresa">🏢 Empresa {vagaSelecionada.empresaId}</p>
 
            <div className="pv-detalhe__meta">
              <span>📍 {vagaSelecionada.regiaoAlvo?.municipio}</span>
              <span>🌐 {vagaSelecionada.regiaoAlvo?.cluster}</span>
              <span>📋 {vagaSelecionada.nivel}</span>

              <span>📁 {vagaSelecionada.regiaoAlvo?.perfil}</span>
            </div>
 
            <div className="pv-detalhe__badges">

              <span
                className="pv-badge pv-badge--esg"
                style={scoreBadgeStyle(vagaSelecionada.diversidadeMinima)}
              >
                Diversidade mínima: {vagaSelecionada.diversidadeMinima}%
              </span>
              {vagaSelecionada.antiVies && (
                <span className="pv-badge pv-badge--antivies">🛡 Anti-viés ativo</span>
              )}
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
              <h3 className="pv-detalhe__section-title">Skills exigidas</h3>
              <div className="pv-detalhe__skills">
                {carregandoSkills && <p>Carregando skills...</p>}
                {!carregandoSkills && vagaSkills.length === 0 && (
                  <p>Nenhuma skill cadastrada para esta vaga.</p>
                )}
                {!carregandoSkills && vagaSkills.map(vs => {
                  const skill = catalogoSkills.find(s => s.id === vs.skillId);
                  return (
                    <span key={vs.skillId} className="pv-skill">
                      {skill ? skill.nome : `Skill #${vs.skillId}`} ({vs.peso}%)
                    </span>
                  );
                })}
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
 
