package com.shopsphere.service.impl;

import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.PageResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.ProductImage;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.ProductMapper;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(String keyword, Long categoryId, BigDecimal minPrice,
                                                 BigDecimal maxPrice, String sortBy, Pageable pageable) {
        Specification<Product> spec = buildSpecification(keyword, categoryId, minPrice, maxPrice);
        Page<Product> page = productRepository.findAll(spec, pageable);
        Page<ProductResponse> mapped = page.map(productMapper::toResponse);
        return PageResponse.from(mapped);
    }

    private Specification<Product> buildSpecification(String keyword, Long categoryId,
                                                        BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("brand")), like)
                ));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse create(Long sellerId, ProductRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .seller(seller)
                .category(category)
                .name(request.getName())
                .slug(slugify(request.getName()) + "-" + UUID.randomUUID().toString().substring(0, 6))
                .brand(request.getBrand())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .active(true)
                .build();

        if (request.getImageUrls() != null) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .displayOrder(i)
                        .primary(i == 0)
                        .build());
            }
            product.setImages(images);
        }

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse update(Long sellerId, Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your product");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setCategory(category);
        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(Long sellerId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your product");
        }
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getBySeller(Long sellerId, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> cb.equal(root.get("seller").get("id"), sellerId);
        Page<ProductResponse> page = productRepository.findAll(spec, pageable).map(productMapper::toResponse);
        return PageResponse.from(page);
    }

    private String slugify(String input) {
        return input.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
