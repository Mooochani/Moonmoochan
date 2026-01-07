package com.commerceweb.dto;

public class AuthResponse {
    private String token;      // JWT 토큰
    private Long userId;       // 사용자 ID
    private String email;      // 이메일
    private String name;       // 이름

    // 생성자
    public AuthResponse(String token, Long userId, String email, String name) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}