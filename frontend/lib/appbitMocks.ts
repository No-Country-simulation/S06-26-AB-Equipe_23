import type { InsightsRegioesResponse, MatchResponse } from './appbitTypes';

const recomendacaoAlta = 'Regiao com conectividade adequada para apoiar trabalho remoto ou hibrido.';
const cargos = [
  'Analista de Dados Junior',
  'Analista de BI Junior',
  'Assistente de Dados',
  'Desenvolvedor Frontend Junior',
  'Analista de Suporte Junior',
  'Estagiario em Dados',
  'Analista de Operacoes',
  'Assistente de Projetos',
];
const niveis = ['estagio', 'junior', 'pleno'];
const regioesCandidatos = [
  ['Florianopolis', 'TRINDADE'],
  ['Florianopolis', 'UFSC'],
  ['Florianopolis', 'CBD_BEIRAMAR'],
  ['Florianopolis', 'CAMPECHE'],
  ['Florianopolis', 'INGLESES'],
  ['Sao Jose', 'SAO_JOSE_KOBRASOL'],
  ['Sao Jose', 'SAO_JOSE_CENTRO'],
  ['Sao Jose', 'SAO_JOSE_ROCADO'],
  ['Palhoca', 'PALHOCA_CENTRO'],
  ['Palhoca', 'PALHOCA_PEDRA_BRANCA'],
  ['Biguacu', 'BIGUACU_BR101_NORTE'],
];
const skillsBase = ['sql', 'python', 'power bi', 'excel', 'react', 'typescript', 'java', 'spring boot', 'atendimento', 'suporte', 'estatistica', 'etl', 'dashboards', 'comunicacao'];
const badgesDiversidade = [
  'Mulher em tecnologia',
  'Pessoa negra em tecnologia',
  'Talento de baixa renda',
  'Perfil junior em formacao tecnica',
  'Primeira geracao no ensino superior',
  'Pessoa com deficiencia',
  'Comunidade LGBTQIA+',
  'Talento de regiao com menor acesso',
  'Sem badge declarado',
];

function pick<T>(items: T[], index: number, step = 1): T {
  return items[(index * step) % items.length];
}

function gerarCandidatosMock() {
  return Array.from({ length: 200 }, (_, itemIndex) => {
    const index = itemIndex + 1;
    const [regiao, cluster] = pick(regioesCandidatos, index, 5);
    const totalSkills = 3 + (index % 4);
    const skills = Array.from({ length: totalSkills }, (_, offset) => pick(skillsBase, index + offset, 3));

    return {
      candidato_id: `cand_${String(index).padStart(3, '0')}`,
      apelido_exibicao: `Candidato ${index}`,
      status_identificacao: 'anonimizado' as const,
      cargo_alvo: pick(cargos, index, 3),
      nivel: pick(niveis, index, 2),
      regiao,
      cluster_residencia: cluster,
      score_match: 58 + ((index * 7) % 40),
      skills,
      badge_diversidade: pick(badgesDiversidade, index, 4),
      explicacao: 'Perfil anonimizado para triagem inicial, com score de match, skills e contexto regional prontos para dashboard e validacao.',
    };
  });
}

const candidatosMatchMock = gerarCandidatosMock();

export const matchMock: MatchResponse = {
  vaga_id: 'job_001',
  total_analisados: candidatosMatchMock.length,
  total_retorno: candidatosMatchMock.length,
  metrica_diversidade: {
    percentual_shortlist_diversa: 88.5,
    meta_diversidade: 40,
    meta_atingida: true,
  },
  candidatos: candidatosMatchMock,
};

function regiao(
  municipio: string,
  cluster: string,
  lat_media: number,
  lon_media: number,
  qtd_antenas: number,
  total_sessoes: number,
  percentual_4g: number,
  percentual_5g: number,
) {
  const percentual_3g = Number((100 - percentual_4g - percentual_5g).toFixed(2));
  return {
    municipio,
    cluster,
    lat_media,
    lon_media,
    qtd_antenas,
    total_sessoes,
    percentual_3g,
    percentual_4g,
    percentual_5g,
    percentual_4g_5g: Number((percentual_4g + percentual_5g).toFixed(2)),
    tecnologia_predominante_regiao: '4G',
    indicador_conectividade: 'alta' as const,
    indicador_label: 'Alta',
    faixa_antenas: qtd_antenas >= 10 ? '10+ antenas' : qtd_antenas >= 5 ? '5 a 9 antenas' : qtd_antenas >= 2 ? '2 a 4 antenas' : '1 antena',
    faixa_sessoes: total_sessoes >= 5_000_000 ? '5M+ sessoes' : total_sessoes >= 2_000_000 ? '2M a 5M sessoes' : total_sessoes >= 1_000_000 ? '1M a 2M sessoes' : 'Ate 1M sessoes',
    possui_alerta: 'Nao' as const,
    recomendacao_rh: recomendacaoAlta,
  };
}

export const insightsRegioesMock: InsightsRegioesResponse = {
  fonte: 'Visent CDRView / Anatel - mock BI',
  regioes: [
    regiao('Biguacu', 'BIGUACU_BR101_NORTE', -27.516721, -48.645949, 4, 2015469, 60.18, 22.48),
    regiao('Florianopolis', 'AEROPORTO_HLZ', -27.689101, -48.55135, 6, 2449927, 60.25, 22.61),
    regiao('Florianopolis', 'CAMPECHE', -27.693087, -48.503058, 8, 3331658, 60.16, 22.72),
    regiao('Florianopolis', 'CANASVIEIRAS', -27.432597, -48.459966, 3, 1508451, 60.24, 22.72),
    regiao('Florianopolis', 'CBD_BEIRAMAR', -27.588457, -48.546862, 13, 6340973, 60.19, 22.7),
    regiao('Florianopolis', 'CENTRO_HISTORICO', -27.60395, -48.546242, 1, 1059788, 60.23, 22.62),
    regiao('Florianopolis', 'COQUEIROS', -27.594117, -48.571572, 1, 866361, 60.14, 22.57),
    regiao('Florianopolis', 'ESTREITO_CAPOEIRAS', -27.596671, -48.589301, 10, 3716661, 60.19, 22.73),
    regiao('Florianopolis', 'INGLESES', -27.44702, -48.395133, 7, 2719638, 60.2, 22.79),
    regiao('Florianopolis', 'JURERE', -27.451011, -48.507101, 5, 1974015, 60.4, 22.53),
    regiao('Florianopolis', 'LAGOA_CONCEICAO', -27.603791, -48.457382, 7, 2895317, 60.31, 22.71),
    regiao('Florianopolis', 'NORTE_ILHA', -27.477624, -48.459756, 7, 2521264, 60.22, 22.61),
    regiao('Florianopolis', 'RESIDENCIAL_NORTE', -27.537876, -48.507835, 6, 2799528, 60.26, 22.78),
    regiao('Florianopolis', 'SC401_CORREDOR', -27.568806, -48.516554, 11, 3947491, 60.25, 22.61),
    regiao('Florianopolis', 'TRINDADE', -27.597023, -48.52391, 8, 4019992, 60.27, 22.6),
    regiao('Florianopolis', 'UFSC', -27.593599, -48.5541, 5, 2617058, 60.25, 22.63),
    regiao('Florianopolis', 'VIA_EXPRESSA_CORREDOR', -27.609272, -48.585003, 4, 1866188, 60.0, 22.95),
    regiao('Palhoca', 'PALHOCA_CENTRO', -27.637456, -48.666794, 1, 796339, 60.14, 22.58),
    regiao('Palhoca', 'PALHOCA_PEDRA_BRANCA', -27.632075, -48.690179, 2, 1232334, 60.03, 22.82),
    regiao('Palhoca', 'SAO_JOSE_BARREIROS', -27.673358, -48.656689, 1, 880819, 60.16, 22.67),
    regiao('Sao Jose', 'ESTREITO_CAPOEIRAS', -27.581231, -48.606435, 3, 1122170, 60.23, 22.65),
    regiao('Sao Jose', 'SAO_JOSE_CENTRO', -27.609003, -48.62332, 3, 2473133, 60.2, 22.56),
    regiao('Sao Jose', 'SAO_JOSE_KOBRASOL', -27.594154, -48.626605, 9, 3775925, 60.23, 22.69),
    regiao('Sao Jose', 'SAO_JOSE_ROCADO', -27.569376, -48.640131, 7, 1864968, 60.2, 22.72),
  ],
};
