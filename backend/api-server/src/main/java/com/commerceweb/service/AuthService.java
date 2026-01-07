package com.commerceweb.service;

import com.commerceweb.entity.User;
import com.commerceweb.entity.UserRole;
import com.commerceweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ 반드시 임포트 필요

@Slf4j // 로깅을 위한 어노테이션
@Service
@RequiredArgsConstructor // ✅ @Autowired 대신 생성자 주입 방식 (권장)
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * ✅ 회원가입 로직
     * @Transactional: 메서드 실행 중 에러가 나면 롤백하고, 성공하면 DB에 최종 저장(Commit)합니다.
     */
    @Transactional // ✅ 이 어노테이션이 있어야 DB에 데이터가 물리적으로 저장됩니다.
    public User signup(String email, String rawPassword, String name) {

        // 1️⃣ 이메일 중복 확인
        if (userRepository.existsByEmail(email)) {
            log.error("회원가입 실패: 이미 존재하는 이메일 -> {}", email);
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 2️⃣ 비밀번호 암호화 (BCrypt)
        String hashedPassword = passwordEncoder.encode(rawPassword);
        log.info("비밀번호 암호화 완료");

        // 3️⃣ User 객체 생성
        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setName(name);
        user.setRole(UserRole.CUSTOMER);

        // 4️⃣ 데이터베이스에 저장
        // .save() 호출 시 JPA 영속성 컨텍스트에 저장되고, 트랜잭션 종료 시 DB로 반영됩니다.
        User savedUser = userRepository.save(user);

        log.info("✅ 회원가입 성공 및 DB 저장 완료: {}", savedUser.getEmail());
        return savedUser;
    }

    /**
     * ✅ 로그인 로직
     */
    @Transactional(readOnly = true) // 읽기 전용 작업 최적화
    public User login(String email, String rawPassword) {
        // 1️⃣ 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 2️⃣ 입력한 비밀번호와 저장된 비밀번호 비교
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            log.warn("❌ 로그인 실패: 비밀번호 불일치 -> {}", email);
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        log.info("✅ 로그인 성공: {}", user.getEmail());
        return user;
    }
}