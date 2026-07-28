package com.shopsphere.controller;

import com.shopsphere.dto.request.OrderStatusUpdateRequest;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<PageResponse<OrderResponse>> allOrders(@RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                              @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}
