export interface MatchRequest {
  empresa_id?: string;
  vaga?: {
    titulo?: string;
    skills?: string[];
    nivel?: string;
    regiao?: string;
    modelo_trabalho?: string;
  };
  filtros?: {
    anti_vies?: boolean;
    diversidade_minima?: number;
    limite_resultados?: number;
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
  cep?: string;
  lat?: number;
  lon?: number;
  modelo_trabalho_preferido?: string;
  skills: string[];
  anos_experiencia?: number;
  badge_diversidade?: string;
  score_match: number;
}

export interface MatchResponse {
  fonte_candidatos: string;
  total_analisados: number;
  total_retorno: number;
  regra_privacidade: string;
  candidatos: CandidatoMatch[];
}

export interface AprovacaoRequest {
  candidato_id: string;
  empresa_id: string;
}

export interface ContatoAprovado {
  candidato_id: string;
  apelido_exibicao: string;
  contato_liberado: {
    nome: string;
    email: string;
    telefone: string;
    linkedin: string;
  };
}

export interface RegiaoInsight {
  municipio: string;
  cluster: string;
  lat_media: number;
  lon_media: number;
  qtd_antenas: number;
  total_sessoes_3g: number;
  total_sessoes_4g: number;
  total_sessoes_5g: number;
  total_sessoes_outros: number;
  total_sessoes: number;
  percentual_3g: number;
  percentual_4g: number;
  percentual_5g: number;
  percentual_outros: number;
  tecnologia_predominante_regiao: '3G' | '4G' | '5G' | 'OUTROS' | 'SEM_DADO';
  usuarios_observados_total: number;
  sessoes_concentracao_total: number;
  periodo_pico: 'MANHA' | 'TARDE' | 'NOITE' | 'MADRUGADA' | 'SEM_DADO';
  usuarios_observados_periodo_pico: number;
  indice_concentracao_relativa: number;
  fonte_antenas: string;
  fonte_sessoes: string;
  fonte_concentracao: string;
}

export interface InsightsRegioesResponse {
  fontes: { antenas: string; sessoes: string; concentracao: string };
  metodologia: string;
  total_regioes: number;
  regioes: RegiaoInsight[];
}

export interface FormacaoMvp {
  trilha_id: number;
  nome_trilha: string;
  descricao_conteudo: string;
  carga_horaria: string;
  link_midia?: string | null;
}

export interface ExperienciaEstruturanteMvp {
  evento_id: number;
  nome_evento: string;
  data: string;
  horario: string;
  local: string;
  detalhes: string;
  tema_palestra: string;
  palestrantes: string;
}

export interface MentoriaMvp {
  mentor_id: number;
  nome_mentor: string;
  empresa_origem: string;
  cargo: string;
  especialidade_esg: string;
  disponibilidade: string;
}
