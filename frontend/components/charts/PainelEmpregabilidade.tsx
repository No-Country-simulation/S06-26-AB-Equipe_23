import { useState } from 'react';
import useVagas from '../../hooks/useVagas';
import VagaCard from '../layout/VagaCard';
import VagaDetalhe from '../layout/VagaDetalhe';
import ModalNovaVaga from '../layout/ModalNovaVaga';
import type { Vaga } from '../../features/jobs/components/type/index.ts';

export default function PainelEmpregabilidade() {
  const {
    vagas,
    vagaSelecionada,
    vagaSelecionadaId,
    setVagaSelecionadaId,
    publicarVaga,
    editarVaga,
    excluirVaga,
    carregando,
    erro,
    pagina,
    tamanhoPagina,
    totalPaginas,
    totalElementos,
    mudarPagina,
    mudarTamanhoPagina,
    busca,
    setBusca,
    modalidadeFiltro,
    setModalidadeFiltro,
  } = useVagas();

  const [modalAberto, setModalAberto] = useState(false);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<Vaga | null>(null);

  function handleAbrirCriacao() {
    setVagaEmEdicao(null);
    setModalAberto(true);
  }

  function handleAbrirEdicao() {
    if (vagaSelecionada) {
      setVagaEmEdicao(vagaSelecionada);
      setModalAberto(true);
    }
  }

  function handleExcluir() {
    if (vagaSelecionada) {
      if (window.confirm(`Tem certeza de que deseja excluir a vaga "${vagaSelecionada.titulo}"?`)) {
        excluirVaga(vagaSelecionada.id);
      }
    }
  }

  return (
    <div className="employment-panel" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Lista de vagas */}
      <div className="employment-list" style={{
        width: 360,
        borderRight: '0.5px solid #e5e7eb',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden',
      }}>
        {/* Topo: Título e Botão Nova Vaga */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '0.5px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', zIndex: 10,
        }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>
              Vagas publicadas
            </h3>
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              {totalElementos} vaga{totalElementos !== 1 ? 's' : ''} no total
            </span>
          </div>
          <button
            onClick={handleAbrirCriacao}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px',
              background: '#6C3FC5', color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(108, 63, 197, 0.2)',
            }}
          >
            + Nova vaga
          </button>
        </div>

        {/* Filtros rápidos: Busca e Modalidade */}
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid #f1f5f9',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, fontSize: 12, color: '#94a3b8' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar título, área ou skill..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#fff',
              }}
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                style={{
                  position: 'absolute', right: 8, border: 'none', background: 'none',
                  color: '#94a3b8', cursor: 'pointer', fontSize: 12,
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Modalidade:</span>
              <select
                value={modalidadeFiltro}
                onChange={(e) => setModalidadeFiltro(e.target.value)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  background: '#fff',
                  color: '#334155',
                }}
              >
                <option value="Todos">Todas</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Por pág:</span>
              <select
                value={tamanhoPagina}
                onChange={(e) => mudarTamanhoPagina(Number(e.target.value))}
                style={{
                  padding: '3px 6px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  background: '#fff',
                  color: '#334155',
                }}
              >
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scroll das vagas */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {carregando && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ padding: 14, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ width: '70%', height: 16 }} />
                  <div className="skeleton" style={{ width: '45%', height: 12 }} />
                  <div className="skeleton" style={{ width: '30%', height: 10 }} />
                </div>
              ))}
            </div>
          )}

          {!carregando && erro && (
            <div style={{ padding: 20, textAlign: 'center', color: '#ef4444', fontSize: 13 }}>
              ⚠️ {erro}
            </div>
          )}

          {!carregando && !erro && vagas.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
              {busca || modalidadeFiltro !== 'Todos'
                ? 'Nenhuma vaga corresponde aos filtros informados.'
                : 'Nenhuma vaga cadastrada.'}
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

        {/* Barra de Paginação Visual no rodapé */}
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
        }}>
          <button
            type="button"
            onClick={() => mudarPagina(pagina - 1)}
            disabled={pagina <= 0 || carregando}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: pagina <= 0 || carregando ? '#f8fafc' : '#fff',
              color: pagina <= 0 || carregando ? '#94a3b8' : '#334155',
              cursor: pagina <= 0 || carregando ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: 11,
            }}
          >
            ‹ Anterior
          </button>

          <span style={{ color: '#475569', fontWeight: 600, fontSize: 11 }}>
            Pág. {pagina + 1} de {totalPaginas}
          </span>

          <button
            type="button"
            onClick={() => mudarPagina(pagina + 1)}
            disabled={pagina >= totalPaginas - 1 || carregando}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: pagina >= totalPaginas - 1 || carregando ? '#f8fafc' : '#fff',
              color: pagina >= totalPaginas - 1 || carregando ? '#94a3b8' : '#334155',
              cursor: pagina >= totalPaginas - 1 || carregando ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: 11,
            }}
          >
            Próxima ›
          </button>
        </div>
      </div>

      {/* Painel de detalhe */}
      <div className="employment-detail" style={{
        flex: 1,
        overflowY: 'auto',
        padding: 24,
        height: '100%',
        background: '#f9fafb',
      }}>
        {vagaSelecionada ? (
          <VagaDetalhe
            vaga={vagaSelecionada}
            onEditar={handleAbrirEdicao}
            onExcluir={handleExcluir}
          />
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
          onClose={() => {
            setModalAberto(false);
            setVagaEmEdicao(null);
          }}
          onPublicar={(form) => {
            if (vagaEmEdicao) {
              editarVaga(vagaEmEdicao.id, form);
            } else {
              publicarVaga(form);
            }
          }}
          vagaInicial={vagaEmEdicao}
        />
      )}
    </div>
  );
}

