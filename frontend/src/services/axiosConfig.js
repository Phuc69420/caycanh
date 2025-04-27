// frontend/src/services/axiosConfig.js
import axios from 'axios';

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('roles');
            localStorage.removeItem('visible_controls');
            window.location.href = '/dang-nhap';
        }
        return Promise.reject(error);
    }
);