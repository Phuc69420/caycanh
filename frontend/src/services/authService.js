// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/tai-khoan';

export const authService = {
    dangNhap: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/dang-nhap`, {
                username: credentials.username,
                password: credentials.password
            });

            if (response.data.thanh_cong) {
                // Save auth data to localStorage
                localStorage.setItem('token', response.data.du_lieu.token);
                localStorage.setItem('user', JSON.stringify(response.data.du_lieu.user));
                localStorage.setItem('roles', JSON.stringify(response.data.du_lieu.roles));
                localStorage.setItem('visible_controls', JSON.stringify(response.data.du_lieu.visible_controls));
            }

            return response.data;
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            throw error.response?.data || { thong_bao: 'Đăng nhập thất bại' };
        }
    },

    dangKy: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/dang-ky`, {
                username: userData.username,
                password: userData.password,
                password_confirmation: userData.password_confirmation,
                name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address
            });

            return response.data;
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
            throw error.response?.data || { thong_bao: 'Đăng ký thất bại' };
        }
    },

    dangXuat: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/dang-xuat`, 
                {},
                { headers: { Authorization: token }}
            );

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('roles');
            localStorage.removeItem('visible_controls');

            return response.data;
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
            throw error.response?.data || { thong_bao: 'Đăng xuất thất bại' };
        }
    },

    googleLogin: async (googleData) => {
        try {
            const response = await axios.post(`${API_URL}/google-login`, {
                email: googleData.email,
                name: googleData.name
            });

            if (response.data.thanh_cong) {
                localStorage.setItem('token', response.data.du_lieu.token);
                localStorage.setItem('user', JSON.stringify(response.data.du_lieu.user));
                localStorage.setItem('roles', JSON.stringify(response.data.du_lieu.roles));
                localStorage.setItem('visible_controls', JSON.stringify(response.data.du_lieu.visible_controls));
            }

            return response.data;
        } catch (error) {
            console.error('Google login error:', error);
            throw error.response?.data || { thong_bao: 'Đăng nhập thất bại' };
        }
    },

    googleRegister: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/google-register`, {
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                address: userData.address
            });

            if (response.data.thanh_cong) {
                localStorage.setItem('token', response.data.du_lieu.token);
                localStorage.setItem('user', JSON.stringify(response.data.du_lieu.user));
                localStorage.setItem('roles', JSON.stringify(response.data.du_lieu.roles));
                localStorage.setItem('visible_controls', JSON.stringify(response.data.du_lieu.visible_controls));
            }

            return response.data;
        } catch (error) {
            console.error('Google registration error:', error);
            throw error.response?.data || { thong_bao: 'Đăng ký thất bại' };
        }
    }
};