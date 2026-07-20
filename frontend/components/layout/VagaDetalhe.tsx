import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vaga } from '../../features/jobs/components/type/index.ts';
import Badge from '../ui/Badge';

interface VagaDetalheProps {
  vaga: Vaga;
  onEditar?: () => void;
  onExcluir?: () => void;
}

function getFiltrosAtivos(vaga: Vaga): string[] {
  const labels: string[] = [];
  if (vaga.filtrosDiversidade.mulheres) labels.push('Mulheres');
  if (vaga.filtrosDiversidade.pessoasNegras) labels.push('Pessoas negras');
  if (vaga.filtrosDiversidade.pcd) labels.push('PcD');
  if (vaga.filtrosDiversidade.lgbtqia) labels.push('LGBTQIA+');
  if (labels.length === 0) labels.push('Inclusiva');
  return labels;
}

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '0.5px solid #e5e7eb',
  borderRadius: 12,
  padding: '24px',
  marginBottom: 16,
};

const dividerStyle: CSSProperties = {
  height: '0.5px',
  background: '#e5e7eb',
  margin: '20px 0',
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 10,
};

export default function VagaDetalhe({ vaga, onEditar, onExcluir }: VagaDetalheProps) {
  const navigate = useNavigate();
  const filtros = getFiltrosAtivos(vaga);

  return (
    <div>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>{vaga.titulo}</h2>
            <p style={{ fontSize: 15, color: '#6C3FC5', marginBottom: 4 }}>🏢 Sua empresa</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {onEditar && (
              <button
                type="button"
                onClick={onEditar}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px',
                  background: '#fff', color: '#6C3FC5',
                  border: '1px solid #6C3FC5', borderRadius: 8,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                ✏️ Editar vaga
              </button>
            )}
            {onExcluir && (
              <button
                type="button"
                onClick={onExcluir}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px',
                  background: '#fef2f2', color: '#ef4444',
                  border: '1px solid #fca5a5', borderRadius: 8,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                🗑 Excluir vaga
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#6b7280', marginBottom: 16, marginTop: 8 }}>
          <span>📍 {vaga.modalidade}</span>
          <span>🗺 {vaga.regiao}</span>
          <span>📈 {vaga.nivel}</span>
          <span>📁 {vaga.area}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {filtros.map((f) => <Badge key={f} label={f} variant="diversidade" size="md" />)}
          <Badge label={`Score ESG: ${vaga.esgMatch}%`} variant="esg" size="md" />
          {vaga.filtrosDiversidade.antivies && (
            <Badge label="🛡 Anti-viés ativo" variant="antivies" size="md" />
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          <button
            type="button"
            onClick={() => navigate(`/shortlist?vaga=${vaga.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              background: '#6C3FC5', color: '#fff',
              border: 'none', borderRadius: 99,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            👥 Ver shortlist de candidatos
          </button>
          <button
            type="button"
            onClick={() => navigate('/insights/regioes')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              background: '#fff', color: '#6C3FC5',
              border: '1px solid #6C3FC5', borderRadius: 99,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            📍 Ver insights regionais
          </button>
        </div>

        <div style={dividerStyle} />

        <p style={sectionLabelStyle}>Sobre a vaga</p>
        <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 16 }}>
          {vaga.descricao}
        </p>

        <p style={sectionLabelStyle}>Skills exigidas</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
          {vaga.skills.map((skill) => (
            <span key={skill} style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              border: '0.5px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 12,
              color: '#374151',
            }}>
              {skill}
            </span>
          ))}
        </div>

        <div style={dividerStyle} />

        <p style={sectionLabelStyle}>Metas de diversidade desta vaga</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Score mínimo exigido', value: `${vaga.scoreMinDiversidade}%`, color: '#6C3FC5' },
            { label: 'Score médio shortlist', value: `${vaga.esgMatch}%`, color: '#3B6D11' },
            { label: 'Filtros ativos', value: String(filtros.length), color: '#111' },
            { label: 'Candidatos analisados', value: '—', color: '#111' },
          ].map((m) => (
            <div key={m.label} style={{
              background: '#f9fafb', borderRadius: 8, padding: 12,
            }}>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{m.label}</p>
              <p style={{ fontSize: 18, fontWeight: 500, color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>

        {vaga.filtrosDiversidade.antivies && (
          <div style={{
            background: '#EEE9FC',
            border: '0.5px solid #AFA9EC',
            borderRadius: 8,
            padding: '12px 14px',
          }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#534AB7', marginBottom: 8 }}>
              🛡 Como o filtro anti-viés funciona nesta vaga
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                'Nome e foto ocultados na triagem inicial',
                'Instituição de ensino anonimizada',
                'Candidatos avaliados por skills e score, não por perfil',
                'Badge de diversidade gerado após shortlist',
              ].map((item) => (
                <li key={item} style={{ fontSize: 11, color: '#3C3489', display: 'flex', gap: 6 }}>
                  <span>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
