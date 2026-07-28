package com.shopsphere.service;

import com.shopsphere.dto.request.ReviewRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse addReview(Long userId, Long productId, ReviewRequest request);
    PageResponse<ReviewResponse> getProductReviews(Long productId, Pageable pageable);
}
