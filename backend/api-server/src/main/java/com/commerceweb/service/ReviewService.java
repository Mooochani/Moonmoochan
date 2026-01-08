package com.commerceweb.service;

import com.commerceweb.dto.ReviewDto;
import com.commerceweb.entity.Product;
import com.commerceweb.entity.Review;
import com.commerceweb.entity.User;
import com.commerceweb.repository.ProductRepository;
import com.commerceweb.repository.ReviewRepository;
import com.commerceweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDto createReview(ReviewDto reviewDto, User user) { // ✅ User 객체를 직접 받도록 수정
        // 1. 상품 존재 확인
        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // 2. 리뷰 엔티티 생성 및 저장 (전달받은 user 객체 사용)
        Review review = Review.builder()
                .product(product)
                .user(user) // ✅ DTO에서 꺼내지 않고 컨트롤러가 넘겨준 user 사용
                .content(reviewDto.getContent())
                .rating(reviewDto.getRating())
                .build();

        reviewRepository.save(review);

        // 3. 상품의 평균 별점 및 리뷰 개수 업데이트
        updateProductRating(product);

        return convertToDto(review);
    }

    public List<ReviewDto> getReviewsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        return reviewRepository.findByProductOrderByCreatedAtDesc(product)
                .stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private void updateProductRating(Product product) {
        List<Review> reviews = reviewRepository.findByProductOrderByCreatedAtDesc(product);
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        product.setAverageRating(average);
        product.setRatingCount((long) reviews.size());
        productRepository.save(product);
    }

    private ReviewDto convertToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }

    @Transactional
    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));

        // 작성자 본인 확인
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인의 리뷰만 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);

        // 삭제 후 별점 재계산
        updateProductRating(review.getProduct());
    }
}