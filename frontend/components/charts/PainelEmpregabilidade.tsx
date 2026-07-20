import { useState } from 'react';
import useVagas from '../../hooks/useVagas';
import VagaCard from '../layout/VagaCard';
import VagaDetalhe from '../layout/VagaDetalhe';
import ModalNovaVaga from '../layout/ModalNovaVaga';

export default function PainelEmpregabilidade() {
  const { vagas, vagaSelecionada, vagaSelecionadaId, setVagaSelecionadaId, publicarVaga, carregando, erro } = useVagas();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="employment-panel" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Lista de vagas */}
      <div className="employment-list" style={{
        width: 340,
        borderRight: '0.5px solid #e5e7eb',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
        height: 'calc(100vh - 57px)',
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '0.5px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 500 }}>
            Vagas publicadas{' '}
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>({vagas.length})</span>
          </h3>
          <button
            onClick={() => setModalAberto(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px',
              background: '#6C3FC5', color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >
            + Nova vaga
          </button>
        </div>

        {carregando && (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
            Carregando vagas...
          </div>
        )}

        {!carregando && erro && (
          <div style={{ padding: 20, textAlign: 'center', color: '#ef4444', fontSize: 13 }}>
            ⚠️ {erro}
          </div>
        )}

        {!carregando && !erro && vagas.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            Nenhuma vaga cadastrada.
          </div>
        )}

        {!carregando && vagas.map((vaga) => (
          <VagaCard
            key={vaga.id}
            vaga={vaga}
            selected={vaga.id === vagaSelecionadaId}
            onClick={() => setVagaSelecionadaId(vaga.id)}
          />
        ))}
      </div>

      {/* Painel de detalhe */}
      <div className="employment-detail" style={{
        flex: 1,
        overflowY: 'auto',
        padding: 24,
        height: 'calc(100vh - 57px)',
        background: '#f9fafb',
      }}>
        {vagaSelecionada ? (
          <VagaDetalhe vaga={vagaSelecionada} />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', color: '#9ca3af', gap: 12,
          }}>
            <span style={{ fontSize: 40 }}>💼</span>
            <p style={{ fontSize: 13 }}>Selecione uma vaga para ver os detalhes</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalNovaVaga
          onClose={() => setModalAberto(false)}
          onPublicar={publicarVaga}
        />
      )}
    </div>
  );
}
