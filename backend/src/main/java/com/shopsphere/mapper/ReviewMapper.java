package com.shopsphere.mapper;

import com.shopsphere.dto.response.ReviewResponse;
import com.shopsphere.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "userFirstName", source = "user.firstName")
    ReviewResponse toResponse(Review review);
}
