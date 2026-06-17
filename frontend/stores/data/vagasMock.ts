import { Vaga } from '../../features/jobs/components/type/index.ts';

export const VAGAS_MOCK: Vaga[] = [
  {
    id: 1,
    titulo: 'Engenheira de Dados Sênior',
    area: 'Dados',
    nivel: 'Sênior',
    modalidade: 'Remoto',
    regiao: 'Brasil',
    descricao: 'Buscamos profissional para estruturar pipelines de dados e liderar iniciativas de analytics na área de diversidade e impacto social.',
    skills: ['Python', 'Spark', 'dbt', 'BigQuery'],
    filtrosDiversidade: {
      antivies: true,
      mulheres: true,
      pessoasNegras: true,
      pcd: false,
      lgbtqia: false,
    },
    scoreMinDiversidade: 60,
    esgMatch: 92,
    publicadaEm: '2025-06-10'
  },
  {
    id: 2,
    titulo: 'Desenvolvedora Frontend React',
    area: 'Tecnologia',
    nivel: 'Pleno',
    modalidade: 'Híbrido',
    regiao: 'São Paulo, SP',
    descricao: 'Criação de interfaces acessíveis e performáticas para o produto principal da empresa, com foco em design system e acessibilidade WCAG.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Acessibilidade'],
    filtrosDiversidade: {
      antivies: true,
      mulheres: false,
      pessoasNegras: false,
      pcd: true,
      lgbtqia: true,
    },
    scoreMinDiversidade: 50,
    esgMatch: 78,
    publicadaEm: '2025-06-08'
  },
  {
    id: 3,
    titulo: 'Product Manager — Inclusão',
    area: 'Produto',
    nivel: 'Sênior',
    modalidade: 'Remoto',
    regiao: 'Brasil',
    descricao: 'Liderar a estratégia de produto com foco em impacto social e metas ESG da empresa, conectando negócio e propósito.',
    skills: ['Roadmap', 'OKRs', 'Discovery', 'Stakeholders'],
    filtrosDiversidade: {
      antivies: true,
      mulheres: true,
      pessoasNegras: true,
      pcd: false,
      lgbtqia: true,
    },
    scoreMinDiversidade: 70,
    esgMatch: 95,
    publicadaEm: '2025-06-05'
  },
];

export const AREAS = ['Tecnologia', 'Produto', 'Design', 'Dados', 'RH', 'Marketing', 'Operações'];
export const NIVEIS = ['Júnior', 'Pleno', 'Sênior', 'Liderança'];
export const MODALIDADES = ['Remoto', 'Híbrido', 'Presencial'];
