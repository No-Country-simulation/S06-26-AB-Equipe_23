export interface MatchRequest {
  empresa_id: string;
  vaga: {
    titulo: string;
    skills: string[];
    nivel: string;
    regiao: string;
    modelo_trabalho: string;
  };
  filtros: {
    anti_vies: boolean;
    diversidade_minima: number;
    limite_resultados: number;
  };
}

export interface CandidatoMatch {
  candidato_id: string;
  apelido_exibicao: string;
  status_identificacao: 'anonimizado' | 'liberado_apos_aprovacao';
  cargo_alvo: string;
  nivel: string;
  regiao: string;
  cluster_residencia: string;
  score_match: number;
  skills: string[];
  badge_diversidade: string;
  explicacao: string;
}

export interface MatchResponse {
  vaga_id: string;
  total_analisados: number;
  total_retorno: number;
  metrica_diversidade: {
    percentual_shortlist_diversa: number;
    meta_diversidade: number;
    meta_atingida: boolean;
  };
  candidatos: CandidatoMatch[];
}

export interface RegiaoInsight {
  municipio: string;
  cluster: string;
  lat_media: number;
  lon_media: number;
  qtd_antenas: number;
  total_sessoes: number;
  percentual_3g: number;
  percentual_4g: number;
  percentual_5g: number;
  percentual_4g_5g: number;
  tecnologia_predominante_regiao: string;
  indicador_conectividade: 'alta' | 'media' | 'baixa' | 'alerta_exclusao_digital' | 'sem_dado';
  indicador_label: string;
  faixa_antenas: string;
  faixa_sessoes: string;
  possui_alerta: 'Sim' | 'Nao';
  recomendacao_rh: string;
}

export interface InsightsRegioesResponse {
  fonte: string;
  regioes: RegiaoInsight[];
}
