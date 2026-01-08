package com.commerceweb.config;

import com.commerceweb.entity.User;
import com.commerceweb.repository.UserRepository;
import com.commerceweb.security.jwt.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1) Authorization 헤더에서 Bearer 토큰 추출
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 2) 토큰 검증 + 인증 객체 세팅
        if (token != null && jwtProvider.validateToken(token)) {
            try {
                Long userId = Long.parseLong(jwtProvider.extractUserId(token));
                User user = userRepository.findById(userId).orElse(null);

                if (user != null) {
                    // ✅ [수정 포인트] Role 이름 처리 로직 강화
                    String roleName = user.getRole().name();
                    // 만약 DB의 Role 이름에 ROLE_ 이 안 붙어 있다면 붙여주고, 이미 있다면 그대로 사용
                    if (!roleName.startsWith("ROLE_")) {
                        roleName = "ROLE_" + roleName;
                    }

                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(roleName));

                    // principal은 email로 설정
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // SecurityContext에 인증 정보 저장
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // 디버깅용 로그 (선택 사항)
                    System.out.println("✅ 인증 성공: " + user.getEmail() + ", 권한: " + roleName);
                }
            } catch (Exception e) {
                // 토큰 파싱 에러 시 컨텍스트 초기화
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}