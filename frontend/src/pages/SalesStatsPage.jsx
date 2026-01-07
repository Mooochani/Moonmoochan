import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesStatsPage = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        // 백엔드 API 호출
        axios.get('http://localhost:8080/api/sales/stats')
            .then(response => {
                console.log("받은 데이터:", response.data); // 데이터 구조 확인용
                setStats(response.data);
            })
            .catch(error => {
                console.error("데이터 로딩 에러:", error);
            });
    }, []);

    // ✅ 수정된 부분: totalSales를 합산하여 총 매출액을 계산합니다.
    const totalRevenue = stats.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);

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
                            {totalRevenue.toLocaleString()}원
                        </h1>
                    </div>
                </div>

                {/* 상세 내역 테이블 */}
                <div style={{ backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
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
                            {stats.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f1f1f1', textAlign: 'center' }}>
                                    <td style={{ padding: '18px', fontWeight: '500', textAlign: 'left', paddingLeft: '30px' }}>{item.productName}</td>
                                    <td style={{ padding: '18px' }}>{item.totalQuantity}개</td>
                                    <td style={{ padding: '18px', color: '#e74c3c', fontWeight: 'bold' }}>{item.totalSales.toLocaleString()}원</td>
                                    <td style={{ padding: '18px', color: '#f1c40f' }}>★ {item.averageRating?.toFixed(1) || '0.0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesStatsPage;