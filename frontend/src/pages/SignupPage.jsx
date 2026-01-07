import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/AuthPages.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // 1️⃣ 상태 관리
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2️⃣ 입력 필드 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 3️⃣ 회원가입 제출
    const handleSubmit = async (e) => {
        e.preventDefault();  // ✅ 기본 폼 동작 방지
        setError('');        // 이전 에러 초기화
        setLoading(true);    // 로딩 상태 시작

        try {
            // API 호출
            const response = await authService.signup(
                formData.email,
                formData.password,
                formData.name
            );

            const { token, userId, email, name } = response.data;
            console.log('✅ 회원가입 성공:', { userId, email, name });

            // ✅ AuthContext에 로그인 정보 저장
            login({ userId, email, name }, token);

            // ✅ 홈페이지로 이동
            navigate('/');

        } catch (err) {
            // ❌ 에러 처리
            const errorMessage = err.response?.data?.message || '회원가입 실패했습니다.';
            console.error('❌ 회원가입 실패:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);  // 로딩 상태 종료
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>회원가입</h1>

                {/* 에러 메시지 */}
                {error && <div className="error-message">{error}</div>}

                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="홍길동"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@gmail.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? '가입 중...' : '회원가입'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <p className="auth-link">
                    이미 계정이 있으신가요? <a href="/login">로그인</a>
                </p>
            </div>
        </div>
    );
}