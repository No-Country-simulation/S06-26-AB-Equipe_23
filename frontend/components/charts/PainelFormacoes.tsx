import { useEffect, useState } from 'react';
import { buscarFormacoesMvp, buscarExperienciasMvp } from '../../lib/appbitApi';
import type { FormacaoMvp, ExperienciaEstruturanteMvp } from '../../lib/appbitTypes';
import { formatarTextoMvp } from '../../lib/formatarTextoMvp';

export default function PainelFormacoes() {
  const [formacoes, setFormacoes] = useState<FormacaoMvp[]>([]);
  const [experiencias, setExperiencias] = useState<ExperienciaEstruturanteMvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTrilhaId, setHoveredTrilhaId] = useState<number | null>(null);
  const [hoveredEventoId, setHoveredEventoId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([buscarFormacoesMvp(), buscarExperienciasMvp()])
      .then(([formacoesData, experienciasData]) => {
        setFormacoes(formacoesData);
        setExperiencias(experienciasData);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao carregar serviços MVP:', err);
        setError('Não foi possível carregar as informações do backend. Por favor, tente novamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, color: '#6C3FC5', background: '#f8fafc', height: '100%'
      }}>
        <div className="loading-spinner" style={{
          width: 32, height: 32,
          border: '4px solid #ede9fe',
          borderTop: '4px solid #6C3FC5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: 14, fontWeight: 500 }}>Carregando dados de capacitação...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, color: '#ef4444', background: '#f8fafc', padding: 20, height: '100%'
      }}>
        <span style={{ fontSize: 40 }}>⚠️</span>
        <p style={{ fontSize: 15, fontWeight: 600, textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '24px 32px', height: 'calc(100vh - 57px)' }}>
      {/* Top Section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-block', background: '#E8F5E9', color: '#2E7D32', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Desenvolvimento Inclusivo · MVP
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>Capacitação & Experiências</h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Trilhas recomendadas para RH e lideranças conectarem diversidade, recrutamento anti-viés e metas corporativas ESG.
        </p>
      </div>

      {/* Grid: Trilhas de Formação */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#334155', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📚</span> Trilhas de Capacitação <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>({formacoes.length} trilhas oficiais)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {formacoes.map((trilha) => {
            const isHovered = hoveredTrilhaId === trilha.trilha_id;
            const nomeTrilha = formatarTextoMvp(trilha.nome_trilha);
            const descricaoTrilha = formatarTextoMvp(trilha.descricao_conteudo);
            return (
              <div
                key={trilha.trilha_id}
                onMouseEnter={() => setHoveredTrilhaId(trilha.trilha_id)}
                onMouseLeave={() => setHoveredTrilhaId(null)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered ? '0 10px 15px -3px rgba(108, 63, 197, 0.08), 0 4px 6px -2px rgba(108, 63, 197, 0.04)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  borderColor: isHovered ? '#6C3FC5' : '#e2e8f0',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: '#f3e8ff', color: '#6c3fc5', padding: '4px 8px', borderRadius: 6 }}>
                      ID {trilha.trilha_id}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⏱️ {trilha.carga_horaria}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {nomeTrilha}
                  </h3>

                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {descricaoTrilha}
                  </p>
                </div>

                <div style={{ marginTop: 20 }}>
                  {trilha.link_midia && !trilha.link_midia.includes('example.com') ? (
                    <a
                      href={trilha.link_midia}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        width: '100%',
                        padding: '8px 16px',
                        background: isHovered ? '#6C3FC5' : '#7c3aed',
                        color: '#fff',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: 'none',
                        textAlign: 'center',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      Iniciar trilha
                    </a>
                  ) : (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        color: '#94a3b8',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'not-allowed',
                      }}
                    >
                      Conteúdo demonstrativo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Table/List: Experiências Estruturantes */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#334155', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📍</span> Eventos & Experiências Estruturantes <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>({experiencias.length} eventos associados às regiões)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {experiencias.map((evento) => {
            const isHovered = hoveredEventoId === evento.evento_id;
            const nomeEvento = formatarTextoMvp(evento.nome_evento);
            const localEvento = formatarTextoMvp(evento.local);
            const detalhesEvento = formatarTextoMvp(evento.detalhes);
            const temaEvento = formatarTextoMvp(evento.tema_palestra);
            const palestrantes = formatarTextoMvp(evento.palestrantes);
            return (
              <div
                key={evento.evento_id}
                onMouseEnter={() => setHoveredEventoId(evento.evento_id)}
                onMouseLeave={() => setHoveredEventoId(null)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: isHovered ? '0 8px 12px -3px rgba(0, 0, 0, 0.04)' : '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                  borderColor: isHovered ? '#6c3fc5' : '#e2e8f0',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, background: '#f8fafc', color: '#64748b', padding: '3px 6px', borderRadius: 4, border: '0.5px solid #cbd5e1' }}>
                      ID {evento.evento_id}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, background: '#e0f2fe', color: '#0369a1', padding: '3px 6px', borderRadius: 4 }}>
                      {localEvento.split(' - ')[0]}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                    {nomeEvento}
                  </h3>

                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px 0' }}>
                    <strong>Palestra:</strong> {temaEvento}
                  </p>

                  <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                    {detalhesEvento}
                  </p>
                </div>

                <div style={{ borderTop: '0.5px solid #f1f5f9', paddingTop: 10, marginTop: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569', marginBottom: 4 }}>
                    <span>🗓️</span> <span>{evento.data.split('-').reverse().join('/')} · {evento.horario}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569', marginBottom: 4 }}>
                    <span>📍</span> <span style={{ color: '#0284c7', fontWeight: 500 }} title={localEvento}>{localEvento.split(' - ')[1] || localEvento}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
                    <span>👥</span> <span style={{ fontStyle: 'italic' }}>{palestrantes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
