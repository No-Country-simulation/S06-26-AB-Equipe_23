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
  AlertaEsg,
  VagaBackend,
  VagaCreateBackend,
} from './appbitTypes';

export async function buscarVagas(): Promise<VagaBackend[]> {
  const response = await api.get<VagaBackend[]>('/vagas');
  return response.data;
}

export async function buscarVagaPorId(id: number): Promise<VagaBackend> {
  const response = await api.get<VagaBackend>(`/vagas/${id}`);
  return response.data;
}

export async function criarVaga(vaga: VagaCreateBackend): Promise<VagaBackend> {
  const response = await api.post<VagaBackend>('/vagas', vaga);
  return response.data;
}

export async function atualizarVaga(id: number, vaga: Partial<VagaCreateBackend>): Promise<VagaBackend> {
  const response = await api.put<VagaBackend>(`/vagas/${id}`, vaga);
  return response.data;
}

export async function deletarVaga(id: number): Promise<void> {
  await api.delete(`/vagas/${id}`);
}

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

export async function buscarAlertasEsg(): Promise<AlertaEsg[]> {
  const response = await api.get<AlertaEsg[]>('/insights/esg');
  return response.data;
}
