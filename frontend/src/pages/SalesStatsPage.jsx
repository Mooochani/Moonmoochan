import React, { useEffect, useState, useMemo } from 'react'; // ✅ useMemo 추가
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalesStatsPage = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/sales/stats')
            .then(response => {
                setStats(response.data || []);
                setLoading(false); // 데이터 로드 완료
            })
            .catch(error => {
                console.error("데이터 로딩 에러:", error);
                setLoading(false);
            });
    }, []);

    // ✅ useMemo를 사용하여 stats가 변경될 때만 합계를 다시 계산합니다.
    // 처음 진입 시 0원이 잠깐 뜨는 현상을 방지하고 최신 데이터를 보장합니다.
    const totalRevenue = useMemo(() => {
        return stats.reduce((acc, curr) => acc + (Number(curr.totalSales) || 0), 0);
    }, [stats]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>📊 판매 통계 대시보드</h2>

                {/* 총 매출액 카드 */}
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
                            {/* 로딩 중일 때는 '계산 중...' 혹은 '-' 표시 */}
                            {loading ? "계산 중..." : `${totalRevenue.toLocaleString()}원`}
                        </h1>
                    </div>
                </div>

                {/* 상세 내역 테이블 */}
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
                                        <td style={{ padding: '18px', color: '#e74c3c', fontWeight: 'bold' }}>{item.totalSales.toLocaleString()}원</td>
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

                {/* 홈으로 가기 버튼 */}
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