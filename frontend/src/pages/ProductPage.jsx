import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const navigate = useNavigate();

  // 사용자님이 말씀하신 3가지 카테고리 + 전체보기
  const categories = ['전체', '가전', '의류', '식품'];

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);

        // 수량 초기화
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

  // 카테고리가 바뀔 때마다 필터링 실행
  useEffect(() => {
    if (selectedCategory === '전체') {
      setFilteredProducts(products);
    } else {
      // 엔티티의 category 필드와 선택된 카테고리명을 비교
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

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
      await api.post('/orders', { productId, quantity });
      alert("주문이 성공적으로 완료되었습니다! 🎉");
      navigate('/orders');
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div style={{ padding: '20px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

      <h1 style={{ marginBottom: '20px', color: '#333', fontWeight: 'bold', fontSize: '1.6rem' }}>📦 상품 목록</h1>

      {/* ✅ 상단 카테고리 탭 바 (모바일 앱 스타일) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        padding: '12px 10px',
        borderRadius: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '450px',
        marginBottom: '25px',
        position: 'sticky',
        top: '10px',
        zIndex: 100
      }}>
        {categories.map(cat => (
          <div
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              cursor: 'pointer',
              padding: '5px 15px',
              fontSize: '1rem',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
              color: selectedCategory === cat ? '#00c73c' : '#888',
              borderBottom: selectedCategory === cat ? '3px solid #00c73c' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* 상품 카드 리스트 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr', // 친구들 폰에서 크게 보이도록 1열 고정
        gap: '20px',
        width: '100%',
        maxWidth: '450px',
        marginBottom: '40px'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} style={cardStyle}>
              <div style={{ width: '100%', height: '220px', backgroundColor: '#eee' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>이미지 준비중</div>
                )}
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#333' }}>{product.name}</h4>
                <p style={{ color: '#00c73c', fontWeight: 'bold', fontSize: '1.5rem', margin: '5px 0' }}>{product.price.toLocaleString()}원</p>

                {/* ✅ 수량 버튼: 흰색 기호 + 네이버 그린 배경 유지 */}
                <div style={qtySectionStyle}>
                  <button type="button" onClick={() => updateQuantity(product.id, -1)} style={qtyBtnStyle}>-</button>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '40px' }}>{quantities[product.id] || 1}</span>
                  <button type="button" onClick={() => updateQuantity(product.id, 1)} style={qtyBtnStyle}>+</button>
                </div>

                <button onClick={() => handleOrder(product.id, product.name)} style={orderBtnStyle}>구매하기</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <p>현재 '{selectedCategory}' 카테고리에</p>
            <p>등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>

      <button onClick={() => navigate('/')} style={homeBtnStyle}>🏠 홈으로</button>
    </div>
  );
};

// 스타일 컴포넌트들
const cardStyle = {
  borderRadius: '20px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
};

const qtySectionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  margin: '15px 0',
  padding: '10px 0',
  borderTop: '1px solid #f8f8f8'
};

const qtyBtnStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#00c73c',
  color: '#ffffff', // ✅ 기호 흰색 고정
  fontSize: '1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const orderBtnStyle = {
  backgroundColor: '#00c73c',
  color: 'white',
  border: 'none',
  padding: '15px',
  borderRadius: '12px',
  cursor: 'pointer',
  width: '100%',
  fontWeight: 'bold',
  fontSize: '1rem'
};

const homeBtnStyle = {
  padding: '14px 40px',
  borderRadius: '30px',
  border: 'none',
  backgroundColor: '#333',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '20px'
};

export default ProductPage;