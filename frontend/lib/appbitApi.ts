import api from './axios';
import type {
  AprovacaoRequest,
  ContatoAprovado,
  ExperienciaEstruturanteMvp,
  FormacaoMvp,
  InsightsRegioesResponse,
  MatchRequest,
  MatchResponse,
  MentoriaMvp,
} from './appbitTypes';

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

export async function buscarFormacoesMvp(): Promise<FormacaoMvp[]> {
  const response = await api.get<FormacaoMvp[]>('/api/formacoes');
  return response.data;
}

export async function buscarExperienciasMvp(): Promise<ExperienciaEstruturanteMvp[]> {
  const response = await api.get<ExperienciaEstruturanteMvp[]>('/api/experiencias');
  return response.data;
}

export async function buscarMentoriasMvp(): Promise<MentoriaMvp[]> {
  const response = await api.get<MentoriaMvp[]>('/api/mentorias');
  return response.data;
}
