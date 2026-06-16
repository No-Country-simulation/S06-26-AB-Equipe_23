export default interface Skill {
    id: string;
    nome_skill: string;
    categoria: string;
}
/*skill_id INT IDENTITY(1,1) PRIMARY KEY,
    nome_skill VARCHAR(80) NOT NULL UNIQUE,
    categoria VARCHAR(80) NULL*/