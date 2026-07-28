package com.shopsphere.mapper;

import com.shopsphere.dto.response.UserResponse;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;
import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    default UserResponse toResponse(User user) {
        if (user == null) return null;
        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .roles(roleNames)
                .build();
    }
}
