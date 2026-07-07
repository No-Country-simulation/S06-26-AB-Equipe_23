import { useEffect, useState } from 'react';
import {
  buscarExperienciasMvp,
  buscarFormacoesMvp,
  buscarMentoriasMvp,
} from '../../lib/appbitApi';
import type {
  ExperienciaEstruturanteMvp,
  FormacaoMvp,
  MentoriaMvp,
} from '../../lib/appbitTypes';

type Status = 'loading' | 'ready' | 'error';

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18, color: '#111827', fontWeight: 650 }}>{title}</h2>
      <span style={{ color: '#6b7280', fontSize: 13 }}>{count} itens</span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <article style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      background: '#fff',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minHeight: 150,
    }}>
      {children}
    </article>
  );
}

export default function PainelServicosMvp() {
  const [status, setStatus] = useState<Status>('loading');
  const [formacoes, setFormacoes] = useState<FormacaoMvp[]>([]);
  const [experiencias, setExperiencias] = useState<ExperienciaEstruturanteMvp[]>([]);
  const [mentorias, setMentorias] = useState<MentoriaMvp[]>([]);

  useEffect(() => {
    Promise.all([
      buscarFormacoesMvp(),
      buscarExperienciasMvp(),
      buscarMentoriasMvp(),
    ])
      .then(([formacoesResponse, experienciasResponse, mentoriasResponse]) => {
        setFormacoes(formacoesResponse);
        setExperiencias(experienciasResponse);
        setMentorias(mentoriasResponse);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return (
      <main style={{ flex: 1, padding: 24, background: '#f9fafb', color: '#6b7280' }}>
        Carregando serviços do MVP...
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main style={{ flex: 1, padding: 24, background: '#f9fafb' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#111827' }}>Serviços do MVP</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            Não foi possível carregar Formações, Experiências e Mentorias. Verifique se o backend está ativo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#f9fafb', textAlign: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionTitle title="Formações" count={formacoes.length} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {formacoes.map((item) => (
              <Card key={item.trilha_id}>
                <strong style={{ color: '#111827', fontSize: 15 }}>{item.nome_trilha}</strong>
                <p style={{ margin: 0, color: '#4b5563', fontSize: 13, lineHeight: 1.5 }}>{item.descricao_conteudo}</p>
                <span style={{ marginTop: 'auto', color: '#6C3FC5', fontSize: 13, fontWeight: 600 }}>
                  {item.carga_horaria}
                </span>
              </Card>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionTitle title="Experiências Estruturantes" count={experiencias.length} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {experiencias.slice(0, 8).map((item) => (
              <Card key={item.evento_id}>
                <strong style={{ color: '#111827', fontSize: 15 }}>{item.nome_evento}</strong>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{item.data} às {item.horario}</span>
                <span style={{ color: '#6C3FC5', fontSize: 13, fontWeight: 600 }}>{item.local}</span>
                <p style={{ margin: 0, color: '#4b5563', fontSize: 13, lineHeight: 1.5 }}>{item.tema_palestra}</p>
              </Card>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionTitle title="Mentorias" count={mentorias.length} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {mentorias.map((item) => (
              <Card key={item.mentor_id}>
                <strong style={{ color: '#111827', fontSize: 15 }}>{item.nome_mentor}</strong>
                <span style={{ color: '#4b5563', fontSize: 13 }}>{item.cargo}</span>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{item.empresa_origem}</span>
                <span style={{ marginTop: 'auto', color: '#6C3FC5', fontSize: 13, fontWeight: 600 }}>
                  {item.especialidade_esg} - {item.disponibilidade}
                </span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
