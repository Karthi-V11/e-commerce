package com.shopsphere.service.impl;

import com.shopsphere.dto.request.AddToCartRequest;
import com.shopsphere.dto.response.CartItemResponse;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.entity.Cart;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponse getCart(Long userId) {
        return toResponse(getOrCreateCart(userId));
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock for " + product.getName());
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .savedForLater(false)
                    .build();
            cart.getItems().add(item);
        }
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateQuantity(Long userId, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findOwnedItem(cart, cartItemId);

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findOwnedItem(cart, cartItemId);
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse saveForLater(Long userId, Long cartItemId, boolean saved) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findOwnedItem(cart, cartItemId);
        item.setSavedForLater(saved);
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    private CartItem findOwnedItem(Cart cart, Long cartItemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .filter(i -> !i.isSavedForLater())
                .map(i -> {
                    BigDecimal unitPrice = i.getProduct().getDiscountPrice() != null
                            ? i.getProduct().getDiscountPrice() : i.getProduct().getPrice();
                    BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(i.getQuantity()));
                    String imageUrl = i.getProduct().getImages().isEmpty() ? null
                            : i.getProduct().getImages().get(0).getImageUrl();
                    return CartItemResponse.builder()
                            .id(i.getId())
                            .productId(i.getProduct().getId())
                            .productName(i.getProduct().getName())
                            .productImageUrl(imageUrl)
                            .unitPrice(unitPrice)
                            .quantity(i.getQuantity())
                            .lineTotal(lineTotal)
                            .savedForLater(i.isSavedForLater())
                            .availableStock(i.getProduct().getStockQuantity())
                            .build();
                }).toList();

        BigDecimal subtotal = items.stream().map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = items.stream().mapToInt(CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }
}
