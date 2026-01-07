package com.commerceweb.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName; // 화면에 작성자 이름을 보여주기 위함
    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
}