import axios from 'axios';
import { clearAppSession } from './session';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://appbit-backend-0v3u.onrender.com",
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const TOKEN = localStorage.getItem('token');
    if (TOKEN && config.headers) {  
        config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
}, (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
        clearAppSession();

        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    return Promise.reject(error);
});

export default api;
