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
    if (!window.confirm("정말 주문을 취소하시겠습니까?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      alert("주문이 취소되었습니다.");
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error(err);
      alert("취소 처리 중 오류 발생");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>📜 내 주문 관리</h1>

      <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '20px', padding: '35px', marginBottom: '50px', textAlign: 'center' }}>
        <p style={{ color: '#888' }}>총 결제 금액</p>
        <h2 style={{ color: '#00c73c', fontSize: '2.8rem' }}>{totalAmount.toLocaleString()}원</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.length > 0 ? (
          orders.map(order => {
            // ✅ 필드명 불일치 방지를 위한 방어 로직
            const pId = order.productId || (order.product && order.product.id);

            return (
              <div key={order.id} style={orderCardStyle}>
                <div>
                  <h3>{order.productName || (order.product && order.product.name)}</h3>
                  <p style={{ color: '#999' }}>
                    📅 {new Date(order.orderDate).toLocaleDateString()} | 📦 {order.quantity}개
                  </p>
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <span style={statusBadgeStyle}>결제완료</span>
                    <button
                      onClick={() => {
                        if(!pId) return alert("상품 정보를 찾을 수 없습니다.");
                        navigate(`/review-management?productId=${pId}&orderId=${order.id}`);
                      }}
                      style={reviewBtnStyle}
                    >✍️ 리뷰 쓰기</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{order.totalPrice.toLocaleString()}원</p>
                  <button onClick={() => handleCancel(order.id)} style={cancelBtnStyle}>취소하기</button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: '#bbb' }}>주문 내역이 없습니다.</p>
        )}
      </div>
            {/* 3️⃣ 최하단 홈으로 가기 버튼 (HomePage 디자인 통일) */}
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 40px',
                borderRadius: '30px',
                border: '2px solid #00c73c',
                cursor: 'pointer',
                backgroundColor: '#fff',
                color: '#00c73c',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00c73c';
                  e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#00c73c';
              }}
            >
              🏠 홈으로 돌아가기
            </button>
    </div>
  );
};

// 스타일 (간략화)
const orderCardStyle = { border: '1px solid #eee', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statusBadgeStyle = { padding: '5px 12px', borderRadius: '30px', fontSize: '0.8rem', backgroundColor: '#e8f5e9', color: '#00c73c', border: '1px solid #00c73c' };
const reviewBtnStyle = { padding: '5px 15px', borderRadius: '30px', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #007bff', color: '#007bff' };
const cancelBtnStyle = { padding: '8px 18px', borderRadius: '8px', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer', backgroundColor: '#fff' };

export default OrderListPage;