// frontend/src/services/authService.js

import axios from 'axios';

// ✅ 로컬호스트를 AWS 서버 IP로 변경했습니다.
const API_URL = 'http://13.236.117.206:8080/api/auth';

export const authService = {
    signup: async (email, password, name, role) => {
        return axios.post(`${API_URL}/signup`, {
            email,
            password,
            name,
            role
        });
    },

    login: async (email, password) => {
        return axios.post(`${API_URL}/login`, {
            email,
            password
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};