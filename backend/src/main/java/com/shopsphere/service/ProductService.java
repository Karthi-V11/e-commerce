package com.shopsphere.service;

import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
    PageResponse<ProductResponse> search(String keyword, Long categoryId, BigDecimal minPrice,
                                          BigDecimal maxPrice, String sortBy, Pageable pageable);
    ProductResponse getBySlug(String slug);
    ProductResponse getById(Long id);
    ProductResponse create(Long sellerId, ProductRequest request);
    ProductResponse update(Long sellerId, Long productId, ProductRequest request);
    void delete(Long sellerId, Long productId);
    PageResponse<ProductResponse> getBySeller(Long sellerId, Pageable pageable);
}
