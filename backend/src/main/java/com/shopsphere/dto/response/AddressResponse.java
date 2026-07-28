package com.shopsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String label;
    private String fullName;
    private String phone;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private boolean isDefault;
}
