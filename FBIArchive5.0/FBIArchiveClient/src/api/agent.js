import axios from 'axios';

const API_URL = "http://localhost:5024/api";

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor для добавления токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const Admin = {
    updateDocument: (id, data) => api.put(`/admin/document/${id}`, data),
    updateCase: (id, data) => api.put(`/admin/case/${id}`, data),
    updateDefendant: (id, data) => api.put(`/admin/defendant/${id}`, data),
    updateEmployee: (id, data) => api.put(`/admin/employee/${id}`, data),
    updateSeries: (id, data) => api.put(`/admin/series/${id}`, data),

    // методы создания
    createDocument: (data) => api.post('/admin/document', data),
    createCase: (data) => api.post('/admin/case', data),
    createDefendant: (data) => api.post('/admin/defendant', data),
    createEmployee: (data) => api.post('/admin/employee', data),
    createSeries: (data) => api.post('/admin/series', data),
    createOrganization: (data) => api.post('/admin/organization', data),
    createDepartment: (data) => api.post('/admin/department', data),
};

export const Auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const Archive = {
    search: (query) => api.get(`/archive/search?query=${encodeURIComponent(query)}`),

    searchWithFilters: (params) => {
        const { query, entityType = 'all', status = '', securityLevel = '', documentType = '', post = '' } = params;

        const searchParams = new URLSearchParams();
        searchParams.append('query', query || '');
        searchParams.append('entityType', entityType);
        if (status) searchParams.append('status', status);
        if (securityLevel) searchParams.append('securityLevel', securityLevel);
        if (documentType) searchParams.append('documentType', documentType);
        if (post) searchParams.append('post', post);

        return api.get(`/archive/search/advanced?${searchParams.toString()}`);
    },
    searchAdvanced: (params) => api.get('/archive/search/advanced', { params }),

    // Метод с фильтрами (рекомендуемый)
    searchFiltered: ({ query, entityType = 'all', status = '', securityLevel = '', documentType = '' }) => {
        const params = {
            query: encodeURIComponent(query),
            entityType,
            status,
            securityLevel,
            documentType
        };
        return api.get('/archive/search/advanced', { params });
    },

    // Старые методы получения по ID
    getDocument: (id) => api.get(`/archive/document/${id}`),
    getCase: (id) => api.get(`/archive/case/${id}`),
    getSeries: (id) => api.get(`/archive/series/${id}`),
    getDefendant: (id) => api.get(`/archive/defendant/${id}`),
    getEmployee: (id) => api.get(`/archive/employee/${id}`),
    getOrganization: (id) => api.get(`/archive/organization/${id}`),
    getDepartment: (id) => api.get(`/archive/department/${id}`),
};

export default api;