export interface Job {
    id: string;
    titulo: string;
    skills: string[];
    nivel: 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista';
    regiao: string
}

