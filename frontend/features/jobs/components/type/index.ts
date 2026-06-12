export interface Job {
    id: string;
    titulo: string;
    skills: string[];
    nivel: 'junior' | 'pleno' | 'senior';
    regiao: string
}

