export interface Job {
    id: string;
    titulo: string;
    nivel: 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista';
    skills: string[];
    regiao_alvo: string;
    diversidade_minina: 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista';
    anti_vies: boolean;
}

/*     vaga_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id VARCHAR(40) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    nivel VARCHAR(40) NOT NULL,
    regiao_alvo VARCHAR(80) NULL,
    diversidade_minima DECIMAL(5,2) NULL,
    anti_vies BIT NOT NULL DEFAULT 1,
    criada_em DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME() */