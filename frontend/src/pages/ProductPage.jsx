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
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff' }}>

      {/* 1️⃣ 최상단 제목 (HomePage의 폰트 스타일 유지) */}
      <h1 style={{ marginBottom: '40px', color: '#333', fontWeight: 'bold', fontSize: '2rem' }}>📦 전체 상품 목록</h1>

      {/* 2️⃣ 상품 리스트 (HomePage의 features-grid 레이아웃 방식 적용) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', // 그리드 방식 통일
        gap: '20px',
        width: '100%',
        maxWidth: '1100px',
        marginBottom: '50px'
      }}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id}
              style={{
                border: '1px solid #ddd', // 기본은 연한 테두리
                padding: '0', // 이미지를 꽉 채우기 위해 0으로 변경
                borderRadius: '12px',
                backgroundColor: '#fff',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '2px solid #00c73c'; // Hover 시 네이버 그린
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid #ddd';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* 상품 이미지 영역 */}
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f8f9fa' }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/260x180?text=No+Image';
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    이미지 준비중
                  </div>
                )}
              </div>

              {/* 상품 정보 영역 (HomePage의 텍스트 정렬 스타일 반영) */}
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>{product.name}</h4>
                <p style={{ color: '#00c73c', fontWeight: 'bold', fontSize: '1.3rem', margin: '5px 0' }}>
                  {product.price.toLocaleString()}원
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>
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
                    fontSize: '1rem'
                  }}
                >
                  구매하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', gridColumn: '1 / -1' }}>등록된 상품이 없습니다.</p>
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

export default ProductPage;