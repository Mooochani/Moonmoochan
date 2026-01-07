import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
        console.log('✅ 로그아웃 완료');
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content">
                    <h1>🛒 네이버 쇼핑커머스</h1>
                    <div className="header-right">
                        <span className="user-name">
                            👤 {user?.name}님 환영합니다!
                        </span>
                        <button className="logout-btn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            <main className="home-main">
                <div className="welcome-section">
                    <h2>환영합니다! 👋</h2>
                    <p className="welcome-subtitle">네이버 쇼핑커머스 플랫폼에 로그인했습니다.</p>
                    <div className="user-info-card">
                        <p><strong>이름:</strong> {user?.name}</p>
                        <p><strong>이메일:</strong> {user?.email}</p>
                        <p><strong>사용자 ID:</strong> {user?.userId}</p>
                        <p><strong>로그인 상태:</strong> ✅ 인증됨</p>
                    </div>
                </div>

                <div className="features-section">
                    <h3>📋 주요 기능</h3>
                    <div className="features-grid">
                        <div
                            className="feature-card"
                            onClick={() => navigate('/products')}
                            style={{ cursor: 'pointer', border: '2px solid #00c73c' }}
                        >
                            <h4>🛍️ 상품 조회</h4>
                            <p>판매 중인 모든 상품을 확인하세요</p>
                        </div>
                        {/* ✅ 수정: 주문 관리 카드 클릭 시 이동 로직 추가 */}
                        <div
                            className="feature-card"
                            onClick={() => navigate('/orders')}
                            style={{ cursor: 'pointer', border: '1px solid #ddd' }}
                        >
                            <h4>📦 주문 관리</h4>
                            <p>구매한 상품의 주문 현황을 확인하세요</p>
                        </div>
                        <div className="feature-card">
                            <h4>💰 판매 통계</h4>
                            <p>판매자라면 판매 통계를 확인하세요</p>
                        </div>
                        <div className="feature-card">
                            <h4>⭐ 리뷰 관리</h4>
                            <p>구매자 리뷰를 작성하고 관리하세요</p>
                        </div>
                    </div>
                </div>

                <div className="day2-section">
                    <h3>🎯 진행 현황</h3>
                    <ul className="day2-list">
                        <li>✅ <strong>회원가입 & 로그인</strong> (완료)</li>
                        <li>✅ <strong>상품 목록 페이지 연결</strong> (완료)</li>
                        <li>✅ <strong>주문 내역 조회</strong> (완료)</li>
                        <li>⏳ 주문 상태 관리 (진행 예정)</li>
                    </ul>
                </div>
            </main>

            <footer className="home-footer">
                <p>© 2026 네이버 쇼핑커머스. All rights reserved.</p>
            </footer>
        </div>
    );
}