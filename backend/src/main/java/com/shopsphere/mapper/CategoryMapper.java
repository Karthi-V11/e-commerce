package com.shopsphere.mapper;

import com.shopsphere.dto.response.CategoryResponse;
import com.shopsphere.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "parentId", expression = "java(category.getParent() != null ? category.getParent().getId() : null)")
    CategoryResponse toResponse(Category category);
}
