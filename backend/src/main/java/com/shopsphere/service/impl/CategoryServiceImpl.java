package com.shopsphere.service.impl;

import com.shopsphere.dto.response.CategoryResponse;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.CategoryMapper;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(categoryMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getBySlug(String slug) {
        return categoryMapper.toResponse(categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + slug)));
    }
}
