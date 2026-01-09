import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css'; // index.css와 연결 확인

export default function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content">
                    <h1>🛒 영무마켓</h1>
                    <div className="header-right">
                        <span className="user-name">👤 {user?.name}님</span>
                        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
                    </div>
                </div>
            </header>

            <main className="home-main">
                {/* 상단 배너 섹션: 이미지가 깨지지 않게 index.css의 클래스 적용 */}
                <div className="banner-section">
                    <img
                        src="https://media.istockphoto.com/id/1414566120/ko/%EC%82%AC%EC%A7%84/%ED%95%9C%EA%B5%AD-%EC%9D%8C%EC%8B%9D-%EB%A7%A4%EC%9A%B4-%EB%8B%AD%EA%B3%A0%EA%B8%B0%EC%99%80-%EC%95%BC%EC%B1%84-%EC%8A%A4%ED%8A%9C.jpg?s=1024x1024&w=is&k=20&c=9CVgGGcVkjEPorPCx35-oKike9zSn4ZFxwmOa7u84ck="
                        alt="메인 배너"
                        className="main-banner-img"
                    />
                </div>

                <div className="welcome-section">
                    <h2>환영합니다! 👋</h2>
                    <p className="welcome-subtitle">YM MARKET 플랫폼에 오신 것을 환영합니다.</p>
                </div>

                <div className="features-section">
                    <h3>📋 주요 기능</h3>
                    <div className="features-grid">
                        <div className="feature-card" onClick={() => navigate('/products')}>
                            <div className="icon">🛍️</div>
                            <h4>상품 조회</h4>
                            <p>전체 상품 확인</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/orders')}>
                            <div className="icon">📦</div>
                            <h4>주문 관리</h4>
                            <p>주문 현황 확인</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/sales-stats')}>
                            <div className="icon">💰</div>
                            <h4>판매 통계</h4>
                            <p>수익 실적 확인</p>
                        </div>
                        <div className="feature-card" onClick={() => navigate('/review-management')}>
                            <div className="icon">⭐</div>
                            <h4>리뷰 관리</h4>
                            <p>고객 리얼 리뷰</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="home-footer">
                <p>© 2026 YM MARKET.</p>
            </footer>
        </div>
    );
}