package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotNull
    private Long shippingAddressId;

    @NotNull
    private Long billingAddressId;

    private String couponCode;

    @NotNull
    private String paymentMethod; // CREDIT_CARD, UPI, NET_BANKING, WALLET, COD
}
