package com.commerceweb.service;

import com.commerceweb.entity.Order;
import com.commerceweb.entity.Product;
import com.commerceweb.entity.User;
import com.commerceweb.repository.OrderRepository;
import com.commerceweb.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Order createOrder(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));
        Order order = Order.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .totalPrice((long) (product.getPrice() * quantity))
                .status("PAID")
                .build();
        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    // ✅ 추가 및 수정: 주문 취소 전용 로직
    @Transactional
    public void cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 없습니다."));

        // 본인 주문인지 확인
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("본인의 주문만 취소할 수 있습니다.");
        }

        order.setStatus("CANCELLED");
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 없습니다."));
        order.setStatus(status);
    }
}