package com.shopsphere.service;

import com.shopsphere.dto.request.CheckoutRequest;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse checkout(Long userId, CheckoutRequest request);
    PageResponse<OrderResponse> getMyOrders(Long userId, Pageable pageable);
    OrderResponse getOrder(Long userId, Long orderId);
    OrderResponse updateStatus(Long orderId, String status);
    PageResponse<OrderResponse> getAllOrders(Pageable pageable);
}
