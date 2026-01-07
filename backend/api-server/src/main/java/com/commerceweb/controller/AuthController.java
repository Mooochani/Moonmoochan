package com.commerceweb.controller;

import com.commerceweb.security.jwt.JwtProvider;
import com.commerceweb.dto.AuthResponse;
import com.commerceweb.dto.LoginRequest;
import com.commerceweb.dto.SignupRequest;
import com.commerceweb.dto.ErrorResponse;
import com.commerceweb.entity.User;
import com.commerceweb.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")  // React 개발 서버 허용
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtProvider jwtProvider;

    // ✅ 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            // 1️⃣ AuthService를 통한 회원가입
            User user = authService.signup(
                    request.getEmail(),
                    request.getPassword(),
                    request.getName()
            );

            System.out.println("✅ 회원가입 완료: " + user.getEmail());

            // 2️⃣ JWT 토큰 생성
            String token = jwtProvider.generateToken(String.valueOf(user.getId()));
            System.out.println("✅ JWT 토큰 생성: " + token.substring(0, 20) + "...");

            // 3️⃣ 응답 DTO 반환
            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getName()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {
            System.out.println("❌ 회원가입 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ✅ 로그인 API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1️⃣ AuthService를 통한 로그인
            User user = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            System.out.println("✅ 로그인 완료: " + user.getEmail());

            // 2️⃣ JWT 토큰 생성
            String token = jwtProvider.generateToken(String.valueOf(user.getId()));
            System.out.println("✅ JWT 토큰 생성: " + token.substring(0, 20) + "...");

            // 3️⃣ 응답 DTO 반환
            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getName()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.out.println("❌ 로그인 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}