import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { NovaVagaForm } from '../../features/jobs/components/type/index.ts';
import type { FiltrosDiversidade } from '../../features/jobs/components/type/index.ts';
import { AREAS, NIVEIS, MODALIDADES } from '../../stores/data/vagasMock';
import Toggle from '../ui/Toggle';

interface ModalNovaVagaProps {
  onClose: () => void;
  onPublicar: (form: NovaVagaForm) => void;
}

const INPUT_STYLE: CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '0.5px solid #d1d5db',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'inherit',
  color: '#111',
  background: '#fff',
  outline: 'none',
};

const LABEL_STYLE: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
};

const INITIAL_FILTROS: FiltrosDiversidade = {
  antivies: true,
  mulheres: false,
  pessoasNegras: false,
  pcd: false,
  lgbtqia: false,
};

export default function ModalNovaVaga({ onClose, onPublicar }: ModalNovaVagaProps) {
  const [titulo, setTitulo] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [nivel, setNivel] = useState<"Júnior" | "Pleno" | "Sênior" | "Liderança">(NIVEIS[0] as "Júnior" | "Pleno" | "Sênior" | "Liderança");
  const [modalidade, setModalidade] = useState<"Remoto" | "Híbrido" | "Presencial">(MODALIDADES[0] as "Remoto" | "Híbrido" | "Presencial");
  const [regiao, setRegiao] = useState('');
  const [skills, setSkills] = useState(['']);
  const [descricao, setDescricao] = useState('');
  const [filtros, setFiltros] = useState<FiltrosDiversidade>(INITIAL_FILTROS);
  const [scoreMin, setScoreMin] = useState(40);

  function handleFiltroChange(key: keyof FiltrosDiversidade, value: boolean) {
    setFiltros((prev: FiltrosDiversidade) => ({ ...prev, [key]: value }));
  }

  function handlePublicar() {
    onPublicar({
      titulo, area, nivel, modalidade, regiao, skills, descricao, filtros, scoreMin
    });
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 20px',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '0.5px solid #e5e7eb',
          width: '100%',
          maxWidth: 560,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '0.5px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 500 }}>Publicar nova vaga</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b7280', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Título da vaga</label>
            <input
              style={INPUT_STYLE}
              placeholder="Ex: Desenvolvedora Backend Sênior"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Área / Departamento</label>
              <select style={INPUT_STYLE} value={area} onChange={(e) => setArea(e.target.value)}>
                {AREAS.map((a: string) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>Nível</label>
              <select style={INPUT_STYLE} value={nivel} onChange={(e) => setNivel(e.target.value as "Júnior" | "Pleno" | "Sênior" | "Liderança")}>
                {NIVEIS.map((n: string) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Modalidade</label>
              <select style={INPUT_STYLE} value={modalidade} onChange={(e) => setModalidade(e.target.value as "Remoto" | "Híbrido" | "Presencial")}>
                {MODALIDADES.map((m: string) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>Região</label>
              <input
                style={INPUT_STYLE}
                placeholder="Ex: São Paulo, SP"
                value={regiao}
                onChange={(e) => setRegiao(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Skills exigidas (separadas por vírgula)</label>
            <input
              style={INPUT_STYLE}
              placeholder="Ex: Python, SQL, dbt"
              value={skills.join(', ')}
              onChange={(e) => setSkills(e.target.value.split(',').map((s) => s.trim()))}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Descrição da vaga</label>
            <textarea
              style={{ ...INPUT_STYLE, resize: 'vertical' }}
              rows={3}
              placeholder="Descreva as responsabilidades e o contexto da vaga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <hr style={{ height: '0.5px', background: '#e5e7eb', border: 'none', margin: '16px 0' }} />

          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#6C3FC5' }}>🛡</span> Filtros de diversidade e inclusão
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <Toggle
              label="Filtro anti-viés"
              description="Oculta nome, foto e origem dos candidatos na triagem"
              value={filtros.antivies}
              onChange={(v) => handleFiltroChange('antivies', v)}
            />
            <Toggle
              label="Prioridade para mulheres"
              description="Score de matching valoriza candidatas mulheres"
              value={filtros.mulheres}
              onChange={(v) => handleFiltroChange('mulheres', v)}
            />
            <Toggle
              label="Prioridade para pessoas negras"
              description="Score valoriza candidatos pretos e pardos"
              value={filtros.pessoasNegras}
              onChange={(v) => handleFiltroChange('pessoasNegras', v)}
            />
            <Toggle
              label="Inclusão de PcD"
              description="Vaga adaptada e sinalizada para pessoas com deficiência"
              value={filtros.pcd}
              onChange={(v) => handleFiltroChange('pcd', v)}
            />
            <Toggle
              label="Comunidade LGBTQIA+"
              description="Score valoriza candidatos LGBTQIA+"
              value={filtros.lgbtqia}
              onChange={(v) => handleFiltroChange('lgbtqia', v)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Score mínimo de diversidade</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6C3FC5' }}>{scoreMin}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={5}
              value={scoreMin}
              onChange={(e) => setScoreMin(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '0.5px solid #e5e7eb',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px',
            border: '0.5px solid #d1d5db',
            borderRadius: 8, background: 'transparent',
            fontSize: 13, cursor: 'pointer', color: '#6b7280',
          }}>
            Cancelar
          </button>
          <button onClick={handlePublicar} style={{
            padding: '8px 20px',
            background: '#6C3FC5', color: '#fff',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            Publicar vaga
          </button>
        </div>
      </div>
    </div>
  );
}
