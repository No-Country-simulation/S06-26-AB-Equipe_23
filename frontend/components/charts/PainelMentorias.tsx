import { useEffect, useState } from 'react';
import { buscarMentoriasMvp } from '../../lib/appbitApi';
import type { MentoriaMvp } from '../../lib/appbitTypes';
import { formatarTextoMvp } from '../../lib/formatarTextoMvp';

export default function PainelMentorias() {
  const [mentores, setMentores] = useState<MentoriaMvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMentorId, setHoveredMentorId] = useState<number | null>(null);
  const [agendados, setAgendados] = useState<Set<number>>(new Set());

  useEffect(() => {
    buscarMentoriasMvp()
      .then((data) => {
        setMentores(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao buscar mentorias:', err);
        setError('Não foi possível carregar as mentorias do backend. Por favor, tente novamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAgendar = (id: number) => {
    setAgendados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, color: '#6C3FC5', background: '#f8fafc', height: '100%'
      }}>
        <div style={{
          width: 32, height: 32,
          border: '4px solid #ede9fe',
          borderTop: '4px solid #6C3FC5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: 14, fontWeight: 500 }}>Carregando rede de mentores...</p>
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
        <div style={{ display: 'inline-block', background: '#E0F2FE', color: '#0369a1', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Mentoria Corporativa · MVP
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>Conexão com Líderes de Diversidade</h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Mentores de outras empresas atuando na troca de boas práticas em ESG, People Analytics e inclusão organizacional.
        </p>
      </div>

      {/* Grid: Mentores */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#334155', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>👥</span> Mentores Disponíveis <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>({mentores.length} mentores oficiais na rede)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {mentores.map((mentor) => {
            const isHovered = hoveredMentorId === mentor.mentor_id;
            const isAgendado = agendados.has(mentor.mentor_id);
            const cargo = formatarTextoMvp(mentor.cargo);
            const empresa = formatarTextoMvp(mentor.empresa_origem);
            const especialidade = formatarTextoMvp(mentor.especialidade_esg);
            return (
              <div
                key={mentor.mentor_id}
                onMouseEnter={() => setHoveredMentorId(mentor.mentor_id)}
                onMouseLeave={() => setHoveredMentorId(null)}
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
                  {/* Top Bar inside card */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      background: '#EEE9FC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#6C3FC5', fontSize: 15, fontWeight: 600, flexShrink: 0
                    }}>
                      {mentor.nome_mentor.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mentor.nome_mentor}
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cargo}
                      </p>
                      <p style={{ fontSize: 11, color: '#475569', fontWeight: 500, margin: '2px 0 0 0' }}>
                        🏢 {empresa}
                      </p>
                    </div>
                  </div>

                  {/* Specialty tag */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 4, fontWeight: 500 }}>
                      Especialidade ESG:
                    </span>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 500,
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: '0.5px solid #cbd5e1'
                    }}>
                      💡 {especialidade}
                    </span>
                  </div>
                </div>

                {/* Footer with availability and action */}
                <div style={{ borderTop: '0.5px solid #f1f5f9', paddingTop: 14, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Disponibilidade</span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: mentor.disponibilidade === 'Quinzenal' ? '#16a34a' : '#2563eb'
                    }}>
                      🗓️ {mentor.disponibilidade}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAgendar(mentor.mentor_id)}
                    style={{
                      padding: '7px 12px',
                      background: isAgendado ? '#10b981' : (isHovered ? '#6C3FC5' : '#7c3aed'),
                      color: '#fff',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s, transform 0.1s',
                      transform: isHovered ? 'scale(1.02)' : 'none',
                    }}
                  >
                    {isAgendado ? '✓ Solicitado' : 'Agendar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
