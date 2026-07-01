import api from '../../../lib/axios';
import { useState } from 'react';
import type Skill from './type';

export default function SkillPostForm() {

    function getUniqueCategories(skills: Skill[]): string[] {
        const categories = skills.map(skill => skill.categoria);
        return Array.from(new Set(categories));
    }

    const [skillData, setSkillData] = useState<Skill>({
        id: '',
        nome_skill: '',
        categoria: ''
    });

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        api.post('/login', skillData)
            .then((response) => {
                alert('Login bem-sucedido: ' + response.data);
            }).catch((error) => {
                console.error('Erro no login:', error);
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSkillData((prev) => ({
            ...prev, [name]: value,
        }));
        api.get('/getAllSkill').then((response) => {
            document.createElement('div').innerHTML = response.data;
        }).catch((error) => {
            console.error('Erro ao obter skills:', error);
        });
    };

    const handleCategoryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSkillData((prev) => ({
            ...prev, [name]: value,
        }));
        api.get('/getAllSkill').then((response) => {
            const uniqueCategories = getUniqueCategories(response.data);
            document.createElement('div').innerHTML = uniqueCategories.join(', ');
        }).catch((error) => {
            console.error('Erro ao obter skills:', error);
        });
    };
    
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Formulário de sua Habilidade</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="categoria" style={{ display: 'block', marginBottom: '5px' }}>
                        Categoria:
                    </label>
                    <input
                        id="categoria"
                        type="text"
                        name="categoria"
                        value={skillData.categoria}
                        onChange={handleCategoryInputChange}
                        placeholder="Categoria da habilidade"
                        required
                        style={{ width: '250px', padding: '8px', fontSize: '14px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nome_skill" style={{ display: 'block', marginBottom: '5px' }}>
                        Nome da Habilidade:
                    </label>
                    <input
                        id="nome_skill"
                        type="text"
                        name="nome_skill"
                        value={skillData.nome_skill}
                        onChange={handleInputChange}
                        placeholder="Nome da sua habilidade"
                        required
                        style={{ width: '250px', padding: '8px', fontSize: '14px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
                    Enviar
                </button>
            </form>
        </div>
    );
}



