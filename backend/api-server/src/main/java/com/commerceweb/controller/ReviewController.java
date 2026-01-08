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

    // ✅ 리뷰 작성 수정
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal String userEmail, // 1️⃣ 현재 로그인한 사용자의 이메일 주입
            @RequestBody ReviewDto reviewDto
    ) {
        // 2️⃣ 이메일로 사용자 객체 조회
        if (userEmail == null) {
            // permitAll() 상황에서 토큰 없이 접근했을 경우 처리
            return ResponseEntity.status(401).build();
        }

        User user = userService.findByEmail(userEmail);

        // 3️⃣ 서비스 호출 시 사용자 정보 함께 전달
        return ResponseEntity.ok(reviewService.createReview(reviewDto, user));
    }

    // 특정 상품의 리뷰 목록 조회
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long reviewId
    ) {
        if (userEmail == null) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(userEmail);
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.ok().build();
    }
}