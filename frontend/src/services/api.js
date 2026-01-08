import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 끝에 /를 붙이지 마세요.
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("🚀 요청 URL:", config.baseURL + config.url); // 주소 확인용 로그
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
