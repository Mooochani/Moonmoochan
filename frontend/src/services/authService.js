// frontend/src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // 실제 API 주소에 맞게 확인하세요

export const authService = {
    // ✅ 인자에 role 추가
    signup: async (email, password, name, role) => {
        return axios.post(`${API_URL}/signup`, {
            email,
            password,
            name,
            role // ✅ 선택한 role(CUSTOMER 또는 SELLER)을 서버로 전송
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