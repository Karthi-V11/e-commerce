package com.shopsphere.controller;

import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seller/products")
@RequiredArgsConstructor
public class SellerController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> myProducts(@AuthenticationPrincipal CustomUserDetails principal,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getBySeller(principal.getUser().getId(), pageable));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@AuthenticationPrincipal CustomUserDetails principal,
                                                     @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(principal.getUser().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@AuthenticationPrincipal CustomUserDetails principal,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(principal.getUser().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        productService.delete(principal.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
