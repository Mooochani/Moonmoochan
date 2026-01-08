import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewManagementPage = () => {
    const [products, setProducts] = useState([]); // 상품 목록
    const [selectedProductId, setSelectedProductId] = useState(''); // 선택된 상품
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [content, setContent] = useState(''); // 리뷰 내용
    const [rating, setRating] = useState(5); // 별점 (기본 5점)
    const navigate = useNavigate();

    // 1. 상품 목록 가져오기 (리뷰를 쓸 상품 선택용)
    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("상품 로딩 실패", err));
    }, []);

    // 2. 특정 상품 선택 시 해당 리뷰 목록 가져오기
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

    // 3. 리뷰 등록 제출
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProductId) return alert("상품을 선택해주세요.");

        // 현재 로그인한 사용자 정보 (localStorage 등에 저장된 ID 사용 가정)
        // 테스트를 위해 일단 userId: 1로 설정 (실제 환경에선 로그인 정보 연동 필요)
        const reviewData = {
            productId: selectedProductId,
            userId: 1,
            content: content,
            rating: rating
        };

    axios.post('http://localhost:8080/api/reviews', reviewData)
            .then(() => {
                alert("리뷰가 등록되었습니다!");
                setContent('');
                fetchReviews(selectedProductId);
            })
            .catch(err => {
                // ✅ 서버에서 보낸 에러 메시지(구매 여부 등)를 사용자에게 노출
                const errorMessage = err.response?.data?.message || "리뷰 등록 중 오류가 발생했습니다.";
                alert(errorMessage);
            });
    };
    // ✅ 4. 리뷰 삭제 (취소) 기능 추가
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
            fetchReviews(selectedProductId); // 목록 새로고침
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
                <h2 style={{ textAlign: 'center', color: '#333' }}>✍️ 상품 리뷰 관리</h2>

                {/* 상품 선택 및 작성 폼 */}
                <form onSubmit={handleSubmit} style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 선택</label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
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
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
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
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px' }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00c73c', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        리뷰 등록하기
                    </button>
                </form>

                {/* 리뷰 목록 영역 */}
                <div>
                    <h3>최근 리뷰 ({reviews.length}개)</h3>
                    {reviews.length === 0 ? (
                        <p style={{ color: '#999' }}>아직 등록된 리뷰가 없습니다.</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r.id} style={{ padding: '15px', borderBottom: '1px solid #f1f1f1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <strong style={{ color: '#007bff' }}>{r.userName}</strong>
                                    <span style={{ color: '#f1c40f' }}>{"⭐".repeat(r.rating)}</span>
                                </div>
                                <p style={{ margin: '5px 0', color: '#555' }}>{r.content}</p>
                                <small style={{ color: '#aaa' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                                {/* ✅ 삭제 버튼 추가 */}
                                <button
                                    onClick={() => handleDeleteReview(r.id)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        bottom: '15px',
                                        backgroundColor: '#ff4d4d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '5px 10px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewManagementPage;