import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// 1. 요청 디버깅 (서버로 보내기 전)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // [DEBUG] 어떤 주소로, 어떤 토큰을 가지고 나가는지 확인
    console.log(`%c🚀 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`, 'color: #008cff; font-weight: bold;');
    console.log('보내는 데이터:', config.data);
    console.log('현재 토큰:', token ? `Bearer ${token.substring(0, 15)}...` : '없음');

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// 2. 응답 디버깅 (서버에서 받은 후)
api.interceptors.response.use(
  (response) => {
    // [DEBUG] 서버에서 성공적으로 데이터를 받았을 때
    console.log(`%c✅ [RESPONSE] ${response.status} ${response.config.url}`, 'color: #00c73c; font-weight: bold;');
    return response;
  },
  (error) => {
    // [DEBUG] 서버에서 에러가 왔을 때 (403, 401, 500 등)
    console.log(`%c❌ [ERROR] ${error.response?.status} ${error.config?.url}`, 'color: #ff4b4b; font-weight: bold;');
    console.log('에러 내용:', error.response?.data || error.message);

    if (error?.response?.status === 401) {
      console.warn('⚠️ 인증 만료: 로그인 페이지로 이동합니다.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // 403 에러인 경우 별도의 디버깅 메시지 출력
    if (error?.response?.status === 403) {
      console.error('🚫 권한 부족(403): 이 요청을 수행할 권한이 없습니다. 토큰이 올바른지, 혹은 계정 권한을 확인하세요.');
    }

    return Promise.reject(error);
  }
);

export default api;