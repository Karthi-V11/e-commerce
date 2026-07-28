package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
}
