import React, { useState, useEffect } from 'react';
import './mentorias.css';

// 1. Tipagem para os dados que chegam do backend
interface LiderConexao {
  id: number;
  nome: string;
  cargo: string;
  empresa: string;
  match: string;
}

export default function NetworkingImpacto() {
  // 2. Estados para controlar os dados do backend, carregamento e possíveis erros
  const [conexoes, setConexoes] = useState<LiderConexao[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // 3. Chamada à API ao montar o componente
  useEffect(() => {
    async function carregarMentorias() {
      try {
        setCarregando(true);
        // Substitua a URL abaixo pela rota correta da sua API do backend
        const resposta = await fetch('http://localhost:3000/api/mentorias'); 
        
        if (!resposta.ok) {
          throw new Error(`Erro no servidor: ${resposta.status}`);
        }
        
        const dados: LiderConexao[] = await resposta.json();
        setConexoes(dados);
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Não foi possível carregar os dados de mentoria.');
      } finally {
        setCarregando(false);
      }
    }

    carregarMentorias();
  }, []);

  return (
    <div className="internalContainer">
      <header className="internalHeader">
        <h2>Conexão entre Líderes (Networking de Impacto)</h2>
        <p>Troque boas práticas de inclusão com profissionais que enfrentam os mesmos desafios corporativos.</p>
      </header>

      {/* 4. Tratamento visual de Carregamento */}
      {carregando && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>
          Carregando líderes disponíveis...
        </div>
      )}

      {/* 5. Tratamento visual de Erro */}
      {erro && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444', background: '#fef2f2', borderRadius: '8px', margin: '20px 0' }}>
          {erro}
        </div>
      )}

      {/* 6. Lista de Cards (Exibida apenas quando termina de carregar e não há erros) */}
      {!carregando && !erro && (
        <div className="cardsGrid">
          {conexoes.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
              Nenhum líder disponível para conexão no momento.
            </p>
          ) : (
            conexoes.map((lider) => (
              <div key={lider.id} className="contentCard networkingCard">
                <div className="avatarPlaceholder">{lider.nome ? lider.nome.charAt(0) : '?'}</div>
                <h3>{lider.nome}</h3>
                <p className="userCargo">{lider.cargo} em <strong>{lider.empresa}</strong></p>
                
                <div className="matchBox">
                  <span className="matchLabel">Interesse em Comum:</span>
                  <p>{lider.match}</p>
                </div>

                <button className="internalButton activeSubmit">Solicitar Troca de Práticas</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}