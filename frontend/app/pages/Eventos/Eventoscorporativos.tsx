import { useState, useEffect } from 'react';
import api from '../../../lib/axios'; // Importa a sua instância configurada do Axios
import './eventoscorporativos.css';

// Definição da estrutura de dados que vem do backend
interface Evento {
  id: number;
  nome: string;
  data: string;
  horario: string;
  local: string;
  temaPalestra: string;
  palestrantes: string;
  detalhes: string;
  status: string; // Ex: 'Inscrições Abertas', 'Confirmado', 'Brevemente'
}

export default function EventosDiversidade() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Requisição para buscar os eventos cadastrados no banco de dados
    api.get('/eventos')
      .then((response) => {
        setEventos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar eventos do backend:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="internalContainer">
        <div className="loadingState">Carregando eventos ...</div>
      </div>
    );
  }

  return (
    <div className="internalContainer">
      <header className="internalHeader">
        <h2>Eventos de Diversidade</h2>
        <p>Inspire sua cultura interna através de painéis e palestras com líderes de grupos sub-representados.</p>
      </header>

      <div className="cardsGrid">
        {eventos.length === 0 ? (
          <p className="emptyEvents">Nenhum evento programado no momento.</p>
        ) : (
          eventos.map((evento) => (
            <div key={evento.id} className="contentCard">
              {/* Linha superior com Data e Horário */}
              <div className="cardDateRow">
                <span className="eventDate">📅 {evento.data}</span>
                <span className="eventTime">⏰ {evento.horario}</span>
              </div>
              
              {/* Local do Evento */}
              <span className="eventLocal">📍 {evento.local}</span>

              {/* Nome do Evento */}
              <h3>{evento.nome}</h3>
              
              <hr className="cardDivider" />

              {/* Tema e Palestrantes */}
              <div className="eventInfoBody">
                <p className="cardTheme"><strong>Tema:</strong> {evento.temaPalestra}</p>
                <p className="cardSpeaker"><strong>Palestrante(s):</strong> {evento.palestrantes}</p>
                <p className="cardDetails"><strong>Sobre o evento:</strong> {evento.detalhes}</p>
              </div>

              {/* Status do Evento para controle de cor */}
              <span className={`statusTag ${evento.status === 'Inscrições Abertas' ? 'statusOpen' : 'statusWait'}`}>
                {evento.status}
              </span>
              
              <button className="internalButton">Garantir meu Ingresso</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}