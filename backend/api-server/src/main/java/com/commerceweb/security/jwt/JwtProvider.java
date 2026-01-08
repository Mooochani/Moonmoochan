package com.commerceweb.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j  // Lombok이 로깅 제공
@Component  // Spring Bean으로 등록 Spring이 알아서 관리해 줌.
// Component를 안 쓰면 나중에 인식이 안 될 수도 있음.
//다른 클래스에서 @Autowired로 주입 가능
public class JwtProvider {

    // ✅ 1. 설정값 주입
    @Value("${jwt.secret}")
    private String jwtSecret;
    //  application.properties의 값을 주입
    //  "jwt.secret=....."를 읽어서 jwtSecret에 저장 비밀번호

    @Value("${jwt.expiration}")
    // application.properties의 jwt.expiration을 주입 만료시간
    private long jwtExpirationMs;

    // ✅ 비밀키를 SecretKey 객체로 변환
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ✅ 토큰 생성
    public String generateToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(userId)         // ✅ 수정됨!
                .setIssuedAt(now)          // ✅ 수정됨!
                .setExpiration(expiryDate) // ✅ 수정됨!
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    // generateToken() 아래에 추가

    // ✅ 토큰 검증
    public boolean validateToken(String token) {
        try {
            // 1️⃣ 토큰 파싱 (서명 확인, 만료 확인 등)
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())  // secret key로 검증
                    .build()
                    .parseClaimsJws(token);  // 여기서 검증 실행!

            // 2️⃣ 검증 성공
            return true;

        } catch (SecurityException e) {
            // 서명이 잘못되었음 (secret key가 다름)
            log.error("Invalid JWT signature: {}", e.getMessage());

        } catch (MalformedJwtException e) {
            // 토큰 형식이 잘못됨 (header.payload.signature 형식 아님)
            log.error("Invalid JWT token: {}", e.getMessage());

        } catch (ExpiredJwtException e) {
            // 토큰이 만료됨 (exp < 현재시간)
            log.error("Expired JWT token: {}", e.getMessage());

        } catch (UnsupportedJwtException e) {
            // 지원하지 않는 JWT 타입
            log.error("Unsupported JWT token: {}", e.getMessage());

        } catch (IllegalArgumentException e) {
            // 토큰이 비어있음
            log.error("JWT claims string is empty: {}", e.getMessage());
        }

        // 3️⃣ 검증 실패
        return false;
    }

    // validateToken() 아래에 추가

    // ✅ 토큰에서 userId 추출
    public String extractUserId(String token) {
        try {
            // 1️⃣ 토큰 파싱
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();  // Claims 객체 추출

            // 2️⃣ Claims에서 subject (userId) 추출
            return claims.getSubject();

        } catch (JwtException e) {
            // 토큰이 유효하지 않으면 null 반환
            log.error("Cannot extract userId from token: {}", e.getMessage());
            return null;
        }
    }
}