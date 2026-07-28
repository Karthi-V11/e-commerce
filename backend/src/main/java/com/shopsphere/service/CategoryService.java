package com.shopsphere.service;

import com.shopsphere.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAll();
    CategoryResponse getBySlug(String slug);
}
