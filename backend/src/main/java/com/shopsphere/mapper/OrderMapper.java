package com.shopsphere.mapper;

import com.shopsphere.dto.response.OrderItemResponse;
import com.shopsphere.dto.response.OrderResponse;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    @Mapping(target = "items", expression = "java(mapItems(order))")
    OrderResponse toResponse(Order order);

    default List<OrderItemResponse> mapItems(Order order) {
        return order.getItems().stream().map(this::toItemResponse).toList();
    }

    default OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductNameSnapshot())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .lineTotal(item.getLineTotal())
                .build();
    }
}
