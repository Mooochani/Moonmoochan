package com.commerceweb.repository;

import com.commerceweb.entity.Order;
import com.commerceweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user); // 내 주문 최신순 조회
}