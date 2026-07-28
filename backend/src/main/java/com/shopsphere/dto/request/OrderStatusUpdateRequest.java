package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull
    private String status;
}
