import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReviewManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const navigate = useNavigate();

    // ... (기본 useEffect 및 함수 로직은 이전과 동일) ...
    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedProductId) fetchReviews(selectedProductId);
    }, [selectedProductId]);

    const fetchReviews = (productId) => {
        api.get(`/reviews/product/${productId}`).then(res => setReviews(res.data)).catch(err => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = { productId: selectedProductId, content, rating };
        api.post('/reviews', reviewData).then(() => {
            alert("리뷰 등록 완료!");
            setContent('');
            fetchReviews(selectedProductId);
        });
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            fetchReviews(selectedProductId);
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>

                {/* (상단에 있던 버튼은 삭제했습니다) */}
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>✍️ 상품 리뷰 관리</h2>

                <form onSubmit={handleSubmit} style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
                    {/* ... (상품 선택, 별점, 리뷰 내용 폼 생략) ... */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 선택</label>
                        <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <option value="">상품을 선택하세요</option>
                            {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>별점</label>
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            {[5, 4, 3, 2, 1].map(num => (<option key={num} value={num}>{num}점 {"⭐".repeat(num)}</option>))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>리뷰 내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="리뷰를 남겨주세요." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', resize: 'none' }} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#00c73c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>리뷰 등록하기</button>
                </form>

                <div>
                    <h3 style={{ marginBottom: '20px' }}>최근 리뷰 ({reviews.length}개)</h3>
                    {reviews.map(r => (
                        <div key={r.id} style={{ padding: '20px', borderBottom: '1px solid #f1f1f1', backgroundColor: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong style={{ color: '#333' }}>{r.userName}</strong>
                                <span style={{ color: '#f1c40f' }}>{"⭐".repeat(r.rating)}</span>
                            </div>
                            <p style={{ margin: '0 0 10px 0', color: '#555', lineHeight: '1.5' }}>{r.content}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleDeleteReview(r.id)} style={{ color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer' }}>삭제</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ [추가] 홈으로 돌아가기 버튼을 맨 하단으로 이동 */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#6c757d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        🏠 홈으로 돌아가기
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReviewManagementPage;