package com.shopsphere.controller;

import com.shopsphere.dto.request.AddToCartRequest;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getUser().getId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal CustomUserDetails principal,
                                                 @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItem(principal.getUser().getId(), request));
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(@AuthenticationPrincipal CustomUserDetails principal,
                                                         @PathVariable Long itemId,
                                                         @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(principal.getUser().getId(), itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal CustomUserDetails principal,
                                                     @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(principal.getUser().getId(), itemId));
    }

    @PatchMapping("/items/{itemId}/save-for-later")
    public ResponseEntity<CartResponse> saveForLater(@AuthenticationPrincipal CustomUserDetails principal,
                                                       @PathVariable Long itemId,
                                                       @RequestParam boolean saved) {
        return ResponseEntity.ok(cartService.saveForLater(principal.getUser().getId(), itemId, saved));
    }
}
