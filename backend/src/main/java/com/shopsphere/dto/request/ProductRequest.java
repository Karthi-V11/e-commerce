package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    @NotNull
    private Long categoryId;

    private String brand;
    private String description;

    @NotNull @Positive
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull @PositiveOrZero
    private Integer stockQuantity;

    private List<String> imageUrls;
}
