import api from './axios';
import type {
  AprovacaoRequest,
  ReprovacaoRequest,
  ReprovacaoResponse,
  FeedbackResumo,
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
  SpringPage,
  CandidatoCadastroPayload,
  CandidatoCadastroResponse,
  RegiaoItem,
} from './appbitTypes';

export async function buscarVagas(): Promise<VagaBackend[]> {
  const response = await api.get<VagaBackend[]>('/vagas');
  return response.data;
}

export async function buscarVagasPaginadas(
  page: number = 0,
  size: number = 10
): Promise<SpringPage<VagaBackend>> {
  const response = await api.get<SpringPage<VagaBackend> | VagaBackend[]>('/vagas', {
    params: { page, size },
  });

  if (Array.isArray(response.data)) {
    const total = response.data.length;
    const start = page * size;
    const content = response.data.slice(start, start + size);
    return {
      content,
      totalPages: Math.ceil(total / size) || 1,
      totalElements: total,
      size,
      number: page,
      numberOfElements: content.length,
      first: page === 0,
      last: (page + 1) * size >= total,
      empty: content.length === 0,
    };
  }

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

export async function reprovarCandidato(request: ReprovacaoRequest): Promise<ReprovacaoResponse> {
  const response = await api.post<ReprovacaoResponse>('/match/reprovar-candidato', request);
  return response.data;
}

export async function buscarFeedbacksVaga(empresaId: string = 'emp_001', vagaId?: number): Promise<FeedbackResumo[]> {
  const params: Record<string, unknown> = { empresa_id: empresaId };
  if (vagaId !== undefined && !isNaN(vagaId)) {
    params.vaga_id = vagaId;
  }
  const response = await api.get<FeedbackResumo[]>('/match/feedbacks', { params });
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

export async function downloadRelatorioPdf(): Promise<void> {
  const response = await api.get('/insights/exportar/pdf', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'relatorio_auditado_esg.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadRelatorioExcel(): Promise<void> {
  const response = await api.get('/insights/exportar/excel', { responseType: 'blob' });
  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'relatorio_auditado_esg.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function cadastrarCandidato(payload: CandidatoCadastroPayload): Promise<CandidatoCadastroResponse> {
  const response = await api.post<CandidatoCadastroResponse>('/candidatos', payload);
  return response.data;
}

export async function buscarCandidatosPaginados(
  page: number = 0,
  size: number = 10
): Promise<SpringPage<CandidatoCadastroResponse>> {
  const response = await api.get<SpringPage<CandidatoCadastroResponse> | CandidatoCadastroResponse[]>('/candidatos', {
    params: { page, size },
  });

  if (Array.isArray(response.data)) {
    const total = response.data.length;
    const start = page * size;
    const content = response.data.slice(start, start + size);
    return {
      content,
      totalPages: Math.ceil(total / size) || 1,
      totalElements: total,
      size,
      number: page,
      numberOfElements: content.length,
      first: page === 0,
      last: (page + 1) * size >= total,
      empty: content.length === 0,
    };
  }

  return response.data;
}

export async function buscarRegioes(): Promise<RegiaoItem[]> {
  const response = await api.get<RegiaoItem[]>('/regioes');
  return response.data;
}
