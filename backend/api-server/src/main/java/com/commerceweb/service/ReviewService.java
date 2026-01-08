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
import org.springframework.security.access.AccessDeniedException; // ✅ 추가
import com.commerceweb.repository.OrderRepository; // ✅ 추가 리뷰 권한을 위한


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository; // ✅ 추가

    @Transactional
    public ReviewDto createReview(ReviewDto reviewDto) {
        // 1. 구매 여부 확인 (핵심 로직)
        boolean hasPurchased = orderRepository.existsByUserIdAndProductIdAndStatus(
                reviewDto.getUserId(),
                reviewDto.getProductId(),
                "PAID" // DB에 저장된 상태값에 맞게 조절 (예: "DELIVERED")
        );

        if (!hasPurchased) {
            throw new RuntimeException("상품을 구매한 고객만 리뷰를 남길 수 있습니다.");
        }

        // 2. 기존 로직 (상품/사용자 조회 및 저장)
        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        User user = userRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .content(reviewDto.getContent())
                .rating(reviewDto.getRating())
                .build();

        reviewRepository.save(review);
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
        productRepository.save(product); // 변경된 별점 정보 저장
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
    }
}