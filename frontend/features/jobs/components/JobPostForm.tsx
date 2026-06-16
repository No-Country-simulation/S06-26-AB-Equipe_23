import api from '../../../lib/axios';
import { useState } from 'react';

interface LoginData {
    user: string;
    password: string;
}

export default function JobPostForm() {

    const [formData, setFormData] = useState<LoginData>({
        user: '',
        password: '',
    });
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        api.post('/login', formData)
            .then((response) => {
                console.log('Login bem-sucedido:', response.data);
            }).catch((error) => {
                console.error('Erro no login:', error);
            });
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev, [name]: value,
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Formulário de Login</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="user" style={{ display: 'block', marginBottom: '5px' }}>
                        Usuário:
                    </label>
                    <input
                        id="user"
                        type="text"
                        name="email"
                        value={formData.user}
                        onChange={handleInputChange}
                        placeholder="seu-email@dominio.com"
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



