import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      })
      .catch(error => {
        console.error("상품 로딩 에러:", error);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleOrder = async (productId, productName) => {
    const quantity = quantities[productId] || 1;
    if (!window.confirm(`${productName} ${quantity}개를 구매하시겠습니까?`)) return;

    try {
      await api.post('/orders', {
        productId: productId,
        quantity: quantity
      });

      alert("주문이 성공적으로 완료되었습니다! 🎉");
      navigate('/orders');
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff' }}>
      <h1 style={{ marginBottom: '40px', color: '#333', fontWeight: 'bold', fontSize: '2rem' }}>📦 전체 상품 목록</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1100px',
        marginBottom: '50px'
      }}>
        {products.map(product => (
          <div key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '100%', height: '180px', backgroundColor: '#f8f9fa' }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>이미지 준비중</div>
              )}
            </div>

            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>{product.name}</h4>
              <p style={{ color: '#00c73c', fontWeight: 'bold', fontSize: '1.3rem', margin: '5px 0' }}>{product.price.toLocaleString()}원</p>

              {/* ✅ 수량 조절 섹션: 기호 색상을 흰색(#fff)으로 설정 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '15px 0', padding: '10px', borderTop: '1px solid #eee' }}>
                <button type="button" onClick={() => updateQuantity(product.id, -1)} style={qtyBtnStyle}>-</button>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{quantities[product.id] || 1}</span>
                <button type="button" onClick={() => updateQuantity(product.id, 1)} style={qtyBtnStyle}>+</button>
              </div>

              <button
                onClick={() => handleOrder(product.id, product.name)}
                style={{
                  backgroundColor: '#00c73c',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 'bold'
                }}
              >
                구매하기
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} style={{ padding: '12px 40px', borderRadius: '30px', border: '2px solid #00c73c', cursor: 'pointer', backgroundColor: '#fff', color: '#00c73c', fontWeight: 'bold' }}>
        🏠 홈으로 돌아가기
      </button>
    </div>
  );
};

// ✅ 버튼 스타일: 배경은 네이버 그린, 기호는 흰색(#fff)
const qtyBtnStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#00c73c',
  color: '#ffffff', // 기호를 흰색으로 설정
  fontSize: '1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  lineHeight: '0'
};

export default ProductPage;