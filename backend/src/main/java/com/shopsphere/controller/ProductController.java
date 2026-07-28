package com.shopsphere.controller;

import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Sort sort = Sort.by(direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(productService.search(keyword, categoryId, minPrice, maxPrice, sortBy, pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getBySlug(slug));
    }
}
