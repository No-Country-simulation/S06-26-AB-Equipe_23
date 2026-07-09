const substituicoes: Array<[string, string]> = [
  ['Capacitacao', 'Capacitação'],
  ['capacitacao', 'capacitação'],
  ['Nao', 'Não'],
  ['nao', 'não'],
  ['possivel', 'possível'],
  ['medio', 'médio'],
  ['criterios', 'critérios'],
  ['Criterios', 'Critérios'],
  ['tecnicas', 'técnicas'],
  ['Tecnicas', 'Técnicas'],
  ['reforcar', 'reforçar'],
  ['vieses', 'vieses'],
  ['anti-vies', 'anti-viés'],
  ['Lideranca', 'Liderança'],
  ['liderancas', 'lideranças'],
  ['seguranca psicologica', 'segurança psicológica'],
  ['pratica', 'prática'],
  ['Conteudo', 'Conteúdo'],
  ['politicas', 'políticas'],
  ['decisao', 'decisão'],
  ['responsavel', 'responsável'],
  ['avaliacao', 'avaliação'],
  ['Aprovacao', 'Aprovação'],
  ['anonima', 'anônima'],
  ['anonimizada', 'anonimizada'],
  ['diagnosticos', 'diagnósticos'],
  ['acao', 'ação'],
  ['formacao', 'formação'],
  ['Formacao', 'Formação'],
  ['tecnica', 'técnica'],
  ['Tecnica', 'Técnica'],
  ['transicao', 'transição'],
  ['Transicao', 'Transição'],
  ['regiao', 'região'],
  ['Regiao', 'Região'],
  ['deficiencia', 'deficiência'],
  ['Deficiencia', 'Deficiência'],
  ['geracao', 'geração'],
  ['Geracao', 'Geração'],
  ['inclusao', 'inclusão'],
  ['Inclusao', 'Inclusão'],
  ['Contratacao', 'Contratação'],
  ['reduzir', 'reduzir'],
  ['Saude', 'Saúde'],
  ['saude', 'saúde'],
  ['sensiveis', 'sensíveis'],
  ['exclusao', 'exclusão'],
  ['retencao', 'retenção'],
  ['inovacao', 'inovação'],
  ['comunicacao', 'comunicação'],
  ['boas praticas', 'boas práticas'],
  ['liderancas corporativas', 'lideranças corporativas'],
  ['Senior', 'Sênior'],
  ['Junior', 'Júnior'],
  ['junior', 'júnior'],
  ['Hibrido', 'Híbrido'],
  ['hibrido', 'híbrido'],
  ['Joao', 'João'],
  ['Biguacu', 'Biguaçu'],
  ['Florianopolis', 'Florianópolis'],
  ['Palhoca', 'Palhoça'],
  ['Sao Jose', 'São José'],
  ['pre-aprovados', 'pré-aprovados'],
];

export function formatarTextoMvp(valor: string) {
  return substituicoes.reduce((texto, [origem, destino]) => texto.replaceAll(origem, destino), valor);
}

const skills: Record<string, string> = {
  sql: 'SQL',
  python: 'Python',
  'power bi': 'Power BI',
  excel: 'Excel',
  tableau: 'Tableau',
  etl: 'ETL',
  git: 'Git',
  estatistica: 'Estatística',
};

export function formatarSkillMvp(valor: string) {
  return skills[valor.toLowerCase()] ?? formatarTextoMvp(valor);
}

const niveis: Record<string, string> = {
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
};

export function formatarNivelMvp(valor: string) {
  return niveis[valor.toLowerCase()] ?? formatarTextoMvp(valor);
}

const clusters: Record<string, string> = {
  BIGUACU_BR101_NORTE: 'Biguaçu BR-101 Norte',
  AEROPORTO_HLZ: 'Aeroporto Hercílio Luz',
  CAMPECHE: 'Campeche',
  CANASVIEIRAS: 'Canasvieiras',
  CBD_BEIRAMAR: 'Beira-Mar',
  CENTRO_HISTORICO: 'Centro Histórico',
  COQUEIROS: 'Coqueiros',
  ESTREITO_CAPOEIRAS: 'Estreito / Capoeiras',
  INGLESES: 'Ingleses',
  JURERE: 'Jurerê',
  LAGOA_CONCEICAO: 'Lagoa da Conceição',
  NORTE_ILHA: 'Norte da Ilha',
  RESIDENCIAL_NORTE: 'Residencial Norte',
  SC401_CORREDOR: 'SC-401 Corredor',
  TRINDADE: 'Trindade',
  UFSC: 'UFSC',
  VIA_EXPRESSA_CORREDOR: 'Via Expressa Corredor',
  PALHOCA_CENTRO: 'Palhoça Centro',
  PALHOCA_PEDRA_BRANCA: 'Palhoça Pedra Branca',
  SAO_JOSE_BARREIROS: 'São José Barreiros',
  SAO_JOSE_CENTRO: 'São José Centro',
  SAO_JOSE_KOBRASOL: 'São José Kobrasol',
  SAO_JOSE_ROÇADO: 'São José Roçado',
};

export function formatarClusterMvp(valor: string) {
  if (clusters[valor]) return clusters[valor];

  const texto = valor
    .replaceAll('_', ' ')
    .replace(/\bBR101\b/g, 'BR-101')
    .replace(/\bSC401\b/g, 'SC-401')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return formatarTextoMvp(texto);
}
