import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.get('/orders/my')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("주문 내역 로딩 실패:", err);
        setLoading(false);
      });
  };

  const totalAmount = orders.reduce((acc, cur) => acc + cur.totalPrice, 0);

  const handleCancel = async (orderId) => {
    if (!window.confirm("정말 주문을 취소하시겠습니까? 취소 시 목록에서 완전히 삭제됩니다.")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      alert("주문이 취소(삭제)되었습니다.");
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error(err);
      alert("취소 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* 1️⃣ 제목 섹션 (버튼을 제거하고 제목만 남김) */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', fontWeight: 'bold' }}>📜 내 주문 관리</h1>
      </div>

      {/* 2️⃣ 총 결제 금액 요약 */}
      <div style={{
        backgroundColor: '#fcfcfc',
        border: '1px solid #eee',
        borderRadius: '20px',
        padding: '35px',
        marginBottom: '50px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <p style={{ margin: 0, color: '#888', fontSize: '1.1rem', fontWeight: '500' }}>현재 보유하고 있는 전체 주문 금액</p>
        <h2 style={{ margin: '15px 0 0 0', color: '#00c73c', fontSize: '2.8rem', fontWeight: 'bold' }}>
          {totalAmount.toLocaleString()}원
        </h2>
      </div>

      {/* 3️⃣ 주문 내역 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id}
              style={{
                border: '1px solid #eee',
                padding: '25px 30px',
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00c73c';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,199,60,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#eee';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#333' }}>{order.productName}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#999' }}>
                  📅 {new Date(order.orderDate).toLocaleDateString()} | 📦 {order.quantity}개
                </p>
                <span style={{
                  display: 'inline-block', marginTop: '15px', padding: '5px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 'bold',
                  backgroundColor: '#e8f5e9', color: '#00c73c', border: '1px solid #00c73c'
                }}>
                  결제완료
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: '0 0 15px 0', color: '#333' }}>
                  {order.totalPrice.toLocaleString()}원
                </p>
                <button
                    onClick={() => handleCancel(order.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: '1px solid #ff4d4f',
                      color: '#ff4d4f',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff4d4f';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.color = '#ff4d4f';
                    }}
                >
                    취소하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#bbb', padding: '100px', fontSize: '1.1rem' }}>
            입금 확인된 주문 내역이 없습니다.
          </div>
        )}
      </div>

      {/* 4️⃣ 하단 이동 버튼 (가장 밑으로 이동됨) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <button
            onClick={() => navigate('/')}
            style={navBtnStyle}
            onMouseEnter={(e) => e.target.style.borderColor = '#00c73c'}
            onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
          >🏠 홈으로 돌아가기</button>
          <button
            onClick={() => navigate('/products')}
            style={{...navBtnStyle, backgroundColor: '#00c73c', color: 'white', border: 'none'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#00ab33'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#00c73c'}
          >🛍️ 계속 쇼핑하기</button>
      </div>

    </div>
  );
};

const navBtnStyle = {
  padding: '15px 35px',
  borderRadius: '12px',
  border: '2px solid #eee',
  backgroundColor: '#fff',
  color: '#666',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.2s'
};

export default OrderListPage;