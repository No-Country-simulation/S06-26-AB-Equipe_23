import.meta.env.VITE_API_URL;
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const TOKEN = localStorage.getItem('token');
    // TODO: Alterar para onde colocar no banco de dados
    if (TOKEN && config.headers) {  
        config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
}, (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
});

export default api;
