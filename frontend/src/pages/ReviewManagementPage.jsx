import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("상품 로딩 실패", err));
    }, []);

    useEffect(() => {
        if (selectedProductId) {
            fetchReviews(selectedProductId);
        }
    }, [selectedProductId]);

    const fetchReviews = (productId) => {
        axios.get(`http://localhost:8080/api/reviews/product/${productId}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("리뷰 로딩 실패", err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProductId) return alert("상품을 선택해주세요.");

        const reviewData = {
            productId: selectedProductId,
            userId: 1, // 실제 로그인 정보 연동 필요
            content: content,
            rating: rating
        };

        axios.post('http://localhost:8080/api/reviews', reviewData)
            .then(() => {
                alert("리뷰가 등록되었습니다!");
                setContent('');
                fetchReviews(selectedProductId);
            })
            .catch(err => alert("리뷰 등록 중 오류가 발생했습니다."));
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return navigate('/login');
        }

        try {
            await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("리뷰가 삭제되었습니다.");
            fetchReviews(selectedProductId);
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
            if (error.response && error.response.status === 403) {
                alert("본인이 작성한 리뷰만 삭제할 수 있습니다.");
            } else {
                alert("리뷰 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>✍️ 상품 리뷰 관리</h2>

                <form onSubmit={handleSubmit} style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 선택</label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="">상품을 선택하세요</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>별점</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num}점 {"⭐".repeat(num)}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>리뷰 내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="상품에 대한 솔직한 평을 남겨주세요."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', resize: 'none' }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#00c73c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                        리뷰 등록하기
                    </button>
                </form>

                <div>
                    <h3 style={{ marginBottom: '20px' }}>최근 리뷰 ({reviews.length}개)</h3>
                    {reviews.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>아직 등록된 리뷰가 없습니다.</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r.id} style={{
                                padding: '20px',
                                borderBottom: '1px solid #f1f1f1',
                                position: 'relative', // ✅ 버튼 배치를 위해 추가
                                backgroundColor: '#fff'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <strong style={{ color: '#333' }}>{r.userName}</strong>
                                    <span style={{ color: '#f1c40f' }}>{"⭐".repeat(r.rating)}</span>
                                </div>
                                <p style={{ margin: '0 0 10px 0', color: '#555', lineHeight: '1.5' }}>{r.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <small style={{ color: '#aaa' }}>{new Date(r.createdAt).toLocaleDateString()}</small>

                                    {/* ✅ 정상화된 삭제 버튼 */}
                                    <button
                                        onClick={() => handleDeleteReview(r.id)}
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#ff4d4f',
                                            border: '1px solid #ff4d4f',
                                            borderRadius: '4px',
                                            padding: '4px 12px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#ff4d4f'; e.target.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#ff4d4f'; }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: '1px solid #ddd',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            color: '#888',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewManagementPage;