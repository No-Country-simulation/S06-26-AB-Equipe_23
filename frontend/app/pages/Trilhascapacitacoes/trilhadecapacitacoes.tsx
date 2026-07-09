import React, { useState, useEffect } from 'react';
import './trilhadecapacitacaoes.css';

// 1. Tipagem para os dados da trilha que virão do backend
interface Trilha {
  id: number;
  titulo: string;
  publico: string;
  progresso: number; // Deve vir como um número de 0 a 100
  aulas: string;     // Exemplo: '8/12 módulos'
}

export default function TrilhasCapacitacao() {
  // 2. Estados para armazenar dados da API, carregamento e mensagens de erro
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // 3. Efeito colateral para disparar a busca de dados ao montar a página
  useEffect(() => {
    async function carregarTrilhas() {
      try {
        setCarregando(true);
        // Substitua pela URL exata do endpoint do seu backend
        const resposta = await fetch('http://localhost:3000/api/trilhas');

        if (!resposta.ok) {
          throw new Error(`Erro no servidor: ${resposta.status}`);
        }

        const dados: Trilha[] = await resposta.json();
        setTrilhas(dados);
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Não foi possível carregar as trilhas de capacitação.');
      } finally {
        setCarregando(false);
      }
    }

    carregarTrilhas();
  }, []);

  return (
    <div className="internalContainer">
      <header className="internalHeader">
        <h2>Trilhas de Capacitação</h2>
        <p>Desenvolva uma cultura inclusiva de dentro para fora com conteúdos focados em Diversidade & Inclusão.</p>
      </header>

      {/* 4. Feedback visual enquanto carrega */}
      {carregando && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>
          Carregando trilhas de capacitação...
        </div>
      )}

      {/* 5. Feedback visual em caso de falha de conexão ou erro no backend */}
      {erro && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444', background: '#fef2f2', borderRadius: '8px', margin: '20px 0' }}>
          {erro}
        </div>
      )}

      {/* 6. Renderização da listagem de cards */}
      {!carregando && !erro && (
        <div className="cardsGrid">
          {trilhas.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
              Nenhuma trilha de capacitação disponível no momento.
            </p>
          ) : (
            trilhas.map((trilha) => (
              <div key={trilha.id} className="contentCard">
                <div className="cardHeader">
                  <span className="cardTag">{trilha.publico}</span>
                  <h3>{trilha.titulo}</h3>
                </div>
                
                <div className="cardBody">
                  <p className="cardDetail"><strong>Status:</strong> {trilha.aulas}</p>
                  
                  {/* Barra de progresso reativa com o valor em % vindo do banco */}
                  <div className="internalProgressBar">
                    <div 
                      className="internalProgressFill" 
                      style={{ width: `${Math.min(Math.max(trilha.progresso, 0), 100)}%` }}
                    ></div>
                  </div>
                  <span className="progressText">{trilha.progresso}% Concluído</span>
                </div>

                <div className="cardFooter">
                  <button className="internalButton">
                    {trilha.progresso === 100 ? 'Revisar Conteúdo' : 'Continuar Trilha'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}