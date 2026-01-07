package com.commerceweb.controller;

import com.commerceweb.dto.Order.OrderResponse;
import com.commerceweb.entity.Order;
import com.commerceweb.entity.User;
import com.commerceweb.service.OrderService;
import com.commerceweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal String userEmail,
            @RequestBody java.util.Map<String, Object> request) {
        User user = userService.findByEmail(userEmail);
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = (Integer) request.get("quantity");
        Order order = orderService.createOrder(user, productId, quantity);
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal String userEmail) {
        User user = userService.findByEmail(userEmail);
        List<OrderResponse> responses = orderService.getMyOrders(user).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // ✅ 추가: 주문 취소 API
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long orderId) {
        User user = userService.findByEmail(userEmail);
        orderService.cancelOrder(orderId, user);
        return ResponseEntity.ok().build();
    }
}