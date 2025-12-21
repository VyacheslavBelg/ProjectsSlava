import axios from 'axios';

const API_URL = "http://localhost:5024/api"; 


const api = axios.create({
    baseURL: API_URL,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const Auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const Archive = {
    search: (query) => api.get(`/archive/search?query=${query}`),
};

export default api;