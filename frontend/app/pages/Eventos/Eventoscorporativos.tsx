import { useEffect, useState } from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import { buscarExperienciasMvp } from '../../../lib/appbitApi';
import type { ExperienciaEstruturanteMvp } from '../../../lib/appbitTypes';
import { formatarTextoMvp } from '../../../lib/formatarTextoMvp';

function formatarData(data: string) {
  if (!data.includes('-')) return data;
  return data.split('-').reverse().join('/');
}

export default function EventosCorporativosPage() {
  const [eventos, setEventos] = useState<ExperienciaEstruturanteMvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarExperienciasMvp()
      .then((data) => {
        setEventos(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao carregar eventos:', err);
        setError('Não foi possível carregar os eventos corporativos do backend.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout activeNav="Eventos">
      <section style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Experiências Estruturantes · MVP
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>Eventos Corporativos de Diversidade</h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Painéis e palestras com líderes de grupos sub-representados para inspirar a cultura interna da empresa.
          </p>
        </div>

        {loading && <p style={{ color: '#6C3FC5', fontWeight: 500 }}>Carregando eventos corporativos...</p>}
        {error && <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {eventos.map((evento) => (
              <article key={evento.evento_id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, background: '#f8fafc', color: '#64748b', padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    ID {evento.evento_id}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, background: '#f3e8ff', color: '#6c3fc5', padding: '4px 8px', borderRadius: 6 }}>
                    {formatarTextoMvp(evento.local).split(' - ')[0]}
                  </span>
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                  {formatarTextoMvp(evento.nome_evento)}
                </h2>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45 }}>
                  <strong>Tema:</strong> {formatarTextoMvp(evento.tema_palestra)}
                </p>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, minHeight: 52 }}>
                  {formatarTextoMvp(evento.detalhes)}
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 10, display: 'grid', gap: 5, fontSize: 12, color: '#475569' }}>
                  <span>🗓️ {formatarData(evento.data)} · {evento.horario}</span>
                  <span>📍 {formatarTextoMvp(evento.local)}</span>
                  <span>👥 {formatarTextoMvp(evento.palestrantes)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
