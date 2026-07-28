package com.shopsphere.controller;

import com.shopsphere.dto.request.CheckoutRequest;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.checkout(principal.getUser().getId(), request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> myOrders(@AuthenticationPrincipal CustomUserDetails principal,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUser().getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(principal.getUser().getId(), id));
    }
}
