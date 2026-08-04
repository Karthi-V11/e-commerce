package com.shopsphere.service.impl;

import com.shopsphere.dto.request.ReviewRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ReviewResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.Review;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.ReviewMapper;
import com.shopsphere.repository.OrderItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse addReview(Long userId, Long productId, ReviewRequest request) {
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating().shortValue())
                .title(request.getTitle())
                .comment(request.getComment())
                .verifiedPurchase(false) // could be derived from OrderItemRepository in a fuller implementation
                .build();
        review = reviewRepository.save(review);

        recalculateRating(product);

        return reviewMapper.toResponse(review);
    }

    private void recalculateRating(Product product) {
        Page<Review> all = reviewRepository.findByProductId(product.getId(),
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE > 500 ? 500 : Integer.MAX_VALUE));
        double avg = all.getContent().stream().mapToInt(Review::getRating).average().orElse(0);
        product.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        product.setReviewCount((int) all.getTotalElements());
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        Page<ReviewResponse> page = reviewRepository.findByProductId(productId, pageable).map(reviewMapper::toResponse);
        return PageResponse.from(page);
    }
}
