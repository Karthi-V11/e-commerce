package com.shopsphere.service.impl;

import com.shopsphere.dto.request.CheckoutRequest;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.OrderMapper;
import com.shopsphere.repository.*;
import com.shopsphere.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    private static final BigDecimal FLAT_SHIPPING_FEE = new BigDecimal("4.99");
    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("50.00");

    @Override
    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        List<CartItem> activeItems = cart.getItems().stream().filter(i -> !i.isSavedForLater()).toList();
        if (activeItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address shipping = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));
        Address billing = addressRepository.findById(request.getBillingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Billing address not found"));

        // Validate stock and compute subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : activeItems) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName());
            }
            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Coupon
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode())
                    .orElseThrow(() -> new BadRequestException("Invalid coupon code"));
            if (!coupon.isActive() || coupon.getValidUntil().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Coupon is expired or inactive");
            }
            if (subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
                throw new BadRequestException("Order does not meet minimum value for this coupon");
            }
            discountAmount = "PERCENTAGE".equals(coupon.getDiscountType())
                    ? subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                    : coupon.getDiscountValue();
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : FLAT_SHIPPING_FEE;
        BigDecimal total = subtotal.subtract(discountAmount).add(shippingFee).max(BigDecimal.ZERO);

        Order order = Order.builder()
                .orderNumber("SS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .shippingAddress(shipping)
                .billingAddress(billing)
                .coupon(coupon)
                .subtotal(subtotal)
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .totalAmount(total)
                .status(Order.OrderStatus.CONFIRMED)
                .paymentMethod(request.getPaymentMethod())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : activeItems) {
            Product product = item.getProduct();
            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .seller(product.getSeller())
                    .productNameSnapshot(product.getName())
                    .unitPrice(unitPrice)
                    .quantity(item.getQuantity())
                    .lineTotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();
            orderItems.add(oi);

            // decrement stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }
        order.setItems(orderItems);
        order = orderRepository.save(order);

        // Mock payment: instantly "succeeds" except COD which stays pending until delivery
        Payment payment = Payment.builder()
                .order(order)
                .method(request.getPaymentMethod())
                .status("COD".equals(request.getPaymentMethod()) ? "PENDING" : "SUCCESS")
                .transactionRef("MOCK-" + UUID.randomUUID().toString().substring(0, 10))
                .amount(total)
                .paidAt("COD".equals(request.getPaymentMethod()) ? null : LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // clear active cart items
        cart.getItems().removeAll(activeItems);
        cartRepository.save(cart);

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(Long userId, Pageable pageable) {
        Page<OrderResponse> page = orderRepository.findByUserId(userId, pageable).map(orderMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your order");
        }
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<OrderResponse> page = orderRepository.findAll(pageable).map(orderMapper::toResponse);
        return PageResponse.from(page);
    }
}
