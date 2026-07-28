package com.shopsphere.controller;

import com.shopsphere.dto.response.CategoryResponse;
import com.shopsphere.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getBySlug(slug));
    }
}
