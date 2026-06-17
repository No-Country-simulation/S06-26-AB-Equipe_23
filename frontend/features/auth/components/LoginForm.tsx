import api from '../../../lib/axios';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type LoginData from './type';

export default function LoginForm() {

    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: '',
    });
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev, [name]: value,
        }));
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData.email === '' || formData.password === '') {
            alert('Preencha todos os campos');
            return;
        }
        if (formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === null) {
            alert('Digite um email válido');
            return;
        }
        if (formData.email === '\' OR 1=1 --' || formData.password === '\' OR 1=1 --' || formData.email.includes('\'') || formData.password.includes('\'')) {
            alert('SQL Injection detectado! Não faça novamente ou será alertado as autoridades competentes com informações pessoais sobre seu ip.');
            return;
        }
        api.post('/login', formData)
            .then((response) => {
                console.log('Login bem-sucedido:', response.data);
            }).catch((error) => {
                console.error('Erro no login:', error);
            });
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
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu-email@dominio.com"
                        required
                        style={{ width: '250px', padding: '8px', fontSize: '14px' }}
                    />
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                        Senha:
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
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



