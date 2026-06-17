import api from './axios';
import { insightsRegioesMock, matchMock } from './appbitMocks';
import type { InsightsRegioesResponse, MatchRequest, MatchResponse } from './appbitTypes';

export async function executarMatch(request?: MatchRequest): Promise<MatchResponse> {
  try {
    const response = await api.post<MatchResponse>('/match', request ?? defaultMatchRequest);
    return response.data;
  } catch {
    return matchMock;
  }
}

export async function buscarInsightsRegioes(): Promise<InsightsRegioesResponse> {
  try {
    const response = await api.get<InsightsRegioesResponse>('/insights/regioes');
    return response.data;
  } catch {
    return insightsRegioesMock;
  }
}

export const defaultMatchRequest: MatchRequest = {
  empresa_id: 'emp_001',
  vaga: {
    titulo: 'Analista de Dados Junior',
    skills: ['sql', 'python', 'power bi'],
    nivel: 'junior',
    regiao: 'Florianopolis',
    modelo_trabalho: 'hibrido',
  },
  filtros: {
    anti_vies: true,
    diversidade_minima: 40,
    limite_resultados: 10,
  },
};
