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

  // ✅ [수정] 메모리에 남아있는 주문들로만 총 금액 계산
  // 이제 리스트에서 삭제되면 이 값도 자동으로 즉시 줄어듭니다.
  const totalAmount = orders.reduce((acc, cur) => acc + cur.totalPrice, 0);

  // ✅ [수정] 주문 삭제 처리 로직
  const handleCancel = async (orderId) => {
    if (!window.confirm("정말 주문을 취소하시겠습니까? 취소 시 목록에서 완전히 삭제됩니다.")) return;
    try {
      // 1. 서버에 삭제(Delete) 요청 (기존 patch에서 변경)
      await api.delete(`/orders/${orderId}`);

      alert("주문이 취소(삭제)되었습니다.");

      // 2. ✅ 핵심: 화면 메모리(State)에서 즉시 제거
      // 서버에서 다시 데이터를 받아오지 않아도 화면이 즉시 갱신되며 총액이 정상화됩니다.
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

    } catch (err) {
      console.error(err);
      alert("취소 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

      {/* 1️⃣ 제목 및 상단 버튼 */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', color: '#333' }}>📜 내 주문 관리</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/')} style={navBtnStyle}>🏠 홈으로</button>
          <button onClick={() => navigate('/products')} style={{...navBtnStyle, backgroundColor: '#00c73c', color: 'white', border: 'none'}}>계속 쇼핑하기</button>
        </div>
      </div>

      {/* 2️⃣ 총 결제 금액 요약 섹션 */}
      <div style={{ backgroundColor: '#fdfdfd', border: '1px solid #eee', borderRadius: '15px', padding: '25px', marginBottom: '30px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <p style={{ margin: 0, color: '#888', fontSize: '1rem' }}>현재 보유 중인 총 주문 금액</p>
        <h2 style={{ margin: '10px 0 0 0', color: '#27ae60', fontSize: '2rem' }}>{totalAmount.toLocaleString()}원</h2>
      </div>

      {/* 3️⃣ 주문 내역 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} style={{
              border: '1px solid #efefef',
              padding: '20px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff' // 삭제할 것이므로 취소 상태 배경은 제거
            }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{order.productName}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                  {new Date(order.orderDate).toLocaleDateString()} | {order.quantity}개
                </p>
                <span style={{
                  display: 'inline-block', marginTop: '10px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                  backgroundColor: '#e8f5e9', color: '#2e7d32'
                }}>
                  결제완료
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 10px 0', color: '#333' }}>
                  {order.totalPrice.toLocaleString()}원
                </p>
                <button
                    onClick={() => handleCancel(order.id)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ff4d4f', color: '#ff4d4f', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                    취소하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#bbb', padding: '50px' }}>주문 내역이 비어 있습니다.</div>
        )}
      </div>
    </div>
  );
};

const navBtnStyle = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default OrderListPage;