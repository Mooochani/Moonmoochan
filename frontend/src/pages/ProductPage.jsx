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
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("상품 로딩 에러:", error);
        setLoading(false);
      });
  }, []);

  const handleOrder = async (productId) => {
    if (!window.confirm("이 상품을 구매하시겠습니까?")) return;

    try {
      await api.post('/orders', {
        productId: productId,
        quantity: 1
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
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>

      {/* 1️⃣ 최상단 제목 */}
      <h1 style={{ marginBottom: '40px', color: '#333', fontWeight: 'bold' }}>📦 전체 상품 목록</h1>

      {/* 2️⃣ 상품 리스트 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '25px',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '50px'
      }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{
              border: '1px solid #eee',
              borderRadius: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden', // 이미지가 튀어나오지 않게 설정
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* ✅ 이미지 영역 추가 */}
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/260x180?text=No+Image'; }} // 이미지 로드 실패 시 대체
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.9rem' }}>
                    이미지 준비중
                  </div>
                )}
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </h3>

                <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 10px 0' }}>
                  {product.price.toLocaleString()}원
                </p>

                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {product.description}
                </p>

                <button
                  onClick={() => handleOrder(product.id)}
                  style={{
                    backgroundColor: '#00c73c',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    marginTop: 'auto' // 버튼을 항상 하단에 고정
                  }}
                >
                  구매하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>등록된 상품이 없습니다.</p>
        )}
      </div>

      {/* 3️⃣ 최하단 홈으로 가기 버튼 */}
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 40px',
          borderRadius: '30px',
          border: '1px solid #00c73c',
          cursor: 'pointer',
          backgroundColor: '#fff',
          color: '#00c73c',
          fontSize: '1rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        🏠 메인 화면으로 돌아가기
      </button>

    </div>
  );
};

export default ProductPage;