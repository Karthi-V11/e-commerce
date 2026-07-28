package com.shopsphere.controller;

import com.shopsphere.dto.request.AddressRequest;
import com.shopsphere.dto.response.AddressResponse;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(addressService.getMyAddresses(principal.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> add(@AuthenticationPrincipal CustomUserDetails principal,
                                                @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.addAddress(principal.getUser().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> update(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(principal.getUser().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        addressService.deleteAddress(principal.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
