import type { Vaga } from '../../features/jobs/components/type/index.ts'
import Badge from '../ui/Badge';
import ScoreBar from './ScoreBar';

interface VagaCardProps {
  vaga: Vaga;
  selected: boolean;
  onClick: () => void;
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

export default function VagaCard({ vaga, selected, onClick }: VagaCardProps) {
  const filtros = getFiltrosAtivos(vaga);

  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderBottom: '0.5px solid #e5e7eb',
        borderLeft: selected ? '2px solid #6C3FC5' : '2px solid transparent',
        background: selected ? '#EEE9FC' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 4 }}>
        {vaga.titulo}
      </p>
      <p style={{ fontSize: 12, color: '#6C3FC5', marginBottom: 4 }}>{vaga.area}</p>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
        📍 {vaga.modalidade} · {vaga.regiao}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        <Badge label={vaga.nivel} variant="nivel" />
        {filtros.slice(0, 2).map((f) => (
          <Badge key={f} label={f} variant="diversidade" />
        ))}
        <Badge label={`ESG ${vaga.esgMatch}%`} variant="esg" />
      </div>

      <ScoreBar score={vaga.esgMatch} />
    </div>
  );
}
