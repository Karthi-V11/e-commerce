package com.shopsphere.service;

import com.shopsphere.dto.request.AddToCartRequest;
import com.shopsphere.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItem(Long userId, AddToCartRequest request);
    CartResponse updateQuantity(Long userId, Long cartItemId, int quantity);
    CartResponse removeItem(Long userId, Long cartItemId);
    CartResponse saveForLater(Long userId, Long cartItemId, boolean saved);
}
