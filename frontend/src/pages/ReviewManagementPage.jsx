import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ReviewManagementPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const productIdFromUrl = queryParams.get('productId');
    const orderIdFromUrl = queryParams.get('orderId');

    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchReviews();
    }, [productIdFromUrl]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("상품 목록 로딩 실패", err);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            let res;
            // productId가 URL에 있으면 특정 상품 조회, 없으면 전체 조회
            if (productIdFromUrl && productIdFromUrl !== 'undefined') {
                res = await api.get(`/reviews/product/${productIdFromUrl}`);
            } else {
                res = await api.get('/reviews');
            }
            setReviews(res.data);
        } catch (err) {
            console.error("리뷰 로딩 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProductChange = (e) => {
        const selectedId = e.target.value;
        // 필터 변경 시 orderId는 제거하고 productId만 유지하여 이동
        if (selectedId) {
            navigate(`/review-management?productId=${selectedId}`);
        } else {
            navigate(`/review-management`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 로직 점검: orderId가 없으면 백엔드에서 에러가 나므로 원천 차단
        if (!orderIdFromUrl || orderIdFromUrl === 'undefined') {
            return alert("주문 정보를 찾을 수 없습니다. 마이페이지에서 리뷰 작성을 시도해주세요.");
        }
        if (!content.trim()) return alert("리뷰 내용을 입력해주세요.");

        const reviewData = {
            productId: Number(productIdFromUrl),
            orderId: Number(orderIdFromUrl), // 이제 확실히 존재할 때만 실행됨
            content: content,
            rating: rating
        };

        try {
            await api.post('/reviews', reviewData);
            alert("리뷰가 등록되었습니다!");
            // 등록 후에는 '작성 모드'를 종료하기 위해 orderId 파라미터를 제거하고 목록으로 이동
            navigate(`/review-management?productId=${productIdFromUrl}`);
            fetchReviews();
            setContent('');
        } catch (err) {
            alert(err.response?.data?.message || "리뷰 등록 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            alert("삭제되었습니다.");
            fetchReviews();
        } catch (err) {
            alert("본인의 리뷰만 삭제할 수 있습니다.");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>데이터를 불러오는 중...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

            {/* 1. 상품 필터 섹션 */}
            <div style={filterContainerStyle}>
                <label style={{ fontWeight: 'bold' }}>🔍 리뷰 필터링: </label>
                <select
                    value={productIdFromUrl || ''}
                    onChange={handleProductChange}
                    style={selectStyle}
                >
                    <option value="">전체 리뷰 보기</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* 2. 리뷰 작성 폼 (orderId가 URL에 있을 때만 노출) */}
            {orderIdFromUrl && orderIdFromUrl !== 'undefined' ? (
                <div style={writeBoxStyle}>
                    <h3>✍️ 상품 리뷰 작성</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>평점 선택:</span>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{padding: '5px'}}>
                                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}점 {"⭐".repeat(n)}</option>)}
                            </select>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="상품에 대한 솔직한 후기를 작성해주세요."
                            style={{ height: '120px', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                        <button type="submit" style={submitBtnStyle}>리뷰 등록 완료</button>
                    </form>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '20px', border: '1px dashed #ccc' }}>
                    <p style={{ margin: 0, color: '#666' }}>
                        💡 <strong>주문 내역</strong>에서 리뷰 작성 버튼을 클릭하면 리뷰를 남길 수 있습니다.
                    </p>
                </div>
            )}

            {/* 3. 리뷰 리스트 출력 */}
            <div style={{ marginTop: '20px' }}>
                <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                    {productIdFromUrl ? "📦 상품별 후기" : "📢 전체 고객 후기"} ({reviews.length})
                </h2>
                {reviews.length > 0 ? (
                    reviews.map(r => (
                        <div key={r.id} style={reviewCardStyle}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <strong>{r.userName} <span style={{fontSize: '0.8rem', color: '#888', fontWeight: 'normal'}}>| {r.productName}</span></strong>
                                    <span style={{ color: '#00c73c' }}>{"⭐".repeat(r.rating)}</span>
                                </div>
                                <p style={{ margin: '10px 0', color: '#444', lineHeight: '1.6' }}>{r.content}</p>
                                <small style={{ color: '#aaa' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>
                            <button onClick={() => handleDelete(r.id)} style={deleteBtnStyle}>삭제</button>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#bbb' }}>아직 작성된 리뷰가 없습니다.</div>
                )}
            </div>
        </div>
    );
};

// 스타일 가이드
const filterContainerStyle = { marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' };
const selectStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginLeft: '10px', minWidth: '250px' };
const writeBoxStyle = { padding: '25px', backgroundColor: '#effaf2', borderRadius: '12px', border: '2px solid #00c73c', marginBottom: '30px' };
const submitBtnStyle = { backgroundColor: '#00c73c', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem' };
const deleteBtnStyle = { color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '4px', padding: '4px 8px', background: 'none', cursor: 'pointer', height: 'fit-content', marginLeft: '20px', fontSize: '0.85rem' };
const reviewCardStyle = { display: 'flex', padding: '25px 0', borderBottom: '1px solid #eee' };

export default ReviewManagementPage;