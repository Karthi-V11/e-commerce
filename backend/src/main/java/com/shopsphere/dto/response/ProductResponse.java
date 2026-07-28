package com.shopsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String brand;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private String categoryName;
    private Long categoryId;
    private List<ProductImageResponse> images;
}
