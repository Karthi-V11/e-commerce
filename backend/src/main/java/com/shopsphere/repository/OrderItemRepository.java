package com.shopsphere.repository;

import com.shopsphere.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Page<OrderItem> findBySellerId(Long sellerId, Pageable pageable);
}
