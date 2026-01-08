package com.commerceweb.controller;

import com.commerceweb.dto.ReviewDto;
import com.commerceweb.entity.User;
import com.commerceweb.service.ReviewService;
import com.commerceweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    // ✅ 리뷰 작성: 토큰 정보를 사용하여 userId를 서버에서 직접 주입
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal String userEmail,
            @RequestBody ReviewDto reviewDto
    ) {
        // 토큰에 담긴 이메일로 실제 User를 찾아서 ID를 세팅 (프론트엔드 null 전송 대응)
        User user = userService.findByEmail(userEmail);
        reviewDto.setUserId(user.getId());

        return ResponseEntity.ok(reviewService.createReview(reviewDto));
    }

    // 특정 상품의 리뷰 목록 조회
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // 전체 상품 조회
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long reviewId
    ) {
        User user = userService.findByEmail(userEmail);
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.ok().build();
    }
}