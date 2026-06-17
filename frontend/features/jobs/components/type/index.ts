export interface FiltrosDiversidade {
  antivies: boolean;
  mulheres: boolean;
  pessoasNegras: boolean;
  pcd: boolean;
  lgbtqia: boolean;
}

export interface Vaga {
  id: number;
  titulo: string;
  area: string;
  nivel: 'Júnior' | 'Pleno' | 'Sênior' | 'Liderança';
  modalidade: 'Remoto' | 'Híbrido' | 'Presencial';
  regiao: string;
  descricao: string;
  skills: string[];
  filtrosDiversidade: FiltrosDiversidade;
  scoreMinDiversidade: number;
  esgMatch: number;
  publicadaEm: string;
}


export interface NovaVagaForm {
  titulo: string;
  area: string;
  nivel: "Júnior" | "Pleno" | "Sênior" | "Liderança";
  modalidade: "Remoto" | "Híbrido" | "Presencial";
  regiao: string;
  skills: string[];
  descricao: string;
  filtros: FiltrosDiversidade;
  scoreMin: number;
}

/*     vaga_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id VARCHAR(40) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    nivel VARCHAR(40) NOT NULL,
    regiao_alvo VARCHAR(80) NULL,
    diversidade_minima DECIMAL(5,2) NULL,
    anti_vies BIT NOT NULL DEFAULT 1,
    criada_em DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME() */