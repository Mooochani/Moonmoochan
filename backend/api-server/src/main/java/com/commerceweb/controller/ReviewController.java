package com.commerceweb.controller;

import com.commerceweb.dto.ReviewDto;
import com.commerceweb.entity.User;
import com.commerceweb.service.ReviewService;
import com.commerceweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // ✅ 추가됨
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService; // ✅ 추가됨 (사용자 조회용)

    // 리뷰 작성
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto) {
        return ResponseEntity.ok(reviewService.createReview(reviewDto));
    }

    // 특정 상품의 리뷰 목록 조회
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @AuthenticationPrincipal String userEmail, // ✅ 이제 인식됨
            @PathVariable Long reviewId
    ) {
        User user = userService.findByEmail(userEmail);
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.ok().build();
    }
}
