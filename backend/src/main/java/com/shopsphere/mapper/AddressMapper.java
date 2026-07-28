package com.shopsphere.mapper;

import com.shopsphere.dto.response.AddressResponse;
import com.shopsphere.entity.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponse toResponse(Address address);
}
