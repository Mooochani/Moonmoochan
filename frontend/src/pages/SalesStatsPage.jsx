import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios'; // ❌ 삭제
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // ✅ 추가: 공통 API 설정 사용

const SalesStatsPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'SELLER') {
            alert("⚠️ 판매자 전용 페이지입니다. 구매자는 접근할 수 없습니다.");
            navigate('/');
            return;
        }

        // ✅ 수정: api 객체를 사용하여 서버 IP(13.236.117.206)를 자동으로 참조하게 함
        api.get('/sales/stats')
            .then(response => {
                setStats(response.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 로딩 에러:", error);
                setLoading(false);
            });
    }, [user, navigate]);

    const totalRevenue = useMemo(() => {
        return stats.reduce((acc, curr) => acc + (Number(curr.totalSales) || 0), 0);
    }, [stats]);

    if (!user || user.role !== 'SELLER') {
        return null;
    }

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>📊 판매 통계 대시보드</h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        textAlign: 'center',
                        width: '100%',
                        borderTop: '6px solid #00c73c'
                    }}>
                        <p style={{ color: '#7f8c8d', fontSize: '18px', marginBottom: '10px' }}>총 누적 매출액</p>
                        <h1 style={{ color: '#27ae60', margin: '0', fontSize: '42px', fontWeight: 'bold' }}>
                            {loading ? "계산 중..." : `${totalRevenue.toLocaleString()}원`}
                        </h1>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #edf2f7' }}>
                                <th style={{ padding: '18px', color: '#4a5568' }}>상품명</th>
                                <th style={{ padding: '18px', color: '#4a5568' }}>수량</th>
                                <th style={{ padding: '18px', color: '#4a5568' }}>합계 금액</th>
                                <th style={{ padding: '18px', color: '#4a5568' }}>평균 별점</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && stats.length > 0 ? (
                                stats.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f1f1f1', textAlign: 'center' }}>
                                        <td style={{ padding: '18px', fontWeight: '500', textAlign: 'left', paddingLeft: '30px' }}>{item.productName}</td>
                                        <td style={{ padding: '18px' }}>{item.totalQuantity}개</td>
                                        <td style={{ padding: '18px', color: '#e74c3c', fontWeight: 'bold' }}>{(item.totalSales || 0).toLocaleString()}원</td>
                                        <td style={{ padding: '18px', color: '#f1c40f' }}>★ {item.averageRating?.toFixed(1) || '0.0'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                        {loading ? "데이터를 불러오는 중입니다..." : "판매 데이터가 없습니다."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 40px',
                            backgroundColor: '#2c3e50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                        }}
                    >
                        🏠 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesStatsPage;