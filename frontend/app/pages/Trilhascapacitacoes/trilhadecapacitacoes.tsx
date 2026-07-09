import { useEffect, useState } from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import { buscarFormacoesMvp } from '../../../lib/appbitApi';
import type { FormacaoMvp } from '../../../lib/appbitTypes';
import { formatarTextoMvp } from '../../../lib/formatarTextoMvp';

export default function TrilhasCapacitacaoPage() {
  const [trilhas, setTrilhas] = useState<FormacaoMvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarFormacoesMvp()
      .then((data) => {
        setTrilhas(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao carregar trilhas:', err);
        setError('Não foi possível carregar as trilhas de capacitação do backend.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout activeNav="Formações">
      <section style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: 'inline-block', background: '#E8F5E9', color: '#2E7D32', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Formações · MVP
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>Trilhas de Capacitação</h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Conteúdos para equipes de RH e lideranças criarem uma cultura inclusiva de dentro para fora.
          </p>
        </div>

        {loading && <p style={{ color: '#6C3FC5', fontWeight: 500 }}>Carregando trilhas de capacitação...</p>}
        {error && <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {trilhas.map((trilha) => (
              <article key={trilha.trilha_id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, background: '#f3e8ff', color: '#6c3fc5', padding: '4px 8px', borderRadius: 6 }}>
                    ID {trilha.trilha_id}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>⏱️ {trilha.carga_horaria}</span>
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                  {formatarTextoMvp(trilha.nome_trilha)}
                </h2>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, minHeight: 58 }}>
                  {formatarTextoMvp(trilha.descricao_conteudo)}
                </p>
                {trilha.link_midia ? (
                  <a href={trilha.link_midia} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%', marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#7c3aed', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                    ▶️ Iniciar Trilha
                  </a>
                ) : (
                  <button disabled style={{ width: '100%', marginTop: 12, padding: '10px 14px', borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                    Mídia Indisponível
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
