package com.shopsphere.controller;

import com.shopsphere.dto.request.ReviewRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ReviewResponse;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.service.ReviewService;
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
@RequestMapping("/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<PageResponse<ReviewResponse>> getReviews(@PathVariable Long productId,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(@AuthenticationPrincipal CustomUserDetails principal,
                                                       @PathVariable Long productId,
                                                       @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addReview(principal.getUser().getId(), productId, request));
    }
}
