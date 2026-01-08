import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/AuthPages.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // 1️⃣ 상태 관리 (role 필드 추가)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'CUSTOMER' // 초기값은 고객(CUSTOMER)
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
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // ✅ role을 인자에 추가하여 전송
            const response = await authService.signup(
                formData.email,
                formData.password,
                formData.name,
                formData.role
            );

            const { token, userId, email, name, role } = response.data;
            console.log('✅ 회원가입 성공:', { userId, email, name, role });

            // ✅ AuthContext에 역할(role) 정보까지 포함하여 저장
            login({ userId, email, name, role }, token);

            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.message || '회원가입 실패했습니다.';
            console.error('❌ 회원가입 실패:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>회원가입</h1>

                {error && <div className="error-message">{error}</div>}

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

                    {/* ✅ 가입 유형 선택 (추가된 섹션) */}
                    <div className="form-group">
                        <label>가입 유형</label>
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            marginTop: '8px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="CUSTOMER"
                                    checked={formData.role === 'CUSTOMER'}
                                    onChange={handleChange}
                                /> 구매자
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="SELLER"
                                    checked={formData.role === 'SELLER'}
                                    onChange={handleChange}
                                /> 판매자
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? '가입 중...' : '회원가입'}
                    </button>
                </form>

                <p className="auth-link">
                    이미 계정이 있으신가요? <a href="/login">로그인</a>
                </p>
            </div>
        </div>
    );
}