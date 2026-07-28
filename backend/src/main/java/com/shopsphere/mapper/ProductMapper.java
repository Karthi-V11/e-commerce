package com.shopsphere.mapper;

import com.shopsphere.dto.response.ProductImageResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "images", expression = "java(mapImages(product))")
    ProductResponse toResponse(Product product);

    default List<ProductImageResponse> mapImages(Product product) {
        return product.getImages().stream()
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .primary(img.isPrimary())
                        .build())
                .toList();
    }
}
