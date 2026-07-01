import api from './axios';
import type { AprovacaoRequest, ContatoAprovado, InsightsRegioesResponse, MatchRequest, MatchResponse } from './appbitTypes';

export async function executarMatch(request: MatchRequest = {}): Promise<MatchResponse> {
  const response = await api.post<MatchResponse>('/match', request);
  return response.data;
}

export async function aprovarCandidato(request: AprovacaoRequest): Promise<ContatoAprovado> {
  const response = await api.post<ContatoAprovado>('/match/aprovar-candidato', request);
  return response.data;
}

export async function buscarInsightsRegioes(): Promise<InsightsRegioesResponse> {
  const response = await api.get<InsightsRegioesResponse>('/insights/regioes');
  return response.data;
}
