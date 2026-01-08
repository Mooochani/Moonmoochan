import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(response => {
        // ✅ 각 상품 객체에 선택 수량(selectedQuantity) 상태 초기값 1 추가
        const productsWithQuantity = response.data.map(p => ({ ...p, selectedQuantity: 1 }));
        setProducts(productsWithQuantity);
        setLoading(false);
      })
      .catch(error => {
        console.error("상품 로딩 에러:", error);
        setLoading(false);
      });
  }, []);

  // ✅ 수량 조절 함수 (음수 방지 포함)
  const updateQuantity = (productId, delta) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const newQty = p.selectedQuantity + delta;
          return { ...p, selectedQuantity: newQty < 1 ? 1 : newQty };
        }
        return p;
      })
    );
  };

  const handleOrder = async (product) => {
    if (!window.confirm(`${product.name} 상품 ${product.selectedQuantity}개를 구매하시겠습니까?`)) return;

    try {
      await api.post('/orders', {
        productId: product.id,
        quantity: product.selectedQuantity // ✅ 선택된 수량 전송
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1100px',
        marginBottom: '50px'
      }}>
        {products.length > 0 ? (
          products.map(product => (
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
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '2px solid #00c73c';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid #ddd';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f8f9fa' }}>
                <img
                  src={product.imageUrl || 'https://placehold.co/260x180?text=No+Image'}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>{product.name}</h4>
                <p style={{ color: '#00c73c', fontWeight: 'bold', fontSize: '1.3rem', margin: '5px 0' }}>
                  {product.price.toLocaleString()}원
                </p>

                {/* ✅ 수량 조절 UI 추가 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    margin: '15px 0',
                    backgroundColor: '#f1f3f5',
                    padding: '8px',
                    borderRadius: '8px'
                }}>
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    style={{ border: 'none', background: '#dee2e6', borderRadius: '4px', width: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                  >-</button>
                  <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{product.selectedQuantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    style={{ border: 'none', background: '#dee2e6', borderRadius: '4px', width: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                  >+</button>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                    총 합계: <strong>{(product.price * product.selectedQuantity).toLocaleString()}원</strong>
                </p>

                <button
                  onClick={() => handleOrder(product)}
                  style={{
                    backgroundColor: '#00c73c',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  {product.selectedQuantity}개 구매하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', gridColumn: '1 / -1' }}>등록된 상품이 없습니다.</p>
        )}
      </div>

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
      >
        🏠 홈으로 돌아가기
      </button>

    </div>
  );
};

export default ProductPage;